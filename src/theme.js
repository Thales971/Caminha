export const paletaClaro = {
  paper: '#F4EFE6',
  ink: '#1C1917',
  yellow: '#E8B931',
  white: '#FFFFFF',
  mute: '#6B7280',
  line: '#E5E7EB',
  neve: '#F3F4F6',
  red: '#B42318',
  cream: '#FEF9C3',
  brown: '#92400E',
  greenBg: '#DCFCE7',
  green: '#15803D',
  errBg: '#FEE2E2',
  err: '#991B1B',
  errLine: '#FCA5A5',
};

// Mesmas chaves do claro, só trocando os valores (RNF06).
// Assim o layout não muda, só as cores.
export const paletaEscuro = {
  paper: '#0C0A09',
  ink: '#FAFAF9',
  yellow: '#E8B931',
  white: '#1C1917',
  mute: '#A8A29E',
  line: '#44403C',
  neve: '#292524',
  red: '#DC2626',
  cream: '#422F0B',
  brown: '#FACC15',
  greenBg: '#14532D',
  green: '#86EFAC',
  errBg: '#7F1D1D',
  err: '#FECACA',
  errLine: '#B91C1C',
};

export function corDoTema(modo) {
  return modo === 'escuro' ? paletaEscuro : paletaClaro;
}

// Escala do tamanho de texto dos ajustes (RF14)
export const fatorTexto = {
  pequeno: 0.9,
  medio: 1,
  grande: 1.15,
};
