const db = require("../db_config.js");

const rankingTurmas = async () => {
  const [rows] = await db.query("SELECT * FROM vw_ranking_maior_frec_turma;");
  return rows;
};

const progressoTemporal = async (turma) => {
  let query = "SELECT * FROM vw_prog_temporal_turma";
  const params = [];
  if (turma) {
    query += " WHERE nome_turma = ?";
    params.push(turma);
  }
  query += " ORDER BY ano, mes";
  const [rows] = await db.query(query, params);
  return rows;
};

const taxaRetencao = async () => {
  const [rows] = await db.query("SELECT * FROM vw_taxa_retencao_periodo;");
  return rows;
};

const turmasAtencao = async () => {
  const [rows] = await db.query("SELECT * FROM vw_turmas_precisam_atencao;");
  return rows;
};

const previsaoEvasao = async () => {
  const [rows] = await db.query("SELECT * FROM vw_prev_evacao;");
  return rows;
};

const linhaTempoSaidas = async () => {
  const [rows] = await db.query("SELECT * FROM vw_linha_tem_saidas;");
  return rows;
};

module.exports = {
  rankingTurmas,
  progressoTemporal,
  taxaRetencao,
  turmasAtencao,
  previsaoEvasao,
  linhaTempoSaidas
};
