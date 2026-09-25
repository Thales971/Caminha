import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { paletaClaro } from '../theme';

function formatarTempo(segundos) {
  const min = Math.floor((segundos || 0) / 60);
  const seg = (segundos || 0) % 60;
  return `${String(min).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;
}

function Linha({ rotulo, valor, styles }) {
  return (
    <View style={styles.linha}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  );
}

export default function TelaDetalhe({ sessao, onVoltar, c = paletaClaro, f = 1 }) {
  const styles = criarStyles(c, f);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Sessão de caminhada</Text>
        <Linha rotulo="Data e hora" valor={sessao.horario} styles={styles} />
        <Linha rotulo="Passos" valor={String(sessao.passos)} styles={styles} />
        <Linha rotulo="Tempo" valor={formatarTempo(sessao.segundos)} styles={styles} />
        <Linha rotulo="Ritmo" valor={`${sessao.ritmo || 0} passos/min`} styles={styles} />
        <Linha rotulo="Distância" valor={`${sessao.km} km`} styles={styles} />
        <Linha
          rotulo="Origem"
          valor={sessao.usouGps ? 'GPS' : 'estimada pelo passo'}
          styles={styles}
        />
      </View>

      <View style={[styles.tag, sessao.usouGps ? styles.tagVerde : styles.tagAmarela]}>
        <Text
          style={[
            styles.tagTexto,
            sessao.usouGps ? styles.tagTextoVerde : styles.tagTextoAmarela,
          ]}
        >
          {sessao.usouGps ? 'Distância medida pelo GPS' : 'Distância estimada sem GPS'}
        </Text>
      </View>

      <TouchableOpacity style={styles.botao} onPress={onVoltar} activeOpacity={0.8}>
        <View style={styles.botaoLinha}>
          <Ionicons name="chevron-back" size={16} color={c.white} />
          <Text style={styles.botaoTexto}>Voltar ao histórico</Text>
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
    linha: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: c.line,
    },
    rotulo: {
      fontSize: fs(13),
      color: c.mute,
      fontWeight: '600',
    },
    valor: {
      fontSize: fs(13),
      color: c.ink,
      fontWeight: 'bold',
      textAlign: 'right',
      marginLeft: 12,
    },
    tag: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      marginBottom: 12,
      alignItems: 'center',
    },
    tagVerde: {
      backgroundColor: c.greenBg,
    },
    tagAmarela: {
      backgroundColor: c.cream,
    },
    tagTexto: {
      fontSize: fs(13),
      fontWeight: 'bold',
    },
    tagTextoVerde: {
      color: c.green,
    },
    tagTextoAmarela: {
      color: c.brown,
    },
    botao: {
      backgroundColor: c.ink,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      width: '100%',
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
