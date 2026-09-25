import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_SESSOES = '@caminha:sessoes';
const CHAVE_PREFS = '@caminha:preferencias';

export const PREFS_PADRAO = {
  visto: false,
  tema: 'claro',
  texto: 'medio',
  meta: 6000,
};

export async function listarSessoes() {
  try {
    const bruto = await AsyncStorage.getItem(CHAVE_SESSOES);
    if (!bruto) {
      return [];
    }
    return JSON.parse(bruto);
  } catch (erro) {
    console.log('Erro ao ler histórico', erro);
    return [];
  }
}

export async function salvarSessoes(lista) {
  try {
    await AsyncStorage.setItem(CHAVE_SESSOES, JSON.stringify(lista));
  } catch (erro) {
    console.log('Erro ao salvar histórico', erro);
  }
}

export async function adicionarSessao(sessao) {
  const lista = await listarSessoes();
  const nova = {
    id: Date.now().toString(),
    horario: new Date().toLocaleString('pt-BR'),
    ...sessao,
  };
  const atualizada = [nova, ...lista];
  await salvarSessoes(atualizada);
  return nova;
}

export async function limparSessoes() {
  try {
    await AsyncStorage.removeItem(CHAVE_SESSOES);
  } catch (erro) {
    console.log('Erro ao limpar histórico', erro);
  }
}

export async function listarPreferencias() {
  try {
    const bruto = await AsyncStorage.getItem(CHAVE_PREFS);
    if (!bruto) {
      return PREFS_PADRAO;
    }
    return { ...PREFS_PADRAO, ...JSON.parse(bruto) };
  } catch (erro) {
    console.log('Erro ao ler preferências', erro);
    return PREFS_PADRAO;
  }
}

export async function salvarPreferencias(prefs) {
  try {
    await AsyncStorage.setItem(CHAVE_PREFS, JSON.stringify(prefs));
  } catch (erro) {
    console.log('Erro ao salvar preferências', erro);
  }
}
