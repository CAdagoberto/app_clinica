import React from 'react';
import { Alert, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function getHeaderIconsOptions(navigation) {
  function abrirNotificacoes() {
    if (navigation?.navigate) {
      try {
        navigation.navigate('Notificacoes');
        return;
      } catch {
        /* ignore */
      }
    }
    Alert.alert('Notificações', 'Abra o menu lateral para acessar notificações.');
  }

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
            : Alert.alert('Menu', 'Menu lateral indisponível nesta tela.')
        }
        style={styles.iconButton}
      >
        <Ionicons name="menu" size={28} color="#ffffff" />
      </Pressable>
    ),
    headerRight: () => (
      <Pressable onPress={abrirNotificacoes} style={styles.iconButton}>
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
