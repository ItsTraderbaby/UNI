// src/screens/LoginScreen.js
// Anchors: [UNI:IMPORTS] [UNI:STATE] [UNI:LOGIN] [UNI:UI] [UNI:STYLES]
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TextInput, Button, StyleSheet, Platform } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function LoginScreen({ navigation }) {
  // [UNI:STATE]
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  // [UNI:LOGIN]
  const handleLogin = async () => {
    setErr('');
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigation.replace('PartnerPairing');
    } catch (e) {
      console.log('[UNI] login error:', e);
      if (e.code === 'auth/invalid-credential') {
        setErr('Email or password is incorrect (or user is in another Firebase project).');
      } else {
        setErr(e.message);
      }
    }
  };

  // [UNI:UI]
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      {!!err && <Text style={styles.error}>{err}</Text>}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        returnKeyType="next"
        onSubmitEditing={() => { /* focus password in a real app */ }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        returnKeyType="go"
        onSubmitEditing={handleLogin}
      />
      <Button title="Log In" onPress={handleLogin} />
      <View style={{ height: 12 }} />
      <Button title="Create account" onPress={() => navigation.navigate('SignUp')} />
      {Platform.OS === 'web' && (
        <Text style={styles.hint}>Tip: Press Enter on the password field to submit.</Text>
      )}
    </View>
  );
}

// [UNI:STYLES]
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 16 },
  error: { color: '#b00020', marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 12,
    padding: 12, marginBottom: 12, backgroundColor: '#fff',
  },
  hint: { marginTop: 8, color: '#666', fontSize: 12 },
});

LoginScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired, replace: PropTypes.func.isRequired }).isRequired,
};
