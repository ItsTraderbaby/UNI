// src/screens/WelcomeScreen.js
// Anchors: [UNI:IMPORTS] [UNI:SCREEN] [UNI:STYLES] [UNI:PROP_TYPES]

import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Button, StyleSheet } from 'react-native';
import UniWordmark from '../components/UniWordmark';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <UniWordmark size={40} dim={0.85} />
      <Text style={styles.subtitle}>Conversational Generative Emotion Interface</Text>
      <View style={{ height: 16 }} />
      <Button title="Log In" onPress={() => navigation.navigate('Login')} />
      <View style={{ height: 8 }} />
      <Button title="Sign Up" onPress={() => navigation.navigate('SignUp')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  subtitle: { marginTop: 10, color: '#666', textAlign: 'center' },
});

WelcomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
