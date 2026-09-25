import { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import Header from './src/components/Header';
import TabBar from './src/components/TabBar';

import TelaInicio from './src/screens/TelaInicio';
import TelaCaminhada from './src/screens/TelaCaminhada';
import TelaHistorico from './src/screens/TelaHistorico';
import TelaSobre from './src/screens/TelaSobre';

import { listarSessoes, adicionarSessao, limparSessoes } from './src/services/storage';

const META_PADRAO = 6000;

export default function App() {
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <Header />

      <View style={styles.conteudo}>
        {abaAtual === 'inicio' && (
          <TelaInicio
            passosHoje={passosHoje}
            meta={META_PADRAO}
            onNavegarCaminhar={() => setAbaAtual('caminhar')}
          />
        )}
        {abaAtual === 'caminhar' && (
          <TelaCaminhada onSalvar={salvarSessao} />
        )}
        {abaAtual === 'historico' && (
          <TelaHistorico historico={historico} onLimpar={limpar} />
        )}
        {abaAtual === 'sobre' && (
          <TelaSobre />
        )}
      </View>

      <TabBar abaAtual={abaAtual} onSelecionarAba={setAbaAtual} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  conteudo: {
    flex: 1,
  },
});
