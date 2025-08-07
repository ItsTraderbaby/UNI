// src/components/BubbleMorph.js

import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

/**
 * BubbleMorph
 *
 * An animated message bubble that morphs based on sentiment:
 * - 'happy': gentle pulsing
 * - 'sad': subtle shrink/stretch
 * - 'angry': horizontal shake
 * - 'neutral': static
 *
 * Props:
 * - message: string — the text to display
 * - isSender: boolean — aligns bubble left or right
 * - sentiment: 'happy' | 'sad' | 'angry' | 'neutral'
 */
export default function BubbleMorph({ message, isSender, sentiment }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animation;
    switch (sentiment) {
      case 'happy':
        animation = Animated.loop(
          Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
          ])
        );
        break;

      case 'sad':
        animation = Animated.loop(
          Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.95, duration: 800, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
          ])
        );
        break;

      case 'angry':
        animation = Animated.loop(
          Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -1, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
          ])
        );
        break;

      default:
        // neutral: no animation
        animation = null;
    }

    if (animation) animation.start();
    return () => animation && animation.stop();
  }, [sentiment, scaleAnim, shakeAnim]);

  // Convert shakeAnim to translateX
  const translateX = shakeAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-5, 5],
  });

  return (
    <Animated.View
      style={[
        styles.bubble,
        isSender ? styles.sender : styles.receiver,
        { transform: sentiment === 'angry' ? [{ translateX }] : [{ scale: scaleAnim }] },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    marginVertical: 4,
    padding: 10,
    borderRadius: 16,
    maxWidth: '75%',
    backgroundColor: '#fff',
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
