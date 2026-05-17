import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockGastos, mockEventos, mockVencimientos, mockIntegrantes, mockHogar } from '../data/mockData';

export type Gasto = {
  id: string;
  nombre: string;
  categoria: string;
  monto: number;
  vencimiento: string | null;
  estado: 'pagado' | 'pendiente';
  responsable: string;
  recurrente: boolean;
  aumento?: number;
};

export type Evento = {
  id: string;
  titulo: string;
  fecha: string;
  hora: string | null;
  integrante: string;
  categoria: string;
  icono: string;
};

export type Vencimiento = {
  id: string;
  nombre: string;
  fecha: string;
  estado: 'urgente' | 'vencido' | 'proximo' | 'ok';
  diasRestantes: number;
};

export type Integrante = {
  id: string;
  nombre: string;
  rol: string;
  color: string;
  avatar: string;
};

export type Hogar = {
  nombre: string;
  tipo: string;
  moneda: string;
};

type AppState = {
  hogar: Hogar;
  integrantes: Integrante[];
  gastos: Gasto[];
  eventos: Evento[];
  vencimientos: Vencimiento[];

  // Gastos
  agregarGasto: (gasto: Omit<Gasto, 'id'>) => void;
  marcarGastoPagado: (id: string) => void;
  eliminarGasto: (id: string) => void;

  // Eventos
  agregarEvento: (evento: Omit<Evento, 'id'>) => void;
  eliminarEvento: (id: string) => void;

  // Hogar
  actualizarHogar: (hogar: Partial<Hogar>) => void;
  agregarIntegrante: (integrante: Omit<Integrante, 'id'>) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hogar: mockHogar,
      integrantes: mockIntegrantes,
      gastos: mockGastos as Gasto[],
      eventos: mockEventos as Evento[],
      vencimientos: mockVencimientos as Vencimiento[],

      agregarGasto: (gasto) =>
        set((state) => ({
          gastos: [{ ...gasto, id: Date.now().toString() }, ...state.gastos],
        })),

      marcarGastoPagado: (id) =>
        set((state) => ({
          gastos: state.gastos.map((g) =>
            g.id === id ? { ...g, estado: 'pagado' } : g
          ),
        })),

      eliminarGasto: (id) =>
        set((state) => ({
          gastos: state.gastos.filter((g) => g.id !== id),
        })),

      agregarEvento: (evento) =>
        set((state) => ({
          eventos: [{ ...evento, id: Date.now().toString() }, ...state.eventos],
        })),

      eliminarEvento: (id) =>
        set((state) => ({
          eventos: state.eventos.filter((e) => e.id !== id),
        })),

      actualizarHogar: (hogar) =>
        set((state) => ({ hogar: { ...state.hogar, ...hogar } })),

      agregarIntegrante: (integrante) =>
        set((state) => ({
          integrantes: [
            ...state.integrantes,
            { ...integrante, id: Date.now().toString() },
          ],
        })),
    }),
    {
      name: 'casa-en-orden-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Solo persistimos datos, no acciones
      partialize: (state) => ({
        hogar: state.hogar,
        integrantes: state.integrantes,
        gastos: state.gastos,
        eventos: state.eventos,
        vencimientos: state.vencimientos,
      }),
    }
  )
);

// Selectores derivados
export const selectResumenMes = (state: AppState) => {
  const costoEstimado = state.gastos.reduce((sum, g) => sum + g.monto, 0);
  const pagado = state.gastos
    .filter((g) => g.estado === 'pagado')
    .reduce((sum, g) => sum + g.monto, 0);
  const pendiente = costoEstimado - pagado;
  return { costoEstimado, pagado, pendiente, libreEstimado: Math.max(0, 1300000 - costoEstimado) };
};
