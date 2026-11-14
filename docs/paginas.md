# Páginas: anatomia e convenções

Cada página é um documento HTML completo e independente. Não há template nem
include: a uniformidade vem de todas as páginas seguirem o mesmo molde, e a
parte que realmente não pode divergir — o cabeçalho e o rodapé — é montada em
tempo de execução por `layout.js`.

## O molde

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- 1. Identidade da página: estes cinco campos mudam em cada arquivo -->
    <title>Nossos jogos | LECC - UnB</title>
    <meta name="description" content="…">
    <meta property="og:title" content="Nossos jogos | LECC - UnB">
    <meta property="og:description" content="…">
    <meta property="og:url" content="https://lecc-unb.github.io/lecc-unb/pages/jogos.html">
    <link rel="canonical" href="https://lecc-unb.github.io/lecc-unb/pages/jogos.html">

    <!-- 2. Idêntico em todas as páginas, só muda o ../ -->
    <link rel="icon" href="../assets/icons/icon-lecc.webp" type="image/webp">
    <meta property="og:type" content="website">
    <meta property="og:image" content="…/assets/icons/icon-lecc.webp">
    <meta property="og:locale" content="pt_BR">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:…&amp;family=Quicksand:…&amp;display=swap">
    <link rel="stylesheet" href="../css/global.css">
    <link rel="stylesheet" href="../css/componentes.css">
</head>

<body>
    <div id="site-header"></div>
    <script src="../js/layout.js"></script>   <!-- síncrono, aqui mesmo -->

    <noscript>
        <nav class="nav-sem-js" aria-label="Navegação principal">…</nav>
    </noscript>

    <main id="conteudo">
        <!-- conteúdo da página -->
    </main>

    <div id="site-footer"></div>

    <script src="../js/global.js"></script>
    <script src="../js/animacoes.js"></script>
</body>
</html>
```

Regras que valem para todas as páginas:

- `lang="pt-BR"` no `<html>`.
- Os três marcadores: `#site-header`, `#conteudo`, `#site-footer`. O
  `id="conteudo"` é o destino do link "pular para o conteúdo" que `layout.js`
  insere.
- A posição de `layout.js` **no corpo**, logo abaixo do marcador do header, é
  deliberada — ver [arquitetura.md, seção 4](arquitetura.md#4-ciclo-de-vida-de-uma-página).
- Os três scripts entram em toda página, inclusive nas que não têm busca nem
  carrossel: as rotinas saem sozinhas quando não encontram seus elementos.
- Exatamente um `<h1>` por página, com a hierarquia de títulos descendo sem
  pular níveis.
- `../` em todos os caminhos dentro de `pages/`; nenhum caminho absoluto
  começando com `/`.

## Os três tipos de página

### 1. Página inicial (`index.html`)

Única com o carrossel 3D e, por isso, a única sensível a métricas de
carregamento. Estrutura: hero em duas colunas (`.hero-home`) com o
`.carrossel-container`, faixa com o slider de modelos didáticos
(`.cards-carrossel`) e seção `.apresentacao--invertida` com a lista de
objetivos.

A primeira imagem do carrossel carrega com `fetchpriority="high"` e **sem**
`loading="lazy"`; as outras duas, com `loading="lazy"`. Todas as imagens do
site declaram `width` e `height` para reservar espaço e evitar deslocamento de
layout.

### 2. Páginas de conteúdo

`acervo.html`, `jogos.html`, `livros.html`, `o-lecc.html`, `equipe.html`.
Começam com `<section class="container-principal hero">` (sobretítulo, `h1` e um
parágrafo de abertura) e seguem com `.secao`, às vezes envolvidas em `.faixa`
para alternar o fundo. Cada uma usa um subconjunto dos componentes:

| Página | Componentes principais |
| --- | --- |
| `acervo.html` | `.lista-etapas`, `.faq` (`<details>`/`<summary>`), `.bloco-destaque` |
| `jogos.html` | `.filtros-jogos` + `.chip-filtro`, `.grupo-area`, `.grid-jogos`, `.card-jogo` |
| `livros.html` | `.container-pesquisa`, `.grid-livros`, `.card-livro` |
| `o-lecc.html` | `.apresentacao`, `.grade` + `.card-pilar`, `.linha-tempo` |
| `equipe.html` | `.grid-equipe`, `.card-equipe`, `.foto-equipe` |

### 3. Páginas "em preparação"

`modelos-didaticos.html`, `propostas-didaticas.html`, `noite-jogos.html`,
`leituras-lecc.html` e `projetos-extensao.html` são o mesmo arquivo de 72
linhas com outro texto: um bloco `.em-breve` com ícone decorativo, sobretítulo
"Em preparação", `h1`, dois parágrafos e dois botões (voltar ao acervo e falar
com a equipe).

Elas existem para que nenhum item do menu leve a um 404. Transformar uma delas
em página de conteúdo é substituir o bloco `.em-breve` por seções `.secao`,
mantendo o `<head>` e os marcadores como estão.

## A página de erro (`404.html`)

Fora do molde, de propósito: CSS e JavaScript embutidos, nenhuma referência a
`css/` ou `js/`, e `<meta name="robots" content="noindex">`.

O GitHub Pages responde com esse arquivo em **qualquer** endereço inexistente,
de qualquer profundidade. Um erro em `/pages/algo-inexistente` tentaria carregar
`/pages/css/global.css` e a página apareceria sem estilo. Por isso ela repete
alguns tokens de cor no próprio `<style>` e traz um script curto que descobre a
raiz do site a partir do hostname (`*.github.io` → `/<repositorio>/`) para
apontar corretamente o botão "Ir para a página inicial".

Isso cria uma duplicação consciente: ao mudar as cores da marca, atualize
também o `404.html`.

## Checklist para criar uma página

1. Copie uma página existente de `pages/` — `noite-jogos.html` para um esboço,
   `livros.html` para uma página de acervo.
2. Atualize `<title>`, `meta description`, `og:title`, `og:description`,
   `og:url` e `canonical`.
3. Escreva o conteúdo dentro de `<main id="conteudo">`, começando por um
   `<section class="container-principal hero">` com o único `<h1>`.
4. Registre a página na constante `MENU`, em
   [`js/layout.js`](../js/layout.js) — é o que faz o link aparecer em todas as
   páginas e o estado "página atual" funcionar.
5. Acrescente a URL em [`sitemap.xml`](../sitemap.xml), com `lastmod` e
   `priority`.
6. Se a página deve aparecer na navegação sem JavaScript, inclua-a também na
   lista do `<noscript>` — essa lista é escrita à mão em cada página.
7. Confira: um só `h1`, `alt` em todas as imagens, `loading="lazy"` fora da
   primeira dobra, navegação só pelo teclado, e as três larguras de tela
   (360 px, 768 px, 1280 px).

## Convenções de conteúdo

- Textos em português, com acentuação correta. Entidades HTML para travessão
  (`&ndash;`, `&mdash;`) e ponto médio (`&middot;`), como no restante do site.
- Imagens: sempre `.webp`, sempre com `alt` (vazio quando puramente
  decorativa), `width`/`height` explícitos, `decoding="async"` e
  `loading="lazy"` fora da primeira dobra.
- Ícones decorativos recebem `aria-hidden="true"`.
- Títulos de seção usam `.titulo-secao titulo-secao--linha`; o rótulo acima
  deles é `.sobretitulo`.
- Nada de `style=""` inline, com uma exceção já presente no projeto
  (`justify-content: center` no grupo de botões das páginas "em preparação").
  Ao repetir um ajuste desses, prefira criar a classe em `componentes.css`.
