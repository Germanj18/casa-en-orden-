import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ScrollView, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingStackParams } from '../../navigation';
import { colors, spacing, radius, typography } from '../../theme';

type Props = NativeStackScreenProps<OnboardingStackParams, 'CrearHogar'>;

const tiposHogar = [
  { id: 'solo', label: 'Vivo solo/a', icono: '🧍' },
  { id: 'pareja', label: 'Pareja', icono: '👫' },
  { id: 'familia', label: 'Familia', icono: '👨‍👩‍👧‍👦' },
  { id: 'roommates', label: 'Roommates', icono: '🤝' },
];

export default function CrearHogarScreen({ navigation }: Props) {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');

  const canContinue = nombre.trim().length > 0 && tipo !== '';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '33%' }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.step}>Paso 1 de 3</Text>
        <Text style={styles.title}>Creemos tu hogar</Text>
        <Text style={styles.subtitle}>
          Vamos a configurar el espacio donde vas a ordenar todo lo de tu casa.
        </Text>

        <View style={styles.section}>
          <Text style={styles.label}>¿Cómo se llama tu hogar?</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Casa German & Rocío"
            placeholderTextColor={colors.textMuted}
            value={nombre}
            onChangeText={setNombre}
            autoFocus
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>¿Cómo es tu hogar?</Text>
          <View style={styles.tiposGrid}>
            {tiposHogar.map((t) => (
              <TouchableOpacity
                key={t.id}
                style={[styles.tipoCard, tipo === t.id && styles.tipoCardSelected]}
                onPress={() => setTipo(t.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.tipoIcono}>{t.icono}</Text>
                <Text style={[styles.tipoLabel, tipo === t.id && styles.tipoLabelSelected]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Moneda principal</Text>
          <TouchableOpacity style={styles.selector}>
            <Text style={styles.selectorText}>🇦🇷 Peso argentino (ARS)</Text>
            <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.primaryButton, !canContinue && styles.primaryButtonDisabled]}
          onPress={() => canContinue && navigation.navigate('Integrantes')}
          activeOpacity={canContinue ? 0.85 : 1}
        >
          <Text style={styles.primaryButtonText}>Continuar</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    backgroundColor: colors.surface,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: radius.full,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  step: {
    ...typography.label,
    color: colors.primaryLight,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    ...typography.body,
    color: colors.text,
  },
  tiposGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tipoCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
  },
  tipoCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.successLight,
  },
  tipoIcono: { fontSize: 28 },
  tipoLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  tipoLabelSelected: {
    color: colors.primaryDark,
  },
  selector: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorText: {
    ...typography.body,
    color: colors.text,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: 17,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  primaryButtonDisabled: {
    backgroundColor: colors.border,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
