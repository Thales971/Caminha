import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { paletaClaro } from '../theme';

const ABAS = [
  { id: 'inicio', rotulo: 'Início', icone: 'home-outline', iconeAtiva: 'home' },
  { id: 'caminhar', rotulo: 'Caminhar', icone: 'walk-outline', iconeAtiva: 'walk' },
  { id: 'historico', rotulo: 'Histórico', icone: 'time-outline', iconeAtiva: 'time' },
  { id: 'sobre', rotulo: 'Ajustes', icone: 'settings-outline', iconeAtiva: 'settings' },
];

export default function TabBar({ abaAtual, onSelecionarAba, c = paletaClaro, f = 1 }) {
  const styles = criarStyles(c, f);

  return (
    <View style={styles.barraAbas}>
      {ABAS.map((aba) => {
        const ativa = abaAtual === aba.id;
        return (
          <TouchableOpacity
            key={aba.id}
            style={[styles.abaItem, ativa && styles.abaAtiva]}
            onPress={() => onSelecionarAba(aba.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={ativa ? aba.iconeAtiva : aba.icone}
              size={20}
              color={ativa ? c.brown : c.mute}
            />
            <Text style={[styles.abaTexto, ativa && styles.abaTextoAtivo]}>
              {aba.rotulo}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function criarStyles(c, f) {
  const fs = (n) => Math.round(n * f);
  return StyleSheet.create({
    barraAbas: {
      flexDirection: 'row',
      backgroundColor: c.white,
      borderTopWidth: 1,
      borderTopColor: c.line,
      paddingVertical: 10,
      paddingHorizontal: 8,
    },
    abaItem: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 8,
      borderRadius: 8,
    },
    abaAtiva: {
      backgroundColor: c.cream,
    },
    abaTexto: {
      fontSize: fs(12),
      color: c.mute,
      fontWeight: '600',
      marginTop: 2,
    },
    abaTextoAtivo: {
      color: c.brown,
      fontWeight: 'bold',
    },
  });
}
