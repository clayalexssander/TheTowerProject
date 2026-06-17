const estoqueModel = require('../models/estoqueModel');

function obterNumeroBook(req, res) {
    const valorNumeroBook = req.body.numero_book;
    const numeroBook = Number(valorNumeroBook);
    if (valorNumeroBook === undefined || valorNumeroBook === null || valorNumeroBook === '' || !Number.isInteger(numeroBook) || numeroBook < 0) {
        res.status(400).json({
            success: false,
            message: "Numero do book deve ser um inteiro valido"
        });
        return null;
    }
    return numeroBook;
}

const listar = async (req, res) => {
    try {
        const rows = await estoqueModel.listar();
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const inserirBook = async (req, res) => {
    const numeroBook = obterNumeroBook(req, res);
    if (numeroBook === null) return;
    try {
        const resultado = await estoqueModel.inserirBook(numeroBook);
        if (resultado === 1) {
            return res.json({ success: true, message: "Book inserido com sucesso!", resultado: resultado });
        }
        if (resultado === 2) {
            return res.json({ success: false, message: "Esse tipo de book ja existe no estoque!", resultado: resultado });
        }
        return res.json({ success: false, message: "Erro inesperado ao inserir book!", resultado: resultado || 3 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erro inesperado ao inserir book!", error: error.message, resultado: 3 });
    }
};

const incrementar = async (req, res) => {
    const numero_book = obterNumeroBook(req, res);
    if (numero_book === null) return;
    try {
        const resultado = await estoqueModel.incrementar(numero_book);
        if (resultado === 1) {
            res.json({ success: true, message: "Estoque incrementado com sucesso!", resultado: resultado });
        } else {
            res.json({ success: false, message: "Book não encontrado no estoque!", resultado: resultado });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const decrementar = async (req, res) => {
    const numero_book = obterNumeroBook(req, res);
    if (numero_book === null) return;
    try {
        const resultado = await estoqueModel.decrementar(numero_book);
        if (resultado === 1) {
            res.json({ success: true, message: "Estoque decrementado com sucesso!", resultado: resultado });
        } else if (resultado === 2) {
            res.json({ success: false, message: "Não é possível decrementar - quantidade zero ou book não encontrado!", resultado: resultado });
        } else {
            res.json({ success: false, message: "Erro ao decrementar estoque!", resultado: resultado });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    listar,
    inserirBook,
    incrementar,
    decrementar
};
