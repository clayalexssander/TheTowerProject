const API_URL = "http://localhost:3000/api";

function irPara(pagina) {
    window.location.href = pagina;
}

function obterNomeUsuario() {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.usuario) {
            return user.usuario.charAt(0).toUpperCase() + user.usuario.slice(1);
        }
    } catch (e) {
        console.error("Erro ao ler dados do usuario do localStorage:", e);
    }

    return "Jefferson";
}

function atualizarSaudacao() {
    const agora = new Date();
    const hora = agora.getHours();
    const nomeUsuario = obterNomeUsuario();
    const idioma = localStorage.getItem("idiomaSite") === "en" ? "en" : "pt";
    let saudacao;

    if (idioma === "en") {
        if (hora >= 5 && hora < 12) {
            saudacao = `Good morning ${nomeUsuario}, welcome back!`;
        } else if (hora >= 12 && hora < 18) {
            saudacao = `Good afternoon ${nomeUsuario}, welcome back!`;
        } else {
            saudacao = `Good evening ${nomeUsuario}, welcome back!`;
        }
    } else if (hora >= 5 && hora < 12) {
        saudacao = `Bom dia ${nomeUsuario}, bem-vindo de volta!`;
    } else if (hora >= 12 && hora < 18) {
        saudacao = `Boa tarde ${nomeUsuario}, bem-vindo de volta!`;
    } else {
        saudacao = `Boa noite ${nomeUsuario}, bem-vindo de volta!`;
    }

    document.getElementById("saudacao").textContent = saudacao;
}

async function carregarAgendaHoje() {
    const lista = document.getElementById("lista-agenda");
    const idioma = localStorage.getItem("idiomaSite") === "en" ? "en" : "pt";

    try {
        const resposta = await fetch(`${API_URL}/home/agenda`);
        const data = await resposta.json();

        if (!data.success || data.data.length === 0) {
            const texto = idioma === "en" ? "No classes today 🎉" : "Nenhuma aula hoje 🎉";
            lista.innerHTML = `<div class="agenda-vazia" style="color:black">${texto}</div>`;
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
        const texto = idioma === "en" ? "Error loading schedule." : "Erro ao carregar agenda.";
        lista.innerHTML = `<div class="agenda-vazia">${texto}</div>`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    atualizarSaudacao();
    carregarAgendaHoje();

    window.addEventListener("app-language-change", () => {
        atualizarSaudacao();
        carregarAgendaHoje();
    });
});
