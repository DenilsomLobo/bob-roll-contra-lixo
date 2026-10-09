# Estrutura do projeto

| Caminho | Responsabilidade |
| --- | --- |
| `index.html` | Entrada do jogo e interface da página |
| `src/js/game.js` | Cena Phaser, jogador, armas, plataformas, saúde e checkpoints |
| `src/js/enemies.js` | Artes, animações, posicionamento e comportamento dos inimigos |
| `src/js/controls.js` | Joystick, botões touch e ranking local |
| `src/css/style.css` | Estilos e disposição em telas móveis |
| `vendor/phaser.min.js` | Phaser local, sem dependência de CDN |
| `assets/` | PNGs originais enviados pelo usuário e referências |
| `assets/game-art/` | Artes derivadas utilizadas no jogo e manifesto de fontes |
| `server/server.mjs` | Servidor HTTP Node.js |
| `scripts/art/` | Preparação de arte e coordenadas dos recortes |
| `scripts/lib/` | Caminhos absolutos do projeto e runtime Chrome compartilhado |
| `scripts/check.mjs` | Verificação de sintaxe e dos caminhos do HTML |
| `scripts/test.mjs` | Servidor temporário e execução sequencial dos testes atuais |
| `tests/` | Testes atuais de controles, terreno, power-ups, inimigos/saúde e chefe/checkpoints |
| `tests/helpers/` | Escrita de prévias e relatórios |
| `tests/legacy/` | Testes antigos; mobile-test cobre o direcional de botões anterior |
| `artifacts/previews/` | Capturas e prévias PNG |
| `artifacts/reports/` | Resultados JSON dos testes |
| `.tmp/` | Perfil temporário do Chrome, ignorado pelo Git |

`scripts/lib/paths.mjs` calcula a raiz a partir de sua própria localização. Scripts e testes não dependem do diretório de execução para encontrar assets ou salvar resultados.

O servidor publica somente `index.html`, `src/`, `vendor/` e `assets/`. Para hospedagem estática, envie esses quatro itens juntos, preservando os caminhos relativos. Não é necessário enviar testes, scripts, relatórios ou o servidor Node.js para uma hospedagem estática.

`Iniciar.cmd` continua na raiz e inicia `server/server.mjs`. Os comandos npm são definidos em `package.json`; o comando `npm test` usa uma porta disponível automaticamente, sem interferir em um servidor já aberto.

Os testes atuais usam Chrome no caminho padrão do Windows. Os testes antigos em `tests/legacy/` exigem um caminho externo de Playwright como argumento. Não fazem parte de `npm test`.
