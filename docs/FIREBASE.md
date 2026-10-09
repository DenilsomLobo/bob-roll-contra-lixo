# Top 10 global

1. Crie ou selecione um projeto Firebase e registre um aplicativo Web.
2. Copie o objeto público firebaseConfig para `src/js/firebase-config.js`. Não use uma chave de conta de serviço.
3. Ative Authentication → Sign-in method → Anonymous. Adicione o domínio publicado aos domínios autorizados.
4. Crie um banco Cloud Firestore Standard. Integre o match de `firebase/firestore.rules` às regras existentes e o índice de `firebase/firestore.indexes.json` aos índices existentes. Como o projeto é compartilhado, preserve as regras e índices de outros jogos.
5. Sirva o jogo por HTTP/HTTPS. O painel mostrará “Ranking global conectado” quando a leitura funcionar.

`ranking_bob_roll_contra_lixo` contém uma partida por documento: name, score, seconds, won, uid e createdAt. A consulta ordena score decrescente, seconds crescente e limita a dez registros. O nome é capturado no início da missão. Vitória e derrota salvam uma única vez; o tempo da celebração não entra no desempate.

Sem configuração ou sem conexão, o painel identifica o ranking local. Falhas de envio preservam a partida localmente; não há reenvio automático. O SDK modular é carregado do CDN Firebase somente quando há configuração.

As regras exigem autenticação anônima, campos válidos e impedem alteração/exclusão pelo cliente. A pontuação é calculada no navegador; estas regras não verificam a legitimidade da partida. Para ranking competitivo resistente a adulteração, será necessária validação de partidas em backend.

Referências: [SDK Web via CDN](https://firebase.google.com/docs/web/alt-setup), [autenticação anônima](https://firebase.google.com/docs/auth/web/anonymous-auth) e [ordenação e limite de consultas](https://firebase.google.com/docs/firestore/query-data/order-limit-data).

## Projeto compartilhado existente

A configuração já foi copiada do Castle Roll para o projeto portifolio-denilsom-lobo. A coleção deste jogo é ranking_bob_roll_contra_lixo. firebase/firestore-games.rules.proposed reúne a proposta existente de Castle Roll/Hiper Catch com o novo match. Compare com as regras realmente publicadas e acrescente o novo match, preservando todas as coleções existentes. Não publique o arquivo isolado firestore.rules sobre o projeto compartilhado: ele só contém este jogo. Publique também o índice proposto junto dos índices existentes. Nenhuma regra remota foi alterada nesta implementação.

Os testes abrem o jogo com ?ranking=local e usam um adaptador simulado para verificar envio único e renderização de dez resultados, sem inserir partidas de teste no placar real.

Verificação de conexão nesta implementação: autenticação/inicialização disponíveis, mas a leitura da nova coleção retornou permission-denied. É necessário publicar o novo match e o índice antes de usar o placar global.

As regras de Castle Roll e Hiper Catch fornecidas pelo usuário correspondem aos dois matches preservados em firebase/firestore-games.rules.proposed. Elas não permitem acesso à coleção ranking_bob_roll_contra_lixo; o terceiro match da proposta libera exclusivamente o ranking deste jogo. Ainda é necessário integrar e publicar esse match no projeto compartilhado.
