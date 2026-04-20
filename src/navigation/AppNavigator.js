import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import AdminStack from './AdminStack';
import EstagiarioStack from './EstagiarioStack';
import PacienteStack from './PacienteStack';

export default function AppNavigator({ user, onLogin, onLogout }) {
  function renderStackPorPerfil() {
    if (user.tipo === 'admin') {
      return <AdminStack user={user} onLogout={onLogout} />;
    }

    if (user.tipo === 'estagiario') {
      return <EstagiarioStack user={user} onLogout={onLogout} />;
    }

    return <PacienteStack user={user} onLogout={onLogout} />;
  }

  return <NavigationContainer>{user ? renderStackPorPerfil() : <AuthStack onLogin={onLogin} />}</NavigationContainer>;
}
