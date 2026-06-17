const alunoModel = require('../models/alunoModel');

const pesquisarAluno = async (req, res) => {
    const { nome } = req.params;
    if(!nome){return res.status(400).json({ success: false, message: "Nome do aluno é obrigatório." });}
    try{
        const alunos = await alunoModel.pesquisarAluno(nome);
        res.json({success: true, data: alunos});
    }catch( error){
        res.status(500).json({success: false, message: error.message});
    }
};

const obterFrequencia = async (req, res) => {
    const { idAluno} = req.params;
    try{
        const rows = await alunoModel.obterFrequencia(idAluno);
        res.json({success: true, data: rows});
    }catch(error){
        console.error("Erro ao obter frequência do aluno: ", error);
        res.status(500).json({success: false, message: error.message});
    }
};

const historicoAluno = async (req, res) => {
    const {idAluno} = req.params;
     try{
        const rows = await alunoModel.historicoAluno(idAluno);
        res.json({success: true,  data: rows});
    }catch(error){
        console.error("Erro ao obter histórico do aluno: ", error);
        res.status(500).json({success: false, message: error.message});
    }
};

const editaAluno = async (req, res) => {
  const { id } = req.params;
  const {
    nome, cidade, tipo_bancaria, telefone,
    bolsista, email, ativo, nivel, id_turma
  } = req.body;
  try{
    const valor = await alunoModel.editaAluno(id, nome, cidade, tipo_bancaria, telefone, bolsista, email, ativo, nivel, id_turma);
    if (valor === 1) return res.json({ success: true, message: "Aluno atualizado."});
    if (valor === 2) return res.status(400).json({ success: false, message: "Email já existe ou turma inválida."});
    return res.status(500).json({ success: false, message: "Erro inesperado."});
  }catch(err){
    console.error(err);
    return res.status(500).json({ success:false, message: err.message });
  }
};

const listaTurmas = async (req, res) => {
    try{
        const turmas = await alunoModel.listaTurmas();
        res.json({success: true, data: turmas});
    }catch(err){
        console.error(err);
        res.status(500).json({success: false, message: err.message});
    }
};

const matriculaAluno = async (req, res) => {
    const { nome, email, cidade, bolsista, nivel, telefone, tipo_bancaria, id_turma } = req.body;
    if(!nome || !email || !cidade || !bolsista || !nivel || !telefone || !tipo_bancaria || !id_turma){
        return res.status(400).json({ resultado: 0, message: "Todos os campos são obrigatórios."});
    }
    try{
        const resultado = await alunoModel.matriculaAluno(nome, cidade, tipo_bancaria, telefone, bolsista, email, nivel, id_turma);
        if(resultado === 1){
            res.status(201).json({ resultado: 1 , message: "Aluno matriculado com sucesso."});
        }else if(resultado === 2){
            res.status(400).json({ resultado: 2, message: "Email já existe ou turma inválida."});
        }else{
            res.status(500).json({ resultado: 0, message: "Erro inesperado na matrícula."});
        }
    }catch(erro){
        console.error("Erro ao matricular aluno:", erro);
        res.status(500).json({erro: "Erro ao matricular aluno."});
    }
};

module.exports = {
    pesquisarAluno,
    obterFrequencia,
    historicoAluno,
    editaAluno,
    listaTurmas,
    matriculaAluno
};
