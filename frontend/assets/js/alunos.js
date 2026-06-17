const API_URL = window.location.port === "3000" ? "/api" : "http://localhost:3000/api";

const inputPesquisa = document.getElementById("inputPesquisa");
const painel = document.getElementById("painelAluno");
const btnEditar = document.getElementById("btnEditar");
const historicoLista = document.getElementById("historicoLista");
const btnMatricular = document.getElementById("btnMatricular");

const modal = document.getElementById("modalEditar");
const formEditar = document.getElementById("formEditarAluno");

const editNome = document.getElementById("editNome");
const editCidade = document.getElementById("editCidade");
const editEmail = document.getElementById("editEmail");
const editNivel = document.getElementById("editNivel");
const editBolsista = document.getElementById("editBolsista");
const editAtivo = document.getElementById("editAtivo");
const editTelefone = document.getElementById("editTelefone");
const editTipoBancaria = document.getElementById("editTipoBancaria");   

let alunoSelecionado = null;

btnEditar.addEventListener("click", async () => {
    const resTurmas = await fetch(`${API_URL}/alunos/turmas`);
    const dadosTurmas = await resTurmas.json();
    
    editTurma.innerHTML = "";
    dadosTurmas.data.forEach(t => {
        const op = document.createElement("option");
        op.value = t.id_turma;
        op.textContent = t.nome_turma;
        editTurma.appendChild(op);
    });

    editNome.value = document.getElementById("nomeAluno").textContent;
    editCidade.value = document.getElementById("cidadeAluno").textContent;
    editEmail.value = document.getElementById("emailAluno").textContent;
    editNivel.value = document.getElementById("nivelAluno").textContent;
    editBolsista.value = document.getElementById("bolsistaAluno").textContent;
    editAtivo.value = document.getElementById("ativoAluno").textContent;
    editTipoBancaria.value = document.getElementById("tipo_conta").textContent;
    editTelefone.value = document.getElementById("telefoneAluno").textContent;

    modal.classList.remove("hidden");
});

document.getElementById("btnCancelarModal").addEventListener("click", () => {
    modal.classList.add("hidden");
});

formEditar.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome  = editNome.value.trim();
    const cidade = editCidade.value.trim();
    const email = editEmail.value.trim();
    const nivel = editNivel.value;
    const bolsista = editBolsista.value;
    const ativo = editAtivo.value;
    const telefone = editTelefone.value.trim();
    const tipo_bancaria = editTipoBancaria.value;
    const id_turma = editTurma.value;

    if (!nome || !cidade || !email || !nivel || !telefone || !tipo_bancaria || !id_turma || bolsista === "" || ativo === "") {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    const res = await fetch(`${API_URL}/alunos/editar/${alunoSelecionado}`, {
        method: "PUT", 
        headers: { "Content-Type" : "application/json"},
        body: JSON.stringify({nome, cidade,tipo_bancaria, telefone, bolsista, email, ativo, nivel, id_turma})
    });

    const resultado = await res.json();

    if(resultado.success){
        alert("Aluno atualizado com sucesso!");
        modal.classList.add("hidden");
        irPara("alunos.html");
    }else{
        alert("Erro ao atualizar aluno: " + resultado.message);
    }
});

 
inputPesquisa.addEventListener("keyup", async (e) => {
    const nome = e.target.value.trim();
    if (nome.length < 2) return;

    const res = await fetch(`${API_URL}/alunos/pesquisar/${nome}`);
    const dados = await res.json();

    if (!dados) return;

    const aluno = dados.data[0];
    alunoSelecionado = aluno.id_aluno;

    painel.classList.remove("hidden");
    btnEditar.classList.remove("hidden");

    document.getElementById("nomeAluno").textContent = aluno.nome_aluno;
    document.getElementById("cidadeAluno").textContent = aluno.cidade;
    document.getElementById("dataMatriculaAluno").textContent = aluno.data_matricula;
    document.getElementById("nivelAluno").textContent = aluno.nivel;
    document.getElementById("emailAluno").textContent = aluno.email_aluno;
    document.getElementById("ativoAluno").textContent = aluno.ativo ? "Sim" : "Não";
    document.getElementById("bolsistaAluno").textContent = aluno.bolsista ? "Sim" : "Não";
    document.getElementById("telefoneAluno").textContent = aluno.numero_telefone;
    document.getElementById("tipo_conta").textContent = aluno.tipo_bancaria;
 
    carregarHistorico(alunoSelecionado); 
    
    carregaFrequencia(alunoSelecionado);
});

 
async function carregarHistorico(id) {
    historicoLista.innerHTML = "";
 
    const res = await fetch(`${API_URL}/alunos/historico/${id}`);
    const dados = await res.json();
    const hist = dados.data[0];

    hist.forEach(h => {
        const li = document.createElement("li");
        li.textContent = `${h.nome_turma} | entrada: ${h.data_entrada} | saída: ${h.data_saida}`;
        historicoLista.appendChild(li);
    });
}


async function carregaFrequencia(id) {
    historicoLista.innerHTML = "";
    const res = await fetch(`${API_URL}/alunos/frequencia/${id}`);
    const dados = await res.json();
    const freq = dados.data[0];
 
    document.getElementById("freqAluno").textContent = `${freq.frequencia_percentual || 0}%`;
    document.getElementById("freqTotal").textContent = freq.total_aulas;
    document.getElementById("freqPres").textContent = freq.aulas_presentes;
    document.getElementById("freqFaltas").textContent = freq.aulas_faltadas;


}


function irPara(pagina){
    window.location.href = pagina;
}

btnMatricular.addEventListener("click", () => {
    window.location.href = "matricular_aluno.html";
});
