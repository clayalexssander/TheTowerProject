const bibliotecaModel = require('../models/bibliotecaModel');

const emprestimosAtivos = async (req, res) => {
    try {
        const rows = await bibliotecaModel.emprestimosAtivos();
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const livrosDisponiveis = async (req, res) => {
    try {
        const rows = await bibliotecaModel.livrosDisponiveis();
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const historicoDevolucoes = async (req, res) => {
    try {
        const rows = await bibliotecaModel.historicoDevolucoes();
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const pesquisarLivro = async (req, res) => {
    const { termo } = req.query;
    try {
        const data = await bibliotecaModel.pesquisarLivro(termo);
        res.json({ success: true, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const inserirLivro = async (req, res) => {
    const { nome_livro, genero, autor, nicho, numero_livro } = req.body;
    if (!nome_livro || !genero || !autor || !nicho || !numero_livro) {
        return res.status(400).json({ success: false, message: "Todos os campos são obrigatórios" });
    }
    try {
        const resultado = await bibliotecaModel.inserirLivro(nome_livro, genero, autor, nicho, numero_livro);
        if (resultado === 1) {
            res.json({ success: true, message: "Livro inserido com sucesso!" });
        } else if (resultado === 2) {
            res.json({ success: false, message: "Já existe um livro com este nicho e número!" });
        } else {
            res.json({ success: false, message: "Erro ao inserir livro!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const editarLivro = async (req, res) => {
    const { id_livro, nome_livro, genero, autor, nicho, numero_livro } = req.body;
    if (!id_livro || !nome_livro || !genero || !autor || !nicho || !numero_livro) {
        return res.status(400).json({ success: false, message: "Todos os campos são obrigatórios" });
    }
    try {
        const resultado = await bibliotecaModel.editarLivro(nome_livro, genero, autor, nicho, numero_livro);
        if (resultado === 1) {
            res.json({ success: true, message: "Livro atualizado com sucesso!" });
        } else if (resultado === 2) {
            res.json({ success: false, message: "Livro não encontrado!" });
        } else {
            res.json({ success: false, message: "Erro ao atualizar livro!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const registrarEmprestimo = async (req, res) => {
    const { email_aluno, id_livro } = req.body;
    if (!email_aluno || !id_livro) {
        return res.status(400).json({ success: false, message: "Email do aluno e ID do livro são obrigatórios" });
    }
    try {
        const resultado = await bibliotecaModel.registrarEmprestimo(email_aluno, id_livro);
        if (resultado === 1) {
            res.json({ success: true, message: "Empréstimo registrado com sucesso!" });
        } else if (resultado === 2) {
            res.json({ success: false, message: "Aluno ou livro não encontrado!" });
        } else if (resultado === 3) {
            res.json({ success: false, message: "Este livro já está emprestado!" });
        } else {
            res.json({ success: false, message: "Erro ao registrar empréstimo!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const registrarDevolucao = async (req, res) => {
    const { id_emprestimo } = req.body;
    if (!id_emprestimo) {
        return res.status(400).json({ success: false, message: "ID do empréstimo é obrigatório" });
    }
    try {
        const resultado = await bibliotecaModel.registrarDevolucao(id_emprestimo);
        if (resultado === 1) {
            res.json({ success: true, message: "Devolução registrada com sucesso!" });
        } else if (resultado === 2) {
            res.json({ success: false, message: "Empréstimo não encontrado ou já devolvido!" });
        } else {
            res.json({ success: false, message: "Erro ao registrar devolução!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    emprestimosAtivos,
    livrosDisponiveis,
    historicoDevolucoes,
    pesquisarLivro,
    inserirLivro,
    editarLivro,
    registrarEmprestimo,
    registrarDevolucao
};
