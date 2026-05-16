import React, { createContext, useContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

// Onboarding
import BienvenidaScreen from '../screens/onboarding/BienvenidaScreen';
import CrearHogarScreen from '../screens/onboarding/CrearHogarScreen';
import IntegrantesScreen from '../screens/onboarding/IntegrantesScreen';

// Main tabs
import InicioScreen from '../screens/main/InicioScreen';
import GastosScreen from '../screens/main/GastosScreen';
import AgendaScreen from '../screens/main/AgendaScreen';
import ComprobantesScreen from '../screens/main/ComprobantesScreen';
import HogarScreen from '../screens/main/HogarScreen';

// Context para compartir el callback onDone con IntegrantesScreen
export const OnboardingDoneContext = createContext<() => void>(() => {});

export type OnboardingStackParams = {
  Bienvenida: undefined;
  CrearHogar: undefined;
  Integrantes: undefined;
};

export type MainTabParams = {
  Inicio: undefined;
  Gastos: undefined;
  Agenda: undefined;
  Comprobantes: undefined;
  Hogar: undefined;
};

const OnboardingStack = createNativeStackNavigator<OnboardingStackParams>();
const Tab = createBottomTabNavigator<MainTabParams>();

type TabIconName = keyof typeof Ionicons.glyphMap;

function OnboardingNavigator() {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen name="Bienvenida" component={BienvenidaScreen} />
      <OnboardingStack.Screen name="CrearHogar" component={CrearHogarScreen} />
      <OnboardingStack.Screen name="Integrantes" component={IntegrantesScreen} />
    </OnboardingStack.Navigator>
  );
}

function MainTabs() {
  const tabIcons: Record<string, [TabIconName, TabIconName]> = {
    Inicio: ['home', 'home-outline'],
    Gastos: ['receipt', 'receipt-outline'],
    Agenda: ['calendar', 'calendar-outline'],
    Comprobantes: ['document-text', 'document-text-outline'],
    Hogar: ['grid', 'grid-outline'],
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = tabIcons[route.name];
          const iconName: TabIconName = icons ? (focused ? icons[0] : icons[1]) : 'grid-outline';
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={InicioScreen} options={{ tabBarLabel: 'Inicio' }} />
      <Tab.Screen name="Gastos" component={GastosScreen} options={{ tabBarLabel: 'Gastos' }} />
      <Tab.Screen name="Agenda" component={AgendaScreen} options={{ tabBarLabel: 'Agenda' }} />
      <Tab.Screen name="Comprobantes" component={ComprobantesScreen} options={{ tabBarLabel: 'Docs' }} />
      <Tab.Screen name="Hogar" component={HogarScreen} options={{ tabBarLabel: 'Hogar' }} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const [onboardingDone, setOnboardingDone] = useState(false);

  return (
    <SafeAreaProvider>
      <OnboardingDoneContext.Provider value={() => setOnboardingDone(true)}>
        <NavigationContainer>
          {onboardingDone ? <MainTabs /> : <OnboardingNavigator />}
        </NavigationContainer>
      </OnboardingDoneContext.Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 80,
    paddingBottom: 16,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
});
