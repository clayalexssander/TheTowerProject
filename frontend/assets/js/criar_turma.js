const API_URL = `${window.location.port === "3000" ? "/api" : "http://localhost:3000/api"}/turmas`;

document.getElementById("formCriarTurma").addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome_turma = document.getElementById("nome_turma").value.trim();
    const dia_semana = document.getElementById("dia_semana").value;
    const hora_inicio = document.getElementById("hora_inicio").value;
    const hora_fim = document.getElementById("hora_fim").value;
    const mensagem = document.getElementById("mensagem");

    if(!nome_turma || !dia_semana || !hora_inicio || !hora_fim){
        mensagem.textContent = "Preencha todos os campos!"
        mensagem.style.color = "red";
        return;
    }

    try{
        const resposta = await fetch(API_URL , {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({nome_turma, dia_semana, hora_inicio, hora_fim})
        });

        const dados = await resposta.json();


        if(  dados.resultado === 1 ){
            mensagem.textContent = " Turma criada com Sucesso!";
            mensagem.style.color = "green";

            // manda paraa a tela de turmas de novo apos 1 segundo e e meio
            setTimeout(() => {
                window.location.href = "turmas.html";
            }, 1500);
        }else if( dados.resultado === 2 ){
            mensagem.textContent = " Foi detectado conflito de horário da nova turma com turmas ja existentes!";
            mensagem.style.color = "orange";
        }
        else{
            mensagem.textContent = "Falha ao criar a turma";
            mensagem.style.color = "red";
        }
     }catch (erro){
        console.error("Erro ao criar turma:", erro);
        mensagem.textContent = "Erro na conexão com o servidor";
        mensagem.style.color = "red";
    }
});

function irPara(pagina){
    window.location.href = pagina;
}
