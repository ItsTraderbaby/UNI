// src/components/MessageBubble.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * MessageBubble
 *
 * Renders a single chat message bubble.
 * Props:
 * - message: string — the text to display
 * - isSender: boolean — true if the message is from the current user
 */

export default function MessageBubble({ message, isSender }) {
  return (
    <View style={[styles.bubble, isSender ? styles.sender : styles.receiver]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    marginVertical: 4,
    padding: 10,
    borderRadius: 16,
    maxWidth: '75%',
  },
  sender: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
  },
  receiver: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 16,
  },
});

