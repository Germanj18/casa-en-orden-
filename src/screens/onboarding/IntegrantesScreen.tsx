import React, { useContext, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingStackParams, OnboardingDoneContext } from '../../navigation';
import { colors, spacing, radius, typography } from '../../theme';

type Props = NativeStackScreenProps<OnboardingStackParams, 'Integrantes'>;

const avatares = ['👨', '👩', '🧑', '👧', '👦', '🧒', '👴', '👵'];
const coloresDisponibles = colors.memberColors;

const integrantesDefault = [
  { id: '1', nombre: 'German', rol: 'administrador', color: coloresDisponibles[0], avatar: '👨' },
];

export default function IntegrantesScreen({ navigation }: Props) {
  const [integrantes] = useState(integrantesDefault);
  const onDone = useContext(OnboardingDoneContext);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '66%' }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.step}>Paso 2 de 3</Text>
        <Text style={styles.title}>¿Quiénes viven en tu hogar?</Text>
        <Text style={styles.subtitle}>
          Agregá las personas que comparten la casa. Cada una puede ver y cargar eventos y gastos.
        </Text>

        <View style={styles.section}>
          {integrantes.map((i) => (
            <View key={i.id} style={styles.integranteCard}>
              <View style={[styles.avatarBubble, { backgroundColor: i.color + '30' }]}>
                <Text style={styles.avatarEmoji}>{i.avatar}</Text>
              </View>
              <View style={styles.integranteInfo}>
                <Text style={styles.integranteNombre}>{i.nombre}</Text>
                <Text style={styles.integranteRol}>{i.rol}</Text>
              </View>
              <View style={[styles.colorDot, { backgroundColor: i.color }]} />
            </View>
          ))}

          <TouchableOpacity style={styles.addCard} activeOpacity={0.7}>
            <View style={styles.addIcon}>
              <Ionicons name="add" size={24} color={colors.primary} />
            </View>
            <Text style={styles.addText}>Agregar integrante</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={18} color={colors.primaryLight} />
          <Text style={styles.infoText}>
            Podés agregar más integrantes después desde la sección Hogar.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onDone}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Empezar a ordenar mi casa</Text>
          <Text style={styles.primaryButtonEmoji}>🏠</Text>
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
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  step: { ...typography.label, color: colors.primaryLight, marginBottom: spacing.sm },
  title: { ...typography.h1, color: colors.text, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, lineHeight: 22, marginBottom: spacing.xl },
  section: { gap: spacing.sm, marginBottom: spacing.lg },
  integranteCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarBubble: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 24 },
  integranteInfo: { flex: 1 },
  integranteNombre: { ...typography.h4, color: colors.text },
  integranteRol: { ...typography.caption, color: colors.textSecondary, textTransform: 'capitalize', marginTop: 2 },
  colorDot: { width: 12, height: 12, borderRadius: radius.full },
  addCard: {
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  addIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: { ...typography.body, color: colors.primary, fontWeight: '600' },
  infoBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.successLight,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'flex-start',
  },
  infoText: { ...typography.bodySmall, color: colors.primaryDark, flex: 1, lineHeight: 18 },
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
  primaryButtonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  primaryButtonEmoji: { fontSize: 20 },
});
