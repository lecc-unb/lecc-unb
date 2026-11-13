/* =========================================================
   LECC - UnB  |  global.js
   Navegacao (menu mobile e dropdowns acessiveis) e os filtros
   de busca das paginas de livros e jogos.

   Depende do header injetado por layout.js, por isso roda
   depois dele (ordem das tags <script> no fim do <body>).
   ========================================================= */
(function () {
    'use strict';

    /* =====================================================
       Utilitario de texto: remove acentos para que a busca
       por "generica" tambem encontre "Genética".
       ===================================================== */
    function normalizar(texto) {
        return String(texto)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, '')
            .trim();
    }

    /* =====================================================
       Navegacao
       ===================================================== */
    function iniciarNavegacao() {
        var btnMenu = document.getElementById('btn-menu');
        var nav = document.getElementById('nav-principal');
        var sobreposicao = document.getElementById('sobreposicao-menu');
        var botoesDrop = Array.prototype.slice.call(
            document.querySelectorAll('.dropdown-btn')
        );

        /* ---- Dropdowns ---- */
        function fecharDropdowns(exceto) {
            botoesDrop.forEach(function (btn) {
                if (btn === exceto) {
                    return;
                }
                btn.setAttribute('aria-expanded', 'false');
                var painel = document.getElementById(btn.getAttribute('aria-controls'));
                if (painel) {
                    painel.classList.remove('show');
                }
            });
        }

        function alternarDropdown(btn) {
            var painel = document.getElementById(btn.getAttribute('aria-controls'));
            if (!painel) {
                return;
            }
            var aberto = btn.getAttribute('aria-expanded') === 'true';
            fecharDropdowns(btn);
            btn.setAttribute('aria-expanded', aberto ? 'false' : 'true');
            painel.classList.toggle('show', !aberto);
        }

        botoesDrop.forEach(function (btn) {
            btn.addEventListener('click', function (evento) {
                evento.stopPropagation();
                alternarDropdown(btn);
            });
        });

        /* ---- Menu mobile ---- */
        function menuAberto() {
            return !!btnMenu && btnMenu.getAttribute('aria-expanded') === 'true';
        }

        function definirMenu(aberto) {
            if (!btnMenu || !nav) {
                return;
            }
            btnMenu.setAttribute('aria-expanded', aberto ? 'true' : 'false');
            btnMenu.setAttribute(
                'aria-label',
                aberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação'
            );
            nav.classList.toggle('aberto', aberto);

            if (sobreposicao) {
                sobreposicao.hidden = !aberto;
                sobreposicao.classList.toggle('visivel', aberto);
            }
            if (!aberto) {
                fecharDropdowns(null);
            }
        }

        if (btnMenu) {
            btnMenu.addEventListener('click', function (evento) {
                evento.stopPropagation();
                definirMenu(!menuAberto());
            });
        }

        if (sobreposicao) {
            sobreposicao.addEventListener('click', function () {
                definirMenu(false);
            });
        }

        /* ---- Fechar clicando fora ---- */
        document.addEventListener('click', function (evento) {
            if (!evento.target.closest('.dropdown')) {
                fecharDropdowns(null);
            }
            if (menuAberto() && !evento.target.closest('.header-principal')) {
                definirMenu(false);
            }
        });

        /* ---- Fechar com Esc, devolvendo o foco ---- */
        document.addEventListener('keydown', function (evento) {
            if (evento.key !== 'Escape') {
                return;
            }
            var abertoAlgum = botoesDrop.some(function (btn) {
                return btn.getAttribute('aria-expanded') === 'true';
            });

            if (abertoAlgum) {
                botoesDrop.forEach(function (btn) {
                    if (btn.getAttribute('aria-expanded') === 'true') {
                        btn.focus();
                    }
                });
                fecharDropdowns(null);
            } else if (menuAberto()) {
                definirMenu(false);
                btnMenu.focus();
            }
        });

        /* Ao voltar para o desktop, desfaz o estado do menu mobile */
        var mq = window.matchMedia('(min-width: 900px)');
        var aoMudar = function (evento) {
            if (evento.matches) {
                definirMenu(false);
            }
        };
        if (typeof mq.addEventListener === 'function') {
            mq.addEventListener('change', aoMudar);
        } else if (typeof mq.addListener === 'function') {
            mq.addListener(aoMudar);
        }
    }

    /* =====================================================
       Busca de livros
       ===================================================== */
    function iniciarBuscaLivros() {
        var campo = document.getElementById('input-pesquisa');
        var grade = document.querySelector('.grid-livros');
        if (!campo || !grade) {
            return;
        }

        var cards = Array.prototype.slice.call(grade.querySelectorAll('.card-livro'));
        var aviso = document.getElementById('aviso-sem-livros');

        campo.addEventListener('input', function () {
            var termo = normalizar(campo.value);
            var visiveis = 0;

            cards.forEach(function (card) {
                var texto = normalizar(card.textContent);
                var combina = termo === '' || texto.indexOf(termo) !== -1;
                card.hidden = !combina;
                if (combina) {
                    visiveis += 1;
                }
            });

            if (aviso) {
                aviso.hidden = visiveis > 0;
            }
        });
    }

    /* =====================================================
       Busca e filtro por area na pagina de jogos
       ===================================================== */
    function iniciarFiltroJogos() {
        var campo = document.getElementById('input-jogos');
        var chips = Array.prototype.slice.call(document.querySelectorAll('.chip-filtro'));
        var grupos = Array.prototype.slice.call(document.querySelectorAll('.grupo-area'));
        if (!grupos.length) {
            return;
        }

        var aviso = document.getElementById('aviso-sem-jogos');
        var areaAtiva = 'todas';

        function aplicar() {
            var termo = campo ? normalizar(campo.value) : '';
            var totalVisivel = 0;

            grupos.forEach(function (grupo) {
                var daArea = areaAtiva === 'todas' || grupo.dataset.area === areaAtiva;
                var cards = Array.prototype.slice.call(grupo.querySelectorAll('.card-jogo'));
                var visiveisNoGrupo = 0;

                cards.forEach(function (card) {
                    var combina = daArea &&
                        (termo === '' || normalizar(card.textContent).indexOf(termo) !== -1);
                    card.hidden = !combina;
                    if (combina) {
                        visiveisNoGrupo += 1;
                    }
                });

                grupo.hidden = visiveisNoGrupo === 0;
                totalVisivel += visiveisNoGrupo;

                var contagem = grupo.querySelector('.contagem-area');
                if (contagem) {
                    contagem.textContent = visiveisNoGrupo === 1
                        ? '1 jogo'
                        : visiveisNoGrupo + ' jogos';
                }
            });

            if (aviso) {
                aviso.hidden = totalVisivel > 0;
            }
        }

        if (campo) {
            campo.addEventListener('input', aplicar);
        }

        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                areaAtiva = chip.dataset.area || 'todas';
                chips.forEach(function (outro) {
                    outro.setAttribute('aria-pressed', String(outro === chip));
                });
                aplicar();
            });
        });

        aplicar();
    }

    /* ---------- Inicializacao ---------- */
    iniciarNavegacao();
    iniciarBuscaLivros();
    iniciarFiltroJogos();
})();
