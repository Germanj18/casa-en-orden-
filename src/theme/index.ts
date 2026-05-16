export const colors = {
  primary: '#C05A3A',
  primaryLight: '#E07A5A',
  primaryDark: '#8B3A22',
  accent: '#F4A261',
  accentLight: '#FFDDD2',
  background: '#F8F7F5',
  surface: '#FFFFFF',
  surfaceSecondary: '#F5F2EF',
  text: '#1A1A1A',
  textSecondary: '#6C757D',
  textMuted: '#ADB5BD',
  border: '#EDE8E3',
  success: '#4A9B72',
  warning: '#E0852A',
  danger: '#D63031',
  dangerLight: '#FFEBEE',
  successLight: '#E8F5EE',
  warningLight: '#FFF3E0',

  // Colores por integrante
  memberColors: ['#C05A3A', '#4A9B72', '#4CC9F0', '#9B59B6', '#E0852A'],
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '600' as const },
  h4: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  bodySmall: { fontSize: 13, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  label: { fontSize: 12, fontWeight: '600' as const, letterSpacing: 0.5 },
};

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  strong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
};
