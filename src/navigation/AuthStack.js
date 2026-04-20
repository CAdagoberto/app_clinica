import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../telas/Login';
import Cadastro from '../telas/Cadastro';
import { colors } from '../services/theme';

const Stack = createNativeStackNavigator();

export default function AuthStack({ onLogin }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen name="Login" options={{ title: 'Entrar' }}>
        {(props) => <Login {...props} onLogin={onLogin} />}
      </Stack.Screen>
      <Stack.Screen name="Cadastro" component={Cadastro} />
    </Stack.Navigator>
  );
}
