# Caminha

App de caminhada com pedômetro. Trabalho de Programação para Dispositivos Móveis — Escola SENAI de Valinhos.

O sensor principal é o pedômetro do celular. O GPS entra só para estimar a distância. Sem o pedômetro o app não faz sentido.

## Stack

- Expo SDK 57
- React Native
- JavaScript
- expo-sensors (Pedometer)
- expo-location (opcional)
- @expo/vector-icons (ícones vetoriais)
- AsyncStorage no histórico e nas preferências

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

- Onboarding e permissões (na primeira abertura, gravadas no aparelho)
- Início: passos do dia, meta e botão para começar
- Caminhar: leitura ao vivo do pedômetro, com tag SENSOR ATIVO
- Modal de encerrar: salvar a sessão ou continuar andando
- Resultado: resumo da sessão salva
- Histórico: lista das sessões (com estado vazio)
- Detalhe: uma sessão inteira, com origem da distância
- Ajustes: tema, tamanho de texto, meta e permissões

## Estados tratados

- Histórico vazio com instrução e botão
- Permissão de passos negada: tela de erro com botão para os ajustes do celular
- GPS recusado: escolha entre começar só com pedômetro ou voltar
- Pedômetro indisponível (emulador): o app não inventa número
- Verificando o sensor antes de liberar a tela
- Tema claro e escuro com tamanho de texto, salvos no aparelho

## Permissões

- Atividade física / movimento (Android `ACTIVITY_RECOGNITION`, iOS Motion and Fitness): obrigatória
- Localização em primeiro plano: opcional. Se recusar, a sessão segue só com os passos

## Protótipo

- Figma: https://www.figma.com/design/amXyXC1K1Hn6CM2H46CluL/Caminha---Prototipo-Sensores-SENAI

## Autor

Thales Torsatto Silva  
Escola SENAI de Valinhos  
Curso técnico em Desenvolvimento de Sistemas
