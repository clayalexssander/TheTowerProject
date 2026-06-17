const db = require("../db_config.js");

const listarPresencasPorAula = async (idAula) => {
    const [rows] = await db.query("CALL sp_listar_presencas_por_aula(?);", [idAula]);
    return rows[0];
};

const realizarChamada = async (presente, idAluno, idAula) => {
    const [rows] = await db.query("CALL sp_realizar_chamada(?, ?, ?);", [presente, idAluno, idAula]);
    return rows[0][0]?.resultado;
};

const concluiConversacao = async (idTurma) => {
    const [rows] = await db.query("call sp_conclui_conversacao(?);", [idTurma]);
    return {
        resultado: rows[0][0]?.resultado,
        idAula: rows[0][0]?.id_aula || null
    };
};

module.exports = {
    listarPresencasPorAula,
    realizarChamada,
    concluiConversacao
};
