import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import HomePaciente from '../telas/HomePaciente';
import Notificacoes from '../telas/Notificacoes';
import Avaliacoes from '../telas/Avaliacoes';
import ConsultaDetalhe from '../telas/ConsultaDetalhe';
import CheckIn from '../telas/CheckIn';
import { colors } from '../services/theme';
import { getStackHeaderOptions, getTabBarOptions } from './navigationTheme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const ROLE = 'paciente';

function LogoutPlaceholder() {
  return null;
}

function PacienteTabs({ user, onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            HomePaciente: 'home-outline',
            CheckIn: 'checkmark-circle-outline',
            Notificacoes: 'notifications-outline',
            Avaliacoes: 'star-outline',
            Sair: 'log-out-outline',
          };

          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        ...getTabBarOptions(ROLE),
        ...getStackHeaderOptions(ROLE, navigation),
      })}
    >
      <Tab.Screen name="HomePaciente" options={{ title: 'Início' }}>
        {(props) => <HomePaciente {...props} user={user} />}
      </Tab.Screen>
      <Tab.Screen name="CheckIn" options={{ title: 'Check-in' }} component={CheckIn} />
      <Tab.Screen name="Notificacoes" options={{ title: 'Avisos' }}>
        {(props) => <Notificacoes {...props} user={user} />}
      </Tab.Screen>
      <Tab.Screen name="Avaliacoes" options={{ title: 'Avaliar' }}>
        {(props) => <Avaliacoes {...props} user={user} />}
      </Tab.Screen>
      <Tab.Screen
        name="Sair"
        component={LogoutPlaceholder}
        options={{ title: 'Sair' }}
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
      <Stack.Screen name="ConsultaDetalhe" options={({ navigation }) => ({ title: 'Consulta', ...getStackHeaderOptions(ROLE, navigation) })}>
        {(props) => <ConsultaDetalhe {...props} user={user} />}
      </Stack.Screen>
      <Stack.Screen name="Notificacoes" options={({ navigation }) => ({ title: 'Notificações', ...getStackHeaderOptions(ROLE, navigation) })}>
        {(props) => <Notificacoes {...props} user={user} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
