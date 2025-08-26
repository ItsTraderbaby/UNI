// src/components/BackgroundCanvas.js
// Anchors: [UNI:IMPORTS] [UNI:STATE] [UNI:EFFECT] [UNI:UI] [UNI:STYLES] [UNI:PROP_TYPES]
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function BackgroundCanvas({ mood = 'neutral', showLogo = true }) {
  // [UNI:STATE]
  const value = useRef(new Animated.Value(0)).current;

  // [UNI:EFFECT]
  useEffect(() => {
    Animated.timing(value, {
      toValue: Math.random(),
      duration: 900,
  useNativeDriver: false, // avoid web warning
    }).start();
  }, [mood]);

  let colors;
  if (mood === 'happy') {
    colors = ['#ffe3a3', '#ffd1dc'];
  } else if (mood === 'sad') {
    colors = ['#b3c7ff', '#e6f0ff'];
  } else if (mood === 'angry') {
    colors = ['#ffd6cc', '#ffb3a7'];
  } else {
    colors = ['#f5f7fa', '#e4ecf3'];
  }

  // [UNI:UI]
  return (
  <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}>
      <LinearGradient colors={colors} style={StyleSheet.absoluteFill} />
      {showLogo ? (
  <View style={[styles.logoWrap, { pointerEvents: 'none' }]}>
          <TextLikeLogo />
        </View>
      ) : null}
    </View>
  );
}

// Minimal text logo (avoids Image resizeMode/tint warnings on web)
function TextLikeLogo() {
  return (
  <View style={[styles.wordmarkWrap, { pointerEvents: 'none' }]}>
      {/* Use a simple text-based wordmark; swap for SVG later if desired */}
      <Animated.Text style={styles.wordmark}>•UNI•</Animated.Text>
    </View>
  );
}

// [UNI:STYLES]
const styles = StyleSheet.create({
  logoWrap: { position: 'absolute', top: 12, alignSelf: 'center' },
  wordmarkWrap: { opacity: 0.55 },
  wordmark: { fontSize: 18, fontWeight: '700', letterSpacing: 2, color: '#1b1b1b' },
});

BackgroundCanvas.propTypes = {
  mood: PropTypes.string,
  showLogo: PropTypes.bool,
};
