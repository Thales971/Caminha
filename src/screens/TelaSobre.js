import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function TelaSobre() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Ficha do sensor</Text>
        <View style={styles.linha}>
          <Text style={styles.rotulo}>Sensor principal</Text>
          <Text style={styles.valor}>Pedômetro</Text>
        </View>
        <View style={styles.linha}>
          <Text style={styles.rotulo}>O que mede</Text>
          <Text style={styles.valor}>Passos</Text>
        </View>
        <View style={styles.linha}>
          <Text style={styles.rotulo}>Biblioteca</Text>
          <Text style={styles.valor}>expo-sensors</Text>
        </View>
        <View style={styles.linha}>
          <Text style={styles.rotulo}>Permissão</Text>
          <Text style={styles.valor}>Atividade física</Text>
        </View>
        <View style={styles.linha}>
          <Text style={styles.rotulo}>Extra</Text>
          <Text style={styles.valor}>GPS opcional</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.titulo}>Se der erro</Text>
        <Text style={styles.texto}>
          Emulador quase nunca tem pedômetro. Celular barato às vezes também não. Sem permissão de movimento o app bloqueia o início. Sem GPS a sessão continua, só a rota some.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.titulo}>Aluno</Text>
        <Text style={styles.texto}>Thales Torsatto Silva</Text>
        <Text style={styles.texto}>Escola SENAI de Valinhos</Text>
        <Text style={styles.texto}>Programação para Dispositivos Móveis</Text>
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
    marginBottom: 12,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  rotulo: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  valor: {
    fontSize: 13,
    color: '#111827',
    fontWeight: 'bold',
  },
  texto: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 22,
  },
});
