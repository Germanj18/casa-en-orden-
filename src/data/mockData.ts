export const mockHogar = {
  nombre: 'Casa German & Rocío',
  tipo: 'pareja',
  moneda: 'ARS',
};

export const mockIntegrantes = [
  { id: '1', nombre: 'German', rol: 'administrador', color: '#52B788', avatar: '👨' },
  { id: '2', nombre: 'Rocío', rol: 'integrante', color: '#F4A261', avatar: '👩' },
];

export const mockGastos = [
  { id: '1', nombre: 'Alquiler', categoria: 'Alquiler', monto: 380000, vencimiento: '2026-05-01', estado: 'pagado', responsable: '1', recurrente: true },
  { id: '2', nombre: 'Expensas', categoria: 'Expensas', monto: 95000, vencimiento: '2026-05-10', estado: 'pendiente', responsable: '2', recurrente: true },
  { id: '3', nombre: 'Internet Telecentro', categoria: 'Internet', monto: 28500, vencimiento: '2026-05-15', estado: 'pendiente', responsable: '1', recurrente: true, aumento: 18 },
  { id: '4', nombre: 'Luz', categoria: 'Luz', monto: 47000, vencimiento: '2026-05-20', estado: 'pendiente', responsable: '1', recurrente: true },
  { id: '5', nombre: 'Gas', categoria: 'Gas', monto: 31000, vencimiento: '2026-05-22', estado: 'pendiente', responsable: '2', recurrente: true },
  { id: '6', nombre: 'Prepaga OSDE', categoria: 'Prepaga', monto: 210000, vencimiento: '2026-05-05', estado: 'pagado', responsable: '1', recurrente: true, aumento: 12 },
  { id: '7', nombre: 'Spotify', categoria: 'Suscripciones', monto: 4500, vencimiento: '2026-05-18', estado: 'pendiente', responsable: '1', recurrente: true },
  { id: '8', nombre: 'Supermercado', categoria: 'Supermercado', monto: 185000, vencimiento: null, estado: 'pagado', responsable: '1', recurrente: false },
];

export const mockVencimientos = [
  { id: '1', nombre: 'Expensas', fecha: '2026-05-17', estado: 'urgente', diasRestantes: 1 },
  { id: '2', nombre: 'Internet', fecha: '2026-05-15', estado: 'vencido', diasRestantes: -1 },
  { id: '3', nombre: 'Luz', fecha: '2026-05-20', estado: 'proximo', diasRestantes: 4 },
  { id: '4', nombre: 'Gas', fecha: '2026-05-22', estado: 'proximo', diasRestantes: 6 },
  { id: '5', nombre: 'Tarjeta Visa', fecha: '2026-05-28', estado: 'ok', diasRestantes: 12 },
];

export const mockEventos = [
  { id: '1', titulo: 'Turno médico Sofía', fecha: '2026-05-18', hora: '09:00', integrante: '2', categoria: 'Salud', icono: '🏥' },
  { id: '2', titulo: 'Viene el técnico del aire', fecha: '2026-05-18', hora: '15:00', integrante: '1', categoria: 'Proveedor', icono: '🔧' },
  { id: '3', titulo: 'Reunión colegio', fecha: '2026-05-20', hora: '18:00', integrante: '2', categoria: 'Colegio', icono: '🏫' },
  { id: '4', titulo: 'Pagar expensas', fecha: '2026-05-17', hora: '11:30', integrante: '2', categoria: 'Vencimiento', icono: '💳' },
  { id: '5', titulo: 'Cumpleaños mamá', fecha: '2026-05-25', hora: null, integrante: '1', categoria: 'Cumpleaños', icono: '🎂' },
  { id: '6', titulo: 'Gimnasio German', fecha: '2026-05-18', hora: '20:00', integrante: '1', categoria: 'Actividad', icono: '💪' },
];

export const mockAlertas = [
  { id: '1', tipo: 'aumento', texto: 'Internet subió 18% respecto al mes pasado.', icono: '📈' },
  { id: '2', tipo: 'vencimiento', texto: 'Mañana vencen expensas ($95.000).', icono: '⚠️' },
  { id: '3', tipo: 'deuda', texto: 'Rocío te debe $47.500.', icono: '💰' },
  { id: '4', tipo: 'aumento', texto: 'La prepaga subió 12% este mes.', icono: '📈' },
];

export const mockComprobantes = [
  { id: '1', nombre: 'Alquiler mayo', categoria: 'Alquiler', fecha: '2026-05-01', tipo: 'imagen', gastoId: '1' },
  { id: '2', nombre: 'Prepaga OSDE mayo', categoria: 'Prepaga', fecha: '2026-05-05', tipo: 'pdf', gastoId: '6' },
  { id: '3', nombre: 'Ticket supermercado', categoria: 'Supermercado', fecha: '2026-05-12', tipo: 'imagen', gastoId: '8' },
];

export const mockResumenMes = {
  costoEstimado: 981000,
  pagado: 775000,
  pendiente: 206000,
  libreEstimado: 319000,
  ingresoTotal: 1300000,
};
