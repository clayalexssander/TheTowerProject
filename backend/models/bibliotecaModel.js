const db = require("../db_config.js");

const emprestimosAtivos = async () => {
    const [rows] = await db.query("SELECT * FROM vw_emprestimos_ativos ");
    return rows;
};

const livrosDisponiveis = async () => {
    const [rows] = await db.query("SELECT * FROM tb_acervo_livros WHERE status = 'Disponivel'");
    return rows;
};

const historicoDevolucoes = async () => {
    const [rows] = await db.query("SELECT * FROM vw_emprestimos_finalizados");
    return rows;
};

const pesquisarLivro = async (termo) => {
    const numeroLivro = parseInt(termo);
    const [rows] = await db.query("CALL sp_pesquisa_livro(?, ?)", [termo, isNaN(numeroLivro) ? null : numeroLivro]);
    return rows[0];
};

const inserirLivro = async (nome_livro, genero, autor, nicho, numero_livro) => {
    const [resultados] = await db.query("CALL sp_insere_livro(?, ?, ?, ?, ?)", [nome_livro, genero, autor, nicho, numero_livro]);
    return resultados?.[0]?.[0]?.resultado;
};

const editarLivro = async (nome_livro, genero, autor, nicho, numero_livro) => {
    const [resultados] = await db.query("CALL sp_edita_livro(?, ?, ?, ?, ?)", [nome_livro, genero, autor, nicho, numero_livro]);
    return resultados?.[0]?.[0]?.resultado;
};

const registrarEmprestimo = async (email_aluno, id_livro) => {
    const [resultados] = await db.query("CALL sp_registar_emprestimo(?, ?)", [email_aluno, id_livro]);
    return resultados?.[0]?.[0]?.resultado;
};

const registrarDevolucao = async (id_emprestimo) => {
    const [resultados] = await db.query("CALL sp_registra_devolução(?)", [id_emprestimo]);
    return resultados?.[0]?.[0]?.resultado;
};

module.exports = {
    emprestimosAtivos,
    livrosDisponiveis,
    historicoDevolucoes,
    pesquisarLivro,
    inserirLivro,
    editarLivro,
    registrarEmprestimo,
    registrarDevolucao
};
