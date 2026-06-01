const express = require('express');
const router = express.Router();
const db = require("../db_config.js");

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

router.get("/listar", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM tb_estoque ORDER BY numero_book");
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post("/inserirBook", async (req, res) => {
    const numeroBook = obterNumeroBook(req, res);
    if (numeroBook === null) return;

    try {
        const [resultados] = await db.query("CALL sp_insere_book(?)", [numeroBook]);
        const resultado = resultados?.[0]?.[0]?.resultado;
        console.log("Resultado da insercao do book:", resultado);
        if (resultado === 1) {
            return res.json({
                success: true,
                message: "Book inserido com sucesso!",
                resultado: resultado
            });
        }

        if (resultado === 2) {
            return res.json({
                success: false,
                message: "Esse tipo de book ja existe no estoque!",
                resultado: resultado
            });
        }

        return res.json({
            success: false,
            message: "Erro inesperado ao inserir book!",
            resultado: resultado || 3
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Erro inesperado ao inserir book!",
            error: error.message,
            resultado: 3
        });
    }
});

router.post("/incrementar", async (req, res) => {
    const numero_book = obterNumeroBook(req, res);
    if (numero_book === null) return;

    try {
        const [resultados] = await db.query("CALL sp_incrementa_estoque(?)", [numero_book]);
        const resultado = resultados?.[0]?.[0]?.resultado;

        if (resultado === 1) {
            res.json({ 
                success: true, 
                message: "Estoque incrementado com sucesso!",
                resultado: resultado
            });
        } else {
            res.json({ 
                success: false, 
                message: "Book não encontrado no estoque!",
                resultado: resultado
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post("/decrementar", async (req, res) => {
    const numero_book = obterNumeroBook(req, res);
    if (numero_book === null) return;

    try {
        const [resultados] = await db.query("CALL sp_decrementa_estoque(?)", [numero_book]);
        const resultado = resultados?.[0]?.[0]?.resultado;

        if (resultado === 1) {
            res.json({ 
                success: true, 
                message: "Estoque decrementado com sucesso!",
                resultado: resultado
            });
        } else if (resultado === 2) {
            res.json({ 
                success: false, 
                message: "Não é possível decrementar - quantidade zero ou book não encontrado!",
                resultado: resultado
            });
        } else {
            res.json({ 
                success: false, 
                message: "Erro ao decrementar estoque!",
                resultado: resultado
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;

