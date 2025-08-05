import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const PartnerPairingScreen = ({ navigation }) => {
  const [myCode, setMyCode] = useState('ABC123'); // TODO: fetch from user profile
  const [partnerCode, setPartnerCode] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pair with a Partner</Text>
      <Text>Your code:</Text>
      <Text style={styles.code}>{myCode}</Text>
      <TextInput
        placeholder="Enter partner's code"
        style={styles.input}
        value={partnerCode}
        onChangeText={setPartnerCode}
        autoCapitalize="characters"
      />
      <Button title="Pair Up" onPress={() => {/* TODO: pairing logic */}} />
      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  code: { fontSize: 22, letterSpacing: 2, marginBottom: 14 },
  input: { width: 180, padding: 10, marginBottom: 18, borderWidth: 1, borderRadius: 8, textAlign: 'center' },
});

export default PartnerPairingScreen;

