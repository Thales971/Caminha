import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { cores } from '../theme';

export default function TabBar({ abaAtual, onSelecionarAba }) {
  const abas = [
    { id: 'inicio', rotulo: 'Início' },
    { id: 'caminhar', rotulo: 'Caminhar' },
    { id: 'historico', rotulo: 'Histórico' },
    { id: 'sobre', rotulo: 'Ajustes' },
  ];

  return (
    <View style={styles.barraAbas}>
      {abas.map((aba) => {
        const ativa = abaAtual === aba.id;
        return (
          <TouchableOpacity
            key={aba.id}
            style={[styles.abaItem, ativa && styles.abaAtiva]}
            onPress={() => onSelecionarAba(aba.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.abaTexto, ativa && styles.abaTextoAtivo]}>
              {aba.rotulo}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  barraAbas: {
    flexDirection: 'row',
    backgroundColor: cores.white,
    borderTopWidth: 1,
    borderTopColor: cores.line,
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
    backgroundColor: cores.cream,
  },
  abaTexto: {
    fontSize: 12,
    color: cores.mute,
    fontWeight: '600',
  },
  abaTextoAtivo: {
    color: cores.brown,
    fontWeight: 'bold',
  },
});
