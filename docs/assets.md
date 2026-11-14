# Imagens e assets

As imagens são o maior peso do site: 93 arquivos, cerca de 4,7 MB, contra
~30 KB de CSS e JS somados. Por isso elas têm um pipeline próprio.

## Estado atual

| Pasta | Arquivos | Tamanho | Largura máxima | Onde aparece |
| --- | --- | --- | --- | --- |
| `assets/icons/` | 7 | 80 KB | 256 px | logo, ícones de rodapé |
| `assets/equipe/` | 9 | 216 KB | 400 px | fotos circulares em `equipe.html` |
| `assets/imagens-jogos/` | 60 | 3,2 MB | 600 px | cards de `jogos.html`, 7 subpastas |
| `assets/imagens-lab/` | 5 | 948 KB | 1400 px | carrossel da home, imagens largas |
| `assets/imagens-modelos/` | 5 | 92 KB | 900 px | slider de modelos |
| `assets/livros/` | 6 | 160 KB | 600 px | capas em `livros.html` |

Todos os arquivos estão em **WebP**. Nenhum JPG ou PNG permanece no
repositório: o commit `d89ca31` converteu o acervo e levou a pasta de 52 MB
para 4,4 MB.

As subpastas de `imagens-jogos/` têm os mesmos nomes dos valores de `data-area`
em `pages/jogos.html`: `zoologia`, `ecologia`, `botanica`,
`geneticaeevolucao`, `saudeeanatomia`, `citologia`, `outrasciencias`. Manter
essa correspondência é o que torna óbvio onde cada imagem mora.

## O script de otimização

[`scripts/otimizar-imagens.py`](../scripts/otimizar-imagens.py) — único código
Python do projeto, única dependência de desenvolvimento (`pip install Pillow`).

```bash
python scripts/otimizar-imagens.py --dry-run   # lista o que faria
python scripts/otimizar-imagens.py             # converte de verdade
```

O que ele faz, para cada `.jpg`, `.jpeg` ou `.png` encontrado em `assets/`
(recursivamente):

1. Decide a largura máxima pela **primeira pasta** sob `assets/`, usando o
   dicionário `LARGURAS` (padrão de 900 px para pastas não listadas).
2. Aplica a rotação gravada no EXIF (`ImageOps.exif_transpose`). Fotos de
   celular saem do aparelho "deitadas" com uma tag de orientação; o WebP não
   leva essa tag, então sem esse passo a foto aparece girada no site. Foi o
   que aconteceu com as 5 fotos de `imagens-modelos/` na primeira conversão.
3. Detecta transparência real — e não apenas `img.info["transparency"]`, que só
   existe em PNG de paleta. O comentário no código registra o bug que isso
   corrigiu: checar só o `info` descartava o canal alfa e os ícones viravam um
   retângulo preto sobre o header escuro.
4. Descarta o canal alfa quando ele é totalmente opaco (só ocuparia espaço).
5. Redimensiona com LANCZOS se a imagem for mais larga que o limite.
6. Salva em WebP com `quality=82`, `method=6`.
7. **Apaga o original** e imprime a economia; ao final, o total.

Os passos 6 e 7 são o ponto de atenção: o script é destrutivo. Guarde os
arquivos em alta resolução **fora do repositório** antes de rodá-lo. Uma falha
em um arquivo é reportada e não interrompe os demais.

Rodar o script de novo depois de converter tudo é inofensivo: sem JPG ou PNG em
`assets/`, ele apenas informa que não há nada a converter.

## Convenção de nomes

**Somente ASCII, minúsculas, com hífen** — sem acento, espaço, `+` ou
maiúsculas.

```
bom:  jogo-da-memoria-celular.webp
ruim: Jogo da Memória +Celular.JPG
```

O motivo é concreto: o GitHub Pages diferencia maiúsculas de minúsculas e o
Windows não. Um arquivo salvo como `Foto.webp` e referenciado como `foto.webp`
funciona na máquina de quem editou e dá 404 no site publicado — um erro que só
aparece depois do deploy. O commit `83fc32c` existe por causa disso.

Parte do acervo ainda usa nomes concatenados sem hífen
(`jogodamemoriacelular.webp`), herdados do site antigo. São válidos; o hífen é
a convenção para o que entrar de agora em diante.

## Ao adicionar uma imagem

1. Coloque o arquivo na pasta certa de `assets/`, com nome em ASCII minúsculo.
2. Rode `python scripts/otimizar-imagens.py` para gerar o `.webp` no tamanho
   adequado.
3. Duplique um `<article>` existente na página e ajuste `src`, `alt`, título e
   texto.
4. Mantenha `width`, `height`, `decoding="async"` e `loading="lazy"` (exceto na
   primeira imagem visível da home).
