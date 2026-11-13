# Site LECC - UnB

Site institucional do **Laboratório de Ensino de Ciências e Cultura (LECC)**, do
NECBio / Instituto de Ciências Biológicas da Universidade de Brasília, Campus
Darcy Ribeiro (DF).

🔗 **No ar:** <https://lecc-unb.github.io/lecc-unb/>

Site estático, sem framework e sem etapa de build: HTML, CSS e JavaScript puros,
hospedado no GitHub Pages.

---

## Como rodar localmente

Abrir os arquivos direto pelo `file://` funciona, mas é melhor usar um servidor
para que os caminhos se comportem como no GitHub Pages:

```bash
python -m http.server 8000
```

Depois acesse <http://localhost:8000>.

---

## Estrutura

```
.
├── index.html              Página inicial
├── 404.html                Página de erro (autossuficiente, veja a nota abaixo)
├── .nojekyll               Impede o GitHub Pages de processar o site com Jekyll
├── robots.txt, sitemap.xml
├── css/
│   ├── global.css          Tokens (cores, espaçamento, tipografia), reset, layout
│   └── componentes.css     Header, menu, cards, sliders, rodapé e seções
├── js/
│   ├── layout.js           Monta o header e o rodapé  ← fonte única do menu
│   ├── global.js           Menu mobile, dropdowns e as buscas
│   └── animacoes.js        Carrossel 3D e sliders de cards
├── pages/                  Demais páginas
└── assets/
    ├── icons/              Logo e ícones
    ├── equipe/             Fotos da equipe
    ├── imagens-jogos/      Jogos, uma subpasta por área
    ├── imagens-lab/        Fotos do laboratório
    ├── imagens-modelos/    Modelos didáticos
    └── livros/             Capas dos livros
```

---

## Tarefas comuns

### Mudar algo no menu ou no rodapé

Edite **apenas** [`js/layout.js`](js/layout.js). O header e o rodapé são montados
ali e injetados em todas as páginas, nos marcadores `<div id="site-header">` e
`<div id="site-footer">`. Não existe HTML de menu duplicado nas páginas.

Para acrescentar um item, inclua uma entrada na constante `MENU`:

```js
{ rotulo: 'Nova Página', href: 'pages/nova-pagina.html' }
```

O `href` é sempre escrito **relativo à raiz do site**; o prefixo `../` das
páginas dentro de `pages/` é calculado automaticamente.

### Criar uma página nova

Copie uma página de `pages/` que já exista (por exemplo `noite-jogos.html`),
troque `<title>`, `meta description`, `og:*` e `canonical`, escreva o conteúdo
dentro de `<main id="conteudo">` e registre a página no `MENU` do `layout.js` e
no `sitemap.xml`.

### Adicionar um jogo, um livro ou um integrante

1. Coloque a imagem na pasta correspondente em `assets/`, seguindo a convenção de
   nomes (veja abaixo).
2. Rode `python scripts/otimizar-imagens.py` para gerar o `.webp`.
3. Duplique um `<article>` existente na página e ajuste imagem, título e texto.

Em `pages/jogos.html` cada área é uma `<section class="grupo-area" data-area="…">`.
Para criar uma área nova, acrescente também um `<button class="chip-filtro"
data-area="…">` na lista de filtros — a busca e a contagem se ajustam sozinhas.

---

## Imagens

As imagens do site são servidas em **WebP**. O script converte, redimensiona e
**substitui** os originais, então guarde os arquivos em alta resolução fora do
repositório antes de rodá-lo:

```bash
pip install Pillow
python scripts/otimizar-imagens.py --dry-run   # mostra o que faria
python scripts/otimizar-imagens.py             # converte de verdade
```

Largura máxima por pasta (definida em `LARGURAS`, dentro do script):

| Pasta              | Largura |
| ------------------ | ------- |
| `icons/`           | 256 px  |
| `equipe/`          | 400 px  |
| `imagens-jogos/`   | 600 px  |
| `livros/`          | 600 px  |
| `imagens-modelos/` | 900 px  |
| `imagens-lab/`     | 1400 px |

### Convenção de nomes

**Somente ASCII, em minúsculas, com hífen** — sem acento, espaço, `+` ou
maiúsculas. O GitHub Pages diferencia maiúsculas de minúsculas (o Windows não),
então um arquivo salvo como `Foto.jpg` e referenciado como `foto.jpg` funciona na
sua máquina e dá erro 404 no site publicado.

```
bom:  jogo-da-memoria-celular.webp
ruim: Jogo da Memória +Celular.JPG
```

---

## Acessibilidade e decisões de interface

- Um único `<h1>` por página, com hierarquia de títulos coerente.
- Menu operável por teclado: `Tab`, `Enter`/`Espaço` para abrir e `Esc` para
  fechar; `aria-expanded`, `aria-controls` e `aria-current="page"` em dia.
- Link "pular para o conteúdo" no início de cada página.
- Todas as imagens têm `alt` (vazio quando são decorativas) e `loading="lazy"`
  fora da primeira dobra.
- Nenhuma animação roda quando o sistema pede
  `prefers-reduced-motion: reduce`; o carrossel também pausa no hover e no foco.
- Alvos de toque com no mínimo 44 px.

### Por que o header é montado por JavaScript

O GitHub Pages serve apenas arquivos estáticos e não tem includes de servidor.
Montar o header em `layout.js` evita repetir o mesmo bloco em 12 páginas, que era
o estado anterior do projeto. Cada página mantém um `<noscript>` com os links
essenciais para quem navega sem JavaScript.

### Por que o `404.html` tem CSS embutido

O GitHub Pages responde com `404.html` em qualquer endereço inexistente, de
qualquer profundidade. Se ele usasse `css/global.css`, um erro em
`/pages/algo-inexistente` tentaria carregar `/pages/css/global.css` e a página
apareceria sem estilo. Por isso ela é autossuficiente.

---

## Publicação

O site é publicado pelo GitHub Pages a partir da branch `main`, pasta raiz
(**Settings → Pages**). Todo push para `main` republica o site.

Antes de publicar, vale conferir:

- nenhum link ou imagem quebrada (atenção às maiúsculas nos nomes de arquivo);
- as páginas abrindo em 360 px, 768 px e 1280 px de largura;
- navegação apenas pelo teclado;
- Lighthouse em modo mobile.

---

## Créditos

Site por Beatriz Flores, Amanda Lima e Artur Stange.
Texto de idealização do laboratório por Mariana Zancul.

Licença: veja [LICENSE](LICENSE).
