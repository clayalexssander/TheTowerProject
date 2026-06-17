const aulaModel = require('../models/aulaModel');

const listaAulas = async (req, res) => {
    const {idTurma, tipoAula} = req.params;
    try{
        const rows = await aulaModel.listaAulas(idTurma, tipoAula);
        res.json({success: true, data: rows});
    } catch (error){
        console.error("Erro ao listar aulas: ", error);
        res.status(500).json({success: false, error: error.message});
    }
};

const concluiAula = async (req, res) => {
    const {idAula } = req.params;
    try{
        const resultado = await aulaModel.concluiAula(idAula);
        if(resultado === 1){
            res.json({success: true, message: "Aula concluída com sucesso!"});
        }else{
            res.json({ success: false, message: "Aula já concluída ou não encontrada."});
        }
    }catch(error){
        console.error("Erro ao concluir aula: ", error);
        res.status(500).json({success: false, error: error.message});
    }
};

module.exports = {
    listaAulas,
    concluiAula
};
