import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
} from 'react-native';
import { Pedometer } from 'expo-sensors';
import * as Location from 'expo-location';
import { paletaClaro } from '../theme';

function Opcoes({ opcoes, valor, onSelecionar, styles }) {
  return (
    <View style={styles.linhaOpcoes}>
      {opcoes.map((op) => {
        const ativa = op.valor === valor;
        return (
          <TouchableOpacity
            key={op.valor}
            style={[styles.opcao, ativa && styles.opcaoAtiva]}
            onPress={() => onSelecionar(op.valor)}
            activeOpacity={0.7}
          >
            <Text style={[styles.opcaoTexto, ativa && styles.opcaoTextoAtiva]}>
              {op.rotulo}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TelaSobre({ prefs, atualizarPrefs, c = paletaClaro, f = 1 }) {
  const styles = criarStyles(c, f);

  const [statusPassos, setStatusPassos] = useState('verificando');
  const [statusGps, setStatusGps] = useState('verificando');
  const [metaTexto, setMetaTexto] = useState(String(prefs.meta || 6000));

  useEffect(() => {
    (async () => {
      try {
        const permissao = await Pedometer.getPermissionsAsync();
        setStatusPassos(rotuloPermissao(permissao.status));
      } catch (erro) {
        console.log('Erro ao ler permissão de passos', erro);
        setStatusPassos('Indisponível');
      }
      try {
        const permissao = await Location.getForegroundPermissionsAsync();
        setStatusGps(rotuloPermissao(permissao.status));
      } catch (erro) {
        console.log('Erro ao ler permissão de GPS', erro);
        setStatusGps('Pendente');
      }
    })();
  }, []);

  const guardarMeta = () => {
    const numero = parseInt(metaTexto, 10);
    if (numero > 0) {
      atualizarPrefs({ meta: numero });
    } else {
      setMetaTexto(String(prefs.meta || 6000));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Aparência</Text>
        <Text style={styles.rotuloGrupo}>Tema</Text>
        <Opcoes
          opcoes={[
            { valor: 'claro', rotulo: 'Claro' },
            { valor: 'escuro', rotulo: 'Escuro' },
          ]}
          valor={prefs.tema}
          onSelecionar={(valor) => atualizarPrefs({ tema: valor })}
          styles={styles}
        />
        <Text style={styles.rotuloGrupo}>Tamanho de texto</Text>
        <Opcoes
          opcoes={[
            { valor: 'pequeno', rotulo: 'Pequeno' },
            { valor: 'medio', rotulo: 'Médio' },
            { valor: 'grande', rotulo: 'Grande' },
          ]}
          valor={prefs.texto}
          onSelecionar={(valor) => atualizarPrefs({ texto: valor })}
          styles={styles}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.titulo}>Meta do dia</Text>
        <Text style={styles.texto}>Quantidade de passos da meta diária da Home.</Text>
        <View style={styles.linhaMeta}>
          <TextInput
            style={styles.inputMeta}
            value={metaTexto}
            onChangeText={setMetaTexto}
            onEndEditing={guardarMeta}
            keyboardType="numeric"
            placeholder="6000"
            placeholderTextColor={c.mute}
          />
          <Text style={styles.textoMeta}>passos</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.titulo}>Permissões</Text>
        <View style={styles.linha}>
          <Text style={styles.rotulo}>Atividade física</Text>
          <Text style={styles.valor}>{statusPassos}</Text>
        </View>
        <View style={styles.linha}>
          <Text style={styles.rotulo}>Localização</Text>
          <Text style={styles.valor}>{statusGps}</Text>
        </View>
        <TouchableOpacity
          style={styles.botaoContornar}
          onPress={() => Linking.openSettings()}
          activeOpacity={0.8}
        >
          <Text style={styles.botaoContornarTexto}>Abrir ajustes do celular</Text>
        </TouchableOpacity>
      </View>

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
          Emulador quase nunca tem pedômetro. Celular barato às vezes também não. Sem
          permissão de movimento o app bloqueia o início. Sem GPS a sessão continua, só
          a rota some.
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

function rotuloPermissao(status) {
  if (status === 'granted') {
    return 'Liberada';
  }
  if (status === 'denied') {
    return 'Negada';
  }
  return 'Pendente';
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
      marginBottom: 10,
    },
    rotuloGrupo: {
      fontSize: fs(13),
      color: c.mute,
      fontWeight: '600',
      marginBottom: 6,
      marginTop: 4,
    },
    linhaOpcoes: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 4,
    },
    opcao: {
      flex: 1,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: c.line,
      borderRadius: 8,
      alignItems: 'center',
      backgroundColor: c.neve,
    },
    opcaoAtiva: {
      backgroundColor: c.ink,
      borderColor: c.ink,
    },
    opcaoTexto: {
      fontSize: fs(13),
      color: c.mute,
      fontWeight: '600',
    },
    opcaoTextoAtiva: {
      color: c.white,
      fontWeight: 'bold',
    },
    linha: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: c.line,
    },
    linhaMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 8,
    },
    inputMeta: {
      borderWidth: 1,
      borderColor: c.line,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      minWidth: 100,
      color: c.ink,
      backgroundColor: c.neve,
      fontSize: fs(14),
    },
    textoMeta: {
      fontSize: fs(13),
      color: c.mute,
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
    texto: {
      fontSize: fs(13),
      color: c.mute,
      lineHeight: Math.round(20 * f),
    },
    botaoContornar: {
      borderWidth: 1,
      borderColor: c.ink,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 12,
    },
    botaoContornarTexto: {
      color: c.ink,
      fontSize: fs(14),
      fontWeight: 'bold',
    },
  });
}
