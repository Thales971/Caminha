import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE = '@caminha:sessoes';

export async function listarSessoes() {
  try {
    const bruto = await AsyncStorage.getItem(CHAVE);
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
    await AsyncStorage.setItem(CHAVE, JSON.stringify(lista));
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
    await AsyncStorage.removeItem(CHAVE);
  } catch (erro) {
    console.log('Erro ao limpar histórico', erro);
  }
}
