const db = require("../db_config.js");

const getAgenda = async () => {
    const [rows] = await db.query("select * from vw_lista_aula_dia;");
    return rows;
};

module.exports = {
    getAgenda
};
