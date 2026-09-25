import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

function formatarTempo(segundos) {
  const min = Math.floor((segundos || 0) / 60);
  const seg = (segundos || 0) % 60;
  return `${String(min).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;
}

export default function TelaHistorico({ historico, onLimpar }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.cabecalho}>
          <Text style={styles.titulo}>Sessões salvas</Text>
          {historico.length > 0 && (
            <TouchableOpacity onPress={onLimpar}>
              <Text style={styles.linkLimpar}>Limpar</Text>
            </TouchableOpacity>
          )}
        </View>

        {historico.length === 0 ? (
          <Text style={styles.textoVazio}>
            Nenhuma caminhada salva ainda. Vá em Caminhar, dê uns passos e toque em Encerrar sessão.
          </Text>
        ) : (
          historico.map((item, index) => (
            <View key={item.id} style={styles.item}>
              <View>
                <Text style={styles.horario}>
                  #{index + 1} • {item.horario}
                </Text>
                <Text style={styles.detalhes}>
                  {item.passos} passos • {formatarTempo(item.segundos)} • {item.km} km
                </Text>
              </View>
              <View style={[styles.tagMini, item.usouGps ? styles.tagVerde : styles.tagAmarela]}>
                <Text
                  style={[
                    styles.tagMiniTexto,
                    item.usouGps ? styles.tagTextoVerde : styles.tagTextoAmarela,
                  ]}
                >
                  {item.usouGps ? 'GPS' : 'passo'}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 16,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  linkLimpar: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: 'bold',
  },
  textoVazio: {
    fontSize: 13,
    color: '#9CA3AF',
    fontStyle: 'italic',
    paddingVertical: 12,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  horario: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111827',
  },
  detalhes: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  tagMini: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagVerde: {
    backgroundColor: '#DCFCE7',
  },
  tagAmarela: {
    backgroundColor: '#FEF3C7',
  },
  tagMiniTexto: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  tagTextoVerde: {
    color: '#15803D',
  },
  tagTextoAmarela: {
    color: '#B45309',
  },
});
