const express = require("express");
const router = express.Router();
const aulaDemonstrativaController = require('../controllers/aulaDemonstrativaController');

router.get("/listar", aulaDemonstrativaController.listarAulas);
router.post("/marcar", aulaDemonstrativaController.marcarAula);
router.post("/enviar-confirmacao-email", aulaDemonstrativaController.enviarConfirmacaoEmail);
router.put("/cancelar/:id", aulaDemonstrativaController.cancelarAula);
router.put("/confirmar/:id", aulaDemonstrativaController.confirmarMatricula);

module.exports = router;
