import React, { useState } from 'react';
import { Animated, TouchableOpacity, Text, StyleSheet } from 'react-native';

const BubbleMorph = ({ text, emotion = 'neutral' }) => {
  const [scale] = useState(new Animated.Value(1));
  const [shake] = useState(new Animated.Value(0));

  const animate = () => {
    if (emotion === 'love') {
      Animated.sequence([
        Animated.spring(scale, { toValue: 1.15, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      ]).start();
    } else if (emotion === 'anger') {
      Animated.sequence([
        Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    } else if (emotion === 'funny') {
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.2, duration: 70, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.9, duration: 70, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 70, useNativeDriver: true }),
      ]).start();
    }
  };

  return (
    <TouchableOpacity onPress={animate} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.bubble,
          {
            backgroundColor:
              emotion === 'love'
                ? '#ffe0ec'
                : emotion === 'anger'
                ? '#ffe3e0'
                : emotion === 'funny'
                ? '#e0f7fa'
                : '#f0f0f0',
            transform: [
              { scale },
              { translateX: shake },
            ],
          },
        ]}
      >
        <Text style={styles.text}>{text}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bubble: {
    padding: 16,
    borderRadius: 24,
    margin: 8,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text: {
    fontSize: 16,
  },
});

export default BubbleMorph;
