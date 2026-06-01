import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../context/ThemeContext';
import { colors } from '../services/theme';

export default function ScreenContainer({ children, centered = false, insetBottom = false }) {
  const insets = useSafeAreaInsets();
  const { screenBackground } = useAppTheme();
  const edges = insetBottom ? ['left', 'right', 'bottom'] : ['left', 'right'];
  const paddingBottom = insetBottom ? 16 + insets.bottom : 16;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: screenBackground }]} edges={edges}>
      <View style={[styles.content, { paddingBottom }, centered && styles.contentCentered]}>
        {children}
      </View>
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
    padding: 20,
  },
  contentCentered: {
    justifyContent: 'center',
  },
});
