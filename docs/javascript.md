# JavaScript

Três arquivos, nenhuma dependência, nenhum módulo ES. Cada um é uma IIFE em
`'use strict'`, sem variáveis globais e sem exportações: a comunicação entre
eles é o próprio DOM. A sintaxe é conservadora de propósito (`var`, `function`,
`Array.prototype.slice.call`), para funcionar sem transpilação em navegadores
antigos.

| Arquivo | Responsabilidade | Depende de |
| --- | --- | --- |
| [`layout.js`](../js/layout.js) | Montar header e rodapé a partir de `MENU` | marcadores `#site-header` e `#site-footer` |
| [`global.js`](../js/global.js) | Menu mobile, dropdowns, busca de livros e de jogos | header já injetado por `layout.js` |
| [`animacoes.js`](../js/animacoes.js) | Carrossel 3D, sliders de cards, revelação ao rolar | nada — cada rotina sai se não achar seus elementos |

Todas as rotinas começam procurando seus elementos e **retornam cedo** quando
não os encontram. É isso que permite carregar os três scripts em todas as
páginas, mesmo nas que não têm carrossel nem busca.

## layout.js

Fonte única do cabeçalho e do rodapé. Ver
[arquitetura.md, seção 5](arquitetura.md#5-fonte-única-da-navegação) para o
formato de `MENU` e a lógica de caminhos.

Funções, em ordem de leitura:

| Função | O que faz |
| --- | --- |
| `prefixo()` | `'../'` dentro de `pages/`, `''` na raiz |
| `paginaAtual()` | último segmento da URL; a raiz conta como `index.html` |
| `ehAtual(href)` | compara o nome do arquivo para marcar a página aberta |
| `escapar(texto)` | escapa `&`, `<`, `>` e `"` |
| `montarHeader()` | devolve o HTML do skip link, da topbar, do header e da sobreposição |
| `montarFooter()` | devolve o HTML do rodapé, com contatos e ano corrente |
| `injetar(id, montar)` | troca o marcador pelo HTML (`outerHTML`); `false` se o marcador não existe |
| `injetarQuandoPossivel()` | tenta agora; senão espera o `DOMContentLoaded` |

Constantes de contato ficam no topo do arquivo: `EMAIL`, `INSTAGRAM` e
`NECBIO`. Mudar o e-mail do laboratório é mudar uma linha.

O HTML é montado por concatenação de strings, não por `createElement`. É
verboso, mas mantém o markup legível na própria fonte e permite trocar o
marcador por um bloco inteiro de uma vez, em um único reflow.

## global.js

### `iniciarNavegacao()`

Controla o header injetado. Comportamentos:

- **Dropdowns** (`.dropdown-btn`): clique alterna, abrir um fecha os outros,
  `aria-expanded` acompanha o estado e a classe `.show` entra no painel.
- **Menu mobile** (`#btn-menu`): alterna `.aberto` na `nav`, mostra a
  `.sobreposicao-menu`, e troca o `aria-label` entre "Abrir" e "Fechar menu de
  navegação".
- **Clique fora**: fecha dropdowns quando o alvo não está em `.dropdown`, e
  fecha o menu quando o alvo não está em `.header-principal`.
- **`Esc`**: fecha o que estiver aberto e devolve o foco ao botão que o abriu —
  primeiro os dropdowns, depois o menu mobile.
- **Volta ao desktop**: um `matchMedia('(min-width: 900px)')` desfaz o estado do
  menu mobile ao cruzar o breakpoint, para o painel não ficar preso aberto.
  Há fallback para `addListener` em navegadores antigos.

### `iniciarBuscaLivros()` e `iniciarFiltroJogos()`

Ambas filtram cards já presentes no HTML, comparando o `textContent`
normalizado (`normalizar()` remove acentos e caixa) com o termo digitado. Os
jogos combinam a busca por texto com a área ativa (`areaAtiva`, padrão
`'todas'`), atualizam a contagem de cada área e escondem a área inteira quando
ela fica vazia. `iniciarFiltroJogos()` chama `aplicar()` uma vez na
inicialização, para que as contagens reflitam o HTML real.

### Contrato de DOM

`global.js` depende dos seguintes ganchos. Renomear qualquer um deles no HTML
exige mudar o JS.

| Gancho | Onde é criado | Para quê |
| --- | --- | --- |
| `#btn-menu` | `layout.js` | botão hambúrguer |
| `#nav-principal` | `layout.js` | painel de navegação |
| `#sobreposicao-menu` | `layout.js` | fundo escuro do menu mobile |
| `.dropdown-btn` + `aria-controls` | `layout.js` | botão e painel do dropdown |
| `#input-pesquisa` | `pages/livros.html` | campo de busca de livros |
| `.grid-livros`, `.card-livro` | `pages/livros.html` | grade e cards filtrados |
| `#aviso-sem-livros` | `pages/livros.html` | mensagem de "nenhum resultado" |
| `#input-jogos` | `pages/jogos.html` | campo de busca de jogos |
| `.chip-filtro[data-area]` | `pages/jogos.html` | filtros por área |
| `.grupo-area[data-area]` | `pages/jogos.html` | seção de uma área |
| `.card-jogo` | `pages/jogos.html` | card filtrado |
| `.contagem-area` | `pages/jogos.html` | contador por área, reescrito pelo JS |
| `#aviso-sem-jogos` | `pages/jogos.html` | mensagem de "nenhum resultado" |

O `data-area` do chip precisa bater exatamente com o `data-area` da seção —
sem acento e em minúsculas, como `geneticaeevolucao`. É o mesmo nome usado na
subpasta de `assets/imagens-jogos/`.

## animacoes.js

Um `matchMedia('(prefers-reduced-motion: reduce)')` no topo do arquivo governa
as três rotinas: com movimento reduzido, o carrossel não inicia e os sliders
rolam com `behavior: 'auto'` em vez de `'smooth'`.

### `iniciarCarrossel3d()`

Carrossel de três posições (`.ativa`, `.proxima`, `.anterior`) girando a cada
4 s sobre as imagens de `.carrossel-container`. Só inicia com duas imagens ou
mais. Pausa:

- no `mouseenter` e no `focusin` (volta no `mouseleave` / `focusout`);
- quando a aba vai para segundo plano (`visibilitychange`);
- quando o visitante clica em `.btn-pausar` — essa pausa é "pegajosa"
  (`pausadoPeloUsuario`) e não é desfeita pelo ponteiro;
- quando `prefers-reduced-motion` passa a valer durante a sessão.

O botão `.btn-pausar` vem com `hidden` no HTML e é revelado pelo script, para
não aparecer um controle inerte quando o JS não roda. Seu rótulo e `aria-label`
alternam entre Pausar e Reproduzir.

### `iniciarSliders()`

A rolagem é nativa (CSS `scroll-snap` em `.cards-view`), então arrastar no
celular, a roda do mouse e o teclado já funcionam sem JS. O script só
acrescenta os botões `.btn-voltar` / `.btn-avancar`, que deslocam a área por
exatamente um card: `passo()` mede a largura do card e soma o `column-gap`
lido do estilo computado. `atualizarBotoes()` desabilita as setas nas pontas,
ouvindo `scroll` (passivo) e `resize`.

### `iniciarRevelacao()`

Qualquer elemento com `data-revelar` entra com opacidade e deslocamento suaves,
via `IntersectionObserver`, e é dispensado do observador depois de aparecer. Os
estilos iniciais são aplicados **pelo JS**, não pelo CSS — assim, sem
JavaScript ou com movimento reduzido, o conteúdo simplesmente aparece visível,
em vez de ficar invisível para sempre.

## Como estender

- **Novo item de menu:** uma entrada em `MENU`, em `layout.js`. Nada mais.
- **Nova área de jogos:** um `.chip-filtro[data-area]` e uma
  `.grupo-area[data-area]` com o mesmo valor. A busca e a contagem se ajustam
  sozinhas.
- **Nova seção com entrada suave:** acrescente `data-revelar` ao elemento.
- **Novo slider de cards:** repita a estrutura
  `.cards-carrossel > .seta-slider + .cards-view > .cards-container > .card`.
  `iniciarSliders()` percorre todos os `.cards-carrossel` da página.
- **Nova busca:** prefira estender `iniciarFiltroJogos()` ou
  `iniciarBuscaLivros()` com os mesmos nomes de gancho em vez de criar um
  terceiro padrão de filtro.
