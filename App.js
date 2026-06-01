import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/services/theme';

export default function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider role={usuarioLogado?.tipo ?? null}>
        <StatusBar style="light" />
        <AppNavigator
          user={usuarioLogado}
          onLogin={(usuario) => setUsuarioLogado(usuario)}
          onLogout={() => setUsuarioLogado(null)}
        />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
