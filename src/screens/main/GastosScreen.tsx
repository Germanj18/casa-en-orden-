import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Modal, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography, shadows } from '../../theme';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore, selectResumenMes, type Gasto } from '../../store';

const categoriaIconos: Record<string, string> = {
  Alquiler: '🏠', Expensas: '🏢', Luz: '💡', Gas: '🔥', Agua: '💧',
  Internet: '🌐', Celular: '📱', Colegio: '🏫', Prepaga: '🏥',
  Gimnasio: '💪', Supermercado: '🛒', Transporte: '🚌', Seguros: '🛡️',
  Suscripciones: '📺', Tarjeta: '💳', Cuotas: '📆', Arreglos: '🔧', Otros: '📦',
};

function formatMonto(n: number) {
  return '$' + n.toLocaleString('es-AR');
}

function GastoCard({ gasto, onMarcarPagado, onEliminar }: {
  gasto: Gasto;
  onMarcarPagado: (id: string) => void;
  onEliminar: (id: string) => void;
}) {
  const integrantes = useAppStore(s => s.integrantes);
  const icono = categoriaIconos[gasto.categoria] ?? '💰';
  const isPagado = gasto.estado === 'pagado';
  const responsable = integrantes.find(i => i.id === gasto.responsable);

  function confirmarEliminar() {
    Alert.alert(
      'Eliminar gasto',
      `¿Eliminar "${gasto.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => onEliminar(gasto.id) },
      ]
    );
  }

  return (
    <TouchableOpacity
      style={styles.gastoCard}
      activeOpacity={0.8}
    >
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
        <View style={styles.gastoTopRight}>
          <Text style={[styles.gastoMonto, { color: isPagado ? colors.text : colors.danger }]}>
            {formatMonto(gasto.monto)}
          </Text>
          <TouchableOpacity onPress={confirmarEliminar} style={styles.deleteBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.estadoBadge, { backgroundColor: isPagado ? colors.successLight : '#FFF3E0' }]}
          onPress={() => !isPagado && onMarcarPagado(gasto.id)}
        >
          <Text style={[styles.estadoText, { color: isPagado ? colors.primaryDark : '#7D4200' }]}>
            {isPagado ? '✓ Pagado' : 'Pendiente'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const CATEGORIAS = Object.entries(categoriaIconos);

export default function GastosScreen() {
  const gastos = useAppStore(s => s.gastos);
  const integrantes = useAppStore(s => s.integrantes);
  const agregarGasto = useAppStore(s => s.agregarGasto);
  const marcarGastoPagado = useAppStore(s => s.marcarGastoPagado);
  const eliminarGasto = useAppStore(s => s.eliminarGasto);
  const resumen = useAppStore(useShallow(selectResumenMes));

  const [modalVisible, setModalVisible] = useState(false);
  const [filtro, setFiltro] = useState<'todos' | 'pagados' | 'pendientes'>('todos');

  // Form state
  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [responsableId, setResponsableId] = useState(integrantes[0]?.id ?? '1');

  const gastosFiltrados = gastos.filter(g => {
    if (filtro === 'pagados') return g.estado === 'pagado';
    if (filtro === 'pendientes') return g.estado === 'pendiente';
    return true;
  });

  const canSave = nombre.trim().length > 0 && monto.length > 0 && categoria !== '';

  function handleGuardar() {
    if (!canSave) return;
    agregarGasto({
      nombre: nombre.trim(),
      categoria,
      monto: parseInt(monto.replace(/\D/g, ''), 10),
      vencimiento: null,
      estado: 'pendiente',
      responsable: responsableId,
      recurrente: false,
    });
    setNombre('');
    setMonto('');
    setCategoria('');
    setModalVisible(false);
  }

  function handleCerrar() {
    setNombre('');
    setMonto('');
    setCategoria('');
    setModalVisible(false);
  }

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
            {formatMonto(resumen.pagado)}
          </Text>
        </View>
        <View style={[styles.resumenCard, { backgroundColor: colors.dangerLight }]}>
          <Text style={styles.resumenLabel}>Pendiente</Text>
          <Text style={[styles.resumenMonto, { color: colors.danger }]}>
            {formatMonto(resumen.pendiente)}
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
        {gastosFiltrados.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>💸</Text>
            <Text style={styles.emptyText}>No hay gastos {filtro !== 'todos' ? filtro : ''}</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => setModalVisible(true)}>
              <Text style={styles.emptyBtnText}>Agregar gasto</Text>
            </TouchableOpacity>
          </View>
        ) : (
          gastosFiltrados.map(g => (
            <GastoCard key={g.id} gasto={g} onMarcarPagado={marcarGastoPagado} onEliminar={eliminarGasto} />
          ))
        )}
        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      {/* Modal agregar gasto */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Agregar gasto</Text>
            <TouchableOpacity onPress={handleCerrar}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Nombre del gasto</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ej: Alquiler mayo"
                placeholderTextColor={colors.textMuted}
                value={nombre}
                onChangeText={setNombre}
                autoFocus
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Monto</Text>
              <TextInput
                style={[styles.formInput, styles.montoInput]}
                placeholder="$ 0"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={monto}
                onChangeText={setMonto}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Categoría</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriasScroll}>
                {CATEGORIAS.map(([cat, ico]) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.categoriaChip, categoria === cat && styles.categoriaChipSelected]}
                    onPress={() => setCategoria(cat)}
                  >
                    <Text style={styles.categoriaIco}>{ico}</Text>
                    <Text style={[styles.categoriaLabel, categoria === cat && styles.categoriaLabelSelected]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Responsable</Text>
              <View style={styles.integrantesRow}>
                {integrantes.map(i => (
                  <TouchableOpacity
                    key={i.id}
                    style={[styles.integranteChip, responsableId === i.id && styles.integranteChipSelected]}
                    onPress={() => setResponsableId(i.id)}
                  >
                    <Text>{i.avatar}</Text>
                    <Text style={[styles.integranteChipLabel, responsableId === i.id && styles.integranteChipLabelSelected]}>
                      {i.nombre}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
              onPress={handleGuardar}
              activeOpacity={canSave ? 0.85 : 1}
            >
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
  gastoTopRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  gastoMonto: { fontSize: 15, fontWeight: '700' },
  deleteBtn: { padding: 2 },
  estadoBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.full },
  estadoText: { fontSize: 10, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingVertical: 60, gap: spacing.md },
  emptyEmoji: { fontSize: 40 },
  emptyText: { ...typography.body, color: colors.textSecondary },
  emptyBtn: {
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  emptyBtnText: { ...typography.body, color: colors.primaryDark, fontWeight: '600' },

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
  modalContent: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
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
  montoInput: { fontSize: 22, fontWeight: '700' },
  categoriasScroll: { marginTop: spacing.xs },
  categoriaChip: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginRight: spacing.sm,
    minWidth: 72,
  },
  categoriaChipSelected: { borderColor: colors.primary, backgroundColor: colors.successLight },
  categoriaIco: { fontSize: 20, marginBottom: 4 },
  categoriaLabel: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
  categoriaLabelSelected: { color: colors.primaryDark, fontWeight: '600' },
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
  integranteChipSelected: { borderColor: colors.primary, backgroundColor: colors.successLight },
  integranteChipLabel: { ...typography.bodySmall, color: colors.text, fontWeight: '500' },
  integranteChipLabelSelected: { color: colors.primaryDark },
  modalFooter: { padding: spacing.lg, paddingBottom: spacing.xl },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: 17,
    alignItems: 'center',
  },
  saveBtnDisabled: { backgroundColor: colors.border },
  saveBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
});
