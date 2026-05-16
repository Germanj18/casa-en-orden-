import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Modal, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography, shadows } from '../../theme';
import { mockEventos, mockIntegrantes } from '../../data/mockData';


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

function EventoCard({ evento }: { evento: typeof mockEventos[0] }) {
  const integrante = mockIntegrantes.find(i => i.id === evento.integrante);
  const bg = categoriaColores[evento.categoria] ?? '#FAFAFA';

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
      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function AgendaScreen() {
  const [vista, setVista] = useState<Vista>('mes');
  const [modalVisible, setModalVisible] = useState(false);
  const [diaSeleccionado, setDiaSeleccionado] = useState(18);

  const hoy = new Date();
  const anio = 2026;
  const mes = 4; // mayo (0-indexed)
  const dias = generarDiasMes(anio, mes);
  // Dividir en filas de 7 para un grid perfecto sin flexWrap
  const semanas: (number | null)[][] = [];
  for (let i = 0; i < dias.length; i += 7) {
    semanas.push(dias.slice(i, i + 7));
  }

  // Parseo manual para evitar bug de timezone (new Date('YYYY-MM-DD') = UTC midnight)
  const getDia = (fecha: string) => parseInt(fecha.split('-')[2], 10);

  const eventosDelDia = mockEventos.filter(e => getDia(e.fecha) === diaSeleccionado);

  const diasConEventos = new Set(mockEventos.map(e => getDia(e.fecha)));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.navBtn}>
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{mesesNombres[mes]} {anio}</Text>
          <TouchableOpacity style={styles.navBtn}>
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
          <TouchableOpacity style={[styles.integranteBtn, styles.integranteBtnActive]}>
            <Text style={styles.integranteBtnText}>Todos</Text>
          </TouchableOpacity>
          {mockIntegrantes.map(i => (
            <TouchableOpacity key={i.id} style={styles.integranteBtn}>
              <Text>{i.avatar}</Text>
              <Text style={styles.integranteBtnLabel}>{i.nombre}</Text>
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
                const esHoy = dia === 18;
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
            {diaSeleccionado === 18 ? 'Hoy' : `${diaSeleccionado} de ${mesesNombres[mes]}`}
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
            <Text style={styles.modalTitle}>Agregar evento</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Título</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ej: Turno médico de Sofía"
                placeholderTextColor={colors.textMuted}
                autoFocus
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Categoría</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoriasRow}>
                  {Object.keys(categoriaColores).map(cat => (
                    <TouchableOpacity key={cat} style={[styles.categoriaChip, { backgroundColor: categoriaColores[cat] }]}>
                      <Text style={styles.categoriaChipText}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.formLabel}>Fecha</Text>
                <TouchableOpacity style={styles.formSelector}>
                  <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.formSelectorText}>Lunes 18/05</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.formLabel}>Hora</Text>
                <TouchableOpacity style={styles.formSelector}>
                  <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.formSelectorText}>09:00</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Asignar a</Text>
              <View style={styles.integrantesChips}>
                {mockIntegrantes.map(i => (
                  <TouchableOpacity key={i.id} style={styles.integranteChipModal}>
                    <Text>{i.avatar}</Text>
                    <Text style={styles.integranteChipLabel}>{i.nombre}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Lugar (opcional)</Text>
              <TextInput style={styles.formInput} placeholder="Ej: Hospital Italiano" placeholderTextColor={colors.textMuted} />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Notas (opcional)</Text>
              <TextInput
                style={[styles.formInput, { height: 80, textAlignVertical: 'top' }]}
                placeholder="Agregar notas..."
                placeholderTextColor={colors.textMuted}
                multiline
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Recordatorio</Text>
              <TouchableOpacity style={styles.formSelector}>
                <Ionicons name="notifications-outline" size={16} color={colors.textSecondary} />
                <Text style={[styles.formSelectorText, { flex: 1 }]}>1 hora antes</Text>
                <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.conectarBox}>
              <Text style={styles.conectarTitle}>Conectar con</Text>
              <View style={styles.conectarRow}>
                {[
                  { icono: '💸', label: 'Gasto' },
                  { icono: '⏰', label: 'Vencimiento' },
                  { icono: '🔧', label: 'Arreglo' },
                  { icono: '📎', label: 'Documento' },
                ].map(c => (
                  <TouchableOpacity key={c.label} style={styles.conectarBtn}>
                    <Text style={styles.conectarBtnIco}>{c.icono}</Text>
                    <Text style={styles.conectarBtnLabel}>{c.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.saveBtn} onPress={() => setModalVisible(false)}>
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
  integranteChipLabel: { ...typography.bodySmall, color: colors.text, fontWeight: '500' },
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
