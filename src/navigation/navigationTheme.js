import { colors } from '../services/theme';
import { getHeaderIconsOptions } from './headerConfig';

export function getTabBarOptions(role) {
  const active = role === 'admin' ? colors.admin.logo : colors.primary;
  return {
    tabBarActiveTintColor: active,
    tabBarInactiveTintColor: colors.placeholder,
    tabBarStyle: {
      backgroundColor: colors.surface,
      borderTopColor: colors.borderNeutral,
    },
    tabBarLabelStyle: { fontSize: 10, fontFamily: 'Inter_500Medium' },
  };
}

export function getStackHeaderOptions(role, navigation, overrides = {}) {
  const headerBg = role === 'admin' ? colors.admin.sidebar : colors.primary;
  const icons = getHeaderIconsOptions(navigation);
  return {
    ...icons,
    headerStyle: { backgroundColor: headerBg },
    headerTintColor: '#ffffff',
    headerTitleStyle: {
      ...icons.headerTitleStyle,
      fontFamily: 'Inter_700Bold',
      fontSize: 18,
      color: '#ffffff',
    },
    ...overrides,
  };
}

export function getDrawerOptions(role, navigation) {
  const isAdmin = role === 'admin';
  return {
    ...getStackHeaderOptions(role, navigation),
    drawerStyle: {
      backgroundColor: isAdmin ? colors.admin.sidebar : colors.surface,
      width: isAdmin ? 280 : 260,
    },
    drawerActiveTintColor: isAdmin ? '#ffffff' : colors.primary,
    drawerInactiveTintColor: isAdmin ? colors.admin.sidebarText : colors.muted,
    drawerActiveBackgroundColor: isAdmin ? colors.admin.sidebarActive : colors.navActiveBg,
    drawerLabelStyle: { fontFamily: 'Inter_500Medium', fontSize: 15 },
    drawerItemStyle: { borderRadius: 12, marginHorizontal: 8 },
  };
}
