// Banco de dados interno das receitas
const listaReceitas = [
    {
        id: 1,
        titulo: "Panqueca Americana Clássica",
        imagem: "https://unsplash.com",
        tempo: "15 min",
        porcoes: "2 pessoas",
        ingredientes: [
            "1 xícara de farinha de trigo",
            "2 colheres de sopa de açúcar",
            "2 colheres de chá de fermento em pó",
            "1 pitada de sal",
            "1 ovo",
            "1 xícara de leite",
            "2 colheres de sopa de manteiga derretida"
        ],
        preparo: [
            "Misture os ingredientes secos (farinha, açúcar, fermento e sal) em uma tigela.",
            "Em outro recipiente, bata levemente o ovo, adicione o leite e a manteiga derretida.",
            "Junte as duas misturas e mexa até ficar homogêneo (não mexa demais).",
            "Aqueça uma frigideira antiaderente com um fio de óleo ou manteiga.",
            "Coloque porções da massa na frigideira. Quando surgirem bolhas na superfície, vire e doure o outro lado.",
            "Sirva quente com mel, geleia ou frutas!"
        ]
    },
    {
        id: 2,
        titulo: "Brigadeiro Gourmet de Panela",
        imagem: "https://unsplash.com",
        tempo: "20 min",
        porcoes: "4 pessoas",
        ingredientes: [
            "1 lata de leite condensado",
            "1 colher de sopa de manteiga",
            "3 colheres de sopa de chocolate em pó (50% cacau)",
            "100g de creme de leite (meia caixinha)",
            "Chocolate granulado para decorar"
        ],
        preparo: [
            "Em uma panela, misture o leite condensado, a manteiga e o chocolate em pó.",
            "Leve ao fogo baixo e mexa sem parar para não queimar o fundo.",
            "Quando começar a desgrudar do fundo da panela, adicione o creme de leite.",
            "Mexa por mais 3 minutos até ganhar consistência cremosa novamente.",
            "Despeje em um prato fundo e deixe esfriar completamente.",
            "Coma de colher ou enrole passando no granulado!"
        ]
    },
    {
        id: 3,
        titulo: "Omelete Cremosa com Queijo",
        imagem: "https://unsplash.com",
        tempo: "10 min",
        porcoes: "1 pessoa",
        ingredientes: [
            "2 ovos inteiros",
            "2 colheres de sopa de leite",
            "1/2 xícara de queijo muçarela ralado",
            "Sal, pimenta e cheiro-verde a gosto",
            "1 colher de chá de manteiga"
        ],
        preparo: [
            "Bata os ovos com o leite usando um garfo até espumar levemente.",
            "Tempere com o sal, a pimenta e o cheiro-verde picadinho.",
            "Derreta a manteiga em uma frigideira em fogo médio.",
            "Despeje os ovos batidos e mexa o centro devagar com uma espátula.",
            "Quando a base estiver firme mas o topo ainda úmido, jogue o queijo por cima.",
            "Dobre a omelete ao meio, espere o queijo derreter e retire da frigideira."
        ]
    }
];

// Elementos da Página
const gridReceitas = document.getElementById('recipes-grid');
const campoBusca = document.getElementById('search-input');
const botaoBusca = document.getElementById('search-button');
const modal = document.getElementById('recipe-modal');
const corpoModal = document.getElementById('modal-body');
const botaoFecharModal = document.getElementById('close-modal');

// Função para desenhar os cartões de receitas na tela
function carregarReceitas(receitas) {
    gridReceitas.innerHTML = ""; // Limpa a tela
    
    if (receitas.length === 0) {
        gridReceitas.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: #888;'>Nenhuma receita encontrada com esse nome. 📋</p>";
        return;
    }

    receitas.forEach(receita => {
        const cartao = document.createElement('div');
        cartao.className = 'recipe-card';
        cartao.onclick = () => abrirJanelaReceita(receita);

        cartao.innerHTML = `
            <img src="${receita.imagem}" alt="${receita.titulo}" class="recipe-image">
            <div class="recipe-info">
                <h3>${receita.titulo}</h3>
                <div class="recipe-tags">
                    <span class="tag">⏱️ ${receita.tempo}</span>
                    <span class="tag">🍽️ ${receita.porcoes}</span>
                </div>
            </div>
        `;
        gridReceitas.appendChild(cartao);
    });
}

// Função para abrir o passo a passo completo da receita clicada
function abrirJanelaReceita(receita) {
    // Cria as listas de ingredientes e preparo em formato HTML
    const listaIngredientesHTML = receita.ingredientes.map(ing => `<li>${ing}</li>`).join('');
    const listaPreparoHTML = receita.preparo.map(passo => `<li>${passo}</li>`).join('');

    corpoModal.innerHTML = `
        <h2>${receita.titulo}</h2>
        <img src="${receita.imagem}" alt="${receita.titulo}">
        
        <h4>🛒 Ingredientes:</h4>
        <ul>${listaIngredientesHTML}</ul>
        
        <h4>👨‍🍳 Modo de Preparo:</h4>
        <ol>${listaPreparoHTML}</ol>
    `;
    
    modal.style.display = 'flex'; // Abre o modal na tela
}

// Função para filtrar as receitas pelo que foi digitado na busca
function filtrarReceitas() {
    const textoDigitado = campoBusca.value.toLowerCase().trim();
    
    const receitasFiltradas = listaReceitas.filter(receita => {
        return receita.titulo.toLowerCase().includes(textoDigitado);
    });
    
    carregarReceitas(receitasFiltradas);
}

// Configurações de Eventos de Cliques e Teclado
botaoBusca.addEventListener('click', filtrarReceitas);
campoBusca.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        filtrarReceitas();
    }
});

botaoFecharModal.addEventListener('click', () => {
    modal.style.display = 'none'; // Fecha o modal ao clicar no X
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none'; // Fecha o modal se clicar fora da caixa branca
    }
});

// Inicialização automática do site ao abrir
carregarReceitas(listaReceitas);
