
const express = require('express');
const cors =  require('cors');
const path = require('path');
const { getSession, requireAuth } = require('./middlewares/auth');
const authRoutes = require("./routes/auth");
const turmasRoutes = require('./routes/turmas');
const aulasRoutes=  require("./routes/aulas");
const presencaRoutes = require("./routes/presencas");
const alunosRoutes = require("./routes/alunos");
const cadastraMaterialRoutes = require("./routes/cadastra_material.js");
const financasRouter = require('./routes/financas');
const aulasDemonstrativasRouter = require('./routes/aulas_demonstrativas');
const bibliotecaRouter = require('./routes/biblioteca');
const estoqueRouter = require('./routes/estoque');
const dashboardRouter = require('./routes/dashboard');
const homeRouter = require('./routes/home');

const app = express();
const PORT = 3000;
const ROOT_DIR = path.join(__dirname, '..');
const FRONTEND_DIR = path.join(ROOT_DIR, 'frontend');
const PROTECTED_PAGES = new Set([
    'alunos.html',
    'aula.html',
    'aulas_demonstrativas.html',
    'biblioteca.html',
    'cadastra_material.html',
    'criar_turma.html',
    'dashboard.html',
    'estoque.html',
    'financas.html',
    'home.html',
    'matricular_aluno.html',
    'turmas.html',
    'turma_info.html'
]);

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use('/frontend/assets', express.static(path.join(FRONTEND_DIR, 'assets')));

app.get(['/', '/index.html'], (req, res) => {
    res.sendFile(path.join(ROOT_DIR, 'index.html'));
});

app.get('/frontend/:page', (req, res, next) => {
    const { page } = req.params;

    if (!PROTECTED_PAGES.has(page)) {
        return next();
    }

    if (!getSession(req)) {
        return res.redirect('/index.html');
    }

    res.sendFile(path.join(FRONTEND_DIR, page));
});

//rota principal
app.use('/api', authRoutes);
app.use('/api', requireAuth);
app.use("/api/turmas", turmasRoutes);
app.use("/api/aulas", aulasRoutes);
app.use("/api/presencas", presencaRoutes );
app.use("/api/alunos", alunosRoutes);
app.use("/api/cadastra-material", cadastraMaterialRoutes);
app.use('/api/financas', financasRouter);
app.use('/api/aula-demonstrativas', aulasDemonstrativasRouter);
app.use('/api/biblioteca', bibliotecaRouter);
app.use('/api/estoque', estoqueRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/home', homeRouter);






app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`)); 
