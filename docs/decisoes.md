# Decisões de arquitetura

Registro curto de cada decisão estrutural: o que foi decidido, por quê, e o que
se paga por isso. A maior parte foi tomada na repaginação do front-end
(commit `d70339d`, 13/11/2026), que substituiu a versão anterior do site.

---

## D1 — Site estático, sem framework e sem build

**Decisão.** HTML, CSS e JavaScript escritos à mão, servidos como estão.
Nenhum bundler, nenhum `package.json`, nenhuma etapa de compilação.

**Por quê.** O site é mantido por estudantes de licenciatura em Ciências
Biológicas, com rotatividade a cada semestre, e o conteúdo muda mais que o
código — um jogo novo, uma foto da equipe, um texto. Um projeto com build
exigiria Node, instalação de dependências e um ciclo de publicação que a
equipe não teria como manter em alguns semestres. Aqui, editar um arquivo e dar
push publica o site.

**Custo.** Sem minificação, sem autoprefixer, sem componentes reutilizáveis de
verdade. A consistência depende de convenção e revisão, não de ferramenta.

---

## D2 — Header e rodapé montados por JavaScript

**Decisão.** O cabeçalho e o rodapé não estão escritos nas páginas. São
montados por [`js/layout.js`](../js/layout.js) e injetados nos marcadores
`#site-header` e `#site-footer`.

**Por quê.** O GitHub Pages não tem includes de servidor. O estado anterior do
projeto repetia o mesmo bloco de menu em 12 páginas, de modo que acrescentar um
item exigia 12 edições idênticas — e qualquer esquecimento deixava uma página
com menu diferente. Com o `MENU` em um único arquivo, o menu, o estado de
"página atual" e o rodapé passam a ter uma fonte só.

**Custo.** O menu depende de JavaScript. A mitigação é o `<noscript>` em cada
página, com os links essenciais. É também o motivo de `layout.js` ser síncrono
e ficar no corpo do documento, e não no `<head>` com `defer`.

---

## D3 — `layout.js` síncrono, no meio do `<body>`

**Decisão.** A tag `<script src="js/layout.js">` vem imediatamente depois do
marcador do header, sem `defer` nem `async`. Os outros dois scripts vão no fim
do `<body>`.

**Por quê.** O cabeçalho precisa estar no DOM antes da primeira pintura; com
`defer`, a página apareceria por um instante sem cabeçalho e depois saltaria.
Com os scripts de comportamento no fim do corpo, eles já encontram o header
montado, sem precisar de eventos de coordenação.

**Custo.** Uma dependência de ordem, implícita e silenciosa: mover as tags
quebra o menu sem erro no console. Está documentado em
[arquitetura.md](arquitetura.md#4-ciclo-de-vida-de-uma-página) e nos
comentários dos próprios arquivos.

---

## D4 — Caminhos sempre relativos

**Decisão.** Nenhum caminho interno começa com `/`. Páginas em `pages/` usam
`../`, e `layout.js` calcula o prefixo conforme a profundidade.

**Por quê.** O site de projeto do GitHub Pages fica em
`usuario.github.io/repositorio/`. Caminhos absolutos apontariam para a raiz do
domínio e quebrariam tudo — CSS, JS e imagens.

**Custo.** `prefixo()` detecta a profundidade pelo padrão `/pages/` na URL. Uma
terceira camada de pastas exigiria generalizar essa função.

---

## D5 — CSS em duas camadas, com tokens

**Decisão.** `global.css` para tokens, reset, tipografia e layout;
`componentes.css` para as peças de interface. Toda cor, espaçamento, raio e
sombra vem de uma variável CSS no `:root`.

**Por quê.** Permite mudar a identidade visual em um lugar e dá nome ao que
antes eram valores repetidos. A camada de papéis semânticos
(`--cor-titulo`, `--cor-superficie`) sobre a escala crua (`--verde-700`) deixa
explícito o que cada cor significa, e não apenas qual é.

**Custo.** Duas folhas de estilo em vez de uma, e a disciplina de decidir, a
cada regra nova, em qual das duas ela mora.

---

## D6 — Estado em atributos ARIA, não em classes

**Decisão.** O CSS estiliza `[aria-expanded="true"]`, `[aria-current="page"]` e
`[aria-pressed="true"]`. As classes de estado se restringem a `.show`,
`.aberto`, `.visivel` e às três posições do carrossel.

**Por quê.** Impede que o visual e a semântica de acessibilidade saiam de
sincronia: o menu não pode *parecer* aberto sem *estar* marcado como aberto,
porque é o mesmo atributo que produz as duas coisas.

**Custo.** Seletores um pouco mais longos.

---

## D7 — Acervo como marcação, sem dados estruturados

**Decisão.** Os 60 jogos, 6 livros e 9 integrantes são HTML escrito à mão nas
páginas. Não há JSON, CMS nem geração de páginas.

**Por quê.** Coerente com D1 e com quem edita o site: duplicar um `<article>` e
trocar três campos é uma operação que qualquer pessoa da equipe faz sem
aprender nada novo. As buscas e os filtros funcionam sobre o DOM já pronto,
sem precisar de uma camada de dados.

**Custo.** Não escala para centenas de itens, e metadados (ano, autores, área)
não ficam disponíveis para consulta. Se o acervo precisar de ficha por jogo ou
de empréstimo online, essa decisão é a primeira a ser revista.

---

## D8 — Todas as imagens em WebP, com script destrutivo

**Decisão.** `assets/` contém apenas `.webp`, gerados por
[`scripts/otimizar-imagens.py`](../scripts/otimizar-imagens.py), que
redimensiona por categoria e **apaga o original**.

**Por quê.** A pasta tinha 52 MB e passou para 4,4 MB (commit `d89ca31`) sem
perda visível no tamanho em que as imagens aparecem. Manter o original ao lado
do `.webp` dobraria o peso do repositório sem servir a ninguém — os arquivos em
alta resolução pertencem a um backup, não ao repositório do site.

**Custo.** O script é irreversível. Rodá-lo sem backup perde o original.

---

## D9 — `404.html` autossuficiente

**Decisão.** A página de erro tem CSS e JS embutidos e não referencia `css/`
nem `js/`.

**Por quê.** O GitHub Pages serve o `404.html` em qualquer endereço
inexistente, de qualquer profundidade. Um erro em `/pages/algo-inexistente`
tentaria buscar `/pages/css/global.css` e a página apareceria sem estilo —
justamente no momento em que o visitante está perdido.

**Custo.** Duplicação consciente dos tokens de cor. Ao mudar a identidade
visual, lembre de atualizar essa página.

---

## D10 — Nomes em português, código em ASCII

**Decisão.** Classes, funções, variáveis e arquivos em português
(`montarHeader`, `.card-jogo`, `otimizar-imagens.py`), mas sem acentuação nos
identificadores e nos nomes de arquivo.

**Por quê.** A equipe e o conteúdo são em português, e comentários técnicos em
inglês sobre uma interface em português só acrescentariam tradução mental. Já
os nomes de arquivo sem acento evitam diferenças de normalização Unicode entre
Windows, macOS e o servidor; os comentários do código também evitam acento, por
consistência com os nomes.

**Custo.** Nenhum relevante neste contexto.

---

## D11 — Movimento é opcional

**Decisão.** `prefers-reduced-motion` é respeitado em dois lugares: no CSS, que
zera animações e transições, e no `animacoes.js`, que não inicia o carrossel e
rola os sliders sem suavização. Além disso, o carrossel pausa no hover, no
foco, na troca de aba e tem botão de pausa explícito.

**Por quê.** Carrossel que gira sozinho é um problema de acessibilidade
conhecido (WCAG 2.2.2). Desligar a animação apenas no CSS não bastaria: o
`setInterval` continuaria trocando as classes.

**Custo.** A lógica de pausa é a parte mais intricada do `animacoes.js`, com
três fontes de pausa independentes.
