import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import HomeEstagiario from '../telas/HomeEstagiario';
import CheckIn from '../telas/CheckIn';
import NovaConsulta from '../telas/NovaConsulta';
import PacientesEstagiario from '../telas/PacientesEstagiario';
import Salas from '../telas/Salas';
import ConsultaDetalhe from '../telas/ConsultaDetalhe';
import Cadastro from '../telas/Cadastro';
import { colors } from '../services/theme';
import { getHeaderIconsOptions } from './headerConfig';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function LogoutPlaceholder() {
  return null;
}

function EstagiarioTabs({ user, onLogout }) {
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

export default function EstagiarioStack({ user, onLogout }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="EstagiarioTabs" options={{ headerShown: false }}>
        {(props) => <EstagiarioTabs {...props} user={user} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen
        name="ConsultaDetalhe"
        options={{
          title: 'Detalhes da Consulta',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#fff',
          ...getHeaderIconsOptions(),
        }}
      >
        {(props) => <ConsultaDetalhe {...props} user={user} />}
      </Stack.Screen>
      <Stack.Screen
        name="CadastroUsuario"
        options={{
          title: 'Cadastro',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#fff',
          ...getHeaderIconsOptions(),
        }}
      >
        {(props) => <Cadastro {...props} user={user} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
