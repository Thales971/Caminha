import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { paletaClaro } from '../theme';

function formatarTempo(segundos) {
  const min = Math.floor((segundos || 0) / 60);
  const seg = (segundos || 0) % 60;
  return `${String(min).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;
}

export default function TelaHistorico({
  historico,
  onLimpar,
  onAbrir,
  onIniciar,
  c = paletaClaro,
  f = 1,
}) {
  const styles = criarStyles(c, f);

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
          <View>
            <Text style={styles.textoVazio}>
              Nenhuma caminhada salva ainda. Vá em Caminhar, dê uns passos e toque em
              Encerrar sessão.
            </Text>
            <TouchableOpacity style={styles.botao} onPress={onIniciar} activeOpacity={0.8}>
              <View style={styles.botaoLinha}>
                <Ionicons name="play" size={16} color={c.white} />
                <Text style={styles.botaoTexto}>Iniciar caminhada</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          historico.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={styles.item}
              onPress={() => onAbrir(item)}
              activeOpacity={0.7}
            >
              <View>
                <Text style={styles.horario}>
                  #{index + 1} • {item.horario}
                </Text>
                <Text style={styles.detalhes}>
                  {item.passos} passos • {formatarTempo(item.segundos)} • {item.km} km
                </Text>
              </View>
              <View style={styles.linhaDireita}>
                <View
                  style={[styles.tagMini, item.usouGps ? styles.tagVerde : styles.tagAmarela]}
                >
                  <Text
                    style={[
                      styles.tagMiniTexto,
                      item.usouGps ? styles.tagTextoVerde : styles.tagTextoAmarela,
                    ]}
                  >
                    {item.usouGps ? 'GPS' : 'passo'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={c.mute} />
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
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
    },
    cabecalho: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    titulo: {
      fontSize: fs(16),
      fontWeight: 'bold',
      color: c.ink,
    },
    linkLimpar: {
      color: c.red,
      fontSize: fs(13),
      fontWeight: 'bold',
    },
    textoVazio: {
      fontSize: fs(13),
      color: c.mute,
      fontStyle: 'italic',
      paddingVertical: 12,
      lineHeight: Math.round(19 * f),
    },
    botao: {
      backgroundColor: c.ink,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 4,
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
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: c.line,
    },
    horario: {
      fontSize: fs(13),
      fontWeight: 'bold',
      color: c.ink,
    },
    detalhes: {
      fontSize: fs(12),
      color: c.mute,
      marginTop: 2,
    },
    linhaDireita: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    tagMini: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    tagVerde: {
      backgroundColor: c.greenBg,
    },
    tagAmarela: {
      backgroundColor: c.cream,
    },
    tagMiniTexto: {
      fontSize: fs(11),
      fontWeight: 'bold',
    },
    tagTextoVerde: {
      color: c.green,
    },
    tagTextoAmarela: {
      color: c.brown,
    },
  });
}
