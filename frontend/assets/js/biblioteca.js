const API_URL = window.location.port === "3000" ? "/api" : "http://localhost:3000/api";

document.addEventListener("DOMContentLoaded", async () => {
    await carregarDados();
    configurarEventListeners();
});

async function carregarDados() {
    try {
        await carregarEmprestimosAtivos();
        await carregarLivrosDisponiveis();
        await carregarHistoricoDevolucoes();
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
        alert("Erro ao carregar dados da biblioteca.");
    }
}

async function carregarEmprestimosAtivos() {
    const response = await fetch(`${API_URL}/biblioteca/emprestimos-ativos`);
    const data = await response.json();
    
    const container = document.getElementById('listaEmprestimos');
    container.innerHTML = '';

    if (data.success && data.data.length > 0) {
        data.data.forEach(emprestimo => {
            const item = document.createElement('div');
            item.className = 'item-emprestimo';
            item.innerHTML = `
                <div class="info-emprestimo">
                    <strong>${emprestimo.nome_livro}</strong> - ${emprestimo.autor}<br>
                    <small>Aluno: ${emprestimo.nome_aluno} (${emprestimo.email_aluno})</small><br>
                    <small>Emprestado em: ${emprestimo.data_emp}</small>
                </div>
                <button class="btn-devolucao" data-id="${emprestimo.id_emprestimo}">
                    Confirmar Devolução
                </button>
            `;
            container.appendChild(item);
        });

       
        document.querySelectorAll('.btn-devolucao').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const idEmprestimo = e.target.dataset.id;
                console.log("id do emprestimo: ", idEmprestimo);
                await registrarDevolucao(idEmprestimo);
            });
        });
    } else {
        container.innerHTML = '<p>Nenhum empréstimo em andamento.</p>';
    }
}

async function carregarLivrosDisponiveis() {
    const response = await fetch(`${API_URL}/biblioteca/livros-disponiveis`);
    const data = await response.json();
    
    const container = document.getElementById('listaLivros');
    container.innerHTML = '';

    if (data.success && data.data.length > 0) {
        data.data.forEach(livro => {
            const card = document.createElement('div');
            card.className = 'card-livro';
            card.innerHTML = `
                <h3>${livro.nome_livro}</h3>
                <p><strong>Autor:</strong> ${livro.autor}</p>
                <p><strong>Gênero:</strong> ${livro.genero}</p>
                <p><strong>Nicho:</strong> ${livro.nicho}</p>
                <p><strong>Número:</strong> ${livro.numero_livro}</p>
            `;
            container.appendChild(card);
        });
    } else {
        container.innerHTML = '<p>Nenhum livro disponível no momento.</p>';
    }
}

async function carregarHistoricoDevolucoes() {
    const response = await fetch(`${API_URL}/biblioteca/historico-devolucoes`);
    const data = await response.json();
    
    const container = document.getElementById('listaHistorico');
    container.innerHTML = '';

    if (data.success && data.data.length > 0) {
        data.data.forEach(item => {
            const historico = document.createElement('div');
            historico.className = 'item-historico';
            historico.innerHTML = `
                <strong>${item.nome_livro}</strong> - ${item.autor}<br>
                <small>Aluno: ${item.nome_aluno}</small><br>
                <small>Empréstimo: ${item.data_emp} | Devolução: ${item.data_dev}</small>
            `;
            container.appendChild(historico);
        });
    } else {
        container.innerHTML = '<p>Nenhum histórico de devoluções.</p>';
    }
}

function configurarEventListeners() {
    
    document.getElementById('btnInserirLivro').addEventListener('click', () => {
        abrirModalInserirLivro();
    });

    document.getElementById('btnCancelarLivro').addEventListener('click', () => {
        document.getElementById('modalLivro').classList.add('hidden');
    });

    document.getElementById('formLivro').addEventListener('submit', async (e) => {
        e.preventDefault();
        await salvarLivro();
    });

     
    document.getElementById('btnEmprestarLivro').addEventListener('click', () => {
        abrirModalPesquisaLivro();
    });

    document.getElementById('btnCancelarPesquisa').addEventListener('click', () => {
        document.getElementById('modalPesquisaLivro').classList.add('hidden');
    });

    document.getElementById('btnPesquisar').addEventListener('click', pesquisarLivros);

     
    document.getElementById('btnCancelarEmprestimo').addEventListener('click', () => {
        document.getElementById('modalConfirmarEmprestimo').classList.add('hidden');
    });

    document.getElementById('btnConfirmarEmprestimo').addEventListener('click', confirmarEmprestimo);
}

function abrirModalInserirLivro(editar = false, livro = null) {
    const modal = document.getElementById('modalLivro');
    const titulo = document.getElementById('tituloModalLivro');
    const form = document.getElementById('formLivro');
    
    if (editar && livro) {
        titulo.textContent = 'Editar Livro';
        document.getElementById('idLivro').value = livro.id_livro;
        document.getElementById('nomeLivro').value = livro.nome_livro;
        document.getElementById('generoLivro').value = livro.genero;
        document.getElementById('autorLivro').value = livro.autor;
        document.getElementById('nichoLivro').value = livro.nicho;
        document.getElementById('numeroLivro').value = livro.numero_livro;
    } else {
        titulo.textContent = 'Inserir Novo Livro';
        form.reset();
        document.getElementById('idLivro').value = '';
    }
    
    modal.classList.remove('hidden');
}

async function salvarLivro() {
    const formData = {
        nome_livro: document.getElementById('nomeLivro').value,
        genero: document.getElementById('generoLivro').value,
        autor: document.getElementById('autorLivro').value,
        nicho: document.getElementById('nichoLivro').value,
        numero_livro: document.getElementById('numeroLivro').value
    };

    const idLivro = document.getElementById('idLivro').value;
    const url = idLivro ? `${API_URL}/biblioteca/editar-livro` : `${API_URL}/biblioteca/inserir-livro`;
    const method = idLivro ? 'PUT' : 'POST';

    if (idLivro) {
        formData.id_livro = idLivro;
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            alert(idLivro ? 'Livro atualizado com sucesso!' : 'Livro inserido com sucesso!');
            document.getElementById('modalLivro').classList.add('hidden');
            await carregarDados();
        } else {
            alert(data.message || 'Erro ao salvar livro.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao salvar livro.');
    }
}

function abrirModalPesquisaLivro() {
    document.getElementById('modalPesquisaLivro').classList.remove('hidden');
    document.getElementById('inputPesquisa').value = '';
    document.getElementById('resultadosPesquisa').innerHTML = '';
}

async function pesquisarLivros() {
    const termo = document.getElementById('inputPesquisa').value;
    
    if (!termo) {
        alert('Digite um termo para pesquisa.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/biblioteca/pesquisar-livro?termo=${encodeURIComponent(termo)}`);
        const data = await response.json();

        const container = document.getElementById('resultadosPesquisa');
        container.innerHTML = '';

        if (data.success && data.data.length > 0) {
            data.data.forEach(livro => {
                const item = document.createElement('div');
                item.className = 'item-pesquisa';
                item.innerHTML = `
                    <strong>${livro.nome_livro}</strong><br>
                    <small>Autor: ${livro.autor} | Gênero: ${livro.genero}</small><br>
                    <small>Nicho: ${livro.nicho} | Número: ${livro.numero_livro}</small>
                `;
                item.addEventListener('click', () => {
                    selecionarLivroParaEmprestimo(livro);
                });
                container.appendChild(item);
            });
        } else {
            container.innerHTML = '<p>Nenhum livro encontrado.</p>';
        }
    } catch (error) {
        console.error('Erro na pesquisa:', error);
        alert('Erro ao pesquisar livros.');
    }
}

function selecionarLivroParaEmprestimo(livro) {
    document.getElementById('modalPesquisaLivro').classList.add('hidden');
    
    const modal = document.getElementById('modalConfirmarEmprestimo');
    const detalhes = document.getElementById('detalhesLivro');
    
    detalhes.innerHTML = `
        <strong>${livro.nome_livro}</strong><br>
        <small>Autor: ${livro.autor}</small><br>
        <small>Gênero: ${livro.genero} | Nicho: ${livro.nicho}</small>
    `;
    
    modal.dataset.idLivro = livro.id_livro;
    document.getElementById('emailAluno').value = '';
    modal.classList.remove('hidden');
}

async function confirmarEmprestimo() {
    const emailAluno = document.getElementById('emailAluno').value;
    const idLivro = document.getElementById('modalConfirmarEmprestimo').dataset.idLivro;

    if (!emailAluno) {
        alert('Digite o email do aluno.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/biblioteca/registrar-emprestimo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email_aluno: emailAluno,
                id_livro: idLivro
            })
        });

        const data = await response.json();

        if (data.success) {
            alert('Empréstimo registrado com sucesso!');
            document.getElementById('modalConfirmarEmprestimo').classList.add('hidden');
            await carregarDados();
        } else {
            alert(data.message || 'Erro ao registrar empréstimo.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao registrar empréstimo.');
    }
}

async function registrarDevolucao(idEmprestimo) {
    if (!confirm('Confirmar devolução deste livro?')) {
        return;
    }
 
    try {
        const response = await fetch(`${API_URL}/biblioteca/registrar-devolucao`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_emprestimo: idEmprestimo
            })
        });

        const data = await response.json();

        if (data.success) {
            alert('Devolução registrada com sucesso!');
            await carregarDados();
        } else {
            alert(data.message || 'Erro ao registrar devolução.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao registrar devolução.');
    }
}

function irPara(pagina) {
    window.location.href = pagina;
}
