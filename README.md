# Caminha

App de caminhada com pedômetro. Trabalho de Programação para Dispositivos Móveis — Escola SENAI de Valinhos.

O sensor principal é o pedômetro do celular. O GPS entra só para estimar distância. Sem o pedômetro o app não faz sentido.

## Stack

- Expo SDK 57
- React Native
- JavaScript
- expo-sensors (Pedometer)
- expo-location (opcional)
- AsyncStorage no histórico

Mesmo jeito dos apps da aula: `App.js` escolhe a tela, pastas `src/screens` e `src/components`, sem React Navigation.

## Como rodar

```bash
git clone https://github.com/Thales971/Caminha.git
cd Caminha
npm install
npx expo start
```

Abre no Expo Go. Pedômetro de verdade precisa de celular físico. Emulador costuma cair na tela de sensor indisponível, e isso é esperado.

## Telas

- Início: passos do dia e botão para começar
- Caminhar: leitura ao vivo do pedômetro
- Histórico: sessões salvas no aparelho
- Sobre: ficha do sensor e permissões

## Permissões

- Atividade física / movimento: obrigatória
- Localização: opcional. Se recusar, a sessão segue só com os passos

## Autor

Thales Torsatto Silva  
Escola SENAI de Valinhos  
Curso técnico em Desenvolvimento de Sistemas
