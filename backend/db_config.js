const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: "root",
    password: '3221',
    database: 'thetower_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit:0
});
if (process.env.NODE_ENV !== 'test') {
    ( async () => {
        try{
            const connection = await db.getConnection();
            console.log("Conectado ao MySQL com sucesso!");
            connection.release();
        }catch (error){
            console.error(" Erro ao conectar ao MySQL:", error.message);
        }
    })();
}

module.exports = db;
 