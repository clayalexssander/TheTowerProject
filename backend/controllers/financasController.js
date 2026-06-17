const financasModel = require('../models/financasModel');
const { enviarRelatorioFinanceiroMensal } = require("../services/financialReportService.js");

const mensalidades = async (req, res) => {
  try{
    const data = await financasModel.mensalidades();
    res.json({ success: true, data });
  }catch(err){
    console.error(err);
    res.status(500).json({ success:false, message: err.message });
  }
};

const pagamento = async (req, res) => {
  const { email_aluno, id_mensalidade } = req.body;
  if (!email_aluno || !id_mensalidade) {
    return res.status(400).json({ success:false, message: "email_aluno e id_mensalidade são obrigatórios." });
  }
  try{
    const resultado = await financasModel.pagamento(email_aluno, id_mensalidade);

    let message = "";
    if (resultado === 1) message = "Pagamento registrado com sucesso.";
    else if (resultado === 2) message = "Aluno ou Mensalidade não encontrado.";
    else if (resultado === 3) message = "Pagamento já realizado no mês corrente.";
    else if (resultado === 0) message = "Erro interno ao tentar registrar pagamento.";
    else message = "Resposta inesperada do servidor.";

    res.json({ success: resultado === 1, code: resultado, message });
  }catch(err){
    console.error(err);
    res.status(500).json({ success:false, message: "Erro no servidor: " + err.message });
  }
};

const projecao = async (req, res) => {
  try{
    const data = await financasModel.projecao();
    res.json({ success:true, data });
  }catch(err){ console.error(err); res.status(500).json({ success:false, message: err.message }); }
};

const tendencia = async (req, res) => {
  try{
    const data = await financasModel.tendencia();
    res.json({ success:true, data });
  }catch(err){ console.error(err); res.status(500).json({ success:false, message: err.message }); }
};

const ltv = async (req, res) => {
  try{
    const data = await financasModel.ltv();
    res.json({ success:true, data });
  }catch(err){ console.error(err); res.status(500).json({ success:false, message: err.message }); }
};

const prev3 = async (req, res) => {
  try{
    const data = await financasModel.prev3();
    res.json({ success:true, data });
  }catch(err){ console.error(err); res.status(500).json({ success:false, message: err.message }); }
};

const impactoBolsistas = async (req, res) => {
  try{
    const data = await financasModel.impactoBolsistas();
    res.json({ success:true, data });
  }catch(err){ console.error(err); res.status(500).json({ success:false, message: err.message }); }
};

const inadimplentes = async (req, res) => {
  try{
    const data = await financasModel.inadimplentes();
    res.json({ success:true, data });
  }catch(err){ console.error(err); res.status(500).json({ success:false, message: err.message }); }
};

const sazonalidade = async (req, res) => {
  try{
    const data = await financasModel.sazonalidade();
    res.json({ success:true, data });
  }catch(err){ console.error(err); res.status(500).json({ success:false, message: err.message }); }
};

const naoPagaramMesAtual = async (req, res) => {
  try{
    const data = await financasModel.naoPagaramMesAtual();
    res.json({ success:true, data });
  }catch(err){ console.error(err); res.status(500).json({ success:false, message: err.message }); }
};

const relatorioMensalEnviar = async (req, res) => {
  try{
    const resultado = await enviarRelatorioFinanceiroMensal(req.body?.email);
    res.json({
      success: true,
      message: "Relatorio financeiro mensal enviado com sucesso.",
      data: resultado
    });
  }catch(err){
    console.error(err);
    res.status(500).json({ success:false, message: err.message });
  }
};

module.exports = {
  mensalidades,
  pagamento,
  projecao,
  tendencia,
  ltv,
  prev3,
  impactoBolsistas,
  inadimplentes,
  sazonalidade,
  naoPagaramMesAtual,
  relatorioMensalEnviar
};
