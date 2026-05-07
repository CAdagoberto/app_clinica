import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import HomeEstagiario from '../telas/HomeEstagiario';
import CheckIn from '../telas/CheckIn';
import NovaConsulta from '../telas/NovaConsulta';
import PacientesEstagiario from '../telas/PacientesEstagiario';
import Salas from '../telas/Salas';
import ConsultaDetalhe from '../telas/ConsultaDetalhe';
import Cadastro from '../telas/Cadastro';
import Notificacoes from '../telas/Notificacoes';
import Avaliacoes from '../telas/Avaliacoes';
import Encaminhamentos from '../telas/Encaminhamentos';
import ProntuarioPaciente from '../telas/ProntuarioPaciente';
import PresencaEstagiario from '../telas/PresencaEstagiario';
import ConsultasPacienteEstagiario from '../telas/ConsultasPacienteEstagiario';
import { colors } from '../services/theme';
import { getHeaderIconsOptions } from './headerConfig';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function LogoutPlaceholder() {
  return null;
}

function EstagiarioTabs({ user }) {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            HomeEstagiario: 'calendar-outline',
            NovaConsulta: 'add-circle-outline',
            CheckIn: 'business-outline',
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
      <Tab.Screen name="HomeEstagiario" options={{ title: 'Agenda' }}>
        {(props) => <HomeEstagiario {...props} user={user} />}
      </Tab.Screen>
      <Tab.Screen name="NovaConsulta" options={{ title: 'Agendar' }}>
        {(props) => <NovaConsulta {...props} user={user} />}
      </Tab.Screen>
      <Tab.Screen name="CheckIn" component={CheckIn} options={{ title: 'Recepção' }} />
    </Tab.Navigator>
  );
}

function EstagiarioDrawer({ user, onLogout }) {
  return (
    <Drawer.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        drawerActiveTintColor: colors.primary,
        ...getHeaderIconsOptions(navigation),
      })}
    >
      <Drawer.Screen name="Painel" options={{ title: 'Início', headerShown: false }}>
        {(props) => <EstagiarioTabs {...props} user={user} />}
      </Drawer.Screen>
      <Drawer.Screen name="Pacientes">
        {(props) => <PacientesEstagiario {...props} user={user} />}
      </Drawer.Screen>
      <Drawer.Screen name="Presenca" options={{ title: 'Presença na clínica' }}>
        {(props) => <PresencaEstagiario {...props} user={user} />}
      </Drawer.Screen>
      <Drawer.Screen name="Encaminhamentos" options={{ title: 'Encaminhamentos' }}>
        {(props) => <Encaminhamentos {...props} user={user} />}
      </Drawer.Screen>
      <Drawer.Screen name="Avaliacoes" options={{ title: 'Avaliações' }}>
        {(props) => <Avaliacoes {...props} user={user} />}
      </Drawer.Screen>
      <Drawer.Screen name="Salas" options={{ title: 'Ambientes' }} component={Salas} />
      <Drawer.Screen name="Notificacoes" options={{ title: 'Notificações' }}>
        {(props) => <Notificacoes {...props} user={user} />}
      </Drawer.Screen>
      <Drawer.Screen
        name="Sair"
        component={LogoutPlaceholder}
        listeners={{
          drawerItemPress: (event) => {
            event.preventDefault();
            onLogout();
          },
        }}
      />
    </Drawer.Navigator>
  );
}

export default function EstagiarioStack({ user, onLogout }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="EstagiarioDrawer" options={{ headerShown: false }}>
        {(props) => <EstagiarioDrawer {...props} user={user} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen
        name="ConsultasPacienteEstagiario"
        options={{
          title: 'Consultas do paciente',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#fff',
        }}
        component={ConsultasPacienteEstagiario}
      />
      <Stack.Screen
        name="ConsultaDetalhe"
        options={{
          title: 'Consulta',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#fff',
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
        }}
      >
        {(props) => <Cadastro {...props} user={user} />}
      </Stack.Screen>
      <Stack.Screen
        name="ProntuarioPaciente"
        options={{
          title: 'Prontuário',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#fff',
        }}
        component={ProntuarioPaciente}
      />
      <Stack.Screen
        name="EncaminhamentoPaciente"
        options={{
          title: 'Encaminhamento',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#fff',
        }}
      >
        {(props) => <Encaminhamentos {...props} user={user} />}
      </Stack.Screen>
      <Stack.Screen
        name="Notificacoes"
        options={{
          title: 'Notificações',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#fff',
        }}
      >
        {(props) => <Notificacoes {...props} user={user} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
