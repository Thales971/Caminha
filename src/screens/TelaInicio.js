import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

export default function TelaInicio({ passosHoje, meta, onNavegarCaminhar }) {
  const percentual = Math.min(100, Math.round((passosHoje / meta) * 100));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Caminhada do dia</Text>
        <Text style={styles.numero}>{passosHoje}</Text>
        <Text style={styles.texto}>passos hoje • meta {meta}</Text>
        <View style={styles.barraFundo}>
          <View style={[styles.barraValor, { width: `${percentual}%` }]} />
        </View>
        <Text style={styles.texto}>{percentual}% da meta</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.titulo}>Como usar</Text>
        <Text style={styles.texto}>1. Toque em Iniciar caminhada.</Text>
        <Text style={styles.texto}>2. Libere a permissão de atividade física.</Text>
        <Text style={styles.texto}>3. Coloque o celular no bolso e ande.</Text>
        <Text style={styles.texto}>4. Encerre a sessão para gravar no histórico.</Text>
        <Text style={[styles.texto, { marginTop: 8 }]}>
          O sensor principal é o <Text style={styles.destaque}>pedômetro</Text>.
          O GPS é opcional e só entra na distância.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.botao}
        onPress={onNavegarCaminhar}
        activeOpacity={0.8}
      >
        <Text style={styles.botaoTexto}>Iniciar caminhada</Text>
      </TouchableOpacity>
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
    marginBottom: 12,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  numero: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#111827',
  },
  texto: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginTop: 2,
  },
  destaque: {
    fontWeight: 'bold',
    color: '#111827',
  },
  barraFundo: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginTop: 12,
    marginBottom: 6,
    overflow: 'hidden',
  },
  barraValor: {
    height: 8,
    backgroundColor: '#E8B931',
  },
  botao: {
    backgroundColor: '#1C1917',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
