# Bob Roll — Contra o Lixo

Jogo de ação e plataforma 2D para navegador, apresentado pela HiperRoll. Na Operação Planeta Limpo, Bob Roll atravessa uma usina tomada por criaturas de lixo, enfrenta obstáculos e chega ao confronto com o Necrocompactador.

## Capa

<!-- Substitua CAMINHO_DA_IMAGEM_DE_CAPA pelo caminho relativo da imagem ou por uma URL. Exemplo: docs/images/capa.png -->
![Capa de Bob Roll — Contra o Lixo](CAMINHO_DA_IMAGEM_DE_CAPA)

## Como é o jogo

A missão percorre um pátio industrial com plataformas e poços de lava, uma torre vertical e a arena do chefe final. Bob pode correr, saltar, agachar e atirar em oito direções. A câmera acompanha a exploração e enquadra a arena durante o combate.

- Oito tipos de inimigos com diferentes movimentos e ataques.
- Quatro armas: Rifle, Spread, Rapid e Laser. Bob começa com o Rifle; o primeiro Tanque Entulho libera um power-up ao ser derrotado.
- Cinco vidas e três pontos de saúde por vida, com checkpoints ao longo da fase.
- Lava e quedas fatais consomem uma vida. Ao reaparecer, Bob recupera a saúde e volta ao Rifle.
- Chefe com diferentes padrões de ataque e um ponto vulnerável na boca verde.
- Celebração animada e créditos após a vitória.
- Top 10 por pontuação, com menor tempo ativo como desempate. Vitórias e derrotas podem entrar no ranking.
- Controles por teclado ou joystick virtual com botões de toque, incluindo teclado virtual para informar o nome.

## Imagens do gameplay

Substitua os três caminhos abaixo por imagens do seu jogo. Caminhos relativos, como `docs/images/gameplay-1.png`, funcionam no README do GitHub quando as imagens também estão no repositório.

### 1. Exploração da usina

<!-- Espaço 1: substitua CAMINHO_DA_IMAGEM_1. -->
![Exploração da usina e plataformas](CAMINHO_DA_IMAGEM_1)

### 2. Combate e obstáculos

<!-- Espaço 2: substitua CAMINHO_DA_IMAGEM_2. -->
![Combate contra os inimigos e obstáculos da fase](CAMINHO_DA_IMAGEM_2)

### 3. Confronto com o chefe

<!-- Espaço 3: substitua CAMINHO_DA_IMAGEM_3. -->
![Bob Roll enfrentando o Necrocompactador](CAMINHO_DA_IMAGEM_3)

## Tecnologias usadas

| Tecnologia | Uso no projeto |
| --- | --- |
| HTML5 | Página do jogo e interface |
| CSS3 | Estilos, layout responsivo e controles para dispositivos móveis |
| JavaScript | Regras do jogo, inimigos, controles e animações |
| Phaser 3 | Renderização, cenas, física e colisões; biblioteca incluída em `vendor/` |
| Node.js 18+ | Servidor HTTP local, scripts de verificação e preparação de arte |
| Firebase Authentication | Autenticação anônima para envio ao ranking global |
| Cloud Firestore | Armazenamento e consulta do Top 10 global |
| localStorage | Ranking local no navegador |
| PNG e SVG | Artes, sprites e elementos visuais |

## Como executar

Você precisa de **Node.js 18 ou superior** e um navegador moderno.

1. Baixe ou clone o repositório.
2. Abra um terminal na pasta do projeto.
3. Execute:

```sh
npm start
```

4. Acesse **http://localhost:3000**.
5. Informe seu nome e selecione **COMEÇAR MISSÃO**.

No Windows, também é possível abrir `Iniciar.cmd`, que inicia o servidor e abre o navegador. Não é necessário executar `npm install`: o servidor usa módulos nativos do Node.js e o Phaser já está incluído no projeto. Sirva o jogo por HTTP; abrir `index.html` diretamente pode impedir o carregamento dos recursos.

## Controles

| Comando | Ação |
| --- | --- |
| A / seta esquerda | Mover para a esquerda |
| D / seta direita | Mover para a direita |
| W / seta para cima | Pular e mirar para cima |
| S / seta para baixo | Agachar e mirar para baixo |
| Espaço | Atirar |
| P / Esc | Pausar ou continuar |
| Enter | Confirmar início ou reiniciar, com nome preenchido |

Combine as direções para mirar na diagonal. Em telas de toque, use o joystick para mover e mirar e os botões **PULAR** e **ATIRAR**. O botão **JOYSTICK VIRTUAL** também disponibiliza esses controles no desktop. Em dispositivos móveis, a orientação horizontal oferece mais espaço.

## Ranking

O ranking global utiliza Firebase e depende de configuração, autenticação anônima, regras de acesso e índice do Firestore. Sem configuração ou conexão disponível, o jogo utiliza o ranking local do navegador. Consulte [a documentação do Firebase](docs/FIREBASE.md) para configurar a integração e preservar as regras de outros jogos no projeto compartilhado.

## Estrutura do projeto

```text
assets/        Artes originais e sprites utilizados no jogo
docs/          Documentação do jogo, estrutura e Firebase
firebase/      Regras e índices do Firestore
scripts/       Verificação, preparação de arte e utilitários
server/        Servidor HTTP local
src/css/       Estilos da interface
src/js/        Jogo, inimigos, controles, final e ranking
vendor/        Biblioteca Phaser incluída localmente
index.html     Página inicial
Iniciar.cmd    Inicializador para Windows
package.json   Comandos e requisito de Node.js
```

## Verificação

Para verificar a sintaxe e os caminhos utilizados pelo HTML:

```sh
npm run check
```

O projeto também define comandos de testes em `package.json`. Eles dependem dos arquivos da pasta `tests/` e do Chrome; a pasta `tests/` não está incluída nesta cópia do projeto.

## Publicação

Para uma hospedagem estática, publique `index.html`, `src/`, `vendor/` e `assets/`, mantendo os caminhos relativos. Para executar em um servidor Node.js, use `npm start`; a porta pode ser definida pela variável de ambiente `PORT`.

## Créditos

Bob Roll — Contra o Lixo / HiperRoll. O Phaser é distribuído sob licença MIT, preservada no cabeçalho da biblioteca em `vendor/phaser.min.js`.
