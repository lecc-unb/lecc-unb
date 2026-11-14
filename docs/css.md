# CSS e design system

Duas folhas de estilo, carregadas nesta ordem em todas as páginas (exceto no
`404.html`, que tem estilo embutido):

| Arquivo | ~Linhas | Conteúdo |
| --- | --- | --- |
| [`css/global.css`](../css/global.css) | 390 | tokens, reset, tipografia, layout, botões, campos de busca, utilitários de acessibilidade |
| [`css/componentes.css`](../css/componentes.css) | 1200 | header, menu, hero, carrossel, cards, listas especiais, grades do acervo, rodapé |

A divisão é a regra de ouro do CSS deste projeto: **`global.css` define o
vocabulário, `componentes.css` o usa.** Se uma declaração vale para a página
inteira (uma cor, uma escala, um container), ela é `global.css`. Se descreve uma
peça específica da interface, é `componentes.css`. Não há CSS por página nem
`<style>` nas páginas — a única exceção documentada é o `404.html`.

## Tokens

Todos no `:root` de `global.css`. Mudar a identidade visual do site é mudar
valores ali, sem tocar em componente nenhum.

### Cores

Uma escala verde única, derivada da identidade original do LECC, e sobre ela
uma camada de **papéis semânticos**. Os componentes usam os papéis; a escala
crua aparece só em casos pontuais.

```
Escala     --verde-900  #002400   (header)
           --verde-800 … --verde-300
           --verde-200  #a1e8a1   (texto sobre o header)
           --verde-100 / 50 / 25  (faixas e fundo)

Papéis     --cor-fundo         fundo da página      (verde-25)
           --cor-superficie    cards e painéis      (branco)
           --cor-texto         corpo de texto
           --cor-texto-suave   textos de apoio
           --cor-titulo        títulos e links      (verde-700, AA sobre o fundo)
           --cor-marca         foco e destaques     (verde-500)
           --cor-header        fundo do cabeçalho   (verde-900)
           --cor-texto-header  texto do cabeçalho   (verde-200)
           --cor-borda         rgba(20,44,32,.12)
```

O comentário no arquivo registra que `--cor-titulo` foi escolhida por atingir
contraste AA sobre `--cor-fundo`. Ao trocar qualquer uma das duas, reconfira o
contraste.

### Espaçamento, forma e tipografia

- `--esp-1` … `--esp-9`: de `0.25rem` a `6rem`. Espaçamentos novos saem dessa
  escala, não de valores soltos.
- `--raio-sm | --raio | --raio-lg | --raio-full` e `--sombra-1 | -2 | -3`:
  três níveis de profundidade, do card em repouso ao elemento flutuante.
- `--fonte-corpo`: Quicksand, com fallback de sistema. `--fonte-titulo`:
  Playfair Display, serifada, aplicada a `h1`–`h6`.
- `--transicao`: `0.25s cubic-bezier(0.4, 0, 0.2, 1)`, usada em todas as
  transições para que o movimento do site seja consistente.

A fonte do corpo é declarada em `body`, **nunca no seletor universal** — o
comentário no arquivo explica o motivo: no universal, os títulos herdariam a
sans-serif e perderiam a serifada.

### Layout

- `--largura-max: 1180px` — largura máxima do conteúdo.
- `--gutter` — respiro lateral, que cresce com a tela: `1rem`, `1.5rem` a
  partir de 600 px e `2rem` a partir de 900 px. É o único token redefinido em
  media query.

## Breakpoints

Dois, sempre em `min-width` (mobile-first):

| Largura | O que muda |
| --- | --- |
| 600 px | `--gutter` para `1.5rem`; cards do slider ficam mais largos |
| 900 px | `--gutter` para `2rem`; o menu passa de painel vertical para barra horizontal; seções ganham mais respiro vertical; `apresentacao` e `hero-home` viram duas colunas |

O 900 px é o breakpoint crítico: ele aparece no CSS **e** no `matchMedia` de
`global.js`, que desfaz o estado do menu mobile ao voltar para o desktop. Mudar
um sem o outro deixa o menu preso aberto. O menu mobile é escrito no bloco
`@media (max-width: 899px)` de `componentes.css`, complementar ao
`@media (min-width: 900px)` logo abaixo.

## Classes de layout e utilitários

De `global.css`, disponíveis em qualquer página:

| Classe | Uso |
| --- | --- |
| `.container-principal` | bloco centralizado com `--largura-max` e `--gutter`, com respiro vertical |
| `.secao` | igual, para seções internas |
| `.faixa` | faixa de largura total com fundo `--verde-50` e bordas; envolve uma `.secao` |
| `.grade` + `.grade--2/3/4` | grade responsiva com `auto-fit` e `minmax(min(100%, …), 1fr)` — nunca estoura em telas estreitas |
| `.titulo-secao`, `.titulo-secao--linha`, `.titulo-secao--centro` | título de seção, com filete decorativo opcional |
| `.sobretitulo`, `.texto-apoio` | rótulo acima do título e parágrafo de apoio |
| `.btn-primario`, `.btn-secundario`, `.grupo-botoes` | botões (48 px de altura mínima) e sua linha |
| `.container-pesquisa`, `.rotulo-pesquisa`, `.barra-pesquisa`, `.aviso-vazio` | campo de busca e mensagem de vazio |
| `.apenas-leitor` | conteúdo só para leitores de tela |
| `.pular-para-conteudo` | link de salto, visível apenas no foco |

## Acessibilidade no CSS

- `:focus-visible` tem contorno de 3 px em `--cor-marca`, com `outline-offset`;
  dentro do header escuro, o contorno muda para `--verde-200` para manter o
  contraste.
- `@media (prefers-reduced-motion: reduce)` zera animações, transições e o
  `scroll-behavior` em tudo. `animacoes.js` respeita a mesma preferência em
  JavaScript, de modo que o carrossel não apenas para de animar: ele não roda.
- `html { overflow-x: clip }` é a rede de segurança contra transbordo lateral.
  O comentário no arquivo explica a escolha de `clip` em vez de `hidden`:
  `hidden` criaria um contexto de rolagem e quebraria o header `sticky`.
- Alvos de toque têm no mínimo 44–48 px (botões, chips, setas de slider).

## Convenções de nome

- Nomes em **português**, em minúsculas, com hífen: `.card-jogo`,
  `.contagem-area`, `.grupo-botoes`.
- Variação de um componente com dois hifens, no estilo BEM:
  `.titulo-secao--linha`, `.apresentacao--invertida`, `.hero-home__texto`.
- Estado vem de atributo, não de classe, quando o atributo já existe por
  acessibilidade: o CSS estiliza `[aria-expanded="true"]`,
  `[aria-current="page"]` e `[aria-pressed="true"]` em vez de uma classe
  `.ativo`. As únicas classes de estado são `.show` (painel do dropdown),
  `.aberto` (menu mobile), `.visivel` (sobreposição) e `.ativa` / `.proxima` /
  `.anterior` (carrossel).
- Esconder conteúdo é `hidden` (o atributo HTML), aplicado pelo JS — não uma
  classe `.escondido`.
