const cadastraMaterialModel = require('../models/cadastraMaterialModel');
const fs = require('fs');

const cadastra = async (req, res) => {
    const file = req.files ? req.files.find(f => f.fieldname === 'pdf') : null;
    const nome_arquivo = file ? file.originalname : null;

    const tipo_aula = req.body.tipo_aula;
    const nome_pasta = req.body.nome_pasta || '';
    const id_book = req.body.id_book ? parseInt(req.body.id_book) : null;
    const numero_lesson = req.body.numero_lesson ? parseInt(req.body.numero_lesson) : null;
    const titulo = req.body.titulo || '';

    if (!tipo_aula || !nome_arquivo) {
        if (file && file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
        return res.status(400).json({ resultado: 0, mensagem: 'Dados incompletos' });
    }

    try {
        const resultado = await cadastraMaterialModel.cadastra(tipo_aula, nome_pasta, nome_arquivo, titulo, id_book, numero_lesson);
        if (resultado === 1) {
            return res.json({ resultado: 1, mensagem: 'Cadastrado com sucesso' });
        } else {
            if (file && file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
            return res.json({ resultado: 0, mensagem: 'Não foi possível cadastrar: arquivo pode já existir ou dados inválidos.' });
        }
    } catch (error) {
        console.error('Erro procedure:', error);
        if (file && file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
        return res.status(500).json({ resultado: 0, mensagem: 'Erro interno no servidor.' });
    }
};

const listarBooks = async (req, res) => {
    try {
        const rows = await cadastraMaterialModel.listarBooks();
        res.json(rows);
    } catch (err) {
        console.error("Erro ao buscar books:", err);
        res.status(500).json({ mensagem: "Erro interno ao buscar os books." });
    }
};

module.exports = {
    cadastra,
    listarBooks
};
