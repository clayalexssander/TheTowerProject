const dashboardModel = require('../models/dashboardModel');

const rankingTurmas = async (req, res) => {
  try {
    const data = await dashboardModel.rankingTurmas();
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const progressoTemporal = async (req, res) => {
  const { turma } = req.query;
  try {
    const data = await dashboardModel.progressoTemporal(turma);
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const taxaRetencao = async (req, res) => {
  try {
    const data = await dashboardModel.taxaRetencao();
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const turmasAtencao = async (req, res) => {
  try {
    const data = await dashboardModel.turmasAtencao();
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const previsaoEvasao = async (req, res) => {
  try {
    const data = await dashboardModel.previsaoEvasao();
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const linhaTempoSaidas = async (req, res) => {
  try {
    const data = await dashboardModel.linhaTempoSaidas();
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  rankingTurmas,
  progressoTemporal,
  taxaRetencao,
  turmasAtencao,
  previsaoEvasao,
  linhaTempoSaidas
};
