const db = require("../db_config.js");

const listarAulas = async () => {
    const [rows] = await db.query("select * from vw_aulas_demonstrativas_marcadas;");
    return rows;
};

const marcarAula = async (nome, data, email, horario) => {
    const [resultado] = await db.query(
        "CALL sp_marca_aula_demostrativa(?,?,?,?);",
        [nome, data, email, horario]
    );
    return resultado[0][0];
};

const cancelarAula = async (id) => {
    const [resultado] = await db.query(
        "CALL sp_cancela_aula_demostrativa(?);",
        [id]
    );
    return resultado[0][0];
};

const confirmarMatricula = async (id) => {
    const [resultado] = await db.query(
        "CALL sp_cofirma_matricula(?);",
        [id]
    );
    return resultado[0][0];
};

module.exports = {
    listarAulas,
    marcarAula,
    cancelarAula,
    confirmarMatricula
};
