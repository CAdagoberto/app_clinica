import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeEstagiario from '../telas/HomeEstagiario';
import CheckIn from '../telas/CheckIn';
import NovaConsulta from '../telas/NovaConsulta';
import PacientesEstagiario from '../telas/PacientesEstagiario';
import Salas from '../telas/Salas';
import { colors } from '../services/theme';
import { getHeaderIconsOptions } from './headerConfig';

const Tab = createBottomTabNavigator();
function LogoutPlaceholder() {
  return null;
}

export default function EstagiarioStack({ user, onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            HomeEstagiario: 'calendar-outline',
            Pacientes: 'people-outline',
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
      <Tab.Screen name="HomeEstagiario" options={{ title: 'Minhas consultas' }}>
        {(props) => <HomeEstagiario {...props} user={user} />}
      </Tab.Screen>
      <Tab.Screen name="Pacientes">
        {(props) => <PacientesEstagiario {...props} user={user} />}
      </Tab.Screen>
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
