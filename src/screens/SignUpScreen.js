// src/screens/SignUpScreen.js

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (!email.trim() || !password) {
      return Alert.alert('Missing Fields', 'Please enter both email and password.');
    }

    try {
      // 1) Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const uid = userCredential.user.uid;

      // 2) Generate partner code (last 6 chars of UID)
      const code = uid.slice(-6).toUpperCase();

      // 3) Save code and initial pairing state in Firestore
      await setDoc(doc(db, 'users', uid), {
        code,
        pairedWith: null,
      });

      // 4) Navigate into Partner Pairing
      navigation.replace('Pair');
    } catch (e) {
      console.error('SignUp Error:', e);
      let message = 'Failed to sign up. Please try again.';
      if (e.code === 'auth/email-already-in-use') message = 'That email is already in use.';
      else if (e.code === 'auth/invalid-email') message = 'Invalid email address.';
      else if (e.code === 'auth/weak-password') message = 'Password should be at least 6 characters.';
      Alert.alert('Sign Up Error', message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={styles.inner}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Sign Up" onPress={handleSignUp} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
});
