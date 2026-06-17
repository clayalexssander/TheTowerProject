const API_URL = "http://localhost:3000/api";

document.addEventListener("DOMContentLoaded", () => {
    configurarModalInserirBook();
    carregarEstoque();
});

function configurarModalInserirBook() {
    const modal = document.getElementById('modalInserirBook');
    const form = document.getElementById('formInserirBook');
    const inputNumeroBook = document.getElementById('numeroBookInput');
    const btnAbrirModal = document.getElementById('btnAbrirModalBook');
    const btnCancelar = document.getElementById('btnCancelarBook');

    btnAbrirModal.addEventListener('click', () => {
        form.reset();
        modal.classList.remove('hidden');
        inputNumeroBook.focus();
    });

    btnCancelar.addEventListener('click', fecharModalInserirBook);

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            fecharModalInserirBook();
        }
    });

    form.addEventListener('submit', inserirBook);
}

function fecharModalInserirBook() {
    document.getElementById('modalInserirBook').classList.add('hidden');
}

async function carregarEstoque() {
    try {
        const response = await fetch(`${API_URL}/estoque/listar`);
        const data = await response.json();

        if (data.success) {
            renderizarTabela(data.data);
            atualizarTotais(data.data);
        } else {
            alert('Erro ao carregar estoque.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor.');
    }
}

function renderizarTabela(estoque) {
    const corpoTabela = document.getElementById('corpoTabela');
    corpoTabela.innerHTML = '';

    estoque.forEach(item => {
        const linha = document.createElement('tr');
        
        // Cor da quantidade
        let corQuantidade = 'quantidade-normal';
        if (item.quantidade === 0) {
            corQuantidade = 'quantidade-zero';
        } else if (item.quantidade < 5) {
            corQuantidade = 'quantidade-baixa';
        }

        linha.innerHTML = `
            <td>Book ${item.numero_book}</td>
            <td>Material didático Book ${item.numero_book}</td>
            <td class="coluna-quantidade">
                <span class="${corQuantidade}">${item.quantidade} unidades</span>
            </td>
            <td class="coluna-acoes">
                <div class="grupo-botoes">
                    <button class="btn-acao btn-incrementar" onclick="incrementarEstoque(${item.numero_book})">
                        + Adicionar
                    </button>
                    <button class="btn-acao btn-decrementar ${item.quantidade === 0 ? 'btn-desabilitado' : ''}" 
                            onclick="decrementarEstoque(${item.numero_book})"
                            ${item.quantidade === 0 ? 'disabled' : ''}>
                        - Remover
                    </button>
                </div>
            </td>
        `;
        
        corpoTabela.appendChild(linha);
    });
}

function atualizarTotais(estoque) {
    const totalBooks = estoque.reduce((total, item) => total + item.quantidade, 0);
    const booksDisponiveis = estoque.filter(item => item.quantidade > 0).length;

    document.getElementById('totalBooks').textContent = totalBooks;
    document.getElementById('booksDisponiveis').textContent = booksDisponiveis;
}

async function inserirBook(event) {
    event.preventDefault();

    const inputNumeroBook = document.getElementById('numeroBookInput');
    const numeroBook = Number(inputNumeroBook.value);

    if (!Number.isInteger(numeroBook) || numeroBook < 0) {
        alert('Informe um numero de book inteiro valido.');
        inputNumeroBook.focus();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/estoque/inserirBook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                numero_book: numeroBook
            })
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message || 'Book inserido com sucesso!');
            fecharModalInserirBook();
            carregarEstoque();
        } else {
            alert(data.message || 'Erro ao inserir book.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor.');
    }
}

async function incrementarEstoque(numeroBook) {
    if (!confirm(`Adicionar 1 unidade ao Book ${numeroBook}?`)) return;

    try {
        const response = await fetch(`${API_URL}/estoque/incrementar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                numero_book: numeroBook
            })
        });

        const data = await response.json();

        if (data.success) {
            alert('Estoque atualizado com sucesso!');
            carregarEstoque(); // Recarrega a tabela
        } else {
            alert(data.message || 'Erro ao atualizar estoque.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor.');
    }
}

async function decrementarEstoque(numeroBook) {
    if (!confirm(`Remover 1 unidade do Book ${numeroBook}?`)) return;

    try {
        const response = await fetch(`${API_URL}/estoque/decrementar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                numero_book: numeroBook
            })
        });

        const data = await response.json();

        if (data.success) {
            alert('Estoque atualizado com sucesso!');
            carregarEstoque(); // Recarrega a tabela
        } else {
            alert(data.message || 'Erro ao atualizar estoque.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor.');
    }
}

function irPara(pagina) {
    window.location.href = pagina;
}
