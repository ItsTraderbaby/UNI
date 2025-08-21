// src/components/BackgroundCanvas.js
// Anchors: [UNI:IMPORTS] [UNI:STATE] [UNI:EFFECTS] [UNI:RENDER] [UNI:STYLES] [UNI:PROP_TYPES]

// [UNI:IMPORTS]
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet, View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import UniWordmark from './UniWordmark';

// [UNI:STATE]
const USE_NATIVE = Platform.OS !== 'web';

// [UNI:COMPONENT]
export default function BackgroundCanvas({ mood = 'neutral', showLogo = true }) {
  const happy = useRef(new Animated.Value(0)).current;
  const sad = useRef(new Animated.Value(0)).current;
  const angry = useRef(new Animated.Value(0)).current;
  const neutral = useRef(new Animated.Value(1)).current;

  // [UNI:EFFECTS]
  useEffect(() => {
    const map = {
      happy:   { happy: 1, sad: 0, angry: 0, neutral: 0 },
      sad:     { happy: 0, sad: 1, angry: 0, neutral: 0 },
      angry:   { happy: 0, sad: 0, angry: 1, neutral: 0 },
      neutral: { happy: 0, sad: 0, angry: 0, neutral: 1 },
    };
    const targets = map[mood] || map.neutral;

    const tween = (ref, toValue) =>
      Animated.timing(ref, { toValue, duration: 1000, useNativeDriver: USE_NATIVE });

    Animated.parallel([
      tween(happy, targets.happy),
      tween(sad, targets.sad),
      tween(angry, targets.angry),
      tween(neutral, targets.neutral),
    ]).start();
  }, [mood, happy, sad, angry, neutral]);

  // [UNI:RENDER]
  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}>
      <Animated.View style={[styles.fill, { opacity: happy }]}>
        <LinearGradient colors={['#FFF3C4', '#FFD48B']} style={styles.fill} />
      </Animated.View>
      <Animated.View style={[styles.fill, { opacity: sad }]}>
        <LinearGradient colors={['#C7D8FF', '#9FB7FF']} style={styles.fill} />
      </Animated.View>
      <Animated.View style={[styles.fill, { opacity: angry }]}>
        <LinearGradient colors={['#FFD1D1', '#FF9A9A']} style={styles.fill} />
      </Animated.View>
      <Animated.View style={[styles.fill, { opacity: neutral }]}>
        <LinearGradient colors={['#F1F1F1', '#E7E7E7']} style={styles.fill} />
      </Animated.View>

      {showLogo && <UniWordmark size={18} style={styles.wordmark} />}
    </View>
  );
}

// [UNI:STYLES]
const styles = StyleSheet.create({
  fill: { ...StyleSheet.absoluteFillObject },
  wordmark: { position: 'absolute', top: 8, alignSelf: 'center', opacity: 0.45 },
});

// [UNI:PROP_TYPES]
BackgroundCanvas.propTypes = {
  mood: PropTypes.oneOf(['happy', 'sad', 'angry', 'neutral']),
  showLogo: PropTypes.bool,
};
