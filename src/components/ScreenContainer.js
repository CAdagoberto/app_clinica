import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { colors } from '../services/theme';

export default function ScreenContainer({ children, centered = false }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.content, centered && styles.contentCentered]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  contentCentered: {
    justifyContent: 'center',
  },
});
