/* =========================================================
   LECC - UnB  |  animacoes.js
   Carrossel 3D da home e os sliders horizontais de cards.

   Tudo e inicializado apenas quando os elementos existem na
   pagina, e nada se move quando o visitante pediu menos
   animacao no sistema (prefers-reduced-motion).
   ========================================================= */
(function () {
    'use strict';

    var menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');

    /* =====================================================
       Carrossel 3D
       ===================================================== */
    function iniciarCarrossel3d() {
        var container = document.querySelector('.carrossel-container');
        if (!container) {
            return;
        }

        var imagens = Array.prototype.slice.call(container.querySelectorAll('.imagem-3d'));
        if (imagens.length < 2) {
            return;
        }

        var classes = ['ativa', 'proxima', 'anterior'];
        var posicoes = imagens.map(function (_, i) {
            return i % classes.length;
        });
        var INTERVALO = 4000;
        var timer = null;
        var pausadoPeloUsuario = false;
        var btnPausar = container.querySelector('.btn-pausar');

        function girar() {
            posicoes.unshift(posicoes.pop());
            imagens.forEach(function (img, i) {
                img.classList.remove('ativa', 'proxima', 'anterior');
                img.classList.add(classes[posicoes[i]]);
            });
        }

        function rodando() {
            return timer !== null;
        }

        function iniciar() {
            if (!rodando() && !pausadoPeloUsuario && !menosMovimento.matches) {
                timer = window.setInterval(girar, INTERVALO);
            }
            atualizarBotao();
        }

        function parar() {
            if (timer !== null) {
                window.clearInterval(timer);
                timer = null;
            }
            atualizarBotao();
        }

        function atualizarBotao() {
            if (!btnPausar) {
                return;
            }
            var ativo = rodando();
            btnPausar.textContent = ativo ? 'Pausar' : 'Reproduzir';
            btnPausar.setAttribute(
                'aria-label',
                ativo ? 'Pausar a troca automática de imagens' : 'Retomar a troca automática de imagens'
            );
        }

        if (btnPausar) {
            btnPausar.hidden = false;
            btnPausar.addEventListener('click', function () {
                pausadoPeloUsuario = rodando();
                if (pausadoPeloUsuario) {
                    parar();
                } else {
                    iniciar();
                }
            });
        }

        /* Pausa enquanto o ponteiro ou o foco estiverem sobre o carrossel */
        ['mouseenter', 'focusin'].forEach(function (evt) {
            container.addEventListener(evt, parar);
        });
        ['mouseleave', 'focusout'].forEach(function (evt) {
            container.addEventListener(evt, function () {
                if (!pausadoPeloUsuario) {
                    iniciar();
                }
            });
        });

        /* Nao gasta processamento com a aba em segundo plano */
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                parar();
            } else if (!pausadoPeloUsuario) {
                iniciar();
            }
        });

        if (typeof menosMovimento.addEventListener === 'function') {
            menosMovimento.addEventListener('change', function (evento) {
                if (evento.matches) {
                    parar();
                } else {
                    iniciar();
                }
            });
        }

        iniciar();
    }

    /* =====================================================
       Sliders de cards

       A rolagem e nativa (CSS scroll-snap), entao o gesto de
       arrastar no celular, a roda do mouse e o teclado ja
       funcionam. Os botoes apenas deslocam a area visivel.
       ===================================================== */
    function iniciarSliders() {
        var carrosseis = Array.prototype.slice.call(
            document.querySelectorAll('.cards-carrossel')
        );

        carrosseis.forEach(function (carrossel) {
            var area = carrossel.querySelector('.cards-view');
            var btnAvancar = carrossel.querySelector('.btn-avancar');
            var btnVoltar = carrossel.querySelector('.btn-voltar');
            if (!area) {
                return;
            }

            function passo() {
                var card = area.querySelector('.card');
                if (!card) {
                    return area.clientWidth;
                }
                var estilo = window.getComputedStyle(card.parentElement);
                var gap = parseFloat(estilo.columnGap || estilo.gap) || 0;
                return card.getBoundingClientRect().width + gap;
            }

            function atualizarBotoes() {
                var fim = area.scrollWidth - area.clientWidth - 1;
                if (btnVoltar) {
                    btnVoltar.disabled = area.scrollLeft <= 0;
                }
                if (btnAvancar) {
                    btnAvancar.disabled = area.scrollLeft >= fim;
                }
            }

            function deslocar(direcao) {
                area.scrollBy({
                    left: direcao * passo(),
                    behavior: menosMovimento.matches ? 'auto' : 'smooth'
                });
            }

            if (btnAvancar) {
                btnAvancar.addEventListener('click', function () {
                    deslocar(1);
                });
            }
            if (btnVoltar) {
                btnVoltar.addEventListener('click', function () {
                    deslocar(-1);
                });
            }

            area.addEventListener('scroll', atualizarBotoes, { passive: true });
            window.addEventListener('resize', atualizarBotoes);
            atualizarBotoes();
        });
    }

    /* =====================================================
       Entrada suave das secoes
       ===================================================== */
    function iniciarRevelacao() {
        if (menosMovimento.matches || !('IntersectionObserver' in window)) {
            return;
        }

        var alvos = Array.prototype.slice.call(document.querySelectorAll('[data-revelar]'));
        if (!alvos.length) {
            return;
        }

        alvos.forEach(function (alvo) {
            alvo.style.opacity = '0';
            alvo.style.transform = 'translateY(16px)';
            alvo.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });

        var observador = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (!entrada.isIntersecting) {
                    return;
                }
                entrada.target.style.opacity = '1';
                entrada.target.style.transform = 'none';
                observador.unobserve(entrada.target);
            });
        }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

        alvos.forEach(function (alvo) {
            observador.observe(alvo);
        });
    }

    iniciarCarrossel3d();
    iniciarSliders();
    iniciarRevelacao();
})();
