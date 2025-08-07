// src/components/UNIAvatar.js

import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

/**
 * UNIAvatar
 *
 * A simple avatar component for the UNI persona,
 * displayed in the chat header or anywhere you need a visual identifier.
 * Uses the local asset at assets/uni-avatar.png.
 */

export default function UNIAvatar() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/uni-avatar.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

