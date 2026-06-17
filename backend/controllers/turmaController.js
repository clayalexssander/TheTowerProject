const turmaModel = require('../models/turmaModel');

const infoTurma = async (req, res) => {
    const { id } = req.params;
    try{
        const data = await turmaModel.infoTurma(id);
        res.json({ success: true, data});
    }catch (error){
        console.error(error);
        res.status(500).json({success: false, error: error.message});
    }
};

const alunosTurma = async (req, res) => {
    const {id} = req.params;
    try{
        const data = await turmaModel.alunosTurma(id);
        res.json({ success: true, data});
    }catch(error){
        res.status(500).json({success: false, message: error.message});
    }
};

const ultimaAula = async (req, res) => {
    const {id} = req.params;
    try{
        const data = await turmaModel.ultimaAula(id);
        res.json({ success: true, data});
    }catch(error){
        res.status(500).json({ success: false, error: error.message});
    }
};

const listaTurmas = async (req, res) => {
   try{
    const data = await turmaModel.listaTurmas();
    res.json(data);
   }catch(erro){
    console.error("Erro ao listar turmas:", erro);
    res.status(500).json({ erro: "Erro ao listar turmas"});
   }
};

const criarTurma = async (req, res) => {
    const { nome_turma, dia_semana, hora_inicio, hora_fim} = req.body;
    if(!nome_turma || !dia_semana || !hora_inicio || !hora_fim){
        return res.status(400).json({ erro:"O preenchimento de todos os campos é obrigatório" });
    }
    try{
        const resultado = await turmaModel.criarTurma(nome_turma, dia_semana, hora_inicio, hora_fim);
        if(resultado === 1){
            res.status(201).json({resultado: 1, mensagem: "Turma Criada com sucesso!"});
        } else if(resultado === 2){
            res.status(200).json({resultado: 2, mensagem: "Conflito de horário detectado com turmas existentes!" });
        }else{
            res.status(500).json({resultado: 0 , mensagem: "Erro ao criar a Turma!"});
        }
    }catch (erro){
        console.error("Erro ao criar turma:", erro);
        res.status(500).json({ erro: "Erro ao criar turma"});
    }
};

const editarTurma = async (req, res) => {
    const { id_turma, novo_nome_turma, novo_dia_aula, novo_horario_aula, novo_hora_fim, ativa } = req.body;
    try {
        const resultado = await turmaModel.editarTurma(id_turma, novo_nome_turma, novo_dia_aula, novo_horario_aula, novo_hora_fim, ativa);
        res.json({ resultado });
    } catch (erro) {
        console.error("Erro ao editar turma:", erro);
        res.status(500).json({ resultado: 0 });
    }
};

module.exports = {
    infoTurma,
    alunosTurma,
    ultimaAula,
    listaTurmas,
    criarTurma,
    editarTurma
};
