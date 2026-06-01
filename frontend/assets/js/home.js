const API_URL = "http://localhost:3000/api";

function irPara(pagina){
    window.location.href = pagina;
}

function atualizarSaudacao(){
    const agora = new Date();
    const hora = agora.getHours();
    let saudacao;
    let nomeUsuario = "Jefferson"; // default / fallback

    try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.usuario) {
            // Capitaliza o nome do usuário para ficar elegante
            nomeUsuario = user.usuario.charAt(0).toUpperCase() + user.usuario.slice(1);
        }
    } catch (e) {
        console.error("Erro ao ler dados do usuário do localStorage:", e);
    }

    if(hora >= 5 && hora < 12){
        saudacao = `Bom dia ${nomeUsuario}, bem-vindo de volta!`;
    } 
    else if(hora >= 12 && hora < 18){
        saudacao = `Boa tarde ${nomeUsuario}, bem-vindo de volta!`;
    }
    else{
        saudacao = `Boa noite ${nomeUsuario}, bem-vindo de volta!`;
    }
    document.getElementById("saudacao").textContent = saudacao;
}

async function carregarAgendaHoje(){
    const lista = document.getElementById("lista-agenda");
    try {
        const resposta = await fetch(`${API_URL}/home/agenda`);
        const data = await resposta.json();

        if(!data.success || data.data.length === 0){
           lista.innerHTML = `<div class='agenda-vazia' style='color:black'>Nenhuma aula hoje 🎉</div>`;
            return;
        }

        lista.innerHTML = "";

        data.data.forEach(aula => {
            const item = document.createElement("div");
            item.classList.add("agenda-item");

            item.innerHTML = `
                <span class="agenda-item-nome">${aula.nome_turma}</span>
                <span class="agenda-item-horario">${aula.horario_aula} - ${aula.hora_fim}</span>
            `;

            lista.appendChild(item);
        });

    } catch (erro) {
        console.error("Erro ao carregar agenda:", erro);
        lista.innerHTML = `<div class='agenda-vazia'>Erro ao carregar agenda.</div>`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    atualizarSaudacao();
    carregarAgendaHoje();

    const logoutButton = document.getElementById("btnLogout");
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem("user");
            window.location.href = "../index.html";
        });
    }
});
