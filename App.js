import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator
        user={usuarioLogado}
        onLogin={(usuario) => setUsuarioLogado(usuario)}
        onLogout={() => setUsuarioLogado(null)}
      />
    </>
  );
}
