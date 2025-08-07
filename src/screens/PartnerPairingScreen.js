// src/screens/PartnerPairingScreen.js

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { auth, db } from '../../firebaseConfig';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  collection,
  where,
  getDocs,
} from 'firebase/firestore';

export default function PartnerPairingScreen({ navigation }) {
  const [myCode, setMyCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [paired, setPaired] = useState(false);
  const [roomId, setRoomId] = useState(null);

  // Animation ref for final logo fade
  const finalOpacity = useRef(new Animated.Value(0)).current;

  // Fetch my code once on mount
  useEffect(() => {
    (async () => {
      const uid = auth.currentUser.uid;
      const snap = await getDoc(doc(db, 'users', uid));
      setMyCode(snap.data().code);
    })();
  }, []);

  // When paired: fade in • UNI • then navigate to Chat
  useEffect(() => {
    if (!paired || !roomId) return;
    Animated.sequence([
      Animated.timing(finalOpacity, {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.delay(500),
    ]).start(() => {
      navigation.replace('Chat', { roomId });
    });
  }, [paired, roomId]);

  // Pairing logic: lookup partner, create room, update Firestore, trigger fade
  const handlePair = async () => {
    if (!inputCode.trim()) {
      return Alert.alert('Enter Code', 'Please enter your partner’s code.');
    }

    // Find partner by code
    const q = query(
      collection(db, 'users'),
      where('code', '==', inputCode.trim())
    );
    const snaps = await getDocs(q);
    if (snaps.empty) {
      return Alert.alert('Not Found', 'That code does not exist.');
    }

    const partnerUid = snaps.docs[0].id;
    const myUid = auth.currentUser.uid;

    // Deterministic room ID (sorted UIDs)
    const rid =
      [myUid, partnerUid].sort().join('_');
    setRoomId(rid);

    // Create room doc if it doesn't exist
    const roomRef = doc(db, 'chatRooms', rid);
    const roomSnap = await getDoc(roomRef);
    if (!roomSnap.exists()) {
      await setDoc(roomRef, {
        members: [myUid, partnerUid],
        createdAt: new Date(),
      });
    }

    // Update both users with pairedWith & roomId
    await Promise.all([
      updateDoc(doc(db, 'users', myUid), {
        pairedWith: partnerUid,
        roomId: rid,
      }),
      updateDoc(doc(db, 'users', partnerUid), {
        pairedWith: myUid,
        roomId: rid,
      }),
    ]);

    setPaired(true);
  };

  return (
    <View style={styles.container}>
      {!paired ? (
        <>
          <Text style={styles.label}>Your code:</Text>
          <View style={styles.codeBox}>
            <Text style={styles.code}>{myCode || 'Loading...'}</Text>
          </View>

          <Text style={[styles.label, { marginTop: 30 }]}>
            Partner’s code:
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter partner code"
            value={inputCode}
            onChangeText={setInputCode}
            autoCapitalize="characters"
          />

          <Button title="Connect" onPress={handlePair} />
        </>
      ) : (
        <Animated.Text
          style={[styles.finalLogo, { opacity: finalOpacity }]}
        >
          • UNI •
        </Animated.Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  codeBox: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
  },
  code: {
    fontSize: 32,
    letterSpacing: 4,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginVertical: 20,
    fontSize: 16,
    width: '80%',
  },
  finalLogo: {
    fontSize: 72,
    textAlign: 'center',
  },
});
