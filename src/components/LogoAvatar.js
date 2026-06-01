import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, typography } from '../services/theme';

export default function LogoAvatar({ size = 60, circular = false }) {
  const radius = circular ? size / 2 : radii.logo;
  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: radius }]}>
      <Text style={[styles.text, { fontSize: size * 0.36 }]}>CP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.logo,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  text: {
    fontFamily: typography.fontBold,
    color: '#ffffff',
    letterSpacing: 0.5,
  },
});
