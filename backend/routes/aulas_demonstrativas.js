const express = require("express");
const router = express.Router();
const db = require("../db_config.js");
const nodemailer = require("nodemailer");

function criarTransporterEmail() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
        return null;
    }

    return nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS
        }
    });
}

function formatarData(data) {
    if (!data) return "";

    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}

function montarMensagemConfirmacao(nome, data, horario) {
    const dataFormatada = formatarData(data);
    const horarioFormatado = horario.slice(0, 5);

    return `Ola, ${nome}! Sua aula demonstrativa na The Tower Idiomas foi agendada para ${dataFormatada} as ${horarioFormatado}. Qualquer duvida, estamos a disposicao.`;
}

// LISTAR AULAS EM ANDAMENTO
router.get("/listar", async (req, res) => {
    try {
        const [rows] = await db.query(
            "select * from vw_aulas_demonstrativas_marcadas;"
        );
        res.json(rows);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// MARCAR AULA
router.post("/marcar", async (req, res) => {
    const { nome, email, data, horario } = req.body;

    try {
        const [resultado] = await db.query(
            "CALL sp_marca_aula_demostrativa(?,?,?,?);",
            [nome, data, email, horario]
        );

        res.json(resultado[0][0]);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// ENVIAR CONFIRMACAO POR EMAIL
router.post("/enviar-confirmacao-email", async (req, res) => {
    const { nome, email, data, horario } = req.body;

    if (!nome || !email || !data || !horario) {
        return res.status(400).json({ erro: "Dados incompletos para enviar email." });
    }

    const transporter = criarTransporterEmail();

    if (!transporter) {
        return res.status(500).json({
            erro: "SMTP nao configurado. Defina SMTP_HOST, SMTP_PORT, SMTP_USER e SMTP_PASS."
        });
    }

    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: email,
            subject: "Confirmacao da sua aula demonstrativa",
            text: montarMensagemConfirmacao(nome, data, horario)
        });

        res.json({ resultado: 1 });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// CANCELAR
router.put("/cancelar/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const [resultado] = await db.query(
            "CALL sp_cancela_aula_demostrativa(?);",
            [id]
        );
        res.json(resultado[0][0]);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// CONFIRMAR MATRÍCULA
router.put("/confirmar/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const [resultado] = await db.query(
            "CALL sp_cofirma_matricula(?);",
            [id]
        );
        res.json(resultado[0][0]);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

module.exports = router;
