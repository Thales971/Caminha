import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { paletaClaro } from '../theme';

export default function TelaInicio({ passosHoje, meta, onNavegarCaminhar, c = paletaClaro, f = 1 }) {
  const metaFinal = Number(meta) || 6000;
  const percentual = Math.min(100, Math.round((passosHoje / metaFinal) * 100));
  const styles = criarStyles(c, f);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Caminhada do dia</Text>
        <Text style={styles.numero}>{passosHoje.toLocaleString('pt-BR')}</Text>
        <Text style={styles.texto}>
          passos hoje • meta {metaFinal.toLocaleString('pt-BR')}
        </Text>
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
        <View style={styles.botaoLinha}>
          <Ionicons name="play" size={16} color={c.white} />
          <Text style={styles.botaoTexto}>Iniciar caminhada</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

function criarStyles(c, f) {
  const fs = (n) => Math.round(n * f);
  return StyleSheet.create({
    container: {
      padding: 16,
    },
    card: {
      backgroundColor: c.white,
      borderWidth: 1,
      borderColor: c.line,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    titulo: {
      fontSize: fs(16),
      fontWeight: 'bold',
      color: c.ink,
      marginBottom: 8,
    },
    numero: {
      fontSize: fs(42),
      fontWeight: 'bold',
      color: c.ink,
    },
    texto: {
      fontSize: fs(14),
      color: c.mute,
      lineHeight: Math.round(20 * f),
      marginTop: 2,
    },
    destaque: {
      fontWeight: 'bold',
      color: c.ink,
    },
    barraFundo: {
      height: 8,
      backgroundColor: c.neve,
      borderRadius: 4,
      marginTop: 12,
      marginBottom: 6,
      overflow: 'hidden',
    },
    barraValor: {
      height: 8,
      backgroundColor: c.yellow,
    },
    botao: {
      backgroundColor: c.ink,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 8,
    },
    botaoLinha: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    botaoTexto: {
      color: c.white,
      fontSize: fs(15),
      fontWeight: 'bold',
    },
  });
}
