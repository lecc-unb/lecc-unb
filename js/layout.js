/* =========================================================
   LECC - UnB  |  layout.js
   Fonte unica do header e do rodape.

   O GitHub Pages serve apenas arquivos estaticos, sem includes
   de servidor. Em vez de repetir o mesmo cabecalho em 11 paginas,
   ele e montado aqui e injetado nos marcadores:

       <div id="site-header"></div>
       <div id="site-footer"></div>

   Para alterar o menu, mexa somente em MENU, abaixo.

   Os caminhos sao relativos (nunca comecam com "/") porque no
   GitHub Pages o site fica em usuario.github.io/repositorio/.
   O prefixo "../" e calculado conforme a profundidade da pagina.
   ========================================================= */
(function () {
    'use strict';

    var EMAIL = 'lecunb.necbio@gmail.com';
    var INSTAGRAM = 'https://www.instagram.com/lecc.unb/';
    var NECBIO = 'https://necbio.unb.br/';

    /* Estrutura do menu. "href" e sempre relativo a raiz do site. */
    var MENU = [
        { rotulo: 'Início', href: 'index.html' },
        {
            rotulo: 'Acervo',
            id: 'drop-acervo',
            itens: [
                { rotulo: 'Como Funciona?', href: 'pages/acervo.html' },
                { rotulo: 'Jogos', href: 'pages/jogos.html' },
                { rotulo: 'Livros', href: 'pages/livros.html' },
                { rotulo: 'Modelos Didáticos', href: 'pages/modelos-didaticos.html' },
                { rotulo: 'Propostas Didáticas', href: 'pages/propostas-didaticas.html' }
            ]
        },
        {
            rotulo: 'Ações',
            id: 'drop-acoes',
            itens: [
                { rotulo: 'Noite de Jogos', href: 'pages/noite-jogos.html' },
                { rotulo: 'Leituras LECC', href: 'pages/leituras-lecc.html' },
                { rotulo: 'Projetos de Extensão', href: 'pages/projetos-extensao.html' }
            ]
        },
        { rotulo: 'O LECC', href: 'pages/o-lecc.html' },
        { rotulo: 'Nossa Equipe', href: 'pages/equipe.html' }
    ];

    /* ---------- Caminhos ---------- */

    /* "" na raiz, "../" dentro de pages/ */
    function prefixo() {
        return /\/pages\//.test(window.location.pathname) ? '../' : '';
    }

    /* Nome do arquivo da pagina atual; a raiz do site conta como index.html */
    function paginaAtual() {
        var arquivo = window.location.pathname.split('/').pop();
        return arquivo && arquivo !== '' ? arquivo : 'index.html';
    }

    function ehAtual(href) {
        return href.split('/').pop() === paginaAtual();
    }

    function escapar(texto) {
        return String(texto)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    /* ---------- Header ---------- */

    function montarHeader() {
        var p = prefixo();
        var itensHtml = '';
        var temAtivoNoDrop;

        MENU.forEach(function (entrada, indice) {
            if (entrada.itens) {
                temAtivoNoDrop = entrada.itens.some(function (sub) {
                    return ehAtual(sub.href);
                });

                var subHtml = entrada.itens.map(function (sub) {
                    return '<li><a href="' + p + sub.href + '"' +
                        (ehAtual(sub.href) ? ' aria-current="page"' : '') +
                        '>' + escapar(sub.rotulo) + '</a></li>';
                }).join('');

                itensHtml +=
                    '<li class="dropdown">' +
                        '<button type="button" class="dropdown-btn" id="btn-' + entrada.id + '"' +
                            ' aria-expanded="false" aria-haspopup="true"' +
                            ' aria-controls="' + entrada.id + '"' +
                            (temAtivoNoDrop ? ' data-ativo="true"' : '') + '>' +
                            escapar(entrada.rotulo) +
                            '<span class="seta-drop" aria-hidden="true"></span>' +
                        '</button>' +
                        '<ul class="dropdown-content" id="' + entrada.id + '">' + subHtml + '</ul>' +
                    '</li>';
            } else {
                itensHtml +=
                    '<li><a href="' + p + entrada.href + '" class="nav-link"' +
                        (ehAtual(entrada.href) ? ' aria-current="page"' : '') +
                        '>' + escapar(entrada.rotulo) + '</a></li>';
            }
            void indice;
        });

        return '' +
        '<a class="pular-para-conteudo" href="#conteudo">Pular para o conteúdo</a>' +

        '<section class="topbar-apoiadores">' +
            '<p>Apoiadores do Laboratório: <strong>DEG/DEX &ndash; Licenciaturas em Movimento em Rede</strong> &middot; <strong>UnB</strong></p>' +
        '</section>' +

        '<header class="header-principal">' +
            '<div class="header-wrapper">' +
                '<a href="' + p + 'index.html" class="logo-lecc" aria-label="LECC - página inicial">' +
                    '<img src="' + p + 'assets/icons/icon-lecc.webp" alt="Logo do LECC" class="logo-img" width="256" height="144">' +
                '</a>' +

                '<button type="button" class="btn-menu" id="btn-menu"' +
                    ' aria-expanded="false" aria-controls="nav-principal"' +
                    ' aria-label="Abrir menu de navegação">' +
                    '<span aria-hidden="true"></span>' +
                    '<span aria-hidden="true"></span>' +
                    '<span aria-hidden="true"></span>' +
                '</button>' +

                '<nav class="nav-principal" id="nav-principal" aria-label="Navegação principal">' +
                    '<ul class="nav-menu">' + itensHtml + '</ul>' +
                '</nav>' +
            '</div>' +
        '</header>' +

        '<div class="sobreposicao-menu" id="sobreposicao-menu" hidden></div>';
    }

    /* ---------- Rodape ---------- */

    function montarFooter() {
        var p = prefixo();

        var linksRapidos = [
            { rotulo: 'Como funciona o acervo', href: 'pages/acervo.html' },
            { rotulo: 'Jogos', href: 'pages/jogos.html' },
            { rotulo: 'Livros', href: 'pages/livros.html' },
            { rotulo: 'O LECC', href: 'pages/o-lecc.html' },
            { rotulo: 'Nossa equipe', href: 'pages/equipe.html' }
        ].map(function (item) {
            return '<li><a href="' + p + item.href + '">' + escapar(item.rotulo) + '</a></li>';
        }).join('');

        return '' +
        '<footer class="rodape-principal">' +
            '<div class="rodape-container">' +
                '<div class="rodape-info">' +
                    '<h2>Laboratório de Ensino de Ciências e Cultura</h2>' +
                    '<p>NECBio &ndash; Instituto de Ciências Biológicas<br>' +
                       'Universidade de Brasília (UnB), Campus Darcy Ribeiro &ndash; DF</p>' +
                    '<a class="rodape-contato" href="mailto:' + EMAIL + '">' + EMAIL + '</a>' +

                    '<div class="rodape-icones">' +
                        '<a href="mailto:' + EMAIL + '" class="icone-link" aria-label="Enviar e-mail para o LECC">' +
                            '<img src="' + p + 'assets/icons/email-icon.webp" alt="" width="22" height="22">' +
                        '</a>' +
                        '<a href="' + INSTAGRAM + '" class="icone-link" aria-label="Instagram do LECC"' +
                            ' target="_blank" rel="noopener">' +
                            '<img src="' + p + 'assets/icons/insta-icon.webp" alt="" width="22" height="22">' +
                        '</a>' +
                        '<a href="' + NECBIO + '" class="icone-link" aria-label="Site do NECBio"' +
                            ' target="_blank" rel="noopener">' +
                            '<img src="' + p + 'assets/icons/icon-ecbio-unb.webp" alt="" width="22" height="22">' +
                        '</a>' +
                    '</div>' +
                '</div>' +

                '<nav class="rodape-links" aria-label="Links do rodapé">' +
                    '<h2>Navegação</h2>' +
                    '<ul>' + linksRapidos + '</ul>' +
                '</nav>' +
            '</div>' +

            '<div class="rodape-base">' +
                '<span>&copy; ' + new Date().getFullYear() + ' LECC &ndash; UnB. Todos os direitos reservados.</span>' +
                '<span>Site por Beatriz Flores, Amanda Lima e Artur Stange</span>' +
            '</div>' +
        '</footer>';
    }

    /* ---------- Injecao ---------- */

    /* Substitui o marcador pelo HTML montado. O script e carregado logo
       abaixo do marcador do header, de modo que o cabecalho aparece antes
       do resto da pagina ser desenhado (sem salto visual). O marcador do
       rodape ainda nao existe nesse momento, entao fica para o
       DOMContentLoaded. */
    function injetar(id, montar) {
        var alvo = document.getElementById(id);
        if (alvo) {
            alvo.outerHTML = montar();
            return true;
        }
        return false;
    }

    function injetarQuandoPossivel(id, montar) {
        if (!injetar(id, montar)) {
            document.addEventListener('DOMContentLoaded', function () {
                injetar(id, montar);
            });
        }
    }

    injetarQuandoPossivel('site-header', montarHeader);
    injetarQuandoPossivel('site-footer', montarFooter);
})();
