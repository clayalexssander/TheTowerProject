const db = require('../db_config');

const pesquisarAluno = async (nome) => {
    const [alunos] = await db.query("CALL sp_pesquisa_aluno(?);", [nome]);
    return alunos[0];
};

const obterFrequencia = async (idAluno) => {
    const [rows] = await db.query("CALL sp_obter_frequencia_aluno(?);", [idAluno]);
    return rows[0];
};

const historicoAluno = async (idAluno) => {
    const [rows] = await db.query("CALL sp_historico_aluno(?);", [idAluno]);
    return rows;
};

const editaAluno = async (id, nome, cidade, tipo_bancaria, telefone, bolsista, email, ativo, nivel, id_turma) => {
    const [resultados] = await db.query("CALL sp_edita_aluno(?,?,?,?,?,?,?,?,?,?);",
      [id, nome, cidade, tipo_bancaria, telefone, bolsista, email, ativo, nivel, id_turma]
    );
    return resultados?.[0]?.[0]?.resultado;
};

const listaTurmas = async () => {
    const [turmas] = await db.query("call sp_lista_turmas();");
    return turmas[0];
};

const matriculaAluno = async (nome, cidade, tipo_bancaria, telefone, bolsista, email, nivel, id_turma) => {
    const [resultados] = await db.query("call sp_matricula_aluno(?,?,?,?,?,?,?,?);",
        [nome, cidade, tipo_bancaria, telefone, bolsista, email, nivel, id_turma]
    );
    return resultados?.[0]?.[0]?.resultado;
};

module.exports = {
    pesquisarAluno,
    obterFrequencia,
    historicoAluno,
    editaAluno,
    listaTurmas,
    matriculaAluno
};
