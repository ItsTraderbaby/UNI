import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const WelcomeScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Welcome to •UNI•</Text>
    <Text style={styles.subtitle}>The first CGEI – chat that feels.</Text>
    <Button title="Login" onPress={() => navigation.navigate('Login')} />
    <Button title="Sign Up" onPress={() => navigation.navigate('SignUp')} />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 16 },
  subtitle: { fontSize: 18, marginBottom: 32 },
});

export default WelcomeScreen;

