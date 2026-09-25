import { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import Header from './src/components/Header';
import TabBar from './src/components/TabBar';
import TelaInicio from './src/screens/TelaInicio';
import TelaCaminhada from './src/screens/TelaCaminhada';
import TelaHistorico from './src/screens/TelaHistorico';
import TelaSobre from './src/screens/TelaSobre';
import { listarSessoes, adicionarSessao, limparSessoes } from './src/services/storage';
import { cores } from './src/theme';

const META_PADRAO = 6000;

function Card({ children }) {
  return <View style={styles.card}>{children}</View>;
}

function Botao({ label, onPress }) {
  return (
    <TouchableOpacity style={styles.botao} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.botaoTexto}>{label}</Text>
    </TouchableOpacity>
  );
}

function TelaOnboarding({ onContinuar }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Header titulo="Bem-vindo" subtitulo="pedômetro do celular" />
      <View style={styles.conteudoPad}>
        <Card>
          <Text style={styles.tituloGrande}>Caminha</Text>
          <Text style={styles.texto}>
            Conta os passos da volta no bairro. Sem feed e sem virar app de corrida.
          </Text>
        </Card>
        <Card>
          <Text style={styles.tituloCard}>O sensor</Text>
          <Text style={styles.texto}>
            O pedômetro soma os passos da sessão. GPS é opcional e só entra na distância.
          </Text>
        </Card>
        <View style={{ flex: 1 }} />
        <Botao label="Continuar" onPress={onContinuar} />
      </View>
    </SafeAreaView>
  );
}

function TelaPermissoes({ onEntrar }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Header titulo="Permissões" subtitulo="antes da primeira caminhada" />
      <View style={styles.conteudoPad}>
        <Card>
          <Text style={styles.tituloCard}>Atividade física</Text>
          <Text style={styles.texto}>Obrigatória. Sem isso o app não lê o pedômetro.</Text>
        </Card>
        <Card>
          <Text style={styles.tituloCard}>Localização</Text>
          <Text style={styles.texto}>Opcional. Se recusar, a sessão segue só com os passos.</Text>
        </Card>
        <View style={{ flex: 1 }} />
        <Botao label="Permitir e entrar" onPress={onEntrar} />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  const [fase, setFase] = useState('onboarding');
  const [abaAtual, setAbaAtual] = useState('inicio');
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    listarSessoes().then(setHistorico);
  }, []);

  const salvarSessao = async (dados) => {
    const nova = await adicionarSessao(dados);
    setHistorico((prev) => [nova, ...prev]);
    setAbaAtual('historico');
  };

  const limpar = async () => {
    await limparSessoes();
    setHistorico([]);
  };

  const hoje = new Date().toLocaleDateString('pt-BR');
  const passosHoje = historico
    .filter((item) => (item.horario || '').includes(hoje))
    .reduce((soma, item) => soma + (item.passos || 0), 0);

  const titulos = {
    inicio: ['Hoje em Valinhos', 'meta de 6.000 passos'],
    caminhar: ['Sessão ao vivo', 'pedômetro ligado'],
    historico: ['Histórico', 'sessões salvas'],
    sobre: ['Ajustes', 'sensor e permissões'],
  };

  if (fase === 'onboarding') {
    return <TelaOnboarding onContinuar={() => setFase('permissoes')} />;
  }
  if (fase === 'permissoes') {
    return <TelaPermissoes onEntrar={() => setFase('app')} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Header titulo={titulos[abaAtual][0]} subtitulo={titulos[abaAtual][1]} />
      <View style={styles.conteudo}>
        {abaAtual === 'inicio' && (
          <TelaInicio
            passosHoje={passosHoje}
            meta={META_PADRAO}
            onNavegarCaminhar={() => setAbaAtual('caminhar')}
          />
        )}
        {abaAtual === 'caminhar' && <TelaCaminhada onSalvar={salvarSessao} />}
        {abaAtual === 'historico' && (
          <TelaHistorico historico={historico} onLimpar={limpar} />
        )}
        {abaAtual === 'sobre' && <TelaSobre />}
      </View>
      <TabBar abaAtual={abaAtual} onSelecionarAba={setAbaAtual} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.paper,
  },
  conteudo: {
    flex: 1,
  },
  conteudoPad: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: cores.white,
    borderWidth: 1,
    borderColor: cores.line,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  tituloGrande: {
    fontSize: 28,
    fontWeight: 'bold',
    color: cores.ink,
    marginBottom: 8,
  },
  tituloCard: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.ink,
    marginBottom: 6,
  },
  texto: {
    fontSize: 14,
    color: cores.mute,
    lineHeight: 20,
  },
  botao: {
    backgroundColor: cores.ink,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoTexto: {
    color: cores.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
