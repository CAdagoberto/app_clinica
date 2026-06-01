/**
 * Design system — alinhado a `design.md` (telas_web).
 * Azul primário #2a75f3, fundo lavanda #e8efff; admin com sidebar/header slate.
 */

export const colors = {
  primary: '#2a75f3',
  primaryHover: '#1e62d0',
  logo: '#72a1f8',
  accent: '#40E0D0',
  accentDark: '#1a568b',

  background: '#e8efff',
  surface: '#ffffff',
  border: '#dbeafe',
  borderNeutral: '#e2e8f0',
  borderInput: '#cbd5e1',

  text: '#1e293b',
  textAlt: '#1a202c',
  muted: '#64748b',
  mutedDark: '#475569',
  placeholder: '#94a3b8',

  danger: '#e53e3e',
  dangerBg: '#fee2e2',
  dangerText: '#991b1b',

  avatarUser: '#2c3e50',
  avatarPatient: '#40E0D0',

  navActiveBg: '#e8efff',

  success: '#10b981',
  successBg: '#dcfce7',
  successText: '#166534',
  warning: '#f59e0b',
  warningBg: '#fef9c3',
  warningText: '#854d0e',
  warningBorder: '#fef08a',
  info: '#3b82f6',
  infoBg: '#e0f2fe',
  infoText: '#0284c7',
  error: '#ef4444',

  admin: {
    background: '#f1f5f9',
    sidebar: '#1e293b',
    sidebarActive: '#334155',
    sidebarText: '#94a3b8',
    logo: '#3b82f6',
    kpiBlueBg: '#e0f2fe',
    kpiBlueText: '#0284c7',
    kpiGreenBg: '#dcfce7',
    kpiGreenText: '#16a34a',
    kpiPurpleBg: '#f3e8ff',
    kpiPurpleText: '#9333ea',
    logout: '#f87171',
  },
};

export const radii = {
  card: 24,
  cardMd: 18,
  cardSm: 16,
  input: 12,
  button: 30,
  logo: 15,
  logoLogin: 30,
  badge: 20,
};

export const spacing = {
  screen: 20,
  card: 16,
  section: 12,
};

export const typography = {
  fontRegular: 'Inter_400Regular',
  fontMedium: 'Inter_500Medium',
  fontSemiBold: 'Inter_600SemiBold',
  fontBold: 'Inter_700Bold',
  sizeTitle: 26,
  sizeTitleMd: 22,
  sizeSection: 18,
  sizeBody: 16,
  sizeSmall: 14,
  sizeCaption: 13,
};

export const shadows = {
  login: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 25,
    elevation: 4,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
  },
  button: {
    shadowColor: '#2a75f3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
};

/** Cores de status de consulta / paciente */
export const statusConsulta = {
  pendente: { bg: '#fef9c3', text: '#854d0e', border: '#f59e0b' },
  confirmado: { bg: '#dcfce7', text: '#166534', border: '#10b981' },
  cancelado: { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' },
};

export const statusSala = {
  disponivel: { bg: '#dcfce7', text: '#166534', label: 'Livre' },
  ocupada: { bg: '#fee2e2', text: '#991b1b', label: 'Ocupada' },
  'em reforma': { bg: '#fef9c3', text: '#854d0e', label: 'Manutenção' },
};

export function getHeaderBackground(role) {
  if (role === 'admin') return colors.admin.sidebar;
  return colors.primary;
}

export function getScreenBackground(role) {
  if (role === 'admin') return colors.admin.background;
  return colors.background;
}

export function getStatusConsultaStyle(status) {
  return statusConsulta[status] || { bg: colors.borderNeutral, text: colors.muted, border: colors.borderInput };
}

export function getStatusSalaStyle(status) {
  const key = status?.toLowerCase?.() || status;
  return statusSala[key] || { bg: colors.borderNeutral, text: colors.muted, label: status || '—' };
}
