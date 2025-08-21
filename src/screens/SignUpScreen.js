// src/screens/SignUpScreen.js
// Anchors: [UNI:IMPORTS] [UNI:STATE] [UNI:ACTIONS] [UNI:RENDER] [UNI:STYLES] [UNI:PROP_TYPES]

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function SignUpScreen({ navigation }) {
  // [UNI:STATE]
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // [UNI:ACTIONS]
  const handleSignUp = async () => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const uid = cred.user.uid;
      const code = (uid.slice(-6) || '').toUpperCase();

      await setDoc(doc(db, 'users', uid), {
        code,
        pairedWith: null,
        updatedAt: serverTimestamp(),
      });

      navigation.replace('Pair');
    } catch (e) {
      console.error('[UNI] signup error:', e);
      Alert.alert('Sign-up failed', String(e?.message || e));
    }
  };

  // [UNI:RENDER]
  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Create account" onPress={handleSignUp} />
    </View>
  );
}

// [UNI:STYLES]
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12, justifyContent: 'center' },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, backgroundColor: '#fff' },
});

// [UNI:PROP_TYPES]
SignUpScreen.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
