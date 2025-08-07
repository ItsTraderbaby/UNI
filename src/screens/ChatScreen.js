// src/screens/ChatScreen.js

import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { auth, db } from '../../firebaseConfig';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import BubbleMorph from '../components/BubbleMorph';
import { getSentiment } from '../utils/sentimentMock';

export default function ChatScreen({ route, navigation }) {
  const { roomId } = route.params;
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);

  // Set header title
  useLayoutEffect(() => {
    navigation.setOptions({ title: 'Chat' });
  }, [navigation]);

  // Real-time subscription to messages
  useEffect(() => {
    const messagesRef = collection(db, 'chatRooms', roomId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, snapshot => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return unsubscribe;
  }, [roomId]);

  // Send a new message
  const sendMessage = async () => {
    if (!text.trim()) return;
    const messagesRef = collection(db, 'chatRooms', roomId, 'messages');
    await addDoc(messagesRef, {
      text: text.trim(),
      sender: auth.currentUser.uid,
      createdAt: serverTimestamp(),
    });
    setText('');
  };

  // Render each message using BubbleMorph
  const renderItem = ({ item }) => {
    const isMe = item.sender === auth.currentUser.uid;
    const sentiment = getSentiment(item.text);
    return (
      <BubbleMorph
        message={item.text}
        isSender={isMe}
        sentiment={sentiment}
      />
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 10 }}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={text}
          onChangeText={setText}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inputRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    padding: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    marginRight: 8,
  },
});
