# Publicação e entrega

## Como o site vai ao ar

GitHub Pages, a partir da branch `main`, pasta raiz (**Settings → Pages**).
Não há GitHub Actions, workflow de build nem passo de deploy: **todo push para
`main` republica o site**, normalmente em menos de um minuto.

URL de produção: <https://lecc-unb.github.io/lecc-unb/>

Não existe ambiente de homologação. O equivalente é rodar o site localmente:

```bash
python -m http.server 8000
```

e acessar <http://localhost:8000>. Abrir os arquivos por `file://` funciona
para conferir texto, mas o servidor local reproduz melhor o comportamento dos
caminhos no GitHub Pages.

## Os arquivos de infraestrutura

| Arquivo | Função |
| --- | --- |
| `.nojekyll` | Impede o GitHub Pages de processar o site com Jekyll. Sem ele, pastas e arquivos iniciados por `_` são ignorados e o processamento adiciona latência sem nenhum ganho — não há nada de Jekyll aqui. |
| `robots.txt` | Libera a indexação (`Allow: /`) e aponta o `sitemap.xml` absoluto. |
| `sitemap.xml` | 11 URLs com `lastmod` e `priority`, mantido à mão. A home tem prioridade 1.0; `acervo` e `jogos`, 0.9; as páginas "em preparação", 0.4. |

## Caminhos relativos: a regra que não se quebra

O site de projeto do GitHub Pages fica em `usuario.github.io/repositorio/`, e
não na raiz do domínio. Por isso:

- **Nenhum caminho começa com `/`.** `/css/global.css` apontaria para
  `lecc-unb.github.io/css/global.css`, que não existe.
- Páginas em `pages/` usam `../` para chegar a `css/`, `js/` e `assets/`.
- Em `layout.js`, os `href` do menu são escritos relativos à raiz do site e o
  `../` é calculado por `prefixo()`.
- Nas URLs **absolutas** dos metadados (`og:url`, `canonical`, `og:image`) o
  domínio e o nome do repositório aparecem inteiros. São as únicas URLs
  absolutas do projeto e precisam ser revisadas se o repositório for renomeado
  ou o site ganhar domínio próprio.

O `404.html` resolve o mesmo problema em tempo de execução, descobrindo a raiz
pelo `window.location` — ver [paginas.md](paginas.md#a-página-de-erro-404html).

## SEO e compartilhamento

Cada página declara: `title`, `meta description`, `og:type`, `og:title`,
`og:description`, `og:image`, `og:url`, `og:locale` e `canonical`. O
`og:image` é sempre o logo do LECC. Ao criar uma página, esses campos são a
parte mais fácil de esquecer e a mais visível quando o link é colado no
WhatsApp ou no Instagram.

## Desempenho

O que o site faz por isso, hoje:

- Nenhum JavaScript de terceiros; ~30 KB de CSS e JS próprios, sem minificação
  (a legibilidade do código venceu, dado o tamanho).
- Imagens em WebP, redimensionadas por categoria, com `width`/`height`
  declarados e `loading="lazy"` fora da primeira dobra.
- `preconnect` para `fonts.googleapis.com` e `fonts.gstatic.com`, e
  `display=swap` na fonte — o texto aparece antes de a fonte chegar.
- A primeira imagem do carrossel usa `fetchpriority="high"`.
- O carrossel para quando a aba vai para segundo plano.

Ponto fraco conhecido: as fontes vêm do Google Fonts, uma requisição externa
bloqueante no `<head>`. Hospedá-las localmente eliminaria essa dependência.

## Checklist antes de publicar

- [ ] Nenhum link ou imagem quebrada — atenção especial a maiúsculas em nomes
      de arquivo, que falham só no site publicado.
- [ ] Páginas abrindo bem em 360 px, 768 px e 1280 px de largura.
- [ ] Navegação completa só pelo teclado: `Tab`, `Enter`/`Espaço` nos
      dropdowns, `Esc` para fechar, link de salto funcionando.
- [ ] Página nova registrada no `MENU` de `layout.js` **e** no `sitemap.xml`.
- [ ] `lastmod` do `sitemap.xml` atualizado nas URLs que mudaram.
- [ ] Lighthouse em modo mobile, se a mudança mexeu em imagem ou script.
