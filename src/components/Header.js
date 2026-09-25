import { StyleSheet, Text, View } from 'react-native';
import { paletaClaro } from '../theme';

export default function Header({ titulo, subtitulo, c = paletaClaro, f = 1 }) {
  const styles = criarStyles(c, f);

  return (
    <View style={styles.header}>
      <Text style={styles.marca}>Caminha</Text>
      <Text style={styles.titulo}>{titulo || 'Caminha'}</Text>
      <Text style={styles.subtitulo}>{subtitulo || 'Pedômetro do celular'}</Text>
    </View>
  );
}

function criarStyles(c, f) {
  const fs = (n) => Math.round(n * f);
  return StyleSheet.create({
    header: {
      backgroundColor: c.white,
      paddingTop: 16,
      paddingBottom: 14,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: c.line,
    },
    marca: {
      fontSize: fs(12),
      fontWeight: 'bold',
      color: c.mute,
      marginBottom: 2,
    },
    titulo: {
      fontSize: fs(20),
      fontWeight: 'bold',
      color: c.ink,
    },
    subtitulo: {
      fontSize: fs(12),
      color: c.mute,
      marginTop: 2,
    },
  });
}
