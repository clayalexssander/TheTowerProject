const express = require("express");
const router = express.Router();
const db = require('../db_config');
const { createSession, destroySession, getSession } = require('../middlewares/auth');

// rota para login
router.post('/login', async (req, res) => {
    const { usuario, senha } = req.body;
     
    if(!usuario || !senha){
        return res.status(400).json({success: false, message: "Usuário e senha são obrigatórios!"});
    }

    try{

        const [results] = await db.query("CALL sp_verifica_admin(?,?);", [usuario, senha]);
         
        const resultado = results?.[0]?.[0]?.resultado;
        if(resultado === 1){
            const user = { usuario };
            createSession(res, user);

            res.json({
                success: true,
                message: 'Login realizado com sucesso!',
                user
            });

        }
        else{
            //senha ou usuario errados
            res.status(401).json({success: false, message: 'Usuário ou senha incorretos!'});
        }
    }catch (err){
        console.error('ERRO ao executar procedure:', err);
        return res.status(500).json({success: false, message: 'erro no servidor'});
    }

});

router.get('/session', (req, res) => {
    const session = getSession(req);

    if (!session) {
        return res.status(401).json({
            success: false,
            message: 'Sessao expirada ou usuario nao autenticado.'
        });
    }

    res.json({
        success: true,
        user: session.user
    });
});

router.post('/logout', (req, res) => {
    destroySession(req, res);
    res.json({ success: true, message: 'Logout realizado com sucesso!' });
});

module.exports = router;
