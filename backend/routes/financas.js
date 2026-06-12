const express = require('express');
const router = express.Router();
const db = require("../db_config.js");
const {
  enviarRelatorioFinanceiroMensal
} = require("../services/financialReportService.js");

// listar mensalidades (select * from tb_mensalidades;)
router.get("/mensalidades", async (req, res) => {
  try{
    const [rows] = await db.query("SELECT id_mensalidade, tipo, valor FROM tb_mensalidades;");
    res.json({ success: true, data: rows });
  }catch(err){
    console.error(err);
    res.status(500).json({ success:false, message: err.message });
  }
});

// realizar pagamento -> chama procedure sp_realiza_pagamento
router.post("/pagamento", async (req, res) => {
  const { email_aluno, id_mensalidade } = req.body;
  if (!email_aluno || !id_mensalidade) {
    return res.status(400).json({ success:false, message: "email_aluno e id_mensalidade são obrigatórios." });
  }
  try{
    // CALL sp_realiza_pagamento(email, id);
    const [results] = await db.query("CALL sp_realiza_pagamento(?, ?);", [email_aluno, id_mensalidade]);
    // mysql returns an array of resultsets; the last SELECT should be in results[0]
    const resultadoRow = Array.isArray(results) && results[0] ? results[0][0] || results[0] : results[0];
    // try to extract resultado field robustly
    let resultado;
    if (Array.isArray(results) && results[0] && results[0][0] && 'resultado' in results[0][0]) {
      resultado = results[0][0].resultado;
    } else if (resultadoRow && 'resultado' in resultadoRow) {
      resultado = resultadoRow.resultado;
    } else {
      // fallback: try first element
      resultado = resultadoRow && resultadoRow.resultado ? resultadoRow.resultado : null;
    }

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
});

// endpoints das análises (cada um chama a procedure respectiva)
// 1 projeção
router.get("/projecao", async (req, res) => {
  try{
    const [rows] = await db.query("CALL sp_projecao_receita();");
    res.json({ success:true, data: rows[0] });
  }catch(err){ console.error(err); res.status(500).json({ success:false, message: err.message }); }
});

// 2 tendencia
router.get("/tendencia", async (req, res) => {
  try{
    const [rows] = await db.query("CALL sp_tendencia_sazonalidade_receita();");
    res.json({ success:true, data: rows[0] });
  }catch(err){ console.error(err); res.status(500).json({ success:false, message: err.message }); }
});

// 3 ltv
router.get("/ltv", async (req, res) => {
  try{
    const [rows] = await db.query("CALL sp_ltv_alunos();");
    res.json({ success:true, data: rows[0] });
  }catch(err){ console.error(err); res.status(500).json({ success:false, message: err.message }); }
});

// 4 previsão 3 meses
router.get("/prev3", async (req, res) => {
  try{
    const [rows] = await db.query("CALL sp_prev_receita_3_meses();");
    res.json({ success:true, data: rows[0] });
  }catch(err){ console.error(err); res.status(500).json({ success:false, message: err.message }); }
});

// 5 impacto bolsistas
router.get("/impacto_bolsistas", async (req, res) => {
  try{
    const [rows] = await db.query("CALL sp_impac_bolsistas();");
    res.json({ success:true, data: rows[0] });
  }catch(err){ console.error(err); res.status(500).json({ success:false, message: err.message }); }
});

// 6 inadimplentes
router.get("/inadimplentes", async (req, res) => {
  try{
    const [rows] = await db.query("CALL sp_alunos_inidimplentes();");
    res.json({ success:true, data: rows[0] });
  }catch(err){ console.error(err); res.status(500).json({ success:false, message: err.message }); }
});

// 7 sazonalidade de matriculas
router.get("/sazonalidade", async (req, res) => {
  try{
    const [rows] = await db.query("CALL sp_sazonalidade_matriculas_mes();");
    res.json({ success:true, data: rows[0] });
  }catch(err){ console.error(err); res.status(500).json({ success:false, message: err.message }); }
});

// alunos que não pagaram no mês atual
router.get("/nao_pagaram_mes_atual", async (req, res) => {
  try{
    const [rows] = await db.query("CALL sp_alunos_pagamentos_mes_atual();");
    res.json({ success:true, data: rows[0] });
  }catch(err){ console.error(err); res.status(500).json({ success:false, message: err.message }); }
});

// envia o relatorio financeiro mensal por email manualmente
router.post("/relatorio-mensal/enviar", async (req, res) => {
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
});

module.exports = router;
