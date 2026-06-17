const API_URL = window.location.port === "3000" ? "/api" : "http://localhost:3000/api";
const inputPesquisa = document.getElementById("pesquisaTurma");
const cardsTurmas = document.getElementById("cardsTurmas");

let todasTurmas = [];  

async function carregarTurmas(){
    try{
        const resposta = await fetch(`${API_URL}/turmas`);
        if(!resposta.ok) throw new Error("Erro ao buscar turmas");
        
        todasTurmas = await resposta.json();  

        renderizarTurmas(todasTurmas);  
    }catch (erro){
        console.error("Erro ao carregar turmas:", erro)
    }
}

function renderizarTurmas(lista){
    cardsTurmas.innerHTML = "";

    lista.forEach(turma => {
        const card  = document.createElement("div");
        card.classList.add("card-turma");
        card.innerHTML = `<h3>${turma.nome_turma}</h3>`;
        
        card.addEventListener("click", () => {
            window.location.href = `turma_info.html?id=${turma.id_turma}`;
        });

        cardsTurmas.appendChild(card);
    });
}

 
inputPesquisa.addEventListener("input", () => {
    const termo = inputPesquisa.value.trim().toLowerCase();

    if(termo === ""){
        renderizarTurmas(todasTurmas); 
        return;
    }

    const filtradas = todasTurmas.filter(turma => 
        turma.nome_turma.toLowerCase().includes(termo)
    );

    renderizarTurmas(filtradas);
});


document.getElementById("btnCriarTurma").addEventListener("click", () => {
    window.location.href = `criar_turma.html`;
});

function irPara(pagina){
    window.location.href = pagina;
}

carregarTurmas();
