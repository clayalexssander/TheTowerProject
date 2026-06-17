const express = require('express');
const router = express.Router();
const aulaController = require('../controllers/aulaController');

router.get("/:idTurma/:tipoAula", aulaController.listaAulas);
router.put("/concluir/:idAula", aulaController.concluiAula);

module.exports = router;