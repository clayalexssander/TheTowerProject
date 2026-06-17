const express = require('express');
const router = express.Router();
const turmaController = require('../controllers/turmaController');

router.get("/info/:id", turmaController.infoTurma);
router.get("/alunos/:id", turmaController.alunosTurma);
router.get("/ultima/:id", turmaController.ultimaAula);
router.get("/", turmaController.listaTurmas);
router.post("/", turmaController.criarTurma);
router.put("/editar", turmaController.editarTurma);

module.exports = router;