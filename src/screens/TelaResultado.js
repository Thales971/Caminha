import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { paletaClaro } from '../theme';

function formatarTempo(segundos) {
  const min = Math.floor((segundos || 0) / 60);
  const seg = (segundos || 0) % 60;
  return `${String(min).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;
}

export default function TelaResultado({ sessao, onVerHistorico, onInicio, c = paletaClaro, f = 1 }) {
  const styles = criarStyles(c, f);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.tagVerde}>
          <Text style={styles.tagVerdeTexto}>SESSÃO SALVA</Text>
        </View>

        <Text style={styles.numero}>{sessao.passos}</Text>
        <Text style={styles.rotulo}>passos</Text>

        <View style={styles.tabelaValores}>
          <View style={styles.colunaValor}>
            <Text style={styles.rotuloEixo}>Tempo</Text>
            <Text style={styles.valorEixo}>{formatarTempo(sessao.segundos)}</Text>
          </View>
          <View style={styles.separadorColuna} />
          <View style={styles.colunaValor}>
            <Text style={styles.rotuloEixo}>Ritmo</Text>
            <Text style={styles.valorEixo}>{sessao.ritmo || 0}</Text>
          </View>
          <View style={styles.separadorColuna} />
          <View style={styles.colunaValor}>
            <Text style={styles.rotuloEixo}>Distância</Text>
            <Text style={styles.valorEixo}>{sessao.km} km</Text>
          </View>
        </View>

        <Text style={styles.texto}>{sessao.horario}</Text>
        <Text style={styles.texto}>
          {sessao.usouGps
            ? 'Distância medida pelo GPS.'
            : 'Distância estimada pela passada, sem GPS.'}
        </Text>
      </View>

      <TouchableOpacity style={styles.botao} onPress={onVerHistorico} activeOpacity={0.8}>
        <View style={styles.botaoLinha}>
          <Ionicons name="time-outline" size={16} color={c.white} />
          <Text style={styles.botaoTexto}>Ver histórico</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoContornar} onPress={onInicio} activeOpacity={0.8}>
        <Text style={styles.botaoContornarTexto}>Voltar ao início</Text>
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
      alignItems: 'center',
    },
    tagVerde: {
      backgroundColor: c.greenBg,
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 6,
      marginBottom: 16,
    },
    tagVerdeTexto: {
      fontSize: fs(13),
      fontWeight: 'bold',
      color: c.green,
    },
    numero: {
      fontSize: fs(64),
      fontWeight: 'bold',
      color: c.ink,
    },
    rotulo: {
      fontSize: fs(14),
      color: c.mute,
      marginBottom: 16,
    },
    tabelaValores: {
      flexDirection: 'row',
      backgroundColor: c.neve,
      borderWidth: 1,
      borderColor: c.line,
      borderRadius: 8,
      paddingVertical: 12,
      width: '100%',
      marginBottom: 16,
    },
    colunaValor: {
      flex: 1,
      alignItems: 'center',
    },
    separadorColuna: {
      width: 1,
      backgroundColor: c.line,
    },
    rotuloEixo: {
      fontSize: fs(12),
      color: c.mute,
      fontWeight: '500',
      marginBottom: 4,
    },
    valorEixo: {
      fontSize: fs(16),
      fontWeight: 'bold',
      color: c.ink,
    },
    texto: {
      fontSize: fs(13),
      color: c.mute,
      textAlign: 'center',
      marginTop: 2,
    },
    botao: {
      backgroundColor: c.ink,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      width: '100%',
      marginBottom: 10,
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
    botaoContornar: {
      borderWidth: 1,
      borderColor: c.ink,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      width: '100%',
      marginBottom: 8,
    },
    botaoContornarTexto: {
      color: c.ink,
      fontSize: fs(15),
      fontWeight: 'bold',
    },
  });
}
