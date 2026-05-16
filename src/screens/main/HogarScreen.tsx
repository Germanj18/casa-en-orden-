import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography, shadows } from '../../theme';
import { mockHogar, mockIntegrantes, mockResumenMes } from '../../data/mockData';

function formatMonto(n: number) {
  return '$' + n.toLocaleString('es-AR');
}

const seccionesHogar = [
  { icono: '📄', label: 'Documentos', sub: 'Contratos, garantías, seguros', color: '#E3F2FD' },
  { icono: '🔧', label: 'Arreglos', sub: 'Historial de mantenimiento', color: '#FFF3E0' },
  { icono: '👷', label: 'Proveedores', sub: 'Plomero, electricista, técnicos', color: '#F3E5F5' },
  { icono: '📊', label: 'Reportes', sub: 'Resumen mensual y anual', color: colors.successLight },
];

export default function HogarScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Hogar</Text>
        <TouchableOpacity style={styles.settingsBtn}>
          <Ionicons name="settings-outline" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tarjeta del hogar */}
        <View style={styles.hogarCard}>
          <View style={styles.hogarCardLeft}>
            <Text style={styles.hogarEmoji}>🏠</Text>
            <View>
              <Text style={styles.hogarNombre}>{mockHogar.nombre}</Text>
              <Text style={styles.hogarTipo}>{mockHogar.tipo} · {mockHogar.moneda}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="pencil-outline" size={18} color={colors.primaryLight} />
          </TouchableOpacity>
        </View>

        {/* Integrantes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Integrantes</Text>
            <TouchableOpacity>
              <Text style={styles.sectionLink}>Agregar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.integrantesRow}>
            {mockIntegrantes.map(i => (
              <TouchableOpacity key={i.id} style={styles.integranteCard} activeOpacity={0.8}>
                <View style={[styles.avatarBg, { backgroundColor: i.color + '25' }]}>
                  <Text style={styles.avatarEmoji}>{i.avatar}</Text>
                </View>
                <Text style={styles.integranteNombre}>{i.nombre}</Text>
                <Text style={styles.integranteRol}>{i.rol}</Text>
                <View style={[styles.colorDot, { backgroundColor: i.color }]} />
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.addIntegranteCard}>
              <View style={styles.addIcon}>
                <Ionicons name="add" size={24} color={colors.primary} />
              </View>
              <Text style={styles.addText}>Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance entre integrantes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Balance del mes</Text>
          <View style={styles.balanceCard}>
            <View style={styles.balanceRow}>
              <View style={styles.balancePerson}>
                <Text style={styles.balanceEmoji}>👨</Text>
                <Text style={styles.balanceName}>German</Text>
              </View>
              <View style={styles.balanceCenter}>
                <Text style={styles.balanceArrow}>←</Text>
                <View style={styles.balanceMontoBg}>
                  <Text style={styles.balanceMonto}>{formatMonto(47500)}</Text>
                </View>
              </View>
              <View style={styles.balancePerson}>
                <Text style={styles.balanceEmoji}>👩</Text>
                <Text style={styles.balanceName}>Rocío</Text>
              </View>
            </View>
            <Text style={styles.balanceDesc}>Rocío le debe $47.500 a German</Text>
            <TouchableOpacity style={styles.saldarBtn}>
              <Text style={styles.saldarText}>Marcar como saldado</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Secciones del hogar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Secciones</Text>
          <View style={styles.seccionesGrid}>
            {seccionesHogar.map((s) => (
              <TouchableOpacity key={s.label} style={[styles.seccionCard, { backgroundColor: s.color }]} activeOpacity={0.8}>
                <Text style={styles.seccionIcono}>{s.icono}</Text>
                <Text style={styles.seccionLabel}>{s.label}</Text>
                <Text style={styles.seccionSub}>{s.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats anuales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen anual 2026</Text>
          <View style={styles.statsCard}>
            {[
              { label: 'Gasto promedio mensual', monto: 918000, icono: '📊' },
              { label: 'Mayor gasto del año', monto: 1100000, icono: '📈' },
              { label: 'Total acumulado', monto: 4590000, icono: '💰' },
            ].map(s => (
              <View key={s.label} style={styles.statsRow}>
                <Text style={styles.statsIcono}>{s.icono}</Text>
                <View style={styles.statsInfo}>
                  <Text style={styles.statsLabel}>{s.label}</Text>
                  <Text style={styles.statsMonto}>{formatMonto(s.monto)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: spacing.xxl + spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  headerTitle: { ...typography.h2, color: colors.text },
  settingsBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  content: { padding: spacing.lg, gap: spacing.lg },
  hogarCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hogarCardLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  hogarEmoji: { fontSize: 36 },
  hogarNombre: { ...typography.h4, color: '#FFF' },
  hogarTipo: { ...typography.caption, color: 'rgba(255,255,255,0.6)', marginTop: 2, textTransform: 'capitalize' },
  editBtn: { padding: spacing.sm },
  section: { gap: spacing.sm },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { ...typography.h4, color: colors.text },
  sectionLink: { ...typography.bodySmall, color: colors.primaryLight, fontWeight: '600' },
  integrantesRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  integranteCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
    width: '30%',
    ...shadows.card,
    position: 'relative',
  },
  avatarBg: { width: 44, height: 44, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 24 },
  integranteNombre: { ...typography.bodySmall, color: colors.text, fontWeight: '600', textAlign: 'center' },
  integranteRol: { ...typography.caption, color: colors.textSecondary, textAlign: 'center', textTransform: 'capitalize' },
  colorDot: { position: 'absolute', top: spacing.sm, right: spacing.sm, width: 8, height: 8, borderRadius: radius.full },
  addIntegranteCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
    width: '30%',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
  },
  addIcon: { width: 44, height: 44, backgroundColor: colors.successLight, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  addText: { ...typography.caption, color: colors.primary, fontWeight: '600' },
  balanceCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.card,
  },
  balanceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, width: '100%', justifyContent: 'center' },
  balancePerson: { alignItems: 'center', gap: spacing.xs },
  balanceEmoji: { fontSize: 32 },
  balanceName: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
  balanceCenter: { alignItems: 'center', gap: spacing.xs },
  balanceArrow: { fontSize: 18, color: colors.danger },
  balanceMontoBg: { backgroundColor: colors.dangerLight, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.full },
  balanceMonto: { ...typography.body, color: colors.danger, fontWeight: '700' },
  balanceDesc: { ...typography.bodySmall, color: colors.textSecondary },
  saldarBtn: { backgroundColor: colors.successLight, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.full },
  saldarText: { ...typography.bodySmall, color: colors.primaryDark, fontWeight: '600' },
  seccionesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  seccionCard: {
    width: '47%',
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  seccionIcono: { fontSize: 28 },
  seccionLabel: { ...typography.h4, color: colors.text },
  seccionSub: { ...typography.caption, color: colors.textSecondary, lineHeight: 16 },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
    ...shadows.card,
  },
  statsRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  statsIcono: { fontSize: 22, width: 28, textAlign: 'center' },
  statsInfo: { flex: 1 },
  statsLabel: { ...typography.caption, color: colors.textSecondary },
  statsMonto: { ...typography.h4, color: colors.text },
});
