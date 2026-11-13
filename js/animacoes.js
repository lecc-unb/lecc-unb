document.addEventListener('DOMContentLoaded', function() {
    const imagens = document.querySelectorAll('.imagem-3d');
    const classes = ['ativa', 'proxima', 'anterior'];
    let posicoes = [0, 1, 2]; // Índices que controlam a ordem das classes

    // Altera as imagens a cada 3.5 segundos
    setInterval(() => {
        // Rotaciona o array de posições (o último vai para o começo)
        posicoes.unshift(posicoes.pop());

        // Aplica a nova classe correta para cada imagem limpando as antigas
        imagens.forEach((img, index) => {
            img.classList.remove('ativa', 'proxima', 'anterior');
            img.classList.add(classes[posicoes[index]]);
        });
    }, 3500);
});

const carrosseis = document.querySelectorAll('.cards-carrossel');

    carrosseis.forEach(carrossel => {
        // Dentro de CADA carrossel, ele busca a trilha e os botões específicos dele
        const trackCards = carrossel.querySelector('.cards-container');
        const btnAvancar = carrossel.querySelector('.btn-avancar');
        const btnVoltar = carrossel.querySelector('.btn-voltar');
        
        // Se a página atual não tiver esse carrossel, ele ignora para não dar erro
        if (!trackCards || !btnAvancar || !btnVoltar) return;

        // Cada carrossel terá seu próprio índice (posição)
        let indexCardAtual = 0;

        function atualizarSliderCards() {
            const cards = trackCards.querySelectorAll('.card');
            if (cards.length === 0) return;

            const larguraCard = cards[0].offsetWidth;
            const gap = parseFloat(window.getComputedStyle(trackCards).gap) || 0;
            const movimento = larguraCard + gap;
            
            trackCards.style.transform = `translateX(-${indexCardAtual * movimento}px)`;
        }

        btnAvancar.addEventListener('click', () => {
            const cards = trackCards.querySelectorAll('.card');
            const cardsVisiveis = Math.round(trackCards.parentElement.offsetWidth / cards[0].offsetWidth);
            const maxCliques = cards.length - cardsVisiveis;

            if (indexCardAtual < maxCliques) {
                indexCardAtual++;
                atualizarSliderCards();
            }
        });

        btnVoltar.addEventListener('click', () => {
            if (indexCardAtual > 0) {
                indexCardAtual--;
                atualizarSliderCards();
            }
        });

        window.addEventListener('resize', () => {
            indexCardAtual = 0;
            atualizarSliderCards();
        });
    });