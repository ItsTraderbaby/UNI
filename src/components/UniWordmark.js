// src/components/UniWordmark.js
// Anchors: [UNI:IMPORTS] [UNI:COMPONENT] [UNI:PROP_TYPES]

import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';

export default function UniWordmark({ size = 18, dim = 0.45, style }) {
  return (
    <Text style={[{ fontSize: size, opacity: dim, letterSpacing: 3, fontWeight: '900' }, style]}>
      •UNI•
    </Text>
  );
}

UniWordmark.propTypes = {
  size: PropTypes.number,
  dim: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};
