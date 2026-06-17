const db = require('../db_config');

const verificaAdmin = async (usuario, senha) => {
    const [results] = await db.query("CALL sp_verifica_admin(?,?);", [usuario, senha]);
    return results?.[0]?.[0]?.resultado;
};

module.exports = {
    verificaAdmin
};
