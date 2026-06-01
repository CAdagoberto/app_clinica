import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import HomeAdmin from '../telas/HomeAdmin';
import CheckIn from '../telas/CheckIn';
import NovaConsulta from '../telas/NovaConsulta';
import Salas from '../telas/Salas';
import UsuariosAdmin from '../telas/UsuariosAdmin';
import Estagiarios from '../telas/Estagiarios';
import AgendaEstagiario from '../telas/AgendaEstagiario';
import ConsultaDetalhe from '../telas/ConsultaDetalhe';
import Cadastro from '../telas/Cadastro';
import Notificacoes from '../telas/Notificacoes';
import Avaliacoes from '../telas/Avaliacoes';
import Encaminhamentos from '../telas/Encaminhamentos';
import { colors } from '../services/theme';
import { getDrawerOptions, getStackHeaderOptions, getTabBarOptions } from './navigationTheme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const ROLE = 'admin';

function LogoutPlaceholder() {
  return null;
}

function AdminTabs({ user }) {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            HomeAdmin: 'calendar-outline',
            NovaConsulta: 'add-circle-outline',
            CheckIn: 'business-outline',
          };

          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        ...getTabBarOptions(ROLE),
        ...getStackHeaderOptions(ROLE, navigation),
      })}
    >
      <Tab.Screen name="HomeAdmin" options={{ title: 'Painel' }}>
        {(props) => <HomeAdmin {...props} user={user} />}
      </Tab.Screen>
      <Tab.Screen name="NovaConsulta" options={{ title: 'Agendar' }}>
        {(props) => <NovaConsulta {...props} user={user} />}
      </Tab.Screen>
      <Tab.Screen name="CheckIn" component={CheckIn} options={{ title: 'Recepção' }} />
    </Tab.Navigator>
  );
}

function AdminDrawer({ user, onLogout }) {
  return (
    <Drawer.Navigator screenOptions={({ navigation }) => getDrawerOptions(ROLE, navigation)}>
      <Drawer.Screen name="Painel" options={{ title: 'Visão Geral', headerShown: false }}>
        {(props) => <AdminTabs {...props} user={user} />}
      </Drawer.Screen>
      <Drawer.Screen name="Estagiarios" options={{ title: 'Estagiários' }} component={Estagiarios} />
      <Drawer.Screen name="Usuarios" options={{ title: 'Gestão de Usuários' }}>
        {(props) => <UsuariosAdmin {...props} />}
      </Drawer.Screen>
      <Drawer.Screen name="Salas" options={{ title: 'Controle de Salas' }} component={Salas} />
      <Drawer.Screen name="Encaminhamentos" options={{ title: 'Encaminhamentos' }}>
        {(props) => <Encaminhamentos {...props} user={user} />}
      </Drawer.Screen>
      <Drawer.Screen name="Avaliacoes" options={{ title: 'Avaliações e Relatórios' }}>
        {(props) => <Avaliacoes {...props} user={user} />}
      </Drawer.Screen>
      <Drawer.Screen name="Notificacoes" options={{ title: 'Notificações' }}>
        {(props) => <Notificacoes {...props} user={user} />}
      </Drawer.Screen>
      <Drawer.Screen
        name="Sair"
        options={{ title: 'Sair', drawerLabelStyle: { color: colors.admin.logout } }}
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

export default function AdminStack({ user, onLogout }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AdminDrawer" options={{ headerShown: false }}>
        {(props) => <AdminDrawer {...props} user={user} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="ConsultaDetalhe" options={({ navigation }) => ({ title: 'Consulta', ...getStackHeaderOptions(ROLE, navigation) })}>
        {(props) => <ConsultaDetalhe {...props} user={user} />}
      </Stack.Screen>
      <Stack.Screen name="CadastroUsuario" options={({ navigation }) => ({ title: 'Cadastro', ...getStackHeaderOptions(ROLE, navigation) })}>
        {(props) => <Cadastro {...props} user={user} />}
      </Stack.Screen>
      <Stack.Screen
        name="AgendaEstagiario"
        options={({ navigation }) => ({ title: 'Agenda', ...getStackHeaderOptions(ROLE, navigation) })}
        component={AgendaEstagiario}
      />
      <Stack.Screen name="Notificacoes" options={({ navigation }) => ({ title: 'Notificações', ...getStackHeaderOptions(ROLE, navigation) })}>
        {(props) => <Notificacoes {...props} user={user} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
