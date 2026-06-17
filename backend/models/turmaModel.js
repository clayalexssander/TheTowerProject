const db = require("../db_config.js");

const infoTurma = async (id) => {
    const [rows] = await db.query("CALL sp_lista_info_turma(?);", [id]);
    return rows[0];
};

const alunosTurma = async (id) => {
    const [rows] = await db.query("CALL sp_lista_turma_alunos(?);", [id]);
    return rows[0];
};

const ultimaAula = async (id) => {
    const [rows] = await db.query("CALL sp_ultima_aula(?);", [id]);
    return rows[0];
};

const listaTurmas = async () => {
    const [rows] = await db.query("CALL sp_lista_turmas();");
    return rows[0];
};

const criarTurma = async (nome_turma, dia_semana, hora_inicio, hora_fim) => {
    const [resultados] = await db.query("CALL sp_criar_turma(?, ?, ?, ?); ",
        [nome_turma, dia_semana, hora_inicio, hora_fim]);
    return resultados?.[0]?.[0]?.resultado;
};

const editarTurma = async (id_turma, novo_nome_turma, novo_dia_aula, novo_horario_aula, novo_hora_fim, ativa) => {
    const [rows] = await db.query(
        "CALL sp_editar_turma(?, ?, ?, ?, ?, ?)",
        [id_turma, novo_nome_turma, novo_dia_aula, novo_horario_aula, novo_hora_fim, ativa]
    );
    return rows[0][0]?.resultado || 0;
};

module.exports = {
    infoTurma,
    alunosTurma,
    ultimaAula,
    listaTurmas,
    criarTurma,
    editarTurma
};
