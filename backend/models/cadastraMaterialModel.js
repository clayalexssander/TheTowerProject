const db = require("../db_config.js");

const cadastra = async (tipo_aula, nome_pasta, nome_arquivo, titulo, id_book, numero_lesson) => {
    const conn = db.promise ? db : db;
    const [rows] = await conn.query('CALL sp_cadastra_material(?,?,?,?,?,?)', [
        tipo_aula,
        nome_pasta,
        nome_arquivo,
        titulo,
        id_book || 0,
        numero_lesson || 0
    ]);
    
    let resultado = 0;
    if (Array.isArray(rows) && rows.length) {
        const first = rows[0];
        if (Array.isArray(first) && first.length && first[0].resultado !== undefined) {
            resultado = first[0].resultado;
        } else if (first.resultado !== undefined) {
            resultado = first.resultado;
        } else if (rows[0] && rows[0][0] && rows[0][0].resultado !== undefined) {
            resultado = rows[0][0].resultado;
        }
    }
    return resultado;
};

const listarBooks = async () => {
    const [rows] = await db.query("SELECT * FROM tb_books ORDER BY numero_book ASC");
    return rows;
};

module.exports = {
    cadastra,
    listarBooks
};
