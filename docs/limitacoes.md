# Limitações conhecidas

O que hoje é frágil, manual ou duplicado. Nada aqui está quebrado — são pontos
em que a arquitetura cobra seu preço, listados para que ninguém os descubra na
hora errada.

## Duplicações que precisam ser mantidas à mão

| O que | Onde | Risco |
| --- | --- | --- |
| Lista de links do `<noscript>` | repetida nas 12 páginas | Não vem do `MENU`. Um item novo no menu não aparece aqui, e a lista pode divergir entre páginas sem que nada acuse. |
| Metadados do `<head>` | 12 páginas | `og:type`, `og:image`, `og:locale`, fontes e folhas de estilo são idênticos; mudar qualquer um exige 12 edições. |
| Tokens de cor | `css/global.css` e `<style>` do `404.html` | Trocar a paleta sem atualizar o `404.html` deixa a página de erro com as cores antigas. |
| URLs absolutas | `og:url` e `canonical` de cada página, `robots.txt`, `sitemap.xml` | Renomear o repositório ou adotar domínio próprio exige revisar todos. |
| `sitemap.xml` | mantido à mão | Uma página nova fica fora do sitemap se o passo for esquecido. Todos os `lastmod` estão hoje em `2026-11-13`, mesmo para páginas editadas depois. |
| Contagem de jogos por área | `<span class="contagem-area">8 jogos</span>` no HTML | O `global.js` recalcula na carga, então o número visível está sempre certo. Sem JavaScript, fica o valor escrito — que envelhece. |

Por que não resolver com JavaScript: o `<noscript>` é, por definição, o caminho
de quem não tem JS; e os metadados precisam estar no HTML servido para que
buscadores e redes sociais os leiam.

## Pontos frágeis do código

- **`prefixo()` reconhece só duas profundidades.** Em
  [`layout.js`](../js/layout.js), o prefixo é `'../'` se a URL contém `/pages/`
  e `''` caso contrário. Uma terceira camada (`pages/acervo/jogos.html`)
  geraria caminhos errados.
- **`ehAtual()` compara apenas o nome do arquivo.** Dois arquivos com o mesmo
  nome em pastas diferentes seriam marcados como "página atual" ao mesmo tempo.
- **A ordem das tags `<script>` é um contrato implícito.** Mover `layout.js`
  para o `<head>` com `defer`, ou `global.js` para antes dele, desliga o menu
  sem gerar erro no console.
- **Renomear um gancho de DOM quebra o JS em silêncio.** Todas as rotinas
  retornam cedo quando não acham seus elementos — ótimo para páginas sem
  carrossel, ruim para erros de digitação: a busca simplesmente não funciona,
  sem aviso. A tabela de ganchos está em
  [javascript.md](javascript.md#contrato-de-dom).
- **O link do Instagram aponta para uma publicação, não para o perfil.** Há um
  `TODO` no topo de `layout.js`; a URL original foi mantida de propósito
  (commit `d359088`), para não inventar um endereço de perfil.
- **O `404.html` assume GitHub Pages.** O script detecta a raiz pelo sufixo
  `.github.io` do hostname. Em domínio próprio ele cai no fallback `'/'`, que é
  correto para domínio na raiz, mas não para um site servido em subpasta.

## Dependências externas

- **Google Fonts.** Playfair Display e Quicksand vêm de
  `fonts.googleapis.com`, uma folha de estilo externa e bloqueante no `<head>`.
  Há `preconnect` e `display=swap`, mas a página ainda depende de um terceiro
  para renderizar como foi desenhada — e isso implica uma requisição do
  visitante a um domínio do Google. Hospedar as fontes em `assets/` removeria
  as duas questões.

## Processo

- **Não há testes nem linting.** Nenhum HTML validator, nenhum verificador de
  links, nenhum ESLint ou Stylelint — e nenhuma GitHub Action. A verificação é
  o checklist manual de [publicacao.md](publicacao.md#checklist-antes-de-publicar).
  Um workflow que rodasse um verificador de links a cada push pegaria a classe
  de erro mais provável do projeto (caminho de imagem com maiúscula, link para
  página renomeada).
- **Não há ambiente de homologação.** Push em `main` é publicação. Mudanças
  maiores merecem uma branch e uma conferência local antes do merge.
- **O script de imagens é irreversível** e apaga os originais. Ver
  [assets.md](assets.md#o-script-de-otimização).

## Limites de escala

- `pages/jogos.html` tem 433 linhas e 60 imagens (todas com `loading="lazy"`).
  O padrão aguenta mais algumas dezenas de itens; passando disso, a página fica
  difícil de editar à mão e vale considerar uma camada de dados — o que
  contraria [D7](decisoes.md#d7--acervo-como-marcação-sem-dados-estruturados) e
  provavelmente exigiria rever [D1](decisoes.md#d1--site-estático-sem-framework-e-sem-build).
- `css/componentes.css` tem 1200 linhas em um arquivo só. Ainda navegável pelos
  comentários de seção, mas é o próximo candidato natural a ser dividido.
- Nenhum recurso exige servidor hoje. Empréstimo online, formulário de reserva
  ou área de login sairiam do que o GitHub Pages consegue entregar.
