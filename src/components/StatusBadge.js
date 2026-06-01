import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getStatusConsultaStyle, getStatusSalaStyle, typography } from '../services/theme';

export function ConsultaStatusBadge({ status }) {
  const s = getStatusConsultaStyle(status);
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <Text style={[styles.text, { color: s.text }]}>{status}</Text>
    </View>
  );
}

export function SalaStatusBadge({ status }) {
  const s = getStatusSalaStyle(status);
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <Text style={[styles.text, { color: s.text }]}>{s.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 6,
  },
  text: {
    fontSize: 12,
    fontFamily: typography.fontSemiBold,
    textTransform: 'capitalize',
  },
});
