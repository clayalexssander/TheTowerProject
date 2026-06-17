const authModel = require('../models/authModel');
const { createSession, destroySession, getSession } = require('../middlewares/auth');

const login = async (req, res) => {
    const { usuario, senha } = req.body;
     
    if(!usuario || !senha){
        return res.status(400).json({success: false, message: "Usuário e senha são obrigatórios!"});
    }

    try{
        const resultado = await authModel.verificaAdmin(usuario, senha);
         
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
            res.status(401).json({success: false, message: 'Usuário ou senha incorretos!'});
        }
    }catch (err){
        console.error('ERRO ao executar procedure:', err);
        return res.status(500).json({success: false, message: 'erro no servidor'});
    }
};

const session = (req, res) => {
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
};

const logout = (req, res) => {
    destroySession(req, res);
    res.json({ success: true, message: 'Logout realizado com sucesso!' });
};

module.exports = {
    login,
    session,
    logout
};
