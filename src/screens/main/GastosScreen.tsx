import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Modal, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography, shadows } from '../../theme';
import { mockGastos, mockResumenMes, mockIntegrantes } from '../../data/mockData';

type Gasto = typeof mockGastos[0];

const categoriaIconos: Record<string, string> = {
  Alquiler: '🏠', Expensas: '🏢', Luz: '💡', Gas: '🔥', Agua: '💧',
  Internet: '🌐', Celular: '📱', Colegio: '🏫', Prepaga: '🏥',
  Gimnasio: '💪', Supermercado: '🛒', Transporte: '🚌', Seguros: '🛡️',
  Suscripciones: '📺', Tarjeta: '💳', Cuotas: '📆', Arreglos: '🔧', Otros: '📦',
};

function formatMonto(n: number) {
  return '$' + n.toLocaleString('es-AR');
}

function GastoCard({ gasto }: { gasto: Gasto }) {
  const icono = categoriaIconos[gasto.categoria] ?? '💰';
  const isPagado = gasto.estado === 'pagado';
  const responsable = mockIntegrantes.find(i => i.id === gasto.responsable);

  return (
    <TouchableOpacity style={styles.gastoCard} activeOpacity={0.8}>
      <View style={[styles.gastoIconoBg, { backgroundColor: isPagado ? colors.successLight : colors.warningLight }]}>
        <Text style={styles.gastoIcono}>{icono}</Text>
      </View>

      <View style={styles.gastoInfo}>
        <View style={styles.gastoRow1}>
          <Text style={styles.gastoNombre}>{gasto.nombre}</Text>
          {gasto.aumento && (
            <View style={styles.aumentoBadge}>
              <Ionicons name="trending-up" size={11} color={colors.danger} />
              <Text style={styles.aumentoText}>+{gasto.aumento}%</Text>
            </View>
          )}
        </View>
        <View style={styles.gastoRow2}>
          <Text style={styles.gastoCategoria}>{gasto.categoria}</Text>
          {responsable && (
            <Text style={styles.gastoResponsable}> · {responsable.avatar} {responsable.nombre}</Text>
          )}
        </View>
      </View>

      <View style={styles.gastoRight}>
        <Text style={[styles.gastoMonto, { color: isPagado ? colors.text : colors.danger }]}>
          {formatMonto(gasto.monto)}
        </Text>
        <View style={[styles.estadoBadge, { backgroundColor: isPagado ? colors.successLight : '#FFF3E0' }]}>
          <Text style={[styles.estadoText, { color: isPagado ? colors.primaryDark : '#7D4200' }]}>
            {isPagado ? 'Pagado' : 'Pendiente'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function GastosScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [filtro, setFiltro] = useState<'todos' | 'pagados' | 'pendientes'>('todos');

  const gastosFiltrados = mockGastos.filter(g => {
    if (filtro === 'pagados') return g.estado === 'pagado';
    if (filtro === 'pendientes') return g.estado === 'pendiente';
    return true;
  });

  const totalPendiente = mockGastos.filter(g => g.estado === 'pendiente').reduce((s, g) => s + g.monto, 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Gastos</Text>
          <Text style={styles.headerSub}>Mayo 2026</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Resumen */}
      <View style={styles.resumenRow}>
        <View style={[styles.resumenCard, { backgroundColor: colors.successLight }]}>
          <Text style={styles.resumenLabel}>Pagado</Text>
          <Text style={[styles.resumenMonto, { color: colors.primaryDark }]}>
            {formatMonto(mockResumenMes.pagado)}
          </Text>
        </View>
        <View style={[styles.resumenCard, { backgroundColor: colors.dangerLight }]}>
          <Text style={styles.resumenLabel}>Pendiente</Text>
          <Text style={[styles.resumenMonto, { color: colors.danger }]}>
            {formatMonto(totalPendiente)}
          </Text>
        </View>
      </View>

      {/* Filtros */}
      <View style={styles.filtrosRow}>
        {(['todos', 'pendientes', 'pagados'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filtroBtn, filtro === f && styles.filtroBtnActive]}
            onPress={() => setFiltro(f)}
          >
            <Text style={[styles.filtroText, filtro === f && styles.filtroTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.lista} showsVerticalScrollIndicator={false}>
        {gastosFiltrados.map(g => (
          <GastoCard key={g.id} gasto={g} />
        ))}
        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      {/* Modal agregar gasto */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Agregar gasto</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Nombre del gasto</Text>
              <TextInput style={styles.formInput} placeholder="Ej: Alquiler mayo" placeholderTextColor={colors.textMuted} />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Categoría</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriasScroll}>
                {Object.entries(categoriaIconos).map(([cat, ico]) => (
                  <TouchableOpacity key={cat} style={styles.categoriaChip}>
                    <Text style={styles.categoriaIco}>{ico}</Text>
                    <Text style={styles.categoriaLabel}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Monto</Text>
              <TextInput
                style={styles.formInput}
                placeholder="$ 0"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.formLabel}>Vencimiento</Text>
                <TouchableOpacity style={styles.formSelector}>
                  <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.formSelectorText}>Seleccionar fecha</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.formLabel}>Recurrencia</Text>
                <TouchableOpacity style={styles.formSelector}>
                  <Ionicons name="repeat" size={16} color={colors.textSecondary} />
                  <Text style={styles.formSelectorText}>Mensual</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Responsable</Text>
              <View style={styles.integrantesRow}>
                {mockIntegrantes.map(i => (
                  <TouchableOpacity key={i.id} style={styles.integranteChip}>
                    <Text>{i.avatar}</Text>
                    <Text style={styles.integranteChipLabel}>{i.nombre}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Comprobante (opcional)</Text>
              <TouchableOpacity style={styles.uploadBtn}>
                <Ionicons name="camera-outline" size={20} color={colors.primaryLight} />
                <Text style={styles.uploadText}>Adjuntar foto o PDF</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.saveBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.saveBtnText}>Guardar gasto</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  headerTitle: { ...typography.h2, color: colors.text },
  headerSub: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  addBtn: {
    width: 42,
    height: 42,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resumenRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  resumenCard: { flex: 1, borderRadius: radius.md, padding: spacing.md },
  resumenLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: 4 },
  resumenMonto: { fontSize: 18, fontWeight: '700' },
  filtrosRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filtroBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceSecondary,
  },
  filtroBtnActive: { backgroundColor: colors.primary },
  filtroText: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '500' },
  filtroTextActive: { color: '#FFFFFF' },
  lista: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  gastoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.card,
  },
  gastoIconoBg: { width: 44, height: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  gastoIcono: { fontSize: 22 },
  gastoInfo: { flex: 1 },
  gastoRow1: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: 3 },
  gastoNombre: { ...typography.body, color: colors.text, fontWeight: '600', flex: 1 },
  aumentoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.dangerLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  aumentoText: { fontSize: 10, color: colors.danger, fontWeight: '700' },
  gastoRow2: { flexDirection: 'row', alignItems: 'center' },
  gastoCategoria: { ...typography.caption, color: colors.textSecondary },
  gastoResponsable: { ...typography.caption, color: colors.textSecondary },
  gastoRight: { alignItems: 'flex-end', gap: 4 },
  gastoMonto: { fontSize: 15, fontWeight: '700' },
  estadoBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.full },
  estadoText: { fontSize: 10, fontWeight: '700' },

  // Modal
  modal: { flex: 1, backgroundColor: colors.background },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: { ...typography.h3, color: colors.text },
  modalContent: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  formGroup: { gap: spacing.xs },
  formLabel: { ...typography.label, color: colors.textSecondary },
  formInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    ...typography.body,
    color: colors.text,
  },
  formRow: { flexDirection: 'row', gap: spacing.sm },
  formSelector: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  formSelectorText: { ...typography.bodySmall, color: colors.textSecondary },
  categoriasScroll: { marginTop: spacing.xs },
  categoriaChip: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginRight: spacing.sm,
    minWidth: 72,
  },
  categoriaIco: { fontSize: 20, marginBottom: 4 },
  categoriaLabel: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
  integrantesRow: { flexDirection: 'row', gap: spacing.sm },
  integranteChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  integranteChipLabel: { ...typography.bodySmall, color: colors.text, fontWeight: '500' },
  uploadBtn: {
    backgroundColor: colors.successLight,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    borderStyle: 'dashed',
  },
  uploadText: { ...typography.body, color: colors.primaryLight, fontWeight: '500' },
  modalFooter: { padding: spacing.lg, paddingBottom: spacing.xl },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: 17,
    alignItems: 'center',
  },
  saveBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
});
