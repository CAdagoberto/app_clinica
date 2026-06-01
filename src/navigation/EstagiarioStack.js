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
import { getDrawerOptions, getStackHeaderOptions, getTabBarOptions } from './navigationTheme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const ROLE = 'estagiario';

function LogoutPlaceholder() {
  return null;
}

function EstagiarioTabs({ user }) {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            HomeEstagiario: 'home-outline',
            NovaConsulta: 'add-circle-outline',
            CheckIn: 'business-outline',
          };

          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        ...getTabBarOptions(ROLE),
        ...getStackHeaderOptions(ROLE, navigation),
      })}
    >
      <Tab.Screen name="HomeEstagiario" options={{ title: 'Início' }}>
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
    <Drawer.Navigator screenOptions={({ navigation }) => getDrawerOptions(ROLE, navigation)}>
      <Drawer.Screen name="Painel" options={{ title: 'Início', headerShown: false }}>
        {(props) => <EstagiarioTabs {...props} user={user} />}
      </Drawer.Screen>
      <Drawer.Screen name="Pacientes" options={{ title: 'Meus Pacientes' }}>
        {(props) => <PacientesEstagiario {...props} user={user} />}
      </Drawer.Screen>
      <Drawer.Screen name="Presenca" options={{ title: 'Presença na clínica' }}>
        {(props) => <PresencaEstagiario {...props} user={user} />}
      </Drawer.Screen>
      <Drawer.Screen name="Encaminhamentos" options={{ title: 'Encaminhamentos' }}>
        {(props) => <Encaminhamentos {...props} user={user} />}
      </Drawer.Screen>
      <Drawer.Screen name="Avaliacoes" options={{ title: 'Avaliação Acadêmica' }}>
        {(props) => <Avaliacoes {...props} user={user} />}
      </Drawer.Screen>
      <Drawer.Screen name="Salas" options={{ title: 'Ambientes' }} component={Salas} />
      <Drawer.Screen name="Notificacoes" options={{ title: 'Notificações' }}>
        {(props) => <Notificacoes {...props} user={user} />}
      </Drawer.Screen>
      <Drawer.Screen
        name="Sair"
        options={{ title: 'Sair', drawerLabelStyle: { color: colors.danger } }}
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
        options={({ navigation }) => ({
          title: 'Consultas do paciente',
          ...getStackHeaderOptions(ROLE, navigation),
        })}
        component={ConsultasPacienteEstagiario}
      />
      <Stack.Screen name="ConsultaDetalhe" options={({ navigation }) => ({ title: 'Consulta', ...getStackHeaderOptions(ROLE, navigation) })}>
        {(props) => <ConsultaDetalhe {...props} user={user} />}
      </Stack.Screen>
      <Stack.Screen name="CadastroUsuario" options={({ navigation }) => ({ title: 'Cadastro', ...getStackHeaderOptions(ROLE, navigation) })}>
        {(props) => <Cadastro {...props} user={user} />}
      </Stack.Screen>
      <Stack.Screen
        name="ProntuarioPaciente"
        options={({ navigation }) => ({ title: 'Prontuário', ...getStackHeaderOptions(ROLE, navigation) })}
        component={ProntuarioPaciente}
      />
      <Stack.Screen name="EncaminhamentoPaciente" options={({ navigation }) => ({ title: 'Encaminhamento', ...getStackHeaderOptions(ROLE, navigation) })}>
        {(props) => <Encaminhamentos {...props} user={user} />}
      </Stack.Screen>
      <Stack.Screen name="Notificacoes" options={({ navigation }) => ({ title: 'Notificações', ...getStackHeaderOptions(ROLE, navigation) })}>
        {(props) => <Notificacoes {...props} user={user} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
