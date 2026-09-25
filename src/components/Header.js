import { StyleSheet, Text, View } from 'react-native';
import { cores } from '../theme';

export default function Header({ titulo, subtitulo }) {
  return (
    <View style={styles.header}>
      <Text style={styles.marca}>Caminha</Text>
      <Text style={styles.titulo}>{titulo || 'Caminha'}</Text>
      <Text style={styles.subtitulo}>{subtitulo || 'Pedômetro do celular'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: cores.white,
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: cores.line,
  },
  marca: {
    fontSize: 12,
    fontWeight: 'bold',
    color: cores.mute,
    marginBottom: 2,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: cores.ink,
  },
  subtitulo: {
    fontSize: 12,
    color: cores.mute,
    marginTop: 2,
  },
});
