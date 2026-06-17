const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');

router.get("/pesquisar/:nome", alunoController.pesquisarAluno);
router.get("/frequencia/:idAluno", alunoController.obterFrequencia);
router.get("/historico/:idAluno", alunoController.historicoAluno);
router.put("/editar/:id", alunoController.editaAluno);
router.get("/turmas", alunoController.listaTurmas);
router.post("/matricular", alunoController.matriculaAluno);

module.exports = router;