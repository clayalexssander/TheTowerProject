const API_URL = window.location.port === "3000" ? "/api" : "http://localhost:3000/api";

const turmaSelect = document.getElementById("turma");
const form = document.getElementById("formMatricula");

async function carregarTurmas(){
    const res = await fetch(`${API_URL}/alunos/turmas`);
    const dados = await res.json();

    dados.data.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t.id_turma;
        opt.textContent = t.nome_turma;
        turmaSelect.appendChild(opt);
    });
}
carregarTurmas();

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const cidade = document.getElementById("cidade").value;
    const bolsista=  document.getElementById("bolsista").value;
    const nivel = document.getElementById("nivel").value;
    const telefone = document.getElementById("telefone").value; 
    const tipo_bancaria = document.getElementById("tipo_bancaria").value;
    const id_turma = turmaSelect.value;

    const res = await fetch(`${API_URL}/alunos/matricular`, {
        method: "POST",
        headers: { "Content-Type" : "application/json"},
        body: JSON.stringify({ nome, email, cidade, bolsista, nivel, telefone, tipo_bancaria, id_turma })
    });

    const resposta = await res.json();
    if(resposta.resultado === 1){
        alert("Aluno Matriculado com sucesso!");
        form.reset();
    }
    else if(resposta.resultado === 2){
        alert("Erro: Email já existe ou turma inválida.");
    }else{
        alert("Erro inisperado na Matrícula."); 
    }

})
function irPara(pagina){
    window.location.href = pagina;
}

 

 
