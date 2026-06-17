const express = require('express');
const router = express.Router();
const estoqueController = require('../controllers/estoqueController');

router.get("/listar", estoqueController.listar);
router.post("/inserirBook", estoqueController.inserirBook);
router.post("/incrementar", estoqueController.incrementar);
router.post("/decrementar", estoqueController.decrementar);

module.exports = router;
