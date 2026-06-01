import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, typography } from '../services/theme';

export default function SectionTitle({ children, variant = 'accent' }) {
  const borderColor = variant === 'primary' ? colors.primary : colors.accent;
  return <Text style={[styles.title, { borderLeftColor: borderColor }]}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: typography.sizeSection,
    fontFamily: typography.fontSemiBold,
    color: colors.text,
    marginBottom: 10,
    paddingLeft: 15,
    borderLeftWidth: 5,
  },
});
