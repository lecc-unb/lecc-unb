// Função para abrir/fechar o menu clicado
function toggleDropdown(id, event) {
    event.stopPropagation(); // Evita que o click feche na mesma hora
    var dropdown = document.getElementById(id);
    var isOculto = dropdown.classList.contains('show');
    
    // Fecha todos os dropdowns para não ficarem dois abertos
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
        dropdowns[i].classList.remove('show');
    }

    // Se não estava aberto, agora ele abre
    if (!isOculto) {
        dropdown.classList.add('show');
    }
}

// Fecha o dropdown se o usuário clicar em qualquer outro lugar da tela
window.onclick = function(event) {
    if (!event.target.matches('.dropdown-btn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            dropdowns[i].classList.remove('show');
        }
    }
}

// ==========================================
// LÓGICA DE PESQUISA DE LIVROS (FILTRO)
// ==========================================
    
// 1. Pegamos a barra de pesquisa pelo ID
const barraPesquisa = document.getElementById('input-pesquisa');

// 2. Só executa o código se a barra de pesquisa existir na página atual
if (barraPesquisa) {
        
    // 3. 'input' faz a função rodar toda vez que o usuário digita ou apaga uma letra
    barraPesquisa.addEventListener('input', function() {
            
        // Pega o que foi digitado e transforma em minúsculo para facilitar a busca
        const termoBuscado = barraPesquisa.value.toLowerCase();
            
        // Pega todos os cards de livros da tela
        const livros = document.querySelectorAll('.card-livro');

        // Passa por cada livro verificando se combina com a pesquisa
        livros.forEach(livro => {
            // Pega o título (h3) e a descrição/autor (p) do livro atual
            const titulo = livro.querySelector('h3').textContent.toLowerCase();
            const autorDescricao = livro.querySelector('p').textContent.toLowerCase();

            // Se o título OU a descrição tiverem o termo digitado...
            if (titulo.includes(termoBuscado) || autorDescricao.includes(termoBuscado)) {
                livro.style.display = 'flex'; // Mostra o livro
            } else {
                livro.style.display = 'none'; // Esconde o livro
            }
        });
    });
}