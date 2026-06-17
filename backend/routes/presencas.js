const express = require('express');
const router = express.Router();
const presencaController = require('../controllers/presencaController');

router.get("/:idAula", presencaController.listarPresencasPorAula);
router.post("/registrar", presencaController.realizarChamada);
router.post("/concluir/conversacao/:idTurma", presencaController.concluiConversacao);

module.exports = router;