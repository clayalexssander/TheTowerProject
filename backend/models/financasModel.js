const db = require("../db_config.js");

const mensalidades = async () => {
  const [rows] = await db.query("SELECT id_mensalidade, tipo, valor FROM tb_mensalidades;");
  return rows;
};

const pagamento = async (email_aluno, id_mensalidade) => {
    const [results] = await db.query("CALL sp_realiza_pagamento(?, ?);", [email_aluno, id_mensalidade]);
    const resultadoRow = Array.isArray(results) && results[0] ? results[0][0] || results[0] : results[0];
    let resultado;
    if (Array.isArray(results) && results[0] && results[0][0] && 'resultado' in results[0][0]) {
      resultado = results[0][0].resultado;
    } else if (resultadoRow && 'resultado' in resultadoRow) {
      resultado = resultadoRow.resultado;
    } else {
      resultado = resultadoRow && resultadoRow.resultado ? resultadoRow.resultado : null;
    }
    return resultado;
};

const projecao = async () => {
  const [rows] = await db.query("CALL sp_projecao_receita();");
  return rows[0];
};

const tendencia = async () => {
  const [rows] = await db.query("CALL sp_tendencia_sazonalidade_receita();");
  return rows[0];
};

const ltv = async () => {
  const [rows] = await db.query("CALL sp_ltv_alunos();");
  return rows[0];
};

const prev3 = async () => {
  const [rows] = await db.query("CALL sp_prev_receita_3_meses();");
  return rows[0];
};

const impactoBolsistas = async () => {
  const [rows] = await db.query("CALL sp_impac_bolsistas();");
  return rows[0];
};

const inadimplentes = async () => {
  const [rows] = await db.query("CALL sp_alunos_inidimplentes();");
  return rows[0];
};

const sazonalidade = async () => {
  const [rows] = await db.query("CALL sp_sazonalidade_matriculas_mes();");
  return rows[0];
};

const naoPagaramMesAtual = async () => {
  const [rows] = await db.query("CALL sp_alunos_pagamentos_mes_atual();");
  return rows[0];
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
  naoPagaramMesAtual
};
