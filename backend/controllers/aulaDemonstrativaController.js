const aulaDemonstrativaModel = require('../models/aulaDemonstrativaModel');
const nodemailer = require("nodemailer");

function criarTransporterEmail() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) return null;
    return nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS }
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

const listarAulas = async (req, res) => {
    try {
        const rows = await aulaDemonstrativaModel.listarAulas();
        res.json(rows);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
};

const marcarAula = async (req, res) => {
    const { nome, email, data, horario } = req.body;
    try {
        const resultado = await aulaDemonstrativaModel.marcarAula(nome, data, email, horario);
        res.json(resultado);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
};

const enviarConfirmacaoEmail = async (req, res) => {
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
};

const cancelarAula = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await aulaDemonstrativaModel.cancelarAula(id);
        res.json(resultado);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
};

const confirmarMatricula = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await aulaDemonstrativaModel.confirmarMatricula(id);
        res.json(resultado);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
};

module.exports = {
    listarAulas,
    marcarAula,
    enviarConfirmacaoEmail,
    cancelarAula,
    confirmarMatricula
};
