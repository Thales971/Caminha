import { useEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Pedometer } from 'expo-sensors';
import * as Location from 'expo-location';

import Header from './src/components/Header';
import TabBar from './src/components/TabBar';
import TelaInicio from './src/screens/TelaInicio';
import TelaCaminhada from './src/screens/TelaCaminhada';
import TelaHistorico from './src/screens/TelaHistorico';
import TelaSobre from './src/screens/TelaSobre';
import TelaResultado from './src/screens/TelaResultado';
import TelaDetalhe from './src/screens/TelaDetalhe';
import {
  listarSessoes,
  adicionarSessao,
  limparSessoes,
  listarPreferencias,
  salvarPreferencias,
} from './src/services/storage';
import { corDoTema, fatorTexto } from './src/theme';

function TelaCarregando({ c, f }) {
  const styles = criarStyles(c, f);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.centro}>
        <Text style={styles.tituloGrande}>Caminha</Text>
        <ActivityIndicator size="small" color={c.brown} style={styles.indicador} />
        <Text style={styles.textoCentro}>lendo preferências…</Text>
      </View>
    </SafeAreaView>
  );
}

function TelaOnboarding({ onContinuar, c, f }) {
  const styles = criarStyles(c, f);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Header titulo="Bem-vindo" subtitulo="pedômetro do celular" c={c} f={f} />
      <View style={styles.conteudoPad}>
        <View style={styles.card}>
          <Text style={styles.tituloGrande}>Caminha</Text>
          <Text style={styles.texto}>
            Conta os passos da volta no bairro. Sem feed e sem virar app de corrida.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.tituloCard}>O sensor</Text>
          <Text style={styles.texto}>
            O pedômetro soma os passos da sessão. GPS é opcional e só entra na distância.
          </Text>
        </View>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.botao} onPress={onContinuar} activeOpacity={0.8}>
          <Text style={styles.botaoTexto}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function TelaPermissoes({ onEntrar, c, f }) {
  const styles = criarStyles(c, f);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Header titulo="Permissões" subtitulo="antes da primeira caminhada" c={c} f={f} />
      <View style={styles.conteudoPad}>
        <View style={styles.card}>
          <Text style={styles.tituloCard}>Atividade física</Text>
          <Text style={styles.texto}>Obrigatória. Sem isso o app não lê o pedômetro.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.tituloCard}>Localização</Text>
          <Text style={styles.texto}>Opcional. Se recusar, a sessão segue só com os passos.</Text>
        </View>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.botao} onPress={onEntrar} activeOpacity={0.8}>
          <Text style={styles.botaoTexto}>Permitir e entrar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  const [fase, setFase] = useState('carregando');
  const [prefs, setPrefs] = useState(null);
  const [abaAtual, setAbaAtual] = useState('inicio');
  const [historico, setHistorico] = useState([]);
  const [sessaoResultado, setSessaoResultado] = useState(null);
  const [sessaoDetalhe, setSessaoDetalhe] = useState(null);

  useEffect(() => {
    (async () => {
      const [sessoes, preferencias] = await Promise.all([
        listarSessoes(),
        listarPreferencias(),
      ]);
      setHistorico(sessoes);
      setPrefs(preferencias);
      setFase(preferencias.visto ? 'app' : 'onboarding');
    })();
  }, []);

  const c = corDoTema(prefs ? prefs.tema : 'claro');
  const f = fatorTexto[prefs ? prefs.texto : 'medio'] || fatorTexto.medio;
  const styles = criarStyles(c, f);

  const atualizarPrefs = (novas) => {
    const atualizadas = { ...prefs, ...novas };
    setPrefs(atualizadas);
    salvarPreferencias(atualizadas);
  };

  const permitirEEntrar = async () => {
    try {
      await Pedometer.requestPermissionsAsync();
    } catch (erro) {
      console.log('Permissão de passos falhou', erro);
    }
    try {
      await Location.requestForegroundPermissionsAsync();
    } catch (erro) {
      console.log('Permissão de GPS falhou', erro);
    }
    atualizarPrefs({ visto: true });
    setFase('app');
  };

  const salvarSessao = async (dados) => {
    const nova = await adicionarSessao(dados);
    setHistorico((prev) => [nova, ...prev]);
    setSessaoDetalhe(null);
    setSessaoResultado(nova);
  };

  const limpar = async () => {
    await limparSessoes();
    setHistorico([]);
  };

  const trocarAba = (novaAba) => {
    setAbaAtual(novaAba);
    setSessaoResultado(null);
    setSessaoDetalhe(null);
  };

  if (fase === 'carregando') {
    return <TelaCarregando c={c} f={f} />;
  }
  if (fase === 'onboarding') {
    return <TelaOnboarding onContinuar={() => setFase('permissoes')} c={c} f={f} />;
  }
  if (fase === 'permissoes') {
    return <TelaPermissoes onEntrar={permitirEEntrar} c={c} f={f} />;
  }

  const hoje = new Date().toLocaleDateString('pt-BR');
  const passosHoje = historico
    .filter((item) => (item.horario || '').includes(hoje))
    .reduce((soma, item) => soma + (item.passos || 0), 0);

  const meta = (prefs && prefs.meta) || 6000;

  const titulos = {
    inicio: ['Hoje em Valinhos', `meta de ${meta.toLocaleString('pt-BR')} passos`],
    caminhar: ['Sessão ao vivo', 'pedômetro ligado'],
    historico: ['Histórico', 'sessões salvas'],
    sobre: ['Ajustes', 'sensor e preferências'],
    resultado: ['Sessão salva', 'resumo da caminhada'],
    detalhe: ['Detalhe da sessão', 'sessão do histórico'],
  };

  let abaExibida = abaAtual;
  let conteudo;

  if (sessaoResultado) {
    abaExibida = 'resultado';
    conteudo = (
      <TelaResultado
        sessao={sessaoResultado}
        onVerHistorico={() => trocarAba('historico')}
        onInicio={() => trocarAba('inicio')}
        c={c}
        f={f}
      />
    );
  } else if (sessaoDetalhe) {
    abaExibida = 'detalhe';
    conteudo = (
      <TelaDetalhe
        sessao={sessaoDetalhe}
        onVoltar={() => setSessaoDetalhe(null)}
        c={c}
        f={f}
      />
    );
  } else if (abaAtual === 'inicio') {
    conteudo = (
      <TelaInicio
        passosHoje={passosHoje}
        meta={meta}
        onNavegarCaminhar={() => trocarAba('caminhar')}
        c={c}
        f={f}
      />
    );
  } else if (abaAtual === 'caminhar') {
    conteudo = (
      <TelaCaminhada
        onSalvar={salvarSessao}
        onVoltar={() => trocarAba('inicio')}
        c={c}
        f={f}
      />
    );
  } else if (abaAtual === 'historico') {
    conteudo = (
      <TelaHistorico
        historico={historico}
        onLimpar={limpar}
        onAbrir={(item) => setSessaoDetalhe(item)}
        onIniciar={() => trocarAba('caminhar')}
        c={c}
        f={f}
      />
    );
  } else {
    conteudo = <TelaSobre prefs={prefs} atualizarPrefs={atualizarPrefs} c={c} f={f} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={prefs.tema === 'escuro' ? 'light' : 'dark'} />
      <Header
        titulo={titulos[abaExibida][0]}
        subtitulo={titulos[abaExibida][1]}
        c={c}
        f={f}
      />
      <View style={styles.conteudo}>{conteudo}</View>
      <TabBar abaAtual={abaAtual} onSelecionarAba={trocarAba} c={c} f={f} />
    </SafeAreaView>
  );
}

function criarStyles(c, f) {
  const fs = (n) => Math.round(n * f);
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.paper,
    },
    conteudo: {
      flex: 1,
    },
    conteudoPad: {
      flex: 1,
      padding: 16,
    },
    centro: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    indicador: {
      marginTop: 12,
    },
    card: {
      backgroundColor: c.white,
      borderWidth: 1,
      borderColor: c.line,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    tituloGrande: {
      fontSize: fs(28),
      fontWeight: 'bold',
      color: c.ink,
      marginBottom: 8,
    },
    tituloCard: {
      fontSize: fs(16),
      fontWeight: 'bold',
      color: c.ink,
      marginBottom: 6,
    },
    texto: {
      fontSize: fs(14),
      color: c.mute,
      lineHeight: Math.round(20 * f),
    },
    textoCentro: {
      fontSize: fs(14),
      color: c.mute,
      textAlign: 'center',
    },
    botao: {
      backgroundColor: c.ink,
      paddingVertical: 16,
      borderRadius: 10,
      alignItems: 'center',
    },
    botaoTexto: {
      color: c.white,
      fontSize: fs(15),
      fontWeight: 'bold',
    },
  });
}
