import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography, shadows } from '../../theme';
import {
  mockResumenMes, mockVencimientos, mockEventos,
  mockAlertas, mockHogar,
} from '../../data/mockData';

function formatMonto(n: number) {
  return '$' + n.toLocaleString('es-AR');
}

function AlertaBadge({ alerta }: { alerta: typeof mockAlertas[0] }) {
  const bgColor = alerta.tipo === 'aumento' ? colors.warningLight
    : alerta.tipo === 'vencimiento' ? colors.dangerLight
    : colors.successLight;
  const textColor = alerta.tipo === 'aumento' ? '#7D4200'
    : alerta.tipo === 'vencimiento' ? colors.danger
    : colors.primaryDark;

  return (
    <View style={[styles.alertaBadge, { backgroundColor: bgColor }]}>
      <Text style={styles.alertaIcono}>{alerta.icono}</Text>
      <Text style={[styles.alertaTexto, { color: textColor }]}>{alerta.texto}</Text>
    </View>
  );
}

function VencimientoRow({ v }: { v: typeof mockVencimientos[0] }) {
  const colores: Record<string, string> = {
    urgente: colors.danger,
    vencido: colors.danger,
    proximo: colors.warning,
    ok: colors.success,
  };
  const labels: Record<string, string> = {
    urgente: `Mañana`,
    vencido: 'Vencido',
    proximo: `En ${v.diasRestantes} días`,
    ok: `En ${v.diasRestantes} días`,
  };

  return (
    <View style={styles.vencimientoRow}>
      <View style={[styles.vencimientoDot, { backgroundColor: colores[v.estado] }]} />
      <Text style={styles.vencimientoNombre}>{v.nombre}</Text>
      <Text style={[styles.vencimientoFecha, { color: colores[v.estado] }]}>
        {labels[v.estado]}
      </Text>
    </View>
  );
}

function EventoRow({ e }: { e: typeof mockEventos[0] }) {
  return (
    <View style={styles.eventoRow}>
      <Text style={styles.eventoIcono}>{e.icono}</Text>
      <View style={styles.eventoInfo}>
        <Text style={styles.eventoTitulo}>{e.titulo}</Text>
        {e.hora && <Text style={styles.eventoHora}>{e.hora}</Text>}
      </View>
    </View>
  );
}

export default function InicioScreen() {
  const { costoEstimado, pagado, pendiente, libreEstimado, ingresoTotal } = mockResumenMes;
  const progresoPorc = Math.round((pagado / costoEstimado) * 100);
  const hoy = new Date();
  const diasRestantesMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate() - hoy.getDate();
  const eventosHoy = mockEventos.filter(e => e.fecha === '2026-05-18');
  const proximosVencimientos = mockVencimientos.filter(v => ['urgente', 'vencido', 'proximo'].includes(v.estado));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSaludo}>Hola, German 👋</Text>
          <Text style={styles.headerHogar}>{mockHogar.nombre}</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn}>
          <Ionicons name="notifications-outline" size={24} color="#FFF" />
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tarjeta principal del mes */}
        <View style={styles.mesCard}>
          <View style={styles.mesCardHeader}>
            <Text style={styles.mesLabel}>Mayo 2026</Text>
            <Text style={styles.mesDias}>{diasRestantesMes} días restantes</Text>
          </View>

          <Text style={styles.mesCosto}>
            Tu casa cuesta este mes{'\n'}
            <Text style={styles.mesCostoMonto}>{formatMonto(costoEstimado)}</Text>
          </Text>

          {/* Barra de progreso */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBg}>
              <View style={[styles.progressBar, { width: `${progresoPorc}%` }]} />
            </View>
            <Text style={styles.progressLabel}>{progresoPorc}% pagado</Text>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Pagado</Text>
              <Text style={[styles.statMonto, { color: colors.success }]}>{formatMonto(pagado)}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Pendiente</Text>
              <Text style={[styles.statMonto, { color: colors.danger }]}>{formatMonto(pendiente)}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Libre est.</Text>
              <Text style={[styles.statMonto, { color: colors.primaryLight }]}>{formatMonto(libreEstimado)}</Text>
            </View>
          </View>
        </View>

        {/* Alertas */}
        {mockAlertas.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alertas</Text>
            <View style={styles.alertasContainer}>
              {mockAlertas.map((a) => (
                <AlertaBadge key={a.id} alerta={a} />
              ))}
            </View>
          </View>
        )}

        {/* Próximos vencimientos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximos vencimientos</Text>
            <TouchableOpacity>
              <Text style={styles.sectionLink}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            {proximosVencimientos.map((v, i) => (
              <React.Fragment key={v.id}>
                <VencimientoRow v={v} />
                {i < proximosVencimientos.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Agenda de hoy */}
        {eventosHoy.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Hoy en la agenda</Text>
              <TouchableOpacity>
                <Text style={styles.sectionLink}>Ver agenda</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.card}>
              {eventosHoy.map((e, i) => (
                <React.Fragment key={e.id}>
                  <EventoRow e={e} />
                  {i < eventosHoy.length - 1 && <View style={styles.divider} />}
                </React.Fragment>
              ))}
            </View>
          </View>
        )}

        {/* Acciones rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones rápidas</Text>
          <View style={styles.accionesGrid}>
            {[
              { icono: '💸', label: 'Cargar gasto', color: colors.successLight },
              { icono: '📅', label: 'Agregar evento', color: colors.warningLight },
              { icono: '📎', label: 'Subir comprobante', color: '#E8F4FD' },
              { icono: '🔧', label: 'Registrar arreglo', color: '#F3E5F5' },
            ].map((a, i) => (
              <TouchableOpacity key={i} style={[styles.accionCard, { backgroundColor: a.color }]} activeOpacity={0.8}>
                <Text style={styles.accionIcono}>{a.icono}</Text>
                <Text style={styles.accionLabel}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primaryDark },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerSaludo: { ...typography.bodySmall, color: 'rgba(255,255,255,0.7)', marginBottom: 2 },
  headerHogar: { ...typography.h3, color: '#FFFFFF' },
  notifBtn: { position: 'relative', padding: spacing.xs },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
    borderWidth: 1.5,
    borderColor: colors.primaryDark,
  },
  scroll: { flex: 1, backgroundColor: colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl + spacing.xl, gap: spacing.lg },

  // Mes card
  mesCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginTop: -24,
    ...shadows.strong,
  },
  mesCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  mesLabel: { ...typography.label, color: 'rgba(255,255,255,0.6)' },
  mesDias: { ...typography.caption, color: 'rgba(255,255,255,0.5)' },
  mesCosto: { ...typography.body, color: 'rgba(255,255,255,0.8)', marginBottom: spacing.lg, lineHeight: 24 },
  mesCostoMonto: { fontSize: 32, fontWeight: '800', color: '#FFFFFF', letterSpacing: -1 },
  progressContainer: { marginBottom: spacing.lg },
  progressBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: radius.full, marginBottom: spacing.xs },
  progressBar: { height: '100%', backgroundColor: colors.primaryLight, borderRadius: radius.full },
  progressLabel: { ...typography.caption, color: 'rgba(255,255,255,0.6)', textAlign: 'right' },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center' },
  statLabel: { ...typography.caption, color: 'rgba(255,255,255,0.5)', marginBottom: 4 },
  statMonto: { fontSize: 15, fontWeight: '700' },
  statDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.1)' },

  // Sections
  section: { gap: spacing.sm },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { ...typography.h4, color: colors.text },
  sectionLink: { ...typography.bodySmall, color: colors.primaryLight, fontWeight: '600' },

  // Cards
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadows.card,
    gap: spacing.sm,
  },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: -spacing.md },

  // Alertas
  alertasContainer: { gap: spacing.sm },
  alertaBadge: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'flex-start',
  },
  alertaIcono: { fontSize: 16, marginTop: 1 },
  alertaTexto: { ...typography.bodySmall, flex: 1, fontWeight: '500', lineHeight: 18 },

  // Vencimientos
  vencimientoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 2 },
  vencimientoDot: { width: 8, height: 8, borderRadius: radius.full },
  vencimientoNombre: { ...typography.body, color: colors.text, flex: 1 },
  vencimientoFecha: { ...typography.bodySmall, fontWeight: '600' },

  // Eventos
  eventoRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center', paddingVertical: 2 },
  eventoIcono: { fontSize: 20, width: 28, textAlign: 'center' },
  eventoInfo: { flex: 1 },
  eventoTitulo: { ...typography.body, color: colors.text, fontWeight: '500' },
  eventoHora: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },

  // Acciones rápidas
  accionesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  accionCard: {
    width: '47%',
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  accionIcono: { fontSize: 24 },
  accionLabel: { ...typography.bodySmall, color: colors.text, fontWeight: '600' },
});
