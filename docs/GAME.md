# Bob Roll - Contra o lixo

Jogo original de acao 2D em HTML5, CSS3, JavaScript e Phaser 3.90.0. Servidor Node.js sem dependencias. HiperRoll aparece na abertura, interface externa e creditos finais.

## Jogar

Para jogar, abra `Iniciar.cmd`. O inicializador sobe o servidor local e abre o jogo em **http://localhost:3000**. Tambem e possivel iniciar manualmente com `npm start` e abrir esse endereco. Nao abra `index.html` diretamente: o jogo precisa ser servido por HTTP para carregar os assets corretamente.

Com Node.js 18+ no PATH, a alternativa e executar a partir da pasta do jogo:

```sh
npm start
```

Nao precisa executar npm install. Phaser esta incluido em `vendor/phaser.min.js` (licenca MIT, cabecalho preservado), portanto nao exige CDN durante o jogo.

## Controles

- A / seta esquerda: andar para tras.
- D / seta direita: andar para frente.
- W / seta para cima: pular. Soltar cedo encurta o salto.
- S / seta para baixo: agachar.
- Espaco: atirar correndo, parado ou no ar.
- P ou Esc: pausar e continuar.
- Enter: iniciar ou reiniciar.
- Dispositivos com toque: botoes abaixo do jogo.

## Missao e regras

Uma fase continua inclui aprendizado, patio horizontal com plataformas e buracos, uma torre vertical e a arena do Necrocompactador. A camera acompanha os dois eixos; na arena, enquadra o combate inteiro.

Cinco vidas, com tres pontos de saude por vida. Os dois primeiros acertos retiram saude; o terceiro consome uma vida e retorna ao ultimo checkpoint, com saude restaurada e 2,2 segundos de protecao. Lava e quedas fatais consomem uma vida diretamente. A arma volta ao Rifle. Ao morrer na arena, o chefe recupera sua vida. Zero vidas encerra a partida; Enter inicia outra.

Quatro armas: Rifle equilibrado; Spread com cinco projeteis; Rapid com maior cadencia; Laser com dano concentrado. Caixas destrutiveis e inimigos fornecem power-ups. Pontuacao por inimigos, coleta e vitoria; recorde local no navegador.

Oito comportamentos de inimigos: Lixumbi patrulheiro, Sucata Rush corredor, Vigia Necro, Torre Chorume, Drone Mosca voador, Tanque Entulho pesado, Cuspidor Toxico e Sucatum de emboscada. Preparacao visual antes de atirar. Ataques deterministas, ativados por proximidade.

O chefe alterna rajadas direcionadas, chuva toxica e leque; fica mais rapido abaixo de metade da vida. O nucleo verde recebe dano dobrado. Barra de vida, recompensa, tela de vitoria e creditos.

## Imagens
As artes carregadas agora são PNGs em assets/game-art, derivados por recorte das referências fornecidas. Originais e antigos SVGs foram preservados. Não foi usada geração por IA: as poses foram extraídas das folhas existentes, com remoção do quadriculado RGB externo e redução para o tamanho do jogo.

- Bob Roll: movimentacao_personagem.png → bob-idle.png, seis bob-run-N.png, bob-jump.png e bob-crouch.png.
- Inimigos: inimigo_1.png → quatro enemy-walk-N.png e slime-shot.png.
- Chefe: boss-neutro.png, boss-mov-1.png e boss-atk.png → boss-static-neutral.png, boss-static-mouth.png e boss-static-attack.png. shot-boss.png → boss-toxic-shot.png.
- Projétil: projetil.png → bob-shot.png.
- Plataformas: plataforma_cenario.png → platform.png, repetida sem esticar nas superfícies.
- Cenário: cenario_1.png → factory-background.png, com brilho reduzido para dar contraste aos personagens.

O mapa em src/js/game.js mantém as chaves de textura existentes. scripts/art/prepare-art.mjs reproduz a prepara??o com Node.js e Chrome headless; scripts/art/prepare-art.py apenas encaminha para esse comando. assets/game-art/sources.json registra os hashes SHA-256 dos originais, verificados pelo script. artifacts/previews/art-preview.png mostra os arquivos derivados sobre fundo escuro. O estilo ilustrado das referências foi preservado e reduzido para a renderização pixelada do jogo; não é uma conversão estrita à paleta NES.

## Hospedagem

Publique o conteudo da raiz do projeto em qualquer hospedagem estatica, ou use Node.js 18+ e `npm start`. O servidor escuta em 0.0.0.0 e aceita a variavel `PORT`. Nao depende de banco de dados, login ou chaves de API. Nenhum deploy externo foi realizado.

## Verificacao

`npm run check` verifica sintaxe. Os arquivos `tests/legacy/smoke-test.mjs` e `tests/legacy/level-test.mjs` executam verificacoes em Chrome headless com Playwright Core. Passe o caminho absoluto de `playwright-core/index.mjs` como primeiro argumento (o runtime usado nos testes ja existia nesta maquina).

Testados: carregamento das imagens; oito tipos de inimigos; movimento; pulo; disparo; quatro armas; pausa e retomada; morte, checkpoint e invencibilidade; ataques do chefe; vitoria; derrota; reinicio; seis saltos da torre com fisica real; coleta por colisao; dano real e bonus do ponto vulneravel do chefe. O teste geral registra `test-results.json`; capturas artifacts/previews/title.png, artifacts/previews/tower.png, artifacts/previews/arena.png e artifacts/previews/defeat.png servem de referencia visual. Os testes de estados usam acesso ao objeto da cena para preparar situacoes; nao representam uma partida completa sem intervencao.

## Mobile, teclado virtual e ranking
O direcional touch possui oito direções. Segure uma direção e ATIRAR para mirar; PULAR é independente da mira e pode ser combinado com movimento e tiro. Os botões suportam múltiplos dedos e liberam o comando ao cancelar o toque ou sair da janela. PAUSAR / CONTINUAR e INICIAR / REINICIAR funcionam sem teclado físico. JOYSTICK VIRTUAL exibe o painel também no desktop. Em paisagem os controles ficam nas laterais da tela.

No teclado físico, W / seta acima mantém o pulo existente e também mira para cima; S / seta abaixo agacha e mira para baixo. Combine com A/D ou setas para diagonais. Espaço atira.

Digite seu nome antes de encerrar a partida. Vitórias e derrotas entram no Top 10 local, ordenado por pontos e, no empate, menor tempo ativo (pausas não contam). O ranking persiste em localStorage neste navegador; não é um ranking online compartilhado. Controles adicionais estão em src/js/controls.js.

Validação adicional: tests/legacy/mobile-test.mjs testa eventos touch reais via Chrome, três dedos simultâneos, oito direções, liberação dos comandos, pausa e tempo, ranking de vitória/derrota, persistência após recarga e largura em paisagem. Execute com o mesmo caminho de Playwright descrito acima.


Inimigo aéreo: inimigo_aerio.png fornece quatro quadros flyer-hover-N.png e a pose flyer-attack.png em assets/game-art. O Drone Mosca usa animação de hélice a 8 fps, anuncia o ataque com a pose de boca aberta nos 300 ms anteriores ao disparo e mantém sua movimentação aérea e colisões existentes. O original foi preservado e incluído na verificação de hashes.


Atualiza??o visual e joystick: execute `node scripts/art/prepare-art.mjs` para reconstruir as imagens derivadas. N?o use vers?es antigas do preparador que reduziam sprites a 32?40 pixels. Os originais permanecem intactos. O cen?rio usa sua resolu??o original; plataformas derivadas preenchem toda a superf?cie de colis?o.

Valida??o atual: com `node server/server.mjs` em execu??o, rode `node tests/joystick-art-test.mjs`. Esse teste substitui as verifica??es do direcional de bot?es de tests/legacy/mobile-test.mjs, que documenta a interface anterior. Testa as oito dire??es por arraste real, zona neutra, libera??o, pausa, comandos combinados, colis?es, armas e chefe. Gera artifacts/previews/art-quality-preview.png e artifacts/previews/mobile-landscape.png. Requer Chrome no caminho padr?o do Windows.


Plataformas e buracos de lava

Os recortes de plataforma_cenario.png ficam em assets/game-art/platform-ground-metal.png, platform-ground-slime.png, platform-beam.png, platform-girder.png, platform-pillar.png, platform-bracket.png e platform-artifacts/previews/tower.png. Os recortes e dimens?es est?o em sources.json. A prepara??o remove tamb?m o fundo quadriculado entre as barras dos suportes, sem alterar a imagem original. `npm run art` reproduz os recortes.

O mapa usa cada pe?a como arte separada; a colis?o fica somente na superf?cie superior de 24 unidades. As estruturas abaixo das plataformas s?o decora??o. O piso ? segmentado e seus intervalos geram automaticamente quatro po?os: x=700?810, 1170?1260, 1700?1820 e 2140?2320. A imagem lava-pit.png, criada com ImageGen a partir do estilo da usina, cobre o ch?o do fundo somente nessas aberturas. Ela fica acima do cen?rio e abaixo de plataformas, personagens e proj?teis. O brilho oscila sem alterar a zona de dano.

Ao cair at? a superf?cie da lava, Bob perde uma vida e volta ao checkpoint, como nas quedas do mapa. Saltar sobre o po?o ? seguro. As dimens?es dos saltos, plataformas e v?os foram preservadas.

Com o servidor ativo, `npm run test:terrain` verifica recortes, profundidades, alinhamento dos quatro v?os, colis?o das plataformas, queda real na lava e retorno ao checkpoint. Gera artifacts/previews/terrain-preview.png e artifacts/previews/tower-platforms-preview.png.


Caixas e proj?teis das quatro armas

As refer?ncias Caixa de Power-Up Espalhamento Retro.png, Caixa Rapid e Proj?til Incandescente.png, M?dulo LASER e Feixe Energ?tico.png e Caixa de Rifle e Disparo Energ?tico.png s?o recortadas sem alterar os originais. `npm run art` produz powerup-spread.png, powerup-rapid.png, powerup-laser.png e powerup-rifle.png, al?m de shot-spread.png, shot-rapid.png, shot-laser.png e shot-rifle.png em assets/game-art. Os recortes, dimens?es e hashes est?o em sources.json. O m?dulo Laser usa as coordenadas de sua imagem de 2172 ? 724; as demais refer?ncias usam 1536 ? 1024.

As caixas destrut?veis e os itens liberados por inimigos usam as mesmas artes, com nomes completos incorporados e sem letras de texto sobrepostas. H? caixas de Spread (610,1060), Rifle (1380,1060), Rapid (1640,1060) e Laser (2570,795) na fase. Rapid foi reposicionada sobre piso firme para o item n?o cair diretamente no po?o. Rifle permite retornar ao disparo inicial. Atirar quebra a caixa; tocar no item liberado equipa a arma. Os padr?es, velocidades, cad?ncia e dano foram preservados. O Laser tem arte de feixe maior, com uma ?rea de colis?o estreita.

Com o servidor ativo, `npm run test:powerups` testa as oito texturas, as quatro caixas, destrui??o por proj?til, coleta de cada arma, quantidade/dire??o/dano dos tiros e limpeza de itens que caem. artifacts/previews/powerups-preview.png apresenta as quatro caixas juntas para revis?o visual; sua distribui??o real na fase permanece nas coordenadas acima.


Leitura visual das superf?cies: todas as plataformas s?lidas recebem tom laranja (0xffa34d), com sua pr?pria superf?cie vis?vel alinhada ao topo da colis?o. As linhas laranja auxiliares foram removidas. O cen?rio de fundo mant?m suas cores originais. A cor ? aplicada na renderiza??o e n?o altera os PNGs de refer?ncia.

O Rifle inicial e o Rifle recolhido usam novamente o proj?til azul de projetil.png, preparado como shot-rifle.png. A caixa Rifle mant?m sua arte pr?pria; Spread, Rapid e Laser mant?m seus proj?teis correspondentes.


Alinhamento das plataformas atualizadas: o jogo mede a regi?o opaca e identifica o primeiro trecho largo do piso, desconsiderando margens transparentes e lumin?rias elevadas. Usa um quadro de textura em mem?ria para exibir a arte na posi??o correta, sem regravar os PNGs. O piso repete m?dulos de 128 unidades com a propor??o da imagem; as pe?as suspensas usam a largura de cada plataforma. A superf?cie medida fica no topo da colis?o de 24 unidades. As linhas decorativas da torre tamb?m foram removidas.

`npm run art` preserva os arquivos platform*.png existentes em assets/game-art, incluindo as novas artes do usu?rio. A op??o expl?cita `node scripts/art/prepare-art.mjs --rebuild-reference-platforms` restaura os recortes antigos de plataforma_cenario.png e sobrescreve essas pe?as; use somente quando essa restaura??o for desejada.

`npm run test:terrain` verifica tamb?m alinhamento, aus?ncia das linhas e pouso real de Bob em cada um dos sete tipos. artifacts/previews/platform-contact-preview.png mostra Bob apoiado na plataforma atualizada.


Inimigos e dificuldade atualizados

A fase tem 26 inimigos dos oito tipos. src/js/enemies.js define suas artes, animacoes e comportamentos: Lixumbi patrulha; Sucata Rush persegue e prepara a investida; Vigia Necro fica em sua posicao e arremessa latas; Torre Chorume prepara e dispara garrafas; Drone Mosca oscila no ar e anuncia o tiro; Tanque Entulho avanca lentamente com seu escudo; Cuspidor Toxico patrulha e dispara lixo energetico; Sucatum emerge do entulho, avisa e ataca. A folha Folha de Sprites do Monstro de Lixo.png corresponde ao inimigo surpresa (nao havia enemy-surpresa.png).

Os seis novos tipos usam recortes em resolucao 4x, registrados em scripts/art/enemy-art-jobs.json. Os PNGs originais e as plataformas atualizadas sao preservados. Execute npm run art:enemies para reconstruir apenas inimigos e bandeira. As artes de ataques, preparacao, movimento e os projetis de guardas, torres e atiradores ficam em assets/game-art. A transparencia original da bandeira HiperRoll e mantida, incluindo seus recortes internos.

Inimigos ficam na camada 7, acima das plataformas (2), caixas e bandeiras (4). Bob fica na camada 8; tiros do jogador e inimigos nas camadas 9 e 10. Posicoes e limites de patrulha sao calculados sobre superficies reais; inimigos terrestres nao caminham para os buracos. Somente inimigos visiveis iniciam ataques, com preparacao antes de disparar. A emboscada permanece visivel como entulho e oferece 850 ms de aviso antes de causar contato. Inimigos visiveis podem receber tiros antes de serem ativados.

Bob inicia com saude 3/3 e cinco vidas. Ha um segundo de protecao entre acertos. O primeiro e segundo acertos nao reposicionam Bob nem removem sua arma. O terceiro retorna ao checkpoint, restaura saude e equipa Rifle. A quinta morte encerra a partida. HUD e painel mostram saude e vidas separadamente.

Com o servidor ativo, npm run test:enemies verifica os oito tipos, 26 posicoes, visibilidade, resolucao, bandeiras, tres acertos por vida, cinco mortes, protecao, preparacao de tiros e ausencia de disparos fora da tela. artifacts/previews/enemies-preview.png apresenta a bandeira e inimigos na fase.

## Bandeiras e chefe gigante

Cada checkpoint começa com checkpoint-neutral.png, derivado de flag_checkpoint_neutra.png, com oscilação suave. Ao passar pelo checkpoint, a textura muda para checkpoint-flag.png (flag_checkpoint.png), com transição de opacidade e efeito de ativação.

O Necrocompactador permanece fixo na lateral direita da arena, com 240 × 250 unidades, quase toda a altura visível. Alterna a pose neutra com a boca aberta e anuncia o disparo usando boss-static-attack.png. As rajadas usam boss-toxic-shot.png, com colisão menor que o brilho da arte. A boca verde continua sendo o ponto vulnerável, com dano dobrado; abaixo de metade da saúde, a cadência aumenta.

Os recortes ficam em scripts/art/setpiece-art-jobs.json. npm run art:setpieces prepara somente essas imagens, preservando os originais e as plataformas atualizadas. npm run test:boss verifica as bandeiras, tamanho e posição do chefe, animações, preparação dos ataques, projéteis, dano real e vitória. A prévia fica em artifacts/previews/giant-boss-preview.png. npm test executa os cinco testes atuais, com 71 verificações.

## Drops reduzidos e agachamento

Somente os três Tanques Entulho deixam power-ups ao serem derrotados. Torres e atiradores não deixam mais caixas; as quatro caixas fixas da fase continuam disponíveis. A distribuição é previsível, sem sorteios de drops.

Ao agachar, a colisão diminui mantendo a mesma posição dos pés, evitando alternância entre as poses de salto e agachamento. A pose abaixada permanece estática enquanto o comando estiver pressionado e Bob estiver no chão. Os testes de inimigos verificam também o agachamento sustentado, retorno à postura normal e o limite de três drops.

## Final animado

Ao derrotar o chefe, o jogo bloqueia novos ataques e inicia uma celebração de quatro segundos. explosao.png vira victory-explosion.png; bob-vitoria-pulando.png fornece a pose do salto, com pausa de 300 ms no alto. Seis poses de bob-dancando.png animam a dança. Cinco poses de bob-robo.png animam o parceiro que cai do céu. Depois entram os créditos. As artes derivadas têm fundo transparente; originais preservados. npm run art:victory refaz somente esses recortes.

O nome é informado antes de iniciar a missão, com teclado virtual ativável. O Top 10 global usa o mesmo projeto Firebase do Castle Roll, em coleção separada. Configuração e implantação das regras estão em docs/FIREBASE.md.

## Dificuldade da arena e power-ups

Apenas o primeiro Tanque Entulho (pátio) deixa um power-up; os outros inimigos não deixam caixas. As quatro caixas fixas permanecem. A entrada da arena mantém saúde e vidas restantes; a saúde só é restaurada após perder uma vida e reaparecer no checkpoint.

Os tiros do chefe duram seis segundos e atravessam plataformas da arena, alcançando a lateral esquerda. Os tiros dos demais inimigos continuam bloqueados pelo cenário. O limite esquerdo mantém Bob inteiro dentro da tela (x=3512), evitando esconder-se fora do enquadramento.

A arte victory.png aparece centralizada acima dos personagens logo após Bob aterrissar do salto de vitória, com entrada suave de escala e opacidade. Permanece durante a dança e sai quando entram os créditos. O derivado victory-banner.png mantém a transparência e é preparado por npm run art:victory; o original permanece intacto.

Atualização: todas as caixas fixas foram removidas do mapa. Power-ups aparecem somente ao derrotar o primeiro Tanque Entulho, mantendo um único drop por partida. As artes das quatro armas continuam disponíveis. O teste de power-ups verifica ausência de caixas fixas, drop real de inimigo e coleta/disparo de cada arma.

Entrada obrigatória do nome: ao abrir ou reiniciar, uma tela central pede o nome e oferece teclado virtual e COMEÇAR MISSÃO. Nome vazio ou apenas espaços bloqueia qualquer forma de início. O nome é capturado ao começar e usado na pontuação final. Enter no campo também confirma o início.
