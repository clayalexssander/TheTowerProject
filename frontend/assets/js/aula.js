const API_URL = window.location.port === "3000" ? "/api" : "http://localhost:3000/api";

document.addEventListener('DOMContentLoaded', async () => {
    const listaAulas = document.getElementById('listaAulas');
    const listaPresenca = document.getElementById('listaPresenca');
    const frameMaterial = document.getElementById('frameMaterial');
    const btnConcluir = document.getElementById('btnConcluir');
    const tituloMaterial = document.getElementById('tituloMaterial');

    const params = new URLSearchParams(window.location.search);
    const idTurma = params.get('id');
    const tipoAula = params.get('tipo');

    const response = await fetch(`${API_URL}/aulas/${idTurma}/${tipoAula}`);
    const dados = await response.json();

    let aulaSelecionadaId = null;

    if (!dados.success) {
        console.error("ERRO na API: ", dados.error);
        return;
    }

    const aulas = dados.data[0];

    aulas.forEach(aula => {
        const li = document.createElement('li');
        li.textContent = aula.titulo;

        if (aula.aula_concluida == 1) li.classList.add('concluida');

        li.addEventListener('click', async () => {
             
            document.querySelectorAll('#listaAulas li').forEach(item => item.classList.remove('selected'));
            li.classList.add('selected');

            aulaSelecionadaId = aula.id_aula;

             
            if (aula.tipo_aula === 'Conversação') {
                frameMaterial.src = '';
                tituloMaterial.textContent = 'Aula de Conversação';
            } else {
                frameMaterial.src = `/materiais/${aula.nome_pasta}/${aula.nome_arquivo}`;
            }

             
            btnConcluir.disabled = aula.aula_concluida == 1;

             
            const presencaResp = await fetch(`${API_URL}/presencas/${aula.id_aula}`);
            const dadosPresenca = await presencaResp.json();

            if (!dadosPresenca.success) {
                console.error("ERRO ao carregar presenças: ", dadosPresenca.message);
                listaPresenca.innerHTML = "<li>ERRO ao carregar presenças</li>";
                return;
            }

            const alunos = dadosPresenca.data;
            listaPresenca.innerHTML = '';

            alunos.forEach(aluno => {
                const liAluno = document.createElement('li');

                const isPresente = aluno.presente == 1;
                const isFalta = aluno.presente == 0;

                liAluno.innerHTML = `
                    ${aluno.nome_aluno}

                    <button class="btn-presenca ${isPresente ? 'marcado' : ''}"
                        data-id="${aluno.id_aluno}"
                        data-aula="${aula.id_aula}"
                        data-presente="1">Presente</button>

                    <button class="btn-presenca falta ${isFalta ? 'marcado' : ''}"
                        data-id="${aluno.id_aluno}"
                        data-aula="${aula.id_aula}"
                        data-presente="0">Falta</button>
                `;

                listaPresenca.appendChild(liAluno);
            });

        });

        listaAulas.appendChild(li);
    });

     
    document.addEventListener('click', async e => {
        if (e.target.classList.contains('btn-presenca')) {

            const idAluno = e.target.dataset.id;
            const idAula = e.target.dataset.aula;
            const presente = e.target.dataset.presente;

            const container = e.target.parentElement;

             
            container.querySelectorAll('.btn-presenca').forEach(btn => {
                btn.classList.remove('marcado');
            });

             
            e.target.classList.add('marcado');

             
            await fetch(`${API_URL}/presencas/registrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idAluno, idAula, presente })
            });
        }
    });

     
    btnConcluir.addEventListener('click', async () => {
        if (!aulaSelecionadaId) return;

        await fetch(`${API_URL}/aulas/concluir/${aulaSelecionadaId}`, {
            method: 'PUT'
        });

        const li = [...document.querySelectorAll('#listaAulas li')]
            .find(li => li.classList.contains('selected'));

        if (li) li.classList.add('concluida');

        btnConcluir.disabled = true;
    });
});

function irPara(pagina) {
    const params = new URLSearchParams(window.location.search);
    const idTurma = params.get("id");
    pagina += `?id=${idTurma}`;
    window.location.href = pagina;
}
