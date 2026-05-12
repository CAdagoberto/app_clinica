import React from 'react';
import { TextInput } from 'react-native';
import { colors } from '../services/theme';

export default function AppTextInput({ style, placeholderTextColor = colors.muted, ...props }) {
  return (
    <TextInput
      style={[{ color: colors.text }, style]}
      placeholderTextColor={placeholderTextColor}
      {...props}
    />
  );
}
