const db = require("../db_config.js");

const listaAulas = async (idTurma, tipoAula) => {
    const [rows] = await db.query("CALL sp_lista_aulas(?, ?);", [idTurma, tipoAula]);
    return rows;
};

const concluiAula = async (idAula) => {
    const [rows] = await db.query("CALL sp_conclui_aula(?);", [idAula]);
    return rows[0][0]?.resultado;
};

module.exports = {
    listaAulas,
    concluiAula
};
