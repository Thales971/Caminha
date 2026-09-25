import { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Pedometer } from 'expo-sensors';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { paletaClaro } from '../theme';

const PASSO_METROS = 0.75;

function formatarTempo(segundos) {
  const min = Math.floor(segundos / 60);
  const seg = segundos % 60;
  return `${String(min).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;
}

export default function TelaCaminhada({ onSalvar, onVoltar, c = paletaClaro, f = 1 }) {
  const [disponivel, setDisponivel] = useState(null);
  const [permissaoPassos, setPermissaoPassos] = useState('undetermined');
  const [gpsOk, setGpsOk] = useState(false);
  const [gpsRecusado, setGpsRecusado] = useState(false);
  const [andando, setAndando] = useState(false);
  const [passos, setPassos] = useState(0);
  const [segundos, setSegundos] = useState(0);
  const [distanciaGps, setDistanciaGps] = useState(null);
  const [modalEncerrar, setModalEncerrar] = useState(false);

  const assinaturaRef = useRef(null);
  const timerRef = useRef(null);
  const origemRef = useRef(null);

  useEffect(() => {
    verificarSensor();

    return () => {
      pararLeitura();
    };
  }, []);

  const verificarSensor = async () => {
    try {
      const ok = await Pedometer.isAvailableAsync();
      setDisponivel(ok);
    } catch (erro) {
      console.log('Falha ao checar o pedômetro', erro);
      setDisponivel(false);
    }
  };

  const pararLeitura = () => {
    if (assinaturaRef.current) {
      assinaturaRef.current.remove();
      assinaturaRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const iniciarLeitura = async (comGps) => {
    const temSensor = await Pedometer.isAvailableAsync();
    setDisponivel(temSensor);
    if (!temSensor) {
      return;
    }

    setPassos(0);
    setSegundos(0);
    setDistanciaGps(null);
    origemRef.current = null;
    setAndando(true);

    assinaturaRef.current = Pedometer.watchStepCount((leitura) => {
      setPassos(leitura.steps);
    });

    timerRef.current = setInterval(() => {
      setSegundos((atual) => atual + 1);
    }, 1000);

    if (comGps) {
      try {
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        origemRef.current = pos.coords;
      } catch (erro) {
        console.log('GPS inicial falhou', erro);
      }
    }
  };

  const pedirEIniciar = async () => {
    const movimento = await Pedometer.requestPermissionsAsync();
    setPermissaoPassos(movimento.status);
    if (movimento.status !== 'granted') {
      return;
    }

    const local = await Location.requestForegroundPermissionsAsync();
    if (local.status === 'granted') {
      setGpsOk(true);
      await iniciarLeitura(true);
    } else {
      setGpsOk(false);
      setGpsRecusado(true);
    }
  };

  const continuarSemGps = async () => {
    setGpsRecusado(false);
    await iniciarLeitura(false);
  };

  const confirmarEncerrar = async () => {
    setModalEncerrar(false);
    pararLeitura();
    setAndando(false);

    let kmGps = null;
    if (origemRef.current) {
      try {
        const agora = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        kmGps = distanciaKm(origemRef.current, agora.coords);
        setDistanciaGps(kmGps);
      } catch (erro) {
        console.log('GPS final falhou', erro);
      }
    }

    const kmEstimado = (passos * PASSO_METROS) / 1000;
    const km = kmGps !== null ? kmGps : kmEstimado;
    const ritmo = segundos > 0 ? Math.round((passos / segundos) * 60) : 0;

    onSalvar({
      passos,
      segundos,
      ritmo,
      km: Number(km.toFixed(2)),
      usouGps: kmGps !== null,
    });
  };

  const styles = criarStyles(c, f);

  if (disponivel === null) {
    return (
      <View style={styles.tela}>
        <ActivityIndicator size="large" color={c.brown} />
        <Text style={styles.rotulo}>Verificando o pedômetro…</Text>
      </View>
    );
  }

  if (disponivel === false) {
    return (
      <View style={styles.tela}>
        <View style={styles.avisoErro}>
          <Text style={styles.avisoErroTitulo}>Pedômetro indisponível</Text>
          <Text style={styles.avisoErroTexto}>
            Este aparelho ou emulador não tem pedômetro. O Caminha não inventa passo.
            Teste em um celular físico.
          </Text>
        </View>
        <TouchableOpacity style={styles.botaoEscuro} onPress={verificarSensor} activeOpacity={0.8}>
          <Text style={styles.botaoTexto}>Tentar de novo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoContornar} onPress={onVoltar} activeOpacity={0.8}>
          <Text style={styles.botaoContornarTexto}>Voltar ao início</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (permissaoPassos === 'denied') {
    return (
      <View style={styles.tela}>
        <View style={styles.avisoErro}>
          <Text style={styles.avisoErroTitulo}>Permissão de passos negada</Text>
          <Text style={styles.avisoErroTexto}>
            Sem permissão de atividade física o app não conta passo. Libere movimento
            nos ajustes do celular e tente de novo.
          </Text>
        </View>
        <TouchableOpacity style={styles.botaoEscuro} onPress={pedirEIniciar} activeOpacity={0.8}>
          <Text style={styles.botaoTexto}>Tentar de novo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoContornar} onPress={() => Linking.openSettings()} activeOpacity={0.8}>
          <Text style={styles.botaoContornarTexto}>Abrir ajustes do celular</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoContornar} onPress={onVoltar} activeOpacity={0.8}>
          <Text style={styles.botaoContornarTexto}>Voltar ao início</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (gpsRecusado) {
    return (
      <View style={styles.tela}>
        <View style={styles.avisoAviso}>
          <Text style={styles.avisoAvisoTitulo}>GPS recusado</Text>
          <Text style={styles.avisoAvisoTexto}>
            A sessão pode começar mesmo assim, só com passos e tempo. A distância sai
            da estimativa por passada.
          </Text>
        </View>
        <TouchableOpacity style={styles.botaoEscuro} onPress={continuarSemGps} activeOpacity={0.8}>
          <View style={styles.botaoLinha}>
            <Ionicons name="walk" size={16} color={c.white} />
            <Text style={styles.botaoTexto}>Começar só com pedômetro</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.botaoContornar}
          onPress={() => setGpsRecusado(false)}
          activeOpacity={0.8}
        >
          <Text style={styles.botaoContornarTexto}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.tela}>
      <View style={[styles.tagStatus, andando ? styles.tagVerde : styles.tagCinza]}>
        <Text style={[styles.tagTexto, andando ? styles.tagTextoVerde : styles.tagTextoCinza]}>
          {andando ? 'SENSOR ATIVO' : 'AGUARDANDO INÍCIO'}
        </Text>
      </View>

      <Text style={styles.numero}>{passos}</Text>
      <Text style={styles.rotulo}>passos da sessão</Text>

      <View style={styles.tabelaValores}>
        <View style={styles.colunaValor}>
          <Text style={styles.rotuloEixo}>Tempo</Text>
          <Text style={styles.valorEixo}>{formatarTempo(segundos)}</Text>
        </View>
        <View style={styles.separadorColuna} />
        <View style={styles.colunaValor}>
          <Text style={styles.rotuloEixo}>Ritmo</Text>
          <Text style={styles.valorEixo}>
            {segundos > 0 ? Math.round((passos / segundos) * 60) : 0}
          </Text>
        </View>
        <View style={styles.separadorColuna} />
        <View style={styles.colunaValor}>
          <Text style={styles.rotuloEixo}>GPS</Text>
          <Text style={styles.valorEixo}>{gpsOk ? 'ligado' : 'off'}</Text>
        </View>
      </View>

      {andando && !gpsOk && (
        <Text style={styles.avisoGps}>
          GPS recusado. A sessão segue só com o pedômetro. Distância vai ser estimada
          pelo passo.
        </Text>
      )}

      {distanciaGps !== null && (
        <Text style={styles.textoKm}>{distanciaGps.toFixed(2)} km pelo GPS</Text>
      )}

      {!andando ? (
        <TouchableOpacity style={styles.botaoEscuro} onPress={pedirEIniciar} activeOpacity={0.8}>
          <View style={styles.botaoLinha}>
            <Ionicons name="play" size={16} color={c.white} />
            <Text style={styles.botaoTexto}>Começar a andar</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.botaoVermelho}
          onPress={() => setModalEncerrar(true)}
          activeOpacity={0.8}
        >
          <View style={styles.botaoLinha}>
            <Ionicons name="stop" size={14} color={c.white} />
            <Text style={styles.botaoTexto}>Encerrar sessão</Text>
          </View>
        </TouchableOpacity>
      )}

      <Modal
        visible={modalEncerrar}
        transparent
        animationType="fade"
        onRequestClose={() => setModalEncerrar(false)}
      >
        <View style={styles.modalFundo}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitulo}>Encerrar caminhada?</Text>
            <Text style={styles.modalTexto}>
              {passos} passos em {formatarTempo(segundos)}
            </Text>
            <TouchableOpacity style={styles.botaoEscuro} onPress={confirmarEncerrar} activeOpacity={0.8}>
              <Text style={styles.botaoTexto}>Salvar sessão</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.botaoContornar}
              onPress={() => setModalEncerrar(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.botaoContornarTexto}>Continuar andando</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function distanciaKm(a, b) {
  const r = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return r * c;
}

function criarStyles(c, f) {
  const fs = (n) => Math.round(n * f);
  return StyleSheet.create({
    tela: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
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
    tagStatus: {
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 6,
      marginBottom: 16,
    },
    tagVerde: {
      backgroundColor: c.greenBg,
    },
    tagCinza: {
      backgroundColor: c.neve,
    },
    tagTexto: {
      fontSize: fs(13),
      fontWeight: 'bold',
    },
    tagTextoVerde: {
      color: c.green,
    },
    tagTextoCinza: {
      color: c.mute,
    },
    tabelaValores: {
      flexDirection: 'row',
      backgroundColor: c.white,
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
    avisoGps: {
      fontSize: fs(13),
      color: c.brown,
      textAlign: 'center',
      marginBottom: 12,
    },
    textoKm: {
      fontSize: fs(14),
      color: c.ink,
      marginBottom: 12,
    },
    botaoEscuro: {
      backgroundColor: c.ink,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      width: '100%',
      marginBottom: 10,
    },
    botaoVermelho: {
      backgroundColor: c.red,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      width: '100%',
    },
    botaoContornar: {
      borderWidth: 1,
      borderColor: c.ink,
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
      fontWeight: 'bold',
      fontSize: fs(15),
    },
    botaoContornarTexto: {
      color: c.ink,
      fontWeight: 'bold',
      fontSize: fs(15),
    },
    avisoErro: {
      backgroundColor: c.errBg,
      borderWidth: 1,
      borderColor: c.errLine,
      padding: 14,
      borderRadius: 12,
      marginBottom: 16,
      width: '100%',
    },
    avisoErroTitulo: {
      color: c.err,
      fontSize: fs(15),
      fontWeight: 'bold',
      marginBottom: 6,
      textAlign: 'center',
    },
    avisoErroTexto: {
      color: c.err,
      fontSize: fs(14),
      textAlign: 'center',
      lineHeight: Math.round(20 * f),
    },
    avisoAviso: {
      backgroundColor: c.cream,
      borderWidth: 1,
      borderColor: c.yellow,
      padding: 14,
      borderRadius: 12,
      marginBottom: 16,
      width: '100%',
    },
    avisoAvisoTitulo: {
      color: c.brown,
      fontSize: fs(15),
      fontWeight: 'bold',
      marginBottom: 6,
      textAlign: 'center',
    },
    avisoAvisoTexto: {
      color: c.ink,
      fontSize: fs(14),
      textAlign: 'center',
      lineHeight: Math.round(20 * f),
    },
    modalFundo: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      padding: 24,
    },
    modalCard: {
      backgroundColor: c.white,
      borderWidth: 1,
      borderColor: c.line,
      borderRadius: 12,
      padding: 20,
    },
    modalTitulo: {
      fontSize: fs(18),
      fontWeight: 'bold',
      color: c.ink,
      marginBottom: 6,
      textAlign: 'center',
    },
    modalTexto: {
      fontSize: fs(14),
      color: c.mute,
      textAlign: 'center',
      marginBottom: 16,
    },
  });
}
