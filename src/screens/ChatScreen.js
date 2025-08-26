// src/screens/ChatScreen.js
// Anchors: [UNI:IMPORTS] [UNI:STATE] [UNI:HEADER] [UNI:EFFECTS:ROOM] [UNI:EFFECTS:MESSAGES]
// [UNI:DERIVED] [UNI:SEND_MESSAGE] [UNI:RENDER_ITEM] [UNI:UI] [UNI:STYLES] [UNI:PROP_TYPES]

// [UNI:IMPORTS]
import React, { useEffect, useMemo, useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import {
  View, Text, TextInput, Button, FlatList, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { auth, db } from '../firebaseConfig';
import {
  collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc,
} from 'firebase/firestore';
import BubbleMorph from '../components/BubbleMorph';
import BackgroundCanvas from '../components/BackgroundCanvas';
import { getSentiment } from '../utils/sentimentMock';
import { getUNIQuip } from '../utils/uniQuipMock';

// [UNI:STATE]
export default function ChatScreen({ route, navigation }) {
  const { roomId } = route.params || {};
  const myUid = auth.currentUser?.uid;

  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [turnUid, setTurnUid] = useState(null);
  const [err, setErr] = useState('');

  // [UNI:HEADER]
  useLayoutEffect(() => { navigation.setOptions({ title: 'Chat' }); }, [navigation]);

  // [UNI:EFFECTS:ROOM]
  useEffect(() => {
    if (!roomId) return;
    const unsub = onSnapshot(doc(db, 'chatRooms', roomId), (snap) => {
      const data = snap.data() || {};
      setMembers(data.members || []);
      setTurnUid(data.turn || null);
    }, (err) => {
      console.error('[UNI] room snapshot error:', err);
      setErr('Could not load chat room. Please check your connection or permissions.');
    });
    return unsub;
  }, [roomId]);

  // [UNI:EFFECTS:MESSAGES]
  useEffect(() => {
    if (!roomId) return;
    const messagesRef = collection(db, 'chatRooms', roomId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(list);
    }, (err) => {
      console.error('[UNI] messages snapshot error:', err);
      setErr('Could not load messages. Please check your connection or permissions.');
    });
    return unsub;
  }, [roomId]);

  // [UNI:DERIVED]
  const partnerUid = useMemo(() => members.find((m) => m !== myUid), [members, myUid]);
  const isMyTurn = turnUid === myUid;
  const mood = useMemo(() => {
    const last = [...messages].reverse().find(m => !m.system);
    return last ? getSentiment(last.text || '') : 'neutral';
  }, [messages]);

  // [UNI:SEND_MESSAGE]
  const sendMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed || !isMyTurn || !roomId) return;

    try {
      const messagesRef = collection(db, 'chatRooms', roomId, 'messages');

      // your message
      await addDoc(messagesRef, { text: trimmed, sender: myUid, createdAt: serverTimestamp() });

      // UNI reacts (lightweight quip)
      const quip = getUNIQuip(trimmed);
      if (quip) {
        await addDoc(messagesRef, {
          text: quip.quip,
          sender: 'UNI',
          system: true,
          createdAt: serverTimestamp(),
        });
      }

      // switch turn
      if (partnerUid) await updateDoc(doc(db, 'chatRooms', roomId), { turn: partnerUid });
      setText('');
    } catch (e) {
      console.error('[UNI] sendMessage error:', e);
      setErr('Failed to send message. Please try again.');
    }
  };

  // [UNI:RENDER_ITEM]
  const renderItem = ({ item }) => {
    if (item.system && item.sender === 'UNI') {
      return (
        <View style={styles.systemRow}>
          <Text style={styles.uniLabel}>UNI</Text>
          <BubbleMorph message={item.text} isSender={false} sentiment="neutral" />
        </View>
      );
    }
    const isMe = item.sender === myUid;
    const sentiment = getSentiment(item.text);
    return <BubbleMorph message={item.text} isSender={isMe} sentiment={sentiment} />;
  };

  // [UNI:UI]
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <BackgroundCanvas mood={mood} showLogo={false} />

      {!!err && <Text style={styles.error}>{err}</Text>}

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 92 }}
        ListEmptyComponent={<Text style={styles.empty}>Say hi 👋</Text>}
      />

      <View style={styles.inputRow}>
        {!isMyTurn && <Text style={styles.waiting}>Waiting for partner…</Text>}
        <TextInput
          style={styles.input}
          placeholder={isMyTurn ? 'Type a message' : 'Waiting for partner…'}
          value={text}
          onChangeText={setText}
          editable={isMyTurn}
          returnKeyType="send"
          onSubmitEditing={sendMessage}
          onKeyPress={(e) => { if (Platform.OS === 'web' && e.nativeEvent.key === 'Enter') sendMessage(); }}
        />
        <Button title="Send" onPress={sendMessage} disabled={!isMyTurn} />
      </View>
    </KeyboardAvoidingView>
  );
}

// [UNI:STYLES]
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  systemRow: { alignItems: 'center', marginVertical: 6 },
  uniLabel: { fontWeight: '700', marginBottom: 4, color: '#555' },
  empty: { textAlign: 'center', color: '#777', marginTop: 24 },
  error: { color: '#b00020', margin: 8, textAlign: 'center' },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderTopWidth: 1, borderColor: '#e7e7e7', padding: 8, backgroundColor: '#ffffffc8',
  },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 20, padding: 10, marginRight: 8, backgroundColor: '#fff' },
  waiting: { position: 'absolute', left: 14, top: -18, fontSize: 12, color: '#666' },
});

ChatScreen.propTypes = {
  route: PropTypes.shape({ params: PropTypes.object }).isRequired,
  navigation: PropTypes.shape({ setOptions: PropTypes.func.isRequired }).isRequired,
};
