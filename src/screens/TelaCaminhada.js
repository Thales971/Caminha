import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Pedometer } from 'expo-sensors';
import * as Location from 'expo-location';

const PASSO_METROS = 0.75;

function formatarTempo(segundos) {
  const min = Math.floor(segundos / 60);
  const seg = segundos % 60;
  return `${String(min).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;
}

export default function TelaCaminhada({ onSalvar }) {
  const [disponivel, setDisponivel] = useState(true);
  const [permissaoPassos, setPermissaoPassos] = useState('undetermined');
  const [gpsOk, setGpsOk] = useState(false);
  const [andando, setAndando] = useState(false);
  const [passos, setPassos] = useState(0);
  const [segundos, setSegundos] = useState(0);
  const [distanciaGps, setDistanciaGps] = useState(null);

  const assinaturaRef = useRef(null);
  const timerRef = useRef(null);
  const origemRef = useRef(null);

  useEffect(() => {
    Pedometer.isAvailableAsync().then((ok) => {
      setDisponivel(ok);
    });

    return () => {
      pararLeitura();
    };
  }, []);

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

  const iniciar = async () => {
    const movimento = await Pedometer.requestPermissionsAsync();
    setPermissaoPassos(movimento.status);
    if (movimento.status !== 'granted') {
      return;
    }

    const local = await Location.requestForegroundPermissionsAsync();
    const temGps = local.status === 'granted';
    setGpsOk(temGps);

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

    if (temGps) {
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

  const encerrar = async () => {
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

    const sessao = {
      passos,
      segundos,
      ritmo,
      km: Number(km.toFixed(2)),
      usouGps: kmGps !== null,
    };

    Alert.alert(
      'Encerrar caminhada?',
      `${passos} passos em ${formatarTempo(segundos)}`,
      [
        { text: 'Continuar sem salvar', style: 'cancel' },
        {
          text: 'Salvar sessão',
          onPress: () => {
            onSalvar(sessao);
            Alert.alert('Pronto', 'Sessão gravada no histórico.');
            setPassos(0);
            setSegundos(0);
          },
        },
      ]
    );
  };

  if (!disponivel) {
    return (
      <View style={styles.tela}>
        <View style={styles.avisoErro}>
          <Text style={styles.avisoErroTexto}>
            Pedômetro indisponível neste aparelho ou emulador. O Caminha não inventa passo. Teste em um celular físico.
          </Text>
        </View>
      </View>
    );
  }

  if (permissaoPassos === 'denied') {
    return (
      <View style={styles.tela}>
        <View style={styles.avisoErro}>
          <Text style={styles.avisoErroTexto}>
            Sem permissão de atividade o app não conta passo. Libere movimento / atividade física nos ajustes do celular e tente de novo.
          </Text>
        </View>
        <TouchableOpacity style={styles.botaoEscuro} onPress={iniciar} activeOpacity={0.8}>
          <Text style={styles.botaoTexto}>Tentar de novo</Text>
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
          GPS recusado. A sessão segue só com o pedômetro. Distância vai ser estimada pelo passo.
        </Text>
      )}

      {distanciaGps !== null && (
        <Text style={styles.textoKm}>{distanciaGps.toFixed(2)} km pelo GPS</Text>
      )}

      {!andando ? (
        <TouchableOpacity style={styles.botaoEscuro} onPress={iniciar} activeOpacity={0.8}>
          <Text style={styles.botaoTexto}>Começar a andar</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.botaoVermelho} onPress={encerrar} activeOpacity={0.8}>
          <Text style={styles.botaoTexto}>Encerrar sessão</Text>
        </TouchableOpacity>
      )}
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

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  numero: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#111827',
  },
  rotulo: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  tagStatus: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginBottom: 16,
  },
  tagVerde: {
    backgroundColor: '#DCFCE7',
  },
  tagCinza: {
    backgroundColor: '#F3F4F6',
  },
  tagTexto: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  tagTextoVerde: {
    color: '#15803D',
  },
  tagTextoCinza: {
    color: '#6B7280',
  },
  tabelaValores: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    backgroundColor: '#E2E8F0',
  },
  rotuloEixo: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 4,
  },
  valorEixo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  avisoGps: {
    fontSize: 13,
    color: '#92400E',
    textAlign: 'center',
    marginBottom: 12,
  },
  textoKm: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 12,
  },
  botaoEscuro: {
    backgroundColor: '#1C1917',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  botaoVermelho: {
    backgroundColor: '#B42318',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  avisoErro: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  avisoErroTexto: {
    color: '#991B1B',
    fontSize: 14,
    textAlign: 'center',
  },
});
