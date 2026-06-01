import React from 'react';
import { TextInput } from 'react-native';
import { colors, typography } from '../services/theme';
import { themeStyles } from '../services/themeStyles';

export default function AppTextInput({ style, placeholderTextColor = colors.placeholder, ...props }) {
  return (
    <TextInput
      style={[themeStyles.input, style]}
      placeholderTextColor={placeholderTextColor}
      {...props}
    />
  );
}
