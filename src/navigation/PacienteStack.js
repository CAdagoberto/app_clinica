import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import HomePaciente from '../telas/HomePaciente';
import CheckIn from '../telas/CheckIn';
import ConsultaDetalhe from '../telas/ConsultaDetalhe';
import { colors } from '../services/theme';
import { getHeaderIconsOptions } from './headerConfig';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function LogoutPlaceholder() {
  return null;
}

function PacienteTabs({ user, onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            HomePaciente: 'calendar-outline',
            CheckIn: 'clipboard-outline',
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
        ...getHeaderIconsOptions(navigation),
      })}
    >
      <Tab.Screen name="HomePaciente" options={{ title: 'Consultas' }}>
        {(props) => <HomePaciente {...props} user={user} />}
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

export default function PacienteStack({ user, onLogout }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PacienteTabs" options={{ headerShown: false }}>
        {(props) => <PacienteTabs {...props} user={user} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen
        name="ConsultaDetalhe"
        options={{
          title: 'Detalhes da Consulta',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#fff',
        }}
      >
        {(props) => <ConsultaDetalhe {...props} user={user} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
