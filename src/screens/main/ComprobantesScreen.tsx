import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography, shadows } from '../../theme';
import { mockComprobantes } from '../../data/mockData';

const categoriaIconos: Record<string, string> = {
  Alquiler: '🏠', Prepaga: '🏥', Supermercado: '🛒',
  Internet: '🌐', Luz: '💡', Gas: '🔥', Expensas: '🏢',
};

export default function ComprobantesScreen() {
  const [busqueda, setBusqueda] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Comprobantes</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Buscador */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por mes, categoría o proveedor"
            placeholderTextColor={colors.textMuted}
            value={busqueda}
            onChangeText={setBusqueda}
          />
        </View>
      </View>

      {/* Filtros */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtrosScroll}
        contentContainerStyle={styles.filtrosRow}
      >
        {['Todos', 'Mayo', 'Abril', 'Alquiler', 'Prepaga', 'Servicios'].map((f, i) => (
          <TouchableOpacity
            key={f}
            style={[styles.filtroBtn, i === 0 && styles.filtroBtnActive]}
          >
            <Text style={[styles.filtroText, i === 0 && styles.filtroTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Upload area */}
        <TouchableOpacity style={styles.uploadArea} activeOpacity={0.8}>
          <View style={styles.uploadIconBg}>
            <Ionicons name="camera-outline" size={28} color={colors.primaryLight} />
          </View>
          <Text style={styles.uploadTitle}>Subir comprobante</Text>
          <Text style={styles.uploadSub}>Foto, PDF o imagen de la cámara</Text>
        </TouchableOpacity>

        {/* Lista de comprobantes */}
        <Text style={styles.sectionTitle}>Mayo 2026</Text>
        <View style={styles.lista}>
          {mockComprobantes.map(c => {
            const icono = categoriaIconos[c.categoria] ?? '📄';
            const isPdf = c.tipo === 'pdf';

            return (
              <TouchableOpacity key={c.id} style={styles.comprobanteCard} activeOpacity={0.8}>
                <View style={[styles.comprobanteIconoBg, { backgroundColor: isPdf ? '#FFF3E0' : colors.successLight }]}>
                  <Text style={styles.comprobanteIcono}>{icono}</Text>
                  <View style={styles.tipoTag}>
                    <Ionicons
                      name={isPdf ? 'document-text-outline' : 'image-outline'}
                      size={11}
                      color={isPdf ? '#7D4200' : colors.primaryDark}
                    />
                  </View>
                </View>
                <View style={styles.comprobanteInfo}>
                  <Text style={styles.comprobanteNombre}>{c.nombre}</Text>
                  <Text style={styles.comprobanteCategoria}>{c.categoria} · {c.fecha.slice(8)}/{c.fecha.slice(5, 7)}</Text>
                </View>
                <TouchableOpacity style={styles.shareBtn}>
                  <Ionicons name="share-outline" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Faltantes */}
        <Text style={styles.sectionTitle}>Comprobantes faltantes</Text>
        <View style={styles.card}>
          {['Expensas', 'Internet', 'Luz'].map((nombre) => (
            <View key={nombre} style={styles.faltanteRow}>
              <View style={styles.faltanteLeft}>
                <Ionicons name="alert-circle-outline" size={18} color={colors.warning} />
                <Text style={styles.faltanteNombre}>{nombre}</Text>
              </View>
              <TouchableOpacity style={styles.subirSmallBtn}>
                <Text style={styles.subirSmallText}>Subir</Text>
              </TouchableOpacity>
            </View>
          ))}
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
  addBtn: {
    width: 42,
    height: 42,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchRow: { paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  searchBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  searchInput: { flex: 1, ...typography.body, color: colors.text },
  filtrosScroll: { marginBottom: spacing.md, height: 44 },
  filtrosRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, alignItems: 'center' },
  filtroBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filtroBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filtroText: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '500' },
  filtroTextActive: { color: '#FFF' },
  content: { padding: spacing.lg, gap: spacing.md },
  uploadArea: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    borderStyle: 'dashed',
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  uploadIconBg: {
    width: 56,
    height: 56,
    backgroundColor: colors.successLight,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  uploadTitle: { ...typography.h4, color: colors.primaryDark },
  uploadSub: { ...typography.bodySmall, color: colors.textSecondary },
  sectionTitle: { ...typography.h4, color: colors.text },
  lista: { gap: spacing.sm },
  comprobanteCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.card,
  },
  comprobanteIconoBg: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  comprobanteIcono: { fontSize: 22 },
  tipoTag: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    padding: 2,
  },
  comprobanteInfo: { flex: 1 },
  comprobanteNombre: { ...typography.body, color: colors.text, fontWeight: '600' },
  comprobanteCategoria: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  shareBtn: { padding: spacing.xs },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.card,
  },
  faltanteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  faltanteLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  faltanteNombre: { ...typography.body, color: colors.text },
  subirSmallBtn: {
    backgroundColor: colors.warningLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  subirSmallText: { ...typography.caption, color: '#7D4200', fontWeight: '600' },
});
