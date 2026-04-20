import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeAdmin from '../telas/HomeAdmin';
import CheckIn from '../telas/CheckIn';
import { colors } from '../services/theme';

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
            CheckIn: 'checkmark-circle-outline',
            Sair: 'log-out-outline',
          };

          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: { backgroundColor: '#fff' },
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
      })}
    >
      <Tab.Screen name="HomeAdmin" options={{ title: 'Home' }}>
        {(props) => <HomeAdmin {...props} user={user} />}
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
