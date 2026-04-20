import React from 'react';
import { Alert, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function getHeaderIconsOptions() {
  return {
    headerTitle: '',
    headerLeft: () => (
      <Pressable
        onPress={() => Alert.alert('Perfil', 'Área de perfil em breve.')}
        style={styles.iconButton}
      >
        <Ionicons name="person-circle-outline" size={28} color="#ffffff" />
      </Pressable>
    ),
    headerRight: () => (
      <Pressable
        onPress={() => Alert.alert('Notificações', 'Você não tem novas notificações.')}
        style={styles.iconButton}
      >
        <Ionicons name="notifications-outline" size={24} color="#ffffff" />
      </Pressable>
    ),
  };
}

const styles = StyleSheet.create({
  iconButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
