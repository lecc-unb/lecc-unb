# Documentação do site do LECC

Esta pasta descreve **como o site é construído por dentro**: as camadas, os
contratos entre elas e o porquê de cada decisão. O
[`README.md`](../README.md) da raiz continua sendo o guia de uso rápido
(rodar localmente, adicionar um jogo, publicar); aqui está a parte que explica
o desenho do projeto para quem vai mantê-lo ou mudá-lo.

## Por onde começar

| Documento | O que responde |
| --- | --- |
| [arquitetura.md](arquitetura.md) | Visão geral, camadas, ordem de carregamento, mapa de dependências |
| [paginas.md](paginas.md) | Anatomia de uma página, os três tipos de página, checklist para criar uma nova |
| [css.md](css.md) | Design system: tokens, divisão entre `global.css` e `componentes.css`, breakpoints |
| [javascript.md](javascript.md) | Os três scripts, o que cada um controla e os contratos de DOM que eles esperam |
| [assets.md](assets.md) | Pipeline de imagens, convenção de nomes, por que WebP |
| [publicacao.md](publicacao.md) | GitHub Pages, SEO, `404.html`, checklist antes de publicar |
| [decisoes.md](decisoes.md) | Registro das decisões de arquitetura e das suas consequências |
| [limitacoes.md](limitacoes.md) | O que hoje é frágil ou manual, e o que fazer a respeito |

## Resumo em um parágrafo

Site institucional estático, em português, sem framework e sem etapa de build:
HTML, CSS e JavaScript escritos à mão e servidos como arquivos pelo GitHub
Pages. Cada página é um arquivo HTML completo que carrega duas folhas de estilo
e três scripts; o cabeçalho e o rodapé não são escritos nas páginas, e sim
montados em tempo de execução por [`js/layout.js`](../js/layout.js), que é a
fonte única da navegação. Não há dados dinâmicos: o acervo (jogos, livros,
modelos, equipe) é marcação HTML, e as buscas e filtros são feitos no navegador
sobre os elementos já presentes na página.
