import React from 'react';
import { Alert, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function getHeaderIconsOptions(navigation) {
  return {
    headerTitleAlign: 'center',
    headerTitleStyle: {
      color: '#ffffff',
      fontWeight: '700',
      fontSize: 18,
    },
    headerLeft: () => (
      <Pressable
        onPress={() =>
          navigation?.openDrawer
            ? navigation.openDrawer()
            : Alert.alert('Perfil', 'Menu lateral indisponível nesta tela.')
        }
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
