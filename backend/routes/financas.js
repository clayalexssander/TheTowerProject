const express = require('express');
const router = express.Router();
const financasController = require('../controllers/financasController');

router.get("/mensalidades", financasController.mensalidades);
router.post("/pagamento", financasController.pagamento);
router.get("/projecao", financasController.projecao);
router.get("/tendencia", financasController.tendencia);
router.get("/ltv", financasController.ltv);
router.get("/prev3", financasController.prev3);
router.get("/impacto_bolsistas", financasController.impactoBolsistas);
router.get("/inadimplentes", financasController.inadimplentes);
router.get("/sazonalidade", financasController.sazonalidade);
router.get("/nao_pagaram_mes_atual", financasController.naoPagaramMesAtual);
router.post("/relatorio-mensal/enviar", financasController.relatorioMensalEnviar);

module.exports = router;
