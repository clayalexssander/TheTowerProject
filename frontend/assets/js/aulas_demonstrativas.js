const API_URL = `${window.location.port === "3000" ? "/api" : "http://localhost:3000/api"}/aula-demonstrativas`;
 
document.addEventListener("DOMContentLoaded", () => {
    carregarAulas();

    document.getElementById("btnNovaAula").onclick = abrirModal;
    document.getElementById("btnFechar").onclick = fecharModal;
    document.getElementById("btnSalvar").onclick = salvarAula;
});

async function carregarAulas() {
    const list = document.getElementById("listaAulas");
    list.innerHTML = "<p>Carregando...</p>";

    const res = await fetch(`${API_URL}/listar`);
    const aulas = await res.json();

    list.innerHTML = "";

    if (aulas.length === 0) {
        list.innerHTML = "<p>Nenhuma aula demonstrativa marcada.</p>";
        return;
    }

    aulas.forEach(aula => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${aula.nome_aluno}</h3>
            <p><strong>Email:</strong> ${aula.email_aluno}</p>
            <p><strong>Data:</strong> ${aula.data_aula.slice(0, 10)}</p>
            <p><strong>Horário:</strong> ${aula.horario}</p>
            <p><strong>Status:</strong> ${aula.status}</p>

            <div class="btn-area">
                <button class="btn-cancelar" onclick="cancelarAula(${aula.id_aula_demostrativa})">Cancelar</button>
                <button class="btn-confirmar" onclick="confirmarMatricula(${aula.id_aula_demostrativa})">Confirmar Matrícula</button>
            </div>
        `;

        list.appendChild(card);
    });
}

function abrirModal() {
    document.getElementById("modalAula").style.display = "flex";
}

function fecharModal() {
    document.getElementById("modalAula").style.display = "none";
}

async function salvarAula() {

    const confirmar = confirm("Tem certeza que deseja salvar essa aula?");
    if (!confirmar) return;

    const nome = document.getElementById("nome_aluno").value;
    const email = document.getElementById("email_aluno").value;
    const telefone = document.getElementById("telefone_aluno").value;
    const data = document.getElementById("data_aula").value;
    const horario = document.getElementById("horario").value;

    if (!telefone.trim()) {
        alert("Informe o WhatsApp do aluno para enviar a confirmacao.");
        return;
    }

    if (!formatarTelefoneWhatsApp(telefone)) {
        alert("Informe um WhatsApp valido para enviar a confirmacao.");
        return;
    }

    const res = await fetch(`${API_URL}/marcar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, data, horario })
    });

    const result = await res.json();

    if (result.resultado === 1){
         alert("Aula marcada com sucesso!");
         enviarConfirmacaoWhatsApp({ nome, telefone, data, horario });
         await enviarConfirmacaoEmail({ nome, email, data, horario });
         fecharModal();
         carregarAulas();
    }
    else if (result.resultado === 2) alert("Conflito detectado! Email ou horário já marcado.");
    else if (result.resultado === 3) alert("Data invalida, escolha uma data maior que a corrente.");
    else if (result.resultado === 4) alert("Horario invalido, escolha uma horário entre 08h e 20h.");
    else alert("Erro ao marcar aula!, certifique-se de preencher todos os campos");
}

function enviarConfirmacaoWhatsApp({ nome, telefone, data, horario }) {
    const telefoneFormatado = formatarTelefoneWhatsApp(telefone);

    if (!telefoneFormatado) {
        alert("Aula marcada, mas o WhatsApp informado nao parece valido.");
        return;
    }

    const mensagem = montarMensagemConfirmacao(nome, data, horario);
    window.open(`https://wa.me/${telefoneFormatado}?text=${encodeURIComponent(mensagem)}`, "_blank");
}

function formatarTelefoneWhatsApp(telefone) {
    const apenasNumeros = telefone.replace(/\D/g, "");

    if (apenasNumeros.length === 10 || apenasNumeros.length === 11) {
        return `55${apenasNumeros}`;
    }

    if (apenasNumeros.length === 12 || apenasNumeros.length === 13) {
        return apenasNumeros;
    }

    return "";
}

function montarMensagemConfirmacao(nome, data, horario) {
    const dataFormatada = formatarData(data);
    const horarioFormatado = horario.slice(0, 5);

    return `Ola, ${nome}! Sua aula demonstrativa na The Tower Idiomas foi agendada para ${dataFormatada} as ${horarioFormatado}. Qualquer duvida, estamos a disposicao.`;
}

async function enviarConfirmacaoEmail({ nome, email, data, horario }) {
    const assunto = "Confirmacao da sua aula demonstrativa";
    const corpo = montarMensagemConfirmacao(nome, data, horario);

    try {
        const res = await fetch(`${API_URL}/enviar-confirmacao-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, data, horario })
        });

        if (res.ok) {
            alert("Email de confirmacao enviado!");
            return;
        }

        const erro = await res.json();
        alert(`Nao foi possivel enviar o email automaticamente: ${erro.erro}`);
    } catch (erro) {
        alert("Nao foi possivel conectar ao servidor para enviar o email automaticamente.");
    }

    const linkEmail = `mailto:${email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
    window.open(linkEmail, "_blank");
}

function formatarData(data) {
    if (!data) return "";

    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}

async function cancelarAula(id) {

    const confirmar = confirm("Tem certeza que deseja cancelar essa aula?");
    if (!confirmar) return;

    const res = await fetch(`${API_URL}/cancelar/${id}`, { method: "PUT" });
    const r = await res.json();

    if (r.resultado === 1) alert("Aula cancelada");
    else alert("Não foi possível cancelar");

    carregarAulas();
}

async function confirmarMatricula(id) {
    const confirmar = confirm("Tem certeza que deseja confirmar essa matricula?");
    if (!confirmar) return;

    const res = await fetch(`${API_URL}/confirmar/${id}`, { method: "PUT" });
    const r = await res.json();

    if (r.resultado === 1) alert("Matrícula confirmada!");
    else alert("Erro ao confirmar matrícula");

    carregarAulas();
}

function irPara(pagina){
    window.location.href = pagina;
}

  
     
 
   
 
