// src/screens/PartnerPairingScreen.js
// Anchors: [UNI:IMPORTS] [UNI:WORDMARK] [UNI:HELPERS] [UNI:SCREEN] [UNI:STYLES] [UNI:PROP_TYPES]

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TextInput, Button, StyleSheet, Animated, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig';
import {
  doc, setDoc, getDoc, updateDoc, serverTimestamp,
  query, where, getDocs, collection,
} from 'firebase/firestore';

// [UNI:WORDMARK]
const Wordmark = ({ size = 36, dim = 0.35, style }) => (
  <Text style={[{ fontSize: size, opacity: dim, fontWeight: '900', letterSpacing: 6 }, style]}>
    •UNI•
  </Text>
);
Wordmark.propTypes = {
  size: PropTypes.number,
  dim: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

// [UNI:HELPERS]
const roomIdFor = (a, b) => [a, b].sort((x, y) => x.localeCompare(y)).join('_');

// [UNI:SCREEN]
export default function PartnerPairingScreen({ navigation }) {
  const me = auth.currentUser?.uid;
  const [myCode, setMyCode] = useState('------');
  const [partnerCode, setPartnerCode] = useState('');
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      if (!me) return;
      const usersRef = doc(db, 'users', me);
      const snap = await getDoc(usersRef);
      let code = (me.slice(-6) || '').toUpperCase();
      if (!snap.exists()) {
        await setDoc(usersRef, { code, pairedWith: null, updatedAt: serverTimestamp() });
      } else {
        const data = snap.data() || {};
        if (data.code) code = data.code;
        else await updateDoc(usersRef, { code, updatedAt: serverTimestamp() });
      }
      setMyCode(code);
    })();
  }, [me]);

  useEffect(() => {
  Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: false }).start();
  }, [fade]);

  const pairWithPartner = async () => {
    const code = partnerCode.trim().toUpperCase();
    if (!me || code.length < 3) return;

    try {
      const q = query(collection(db, 'users'), where('code', '==', code));
      const r = await getDocs(q);
      if (r.empty) return Alert.alert('Not found', 'No user with that code.');

      let partnerUid = null;
      r.forEach(d => { if (d.id !== me) partnerUid = d.id; });
      if (!partnerUid) return Alert.alert('Oops', 'That code is yours. Ask your partner for theirs.');

      const roomId = roomIdFor(me, partnerUid);
      const roomRef = doc(db, 'chatRooms', roomId);

      // DEBUG: log identities and planned writes
      console.log('[UNI][debug] me:', me);
      console.log('[UNI][debug] partnerUid:', partnerUid);
      console.log('[UNI][debug] creating/updating roomId:', roomId);

      await setDoc(roomRef, {
        members: [me, partnerUid],
        createdAt: serverTimestamp(),
        turn: me,
      }, { merge: true });

      // Only update if not already paired
      const myRef = doc(db, 'users', me);
      const partnerRef = doc(db, 'users', partnerUid);

      const mySnap = await getDoc(myRef);
      const partnerSnap = await getDoc(partnerRef);

      // DEBUG: log current user docs and planned updates
      console.log('[UNI][debug] mySnap.exists:', mySnap.exists());
      console.log('[UNI][debug] mySnap.data:', mySnap.exists() ? mySnap.data() : null);
      console.log('[UNI][debug] partnerSnap.exists:', partnerSnap.exists());
      console.log('[UNI][debug] partnerSnap.data:', partnerSnap.exists() ? partnerSnap.data() : null);

      if (mySnap.exists() && mySnap.data().pairedWith !== partnerUid) {
        console.log('[UNI][debug] updating my doc:', { pairedWith: partnerUid, lastRoomId: roomId });
        await updateDoc(myRef, { pairedWith: partnerUid, lastRoomId: roomId });
      }
      if (partnerSnap.exists() && partnerSnap.data().pairedWith !== me) {
        console.log('[UNI][debug] updating partner doc:', { pairedWith: me, lastRoomId: roomId });
        await updateDoc(partnerRef, { pairedWith: me, lastRoomId: roomId });
      }

      navigation.replace('Chat', { roomId });
    } catch (e) {
      console.error('[UNI] pair error:', e);
      Alert.alert('Error', String(e?.message || e));
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fade, alignItems: 'center', marginBottom: 24 }}>
        <Wordmark />
        <Text style={styles.subtitle}>Share your code with your partner:</Text>
        <Text style={styles.codeBox}>{myCode}</Text>
      </Animated.View>

      <Text style={styles.label}>Enter partner code</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. A1B2C3"
        autoCapitalize="characters"
        maxLength={6}
        value={partnerCode}
        onChangeText={setPartnerCode}
        returnKeyType="done"
        onSubmitEditing={pairWithPartner}
      />
      <Button title="Pair" onPress={pairWithPartner} />
    </View>
  );
}

// [UNI:STYLES]
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 10, justifyContent: 'center' },
  subtitle: { marginTop: 8, color: '#666' },
  codeBox: {
    marginTop: 6, fontSize: 28, fontWeight: '800', letterSpacing: 4,
    paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#f5f5f5', borderRadius: 10,
  },
  label: { marginTop: 8, fontSize: 14, color: '#444' },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 16, backgroundColor: '#fff' },
});

// [UNI:PROP_TYPES]
PartnerPairingScreen.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
