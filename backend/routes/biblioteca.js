const express = require('express');
const router = express.Router();
const bibliotecaController = require('../controllers/bibliotecaController');

router.get("/emprestimos-ativos", bibliotecaController.emprestimosAtivos);
router.get("/livros-disponiveis", bibliotecaController.livrosDisponiveis);
router.get("/historico-devolucoes", bibliotecaController.historicoDevolucoes);
router.get("/pesquisar-livro", bibliotecaController.pesquisarLivro);
router.post("/inserir-livro", bibliotecaController.inserirLivro);
router.put("/editar-livro", bibliotecaController.editarLivro);
router.post("/registrar-emprestimo", bibliotecaController.registrarEmprestimo);
router.post("/registrar-devolucao", bibliotecaController.registrarDevolucao);

module.exports = router;