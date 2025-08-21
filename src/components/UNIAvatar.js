// src/components/UNIAvatar.js
// Anchors: [UNI:IMPORTS] [UNI:STATE] [UNI:HELPERS] [UNI:EFFECTS] [UNI:RENDER] [UNI:STYLES] [UNI:PROP_TYPES]

// [UNI:IMPORTS]
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Animated, View, Platform } from 'react-native';
import UniWordmark from './UniWordmark';

// [UNI:STATE]
const USE_NATIVE = Platform.OS !== 'web';
const webShadow = { boxShadow: '0 8px 18px rgba(0,0,0,0.08)' };
const nativeShadow = {
  shadowColor: '#000',
  shadowOpacity: 0.12,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 6 },
};
const ringShadow = Platform.OS === 'web' ? webShadow : nativeShadow;

// [UNI:HELPERS]
function moodColor(mood) {
  switch (mood) {
    case 'happy': return '#FFCF6C';
    case 'sad':   return '#9FB7FF';
    case 'angry': return '#FF9A9A';
    default:      return '#BDBDBD';
  }
}
function startSpeakingPulse(anim) {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(anim, { toValue: 1, duration: 280, useNativeDriver: false }),
      Animated.timing(anim, { toValue: 0, duration: 280, useNativeDriver: false }),
    ])
  );
}
function stopSpeakingPulse(anim, handleRef) {
  if (handleRef.current) handleRef.current.stop();
  anim.stopAnimation();
  anim.setValue(0);
}

// [UNI:COMPONENT]
export default function UNIAvatar({ mood = 'neutral', speaking = false }) {
  const glow = useRef(new Animated.Value(1)).current;
  const speak = useRef(new Animated.Value(0)).current;
  const speakHandle = useRef(null);

  // breathing
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1.07, duration: 900, useNativeDriver: USE_NATIVE }),
        Animated.timing(glow, { toValue: 1.00, duration: 900, useNativeDriver: USE_NATIVE }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [glow]);

  // speaking pulse (separate methods per Sonar suggestion)
  useEffect(() => {
    if (speaking) {
      speakHandle.current = startSpeakingPulse(speak);
      speakHandle.current.start();
    } else {
      stopSpeakingPulse(speak, speakHandle);
    }
    return () => stopSpeakingPulse(speak, speakHandle);
  }, [speaking, speak]);

  const color = moodColor(mood);
  const ringStyle = {
    borderColor: color,
    borderWidth: 2 + speak.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
  };

  // [UNI:RENDER]
  return (
    <Animated.View style={[styles.ring, ringShadow, { transform: [{ scale: glow }] }]}>
      <View style={[styles.inner, ringStyle]}>
        <UniWordmark size={12} dim={0.9} />
      </View>
    </Animated.View>
  );
}

// [UNI:STYLES]
const styles = StyleSheet.create({
  ring: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  inner: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});

// [UNI:PROP_TYPES]
UNIAvatar.propTypes = {
  mood: PropTypes.oneOf(['happy', 'sad', 'angry', 'neutral']),
  speaking: PropTypes.bool,
};
