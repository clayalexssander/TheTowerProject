const API_URL = window.location.port === "3000" ? "/api" : "http://localhost:3000/api";

document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const idTurma = params.get("id");
     
    if(!idTurma) return alert("Turma não encontrada!");

    try{

        const infoRes = await fetch(`${API_URL}/turmas/info/${idTurma}`);
        const infoData = await infoRes.json();
         console.log("daodsnda yurma: ",infoData.data[0]);
         window.dadosTurma = infoData.data[0];

        if(infoData.success && infoData.data.length > 0){
            const t = infoData.data[0];

            document.getElementById("nomeTurma").textContent = t.nome_turma;
            document.getElementById("diaAula").textContent = t.dia_aula;
            document.getElementById("horario").textContent = `${t.horario_aula} - ${t.hora_fim}`;
            document.getElementById("qtdAlunos").textContent = t.qtd_alunos;
            document.getElementById("aulasProg").textContent = t.qtd_aulas_programadas;
            document.getElementById("aulasConcluidas").textContent = t.qtd_aulas_realizadas;
            document.getElementById("bookAtual").textContent = t.numero_book;

            const progresso = Math.round(t.progresso_turma || 0);
            document.getElementById("progress").style.width = `${progresso}%`;
            document.getElementById("Percentual").textContent = `${progresso}%`;

        }

        const alunosRes = await fetch(`${API_URL}/turmas/alunos/${idTurma}`);
        const alunosData = await alunosRes.json();

        if(alunosData.success){
            const lista = document.getElementById("listaAlunos");
            lista.innerHTML = "";
            alunosData.data.forEach(al => {
                const li = document.createElement("li");
                li.textContent = al.nome_aluno;
                lista.appendChild(li);
            });
        }

        const ultimaRes = await fetch(`${API_URL}/turmas/ultima/${idTurma}`);
        const ultimaData = await ultimaRes.json();

        if(ultimaData.success && ultimaData.data.length > 0){
            const aula = ultimaData.data[0];
            document.getElementById("ultimaAula").textContent = 
            `Última aula : ${aula.tipo_aula} (${aula.data_aula})`;
        }

        document.querySelectorAll(".aula-card").forEach(card => {
            card.addEventListener("click", () => {
                const tipo = card.dataset.tipo;

                if(tipo === "Conversação"){
                   abrirModalConversacao(idTurma);
                }
                else{
                    window.location.href = `aula.html?id=${idTurma}&tipo=${tipo}`;
                }
            });
        });
    }catch (err){
        console.error(err);
        alert("Erro ao carregar informações da turma.");
    }
});

async function abrirModalConversacao(idTurma) {
    const modal = document.getElementById("modalConversacao");
    const listaContainer = document.getElementById("listaPresencaContainer");

    modal.classList.remove("hidden");
    listaContainer.innerHTML = "<p>Carregando alunos...</p>";

    try {
        const res = await fetch(`${API_URL}/turmas/alunos/${idTurma}`);
        const data = await res.json();

        if (!data.success) {
            listaContainer.innerHTML = "<p>Erro ao carregar alunos.</p>";
            return;
        }

        listaContainer.innerHTML = "";

        data.data.forEach(al => {
            const div = document.createElement("div");
           div.classList.add("linha-presenca");

            div.innerHTML = `
            <span>${al.nome_aluno}</span>
                <div class="botoes-presenca">
                    <button class="btnPresente" data-id=${al.id_aluno}>presente</button>
                    <button class="btnFalta" data-id=${al.id_aluno}>Falta</button>
                </div>
            `;

            const btnPresente = div.querySelector(".btnPresente");
            const btnFalta = div.querySelector(".btnFalta");

            btnPresente.onclick = (e) => {
                btnPresente.classList.add("selecionado");
                btnFalta.classList.remove("selecionado");
            };

            btnFalta.onclick = (e) => {
                btnFalta.classList.add("selecionado");
                btnPresente.classList.remove("selecionado");
            };


            listaContainer.appendChild(div);
        });

    } catch (err) {
        console.error(err);
        listaContainer.innerHTML = "<p>Erro ao carregar alunos.</p>";
    }

    document.getElementById("btnFecharModal").onclick = () => {
        modal.classList.add("hidden");
    };

    document.getElementById("btnConcluirAula").addEventListener("click", async () => {
        const confirmar = confirm("Deseja concluir esta aula de conversação?");
        if (!confirmar) return;

        try{
            if(!idTurma){
                alert("Nenhuma turma foi selecionada.");
                return;
            }

            const res = await fetch(`${API_URL}/presencas/concluir/conversacao/${idTurma}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });

            console.log("RESPOSTA: ", res);

            const resposta = await res.json();

            if (resposta.success) {
                localStorage.setItem("id_aula_conversacao", resposta.id_aula);
            } else {
                alert("Erro ao concluir aula.");
            }

            const idAula = localStorage.getItem("id_aula_conversacao");

            if(!idAula){
                alert("ID da aula não encontrado");
                return;
            }

            const botoes = document.querySelectorAll(".botoes-presenca button");
            for(const b of botoes){
                const idAluno = b.dataset.id;
                const presente = b.classList.contains("selecionado") ? 1 : 0;

                await fetch(`${API_URL}/presencas/registrar`, {
                    method: "POST",
                    headers: {"Content-Type" : "application/json"},
                    body: JSON.stringify({idAluno, idAula,presente})
                });
            }

            alert("Aula Concluida com sucesso!");
            window.location.reload();

        }catch(error){
            console.error("Erro:", error);

        }
    });
}

const modalEditar = document.getElementById("modalEditarTurma");
const btnAbrirEditar = document.getElementById("btnAbrirEditar");
const btnCancelarEditar = document.getElementById("btnCancelarEditar");
 
btnAbrirEditar.addEventListener("click", () => {
    preencherModal();
    modalEditar.classList.remove("hidden");
});

btnCancelarEditar.addEventListener("click", () => {
    modalEditar.classList.add("hidden");
});
 
function preencherModal() {
    document.getElementById("edit_nome").value = window.dadosTurma.nome_turma;
    document.getElementById("edit_dia").value = window.dadosTurma.dia_aula;
    document.getElementById("edit_inicio").value = window.dadosTurma.horario_aula;
    document.getElementById("edit_fim").value = window.dadosTurma.hora_fim;
    document.getElementById("edit_ativa").value = window.dadosTurma.ativa ? 1 : 0;
}
 
document.getElementById("formEditarTurma").addEventListener("submit", async (e) => {
    e.preventDefault();

    const mudancas = {
        id_turma: window.dadosTurma.id_turma,
        novo_nome_turma: document.getElementById("edit_nome").value,
        novo_dia_aula: document.getElementById("edit_dia").value,
        novo_horario_aula: document.getElementById("edit_inicio").value,
        novo_hora_fim: document.getElementById("edit_fim").value,
        ativa: document.getElementById("edit_ativa").value
    };

    try {
        const resposta = await fetch(`${API_URL}/turmas/editar`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mudancas)
        });

        const resultado = await resposta.json();

        if (resultado.resultado === 1) {
            alert("Turma atualizada com sucesso!");
            location.reload();
        } 
        else if (resultado.resultado === 2) {
            alert("Conflito de horário com outra turma ativa.");
        }
        else if (resultado.resultado === 3) {
            alert("A turma possui alunos ativos. Transfira antes de desativar.");
        }
        else {
            alert("Erro inesperado ao atualizar turma.");
        }

    } catch (erro) {
        console.error("Erro ao atualizar turma:", erro);
    }
});

function irPara(pagina){
    window.location.href = pagina;
}
