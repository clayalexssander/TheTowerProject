const presencaModel = require('../models/presencaModel');

const listarPresencasPorAula = async (req, res) => {
    const { idAula } = req.params;
    try{
        const dados = await presencaModel.listarPresencasPorAula(idAula);
        if (dados.length === 1 && dados[0].resultado === 0){
            res.json({ success: false, message: "Aula não encontrada. "});
        }else{
            res.json({success: true, data: dados});
        }
    } catch (error){
        console.error("Erro ao listar presenças : ", error);
        res.status(500).json({ success: false, message: error.message});
    }
};

const realizarChamada = async (req, res) => {
    const { idAluno, idAula, presente } = req.body;
    try{
        const resultado = await presencaModel.realizarChamada(presente, idAluno, idAula);
        if(resultado == 1){
            res.json({success: true, message: "Presença registrada com sucesso!"});
        }else{
            res.json({success: false, message: "Erro ao registrar presença!."});
        }
    }catch (error){
        console.error(" Erro ao registrar presença: ", error);
        res.status(500).json({success: false, message: error.message});
    }
};

const concluiConversacao = async (req, res) => {
    const { idTurma} = req.params;
    try{
        const { resultado, idAula } = await presencaModel.concluiConversacao(idTurma);
        if(resultado == 1){
            res.json({ success: true, id_aula: idAula});
        }else{
            res.json({success: false, message: "Aula não encontrada."})
        }
    }catch(error){
        console.error(error);
        res.status(500).json({success: false, message: error.message});
    }
};

module.exports = {
    listarPresencasPorAula,
    realizarChamada,
    concluiConversacao
};
