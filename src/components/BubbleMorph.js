// src/components/BubbleMorph.js
// Anchors: [UNI:IMPORTS] [UNI:HELPERS] [UNI:COMPONENT] [UNI:STYLES] [UNI:PROP_TYPES]

// [UNI:IMPORTS]
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Platform } from 'react-native';

// [UNI:HELPERS]
const bubbleShadow = Platform.OS === 'web'
  ? { boxShadow: '0 10px 28px rgba(0,0,0,0.08)' }
  : {};

function bubbleColor(sentiment) {
  switch (sentiment) {
    case 'happy':
      return '#fffaf0';
    case 'sad':
      return '#f4f7ff';
    case 'angry':
      return '#fff3f3';
    default:
      return '#ffffff';
  }
}

// [UNI:COMPONENT]
export default function BubbleMorph({ message, isSender, sentiment = 'neutral' }) {
  const align = isSender ? 'flex-end' : 'flex-start';
  const color = bubbleColor(sentiment);
  return (
    <View style={[styles.row, { justifyContent: align }]}>
  <View style={[styles.bubble, bubbleShadow, { backgroundColor: color, alignSelf: align }]}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
}

// [UNI:STYLES]
const styles = StyleSheet.create({
  row: { width: '100%', marginVertical: 8 },
  bubble: { maxWidth: '78%', padding: 12, borderRadius: 16 },
  text: { fontSize: 16, lineHeight: 22, color: '#222' },
});

// [UNI:PROP_TYPES]
BubbleMorph.propTypes = {
  message: PropTypes.string.isRequired,
  isSender: PropTypes.bool.isRequired,
  sentiment: PropTypes.oneOf(['happy', 'sad', 'angry', 'neutral']),
};
