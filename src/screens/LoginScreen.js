// src/screens/LoginScreen.js
// Anchors: [UNI:IMPORTS] [UNI:STATE] [UNI:ACTIONS] [UNI:RENDER] [UNI:STYLES] [UNI:PROP_TYPES]

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function LoginScreen({ navigation }) {
  // [UNI:STATE]
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // [UNI:ACTIONS]
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigation.replace('Pair');
    } catch (e) {
      console.error('[UNI] login error:', e);
      Alert.alert('Login failed', String(e?.message || e));
    }
  };

  // [UNI:RENDER]
  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Log In" onPress={handleLogin} />
    </View>
  );
}

// [UNI:STYLES]
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12, justifyContent: 'center' },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, backgroundColor: '#fff' },
});

// [UNI:PROP_TYPES]
LoginScreen.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
