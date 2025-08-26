// src/components/UNIAvatar.js
// Anchors: [UNI:IMPORTS] [UNI:STATE] [UNI:EFFECT] [UNI:UI] [UNI:STYLES] [UNI:PROP_TYPES]
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Animated, View, StyleSheet } from 'react-native';

export default function UNIAvatar({ mood = 'neutral', speaking = false }) {
  // [UNI:STATE]
  const scale = useRef(new Animated.Value(1)).current;

  // [UNI:EFFECT]
  useEffect(() => {
    let to;
    if (speaking) {
      to = 1.08;
    } else if (mood === 'happy') {
      to = 1.05;
    } else {
      to = 1.0;
    }
    Animated.spring(scale, {
      toValue: to,
  useNativeDriver: false,
      friction: 6,
      tension: 120,
    }).start();
  }, [speaking, mood]);

  // [UNI:UI]
  return (
  <Animated.View style={[styles.dot, { transform: [{ scale }] }, { pointerEvents: 'none' }]}>
      {/* swap for SVG icon later */}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  dot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#111', opacity: 0.85,
  },
});

UNIAvatar.propTypes = {
  mood: PropTypes.string,
  speaking: PropTypes.bool,
};
