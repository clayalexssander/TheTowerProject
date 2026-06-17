const db = require("../db_config.js");

const listar = async () => {
    const [rows] = await db.query("SELECT * FROM tb_estoque ORDER BY numero_book");
    return rows;
};

const inserirBook = async (numeroBook) => {
    const [resultados] = await db.query("CALL sp_insere_book(?)", [numeroBook]);
    return resultados?.[0]?.[0]?.resultado;
};

const incrementar = async (numero_book) => {
    const [resultados] = await db.query("CALL sp_incrementa_estoque(?)", [numero_book]);
    return resultados?.[0]?.[0]?.resultado;
};

const decrementar = async (numero_book) => {
    const [resultados] = await db.query("CALL sp_decrementa_estoque(?)", [numero_book]);
    return resultados?.[0]?.[0]?.resultado;
};

module.exports = {
    listar,
    inserirBook,
    incrementar,
    decrementar
};
