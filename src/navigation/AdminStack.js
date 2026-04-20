import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeAdmin from '../telas/HomeAdmin';
import CheckIn from '../telas/CheckIn';
import NovaConsulta from '../telas/NovaConsulta';
import Salas from '../telas/Salas';
import UsuariosAdmin from '../telas/UsuariosAdmin';
import { colors } from '../services/theme';
import { getHeaderIconsOptions } from './headerConfig';

const Tab = createBottomTabNavigator();
function LogoutPlaceholder() {
  return null;
}

export default function AdminStack({ user, onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            HomeAdmin: 'speedometer-outline',
            Usuarios: 'people-outline',
            Salas: 'business-outline',
            NovaConsulta: 'add-circle-outline',
            CheckIn: 'checkmark-circle-outline',
            Sair: 'log-out-outline',
          };

          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: { backgroundColor: '#fff' },
        tabBarLabelStyle: { fontSize: 10 },
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        ...getHeaderIconsOptions(),
      })}
    >
      <Tab.Screen name="HomeAdmin" options={{ title: 'Home' }}>
        {(props) => <HomeAdmin {...props} user={user} />}
      </Tab.Screen>
      <Tab.Screen name="Usuarios" component={UsuariosAdmin} options={{ title: 'Usuários' }} />
      <Tab.Screen name="Salas" component={Salas} />
      <Tab.Screen name="NovaConsulta" options={{ title: 'Nova Consulta' }}>
        {(props) => <NovaConsulta {...props} user={user} />}
      </Tab.Screen>
      <Tab.Screen name="CheckIn" component={CheckIn} options={{ title: 'Check-in' }} />
      <Tab.Screen
        name="Sair"
        component={LogoutPlaceholder}
        listeners={{
          tabPress: (event) => {
            event.preventDefault();
            onLogout();
          },
        }}
      />
    </Tab.Navigator>
  );
}
