import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Modal, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography, shadows } from '../../theme';
import { useAppStore } from '../../store';


type Vista = 'mes' | 'dia';

const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const mesesNombres = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const categoriaColores: Record<string, string> = {
  Salud: '#E8F5E9',
  Colegio: '#E3F2FD',
  Proveedor: '#FFF3E0',
  Vencimiento: '#FCE4EC',
  Cumpleaños: '#F3E5F5',
  Actividad: '#E0F7FA',
  Trabajo: '#F5F5F5',
  Trámite: '#FFF8E1',
  Casa: '#E8F5E9',
  Compra: '#E3F2FD',
  Viaje: '#E8EAF6',
  Otro: '#FAFAFA',
};

function generarDiasMes(anio: number, mes: number) {
  const primerDia = new Date(anio, mes, 1).getDay();
  const totalDias = new Date(anio, mes + 1, 0).getDate();
  const dias: (number | null)[] = Array(primerDia).fill(null);
  for (let i = 1; i <= totalDias; i++) dias.push(i);
  return dias;
}

function EventoCard({ evento }: { evento: ReturnType<typeof useAppStore.getState>['eventos'][0] }) {
  const integrantes = useAppStore(s => s.integrantes);
  const eliminarEvento = useAppStore(s => s.eliminarEvento);
  const integrante = integrantes.find(i => i.id === evento.integrante);
  const bg = categoriaColores[evento.categoria] ?? '#FAFAFA';

  function confirmarEliminar() {
    Alert.alert(
      'Eliminar evento',
      `¿Eliminar "${evento.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => eliminarEvento(evento.id) },
      ]
    );
  }

  return (
    <TouchableOpacity style={[styles.eventoCard, { backgroundColor: bg }]} activeOpacity={0.8}>
      <Text style={styles.eventoCardIcono}>{evento.icono}</Text>
      <View style={styles.eventoCardInfo}>
        <Text style={styles.eventoCardTitulo}>{evento.titulo}</Text>
        <View style={styles.eventoCardMeta}>
          {evento.hora && (
            <View style={styles.metaChip}>
              <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
              <Text style={styles.metaText}>{evento.hora}</Text>
            </View>
          )}
          {integrante && (
            <View style={styles.metaChip}>
              <Text style={styles.metaEmoji}>{integrante.avatar}</Text>
              <Text style={styles.metaText}>{integrante.nombre}</Text>
            </View>
          )}
          <View style={[styles.metaChip, styles.categoriaBadge]}>
            <Text style={styles.metaText}>{evento.categoria}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={confirmarEliminar} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function AgendaScreen() {
  const eventos = useAppStore(s => s.eventos);
  const integrantes = useAppStore(s => s.integrantes);
  const agregarEvento = useAppStore(s => s.agregarEvento);

  const hoyReal = new Date();
  const [anio, setAnio] = useState(hoyReal.getFullYear());
  const [mes, setMes] = useState(hoyReal.getMonth());
  const [diaSeleccionado, setDiaSeleccionado] = useState(hoyReal.getDate());
  const [vista, setVista] = useState<Vista>('mes');
  const [modalVisible, setModalVisible] = useState(false);
  const [filtroIntegrante, setFiltroIntegrante] = useState<string | null>(null);

  // Form state
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevoIntegrante, setNuevoIntegrante] = useState(integrantes[0]?.id ?? '1');
  const [nuevaCategoria, setNuevaCategoria] = useState('');

  const dias = generarDiasMes(anio, mes);
  const semanas: (number | null)[][] = [];
  for (let i = 0; i < dias.length; i += 7) {
    semanas.push(dias.slice(i, i + 7));
  }

  const esHoyReal = (dia: number) =>
    dia === hoyReal.getDate() &&
    mes === hoyReal.getMonth() &&
    anio === hoyReal.getFullYear();

  // Filtrar eventos del mes/año actual
  const mesStr = `${anio}-${String(mes + 1).padStart(2, '0')}`;
  const eventosMes = eventos.filter(e => {
    if (!e.fecha.startsWith(mesStr)) return false;
    if (filtroIntegrante && e.integrante !== filtroIntegrante) return false;
    return true;
  });
  const getDia = (fecha: string) => parseInt(fecha.split('-')[2], 10);
  const eventosDelDia = eventosMes.filter(e => getDia(e.fecha) === diaSeleccionado);
  const diasConEventos = new Set(eventosMes.map(e => getDia(e.fecha)));

  function irMesAnterior() {
    if (mes === 0) { setMes(11); setAnio(a => a - 1); }
    else setMes(m => m - 1);
    setDiaSeleccionado(1);
  }

  function irMesSiguiente() {
    if (mes === 11) { setMes(0); setAnio(a => a + 1); }
    else setMes(m => m + 1);
    setDiaSeleccionado(1);
  }

  function handleGuardarEvento() {
    if (!nuevoTitulo.trim() || !nuevaCategoria) return;
    const mes2 = String(mes + 1).padStart(2, '0');
    const dia2 = String(diaSeleccionado).padStart(2, '0');
    agregarEvento({
      titulo: nuevoTitulo.trim(),
      fecha: `${anio}-${mes2}-${dia2}`,
      hora: null,
      integrante: nuevoIntegrante,
      categoria: nuevaCategoria,
      icono: '📅',
    });
    setNuevoTitulo('');
    setNuevaCategoria('');
    setModalVisible(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.navBtn} onPress={irMesAnterior}>
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{mesesNombres[mes]} {anio}</Text>
          <TouchableOpacity style={styles.navBtn} onPress={irMesSiguiente}>
            <Ionicons name="chevron-forward" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Vista toggle */}
      <View style={styles.vistasRow}>
        {(['mes', 'dia'] as Vista[]).map(v => (
          <TouchableOpacity
            key={v}
            style={[styles.vistaBtn, vista === v && styles.vistaBtnActive]}
            onPress={() => setVista(v)}
          >
            <Text style={[styles.vistaText, vista === v && styles.vistaTextActive]}>
              {v === 'mes' ? 'Mes' : 'Día'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Filtros por integrante */}
      <View style={styles.integrantesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.integrantesRow}>
          <TouchableOpacity
            style={[styles.integranteBtn, filtroIntegrante === null && styles.integranteBtnActive]}
            onPress={() => setFiltroIntegrante(null)}
          >
            <Text style={[styles.integranteBtnText, filtroIntegrante !== null && { color: colors.textSecondary }]}>
              Todos
            </Text>
          </TouchableOpacity>
          {integrantes.map(i => (
            <TouchableOpacity
              key={i.id}
              style={[styles.integranteBtn, filtroIntegrante === i.id && styles.integranteBtnActive]}
              onPress={() => setFiltroIntegrante(filtroIntegrante === i.id ? null : i.id)}
            >
              <Text>{i.avatar}</Text>
              <Text style={[
                styles.integranteBtnLabel,
                filtroIntegrante === i.id && { color: '#FFF', fontWeight: '600' },
              ]}>
                {i.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.mainScroll}>
        {/* Calendario */}
        <View style={styles.calendario}>
          <View style={styles.diasSemanaRow}>
            {diasSemana.map(d => (
              <Text key={d} style={styles.diaSemanaLabel}>{d}</Text>
            ))}
          </View>
          {/* Grid de filas: cada fila es un flexRow de 7 celdas con flex:1 */}
          {semanas.map((semana, semIdx) => (
            <View key={semIdx} style={styles.diasRow}>
              {semana.map((dia, colIdx) => {
                if (!dia) return <View key={`e-${colIdx}`} style={styles.diaCell} />;
                const tieneEvento = diasConEventos.has(dia);
                const esHoy = esHoyReal(dia);
                const esSeleccionado = dia === diaSeleccionado;

                return (
                  <TouchableOpacity
                    key={dia}
                    style={styles.diaCell}
                    onPress={() => { setDiaSeleccionado(dia); setVista('dia'); }}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.diaCellCircle,
                      esSeleccionado && styles.diaCellCircleSelected,
                    ]}>
                      <Text style={[
                        styles.diaCellText,
                        esHoy && !esSeleccionado && styles.diaCellHoy,
                        esSeleccionado && styles.diaCellTextSelected,
                      ]}>
                        {dia}
                      </Text>
                    </View>
                    <View style={styles.dotSlot}>
                      {tieneEvento && (
                        <View style={[
                          styles.eventoDot,
                          esSeleccionado && styles.eventoDotSelected,
                        ]} />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {/* Eventos del día seleccionado */}
        <View style={styles.eventosSection}>
          <Text style={styles.eventosSectionTitle}>
            {esHoyReal(diaSeleccionado) ? 'Hoy' : `${diaSeleccionado} de ${mesesNombres[mes]}`}
            {eventosDelDia.length === 0 ? ' — Sin eventos' : ` — ${eventosDelDia.length} evento${eventosDelDia.length > 1 ? 's' : ''}`}
          </Text>

          {eventosDelDia.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📅</Text>
              <Text style={styles.emptyText}>Sin eventos para este día</Text>
              <TouchableOpacity style={styles.emptyAddBtn} onPress={() => setModalVisible(true)}>
                <Text style={styles.emptyAddText}>Agregar evento</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.eventosList}>
              {eventosDelDia.map(e => (
                <EventoCard key={e.id} evento={e} />
              ))}
            </View>
          )}
        </View>

        <View style={{ height: spacing.xxl + spacing.xl }} />
      </ScrollView>

      {/* Modal agregar evento */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {esHoyReal(diaSeleccionado) ? 'Hoy' : `${diaSeleccionado} de ${mesesNombres[mes]}`}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Título</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ej: Turno médico de Sofía"
                placeholderTextColor={colors.textMuted}
                value={nuevoTitulo}
                onChangeText={setNuevoTitulo}
                autoFocus
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Categoría</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoriasRow}>
                  {Object.keys(categoriaColores).map(cat => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoriaChip,
                        { backgroundColor: categoriaColores[cat] },
                        nuevaCategoria === cat && styles.categoriaChipSelected,
                      ]}
                      onPress={() => setNuevaCategoria(cat)}
                    >
                      <Text style={styles.categoriaChipText}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Asignar a</Text>
              <View style={styles.integrantesChips}>
                {integrantes.map(i => (
                  <TouchableOpacity
                    key={i.id}
                    style={[styles.integranteChipModal, nuevoIntegrante === i.id && styles.integranteChipModalSelected]}
                    onPress={() => setNuevoIntegrante(i.id)}
                  >
                    <Text>{i.avatar}</Text>
                    <Text style={styles.integranteChipLabel}>{i.nombre}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.saveBtn, (!nuevoTitulo.trim() || !nuevaCategoria) && styles.saveBtnDisabled]}
              onPress={handleGuardarEvento}
            >
              <Text style={styles.saveBtnText}>Guardar evento</Text>
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
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  headerTitle: { ...typography.h3, color: colors.text },
  navBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    backgroundColor: colors.surfaceSecondary,
  },
  addBtn: {
    width: 42,
    height: 42,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vistasRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  vistaBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceSecondary,
  },
  vistaBtnActive: { backgroundColor: colors.primary },
  vistaText: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '600' },
  vistaTextActive: { color: '#FFF' },
  mainScroll: { flex: 1 },
  integrantesContainer: { height: 40, marginBottom: spacing.sm },
  integrantesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  integranteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  integranteBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  integranteBtnText: { ...typography.bodySmall, color: '#FFF', fontWeight: '600' },
  integranteBtnLabel: { ...typography.bodySmall, color: colors.textSecondary },

  // Calendario
  calendario: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  diasSemanaRow: { flexDirection: 'row', marginBottom: spacing.xs },
  diaSemanaLabel: {
    flex: 1,
    textAlign: 'center',
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '600',
  },
  diasRow: { flexDirection: 'row', height: 46 },
  diaCell: {
    flex: 1,
    height: 46,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 3,
  },
  diaCellCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diaCellCircleSelected: {
    backgroundColor: colors.primary,
  },
  diaCellText: { ...typography.body, color: colors.text },
  diaCellHoy: { color: colors.primary, fontWeight: '700' },
  diaCellTextSelected: { color: '#FFF', fontWeight: '700' },
  dotSlot: {
    height: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  eventoDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
  },
  eventoDotSelected: { backgroundColor: 'rgba(255,255,255,0.8)' },

  // Eventos
  eventosSection: { paddingHorizontal: spacing.lg },
  eventosSectionTitle: { ...typography.h4, color: colors.text, marginBottom: spacing.md },
  eventosList: { gap: spacing.sm },
  eventoCard: {
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.card,
  },
  eventoCardIcono: { fontSize: 24, width: 32, textAlign: 'center' },
  eventoCardInfo: { flex: 1 },
  eventoCardTitulo: { ...typography.body, color: colors.text, fontWeight: '600', marginBottom: 4 },
  eventoCardMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  categoriaBadge: { backgroundColor: 'rgba(0,0,0,0.07)' },
  metaEmoji: { fontSize: 11 },
  metaText: { ...typography.caption, color: colors.textSecondary },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxl, gap: spacing.md },
  emptyEmoji: { fontSize: 40 },
  emptyText: { ...typography.body, color: colors.textSecondary },
  emptyAddBtn: {
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  emptyAddText: { ...typography.body, color: colors.primaryDark, fontWeight: '600' },

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
  formSelectorText: { ...typography.bodySmall, color: colors.text },
  categoriasRow: { flexDirection: 'row', gap: spacing.sm, paddingVertical: spacing.xs },
  categoriaChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  categoriaChipSelected: { borderWidth: 2, borderColor: colors.primary },
  categoriaChipText: { ...typography.bodySmall, color: colors.text, fontWeight: '500' },
  integrantesChips: { flexDirection: 'row', gap: spacing.sm },
  integranteChipModal: {
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
  integranteChipModalSelected: { borderColor: colors.primary, backgroundColor: colors.successLight },
  integranteChipLabel: { ...typography.bodySmall, color: colors.text, fontWeight: '500' },
  saveBtnDisabled: { backgroundColor: colors.border },
  conectarBox: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  conectarTitle: { ...typography.label, color: colors.textSecondary },
  conectarRow: { flexDirection: 'row', gap: spacing.sm },
  conectarBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  conectarBtnIco: { fontSize: 20 },
  conectarBtnLabel: { ...typography.caption, color: colors.textSecondary },
  modalFooter: { padding: spacing.lg, paddingBottom: spacing.xl },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: 17,
    alignItems: 'center',
  },
  saveBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
});
