import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radii, shadows, typography } from '../services/theme';

export default function ActionButton({ title, onPress, variant = 'primary', disabled = false }) {
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        isSecondary && styles.secondary,
        isOutline && styles.outline,
        isDanger && styles.danger,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        variant === 'primary' && !disabled && shadows.button,
      ]}
    >
      <Text
        style={[
          styles.text,
          (isSecondary || isOutline) && styles.secondaryText,
          isDanger && styles.dangerText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radii.button,
    alignItems: 'center',
  },
  secondary: {
    backgroundColor: colors.navActiveBg,
    borderWidth: 0,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  text: {
    color: '#ffffff',
    fontFamily: typography.fontBold,
    fontSize: 15,
  },
  secondaryText: {
    color: colors.primary,
  },
  dangerText: {
    color: '#ffffff',
  },
  disabled: {
    opacity: 0.55,
    backgroundColor: colors.borderNeutral,
  },
  pressed: {
    opacity: 0.88,
  },
});
