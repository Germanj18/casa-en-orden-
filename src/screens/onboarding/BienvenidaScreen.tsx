import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParams } from '../../navigation';
import { colors, spacing, radius, typography } from '../../theme';

const { height } = Dimensions.get('window');

type Props = NativeStackScreenProps<OnboardingStackParams, 'Bienvenida'>;

const features = [
  { icono: '💰', texto: 'Cuánto cuesta vivir' },
  { icono: '📅', texto: 'Qué vence' },
  { icono: '📈', texto: 'Qué subió' },
  { icono: '🤝', texto: 'Quién debe qué' },
  { icono: '🗂️', texto: 'Dónde está cada comprobante' },
];

export default function BienvenidaScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      <View style={styles.hero}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>🏠</Text>
        </View>
        <Text style={styles.appName}>Casa en Orden</Text>
        <Text style={styles.tagline}>
          Ordená tu casa{'\n'}en un solo lugar
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Todo lo que necesitás saber sobre tu casa:</Text>

        <View style={styles.featureList}>
          {features.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{f.icono}</Text>
              <Text style={styles.featureText}>{f.texto}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('CrearHogar')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Crear mi hogar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7}>
          <Text style={styles.secondaryButtonText}>Ya tengo una cuenta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryDark,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  logoContainer: {
    width: 88,
    height: 88,
    borderRadius: radius.xl,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  logoEmoji: {
    fontSize: 44,
  },
  appName: {
    ...typography.h2,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: spacing.sm,
  },
  tagline: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  card: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  featureList: {
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featureIcon: {
    fontSize: 22,
    width: 32,
    textAlign: 'center',
  },
  featureText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: 17,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  secondaryButtonText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
