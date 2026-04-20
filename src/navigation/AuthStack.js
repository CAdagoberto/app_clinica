import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../telas/Login';
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
      <Stack.Screen name="Login" options={{ title: 'Entrar', headerShown: false }}>
        {(props) => <Login {...props} onLogin={onLogin} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
