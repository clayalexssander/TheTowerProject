const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get("/ranking-turmas", dashboardController.rankingTurmas);
router.get("/progresso-temporal", dashboardController.progressoTemporal);
router.get("/taxa-retencao", dashboardController.taxaRetencao);
router.get("/turmas-atencao", dashboardController.turmasAtencao);
router.get("/previsao-evasao", dashboardController.previsaoEvasao);
router.get("/linha-tempo-saidas", dashboardController.linhaTempoSaidas);

module.exports = router;