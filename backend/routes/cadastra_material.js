const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cadastraMaterialController = require('../controllers/cadastraMaterialController');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const nomePasta = req.body.nome_pasta;
        let dest;
        if (req.body.tipo_aula === "Lesson") {
            dest = path.join(__dirname, '..', 'materiais', nomePasta);
        } else {
            dest = path.join(__dirname, '..', '..', 'materiais', nomePasta);
        }
        fs.mkdirSync(dest, { recursive: true });
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') return cb(new Error('Apenas PDF permitido'));
        cb(null, true);
    }
}).any();

router.post('/', (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            console.error('MulTer erro', err);
            return res.status(400).json({ resultado: 0, mensagem: err.message || 'Erro no upload' });
        }
        cadastraMaterialController.cadastra(req, res);
    });
});

router.get("/books", cadastraMaterialController.listarBooks);

module.exports = router;
