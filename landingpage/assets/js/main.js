const MAPA_COMPONENTES = {
    hero: { chaveJson: 'hero', idHtml: 'home' }, 
    modalidades: { chaveJson: 'modalidades', idHtml: 'modalidades' },
    tipodeaula: { chaveJson: 'tiposDeAulas', idHtml: 'tipos' },
    metodologia: { chaveJson: 'metodologia', idHtml: 'metodologia' },
    eventos: { chaveJson: 'eventos', idHtml: 'eventos' },
    planos: { chaveJson: 'planos', idHtml: 'planos' },
    sobre: { chaveJson: 'sobre', idHtml: 'sobre' },
    footer: { chaveJson: 'footer', idHtml: 'contato' },
    depoimentos: { chaveJson: 'depoimentos', idHtml: 'depoimentos' },
};

let dadosDoSite = {};

const CAMINHO_BASE = './landingpage'; 
const IDIOMA_PADRAO = 'pt';
const ARQUIVOS_IDIOMA = {
    pt: 'data.json',
    en: 'data.en.json'
};
const TEXTOS_INTERFACE = {
    pt: {
        tituloPagina: 'The Tower Idiomas',
        menuAria: 'Abrir Menu de Navegacao',
        seletorAria: 'Selecionar idioma',
        nav: {
            home: 'Home',
            modalidades: 'Modalidades',
            tipos: 'Tipos de Aulas',
            metodologia: 'Metodologia',
            eventos: 'Eventos',
            planos: 'Planos',
            sobre: 'Sobre',
            contato: 'Contato'
        }
    },
    en: {
        tituloPagina: 'The Tower Languages',
        menuAria: 'Open navigation menu',
        seletorAria: 'Choose language',
        nav: {
            home: 'Home',
            modalidades: 'Formats',
            tipos: 'Class Types',
            metodologia: 'Methodology',
            eventos: 'Events',
            planos: 'Plans',
            sobre: 'About',
            contato: 'Contact'
        }
    }
};

function obterIdiomaAtual() {
    const idiomaSalvo = localStorage.getItem('idiomaSite');
    return ARQUIVOS_IDIOMA[idiomaSalvo] ? idiomaSalvo : IDIOMA_PADRAO;
}

function aplicarTextosInterface(idioma) {
    const textos = TEXTOS_INTERFACE[idioma] || TEXTOS_INTERFACE[IDIOMA_PADRAO];

    document.documentElement.lang = idioma === 'en' ? 'en' : 'pt-BR';
    document.title = textos.tituloPagina;

    document.querySelectorAll('[data-i18n-nav]').forEach(link => {
        const chave = link.getAttribute('data-i18n-nav');
        if (textos.nav[chave]) link.textContent = textos.nav[chave];
    });

    const botaoMenu = document.getElementById('botaoMenuMobile');
    if (botaoMenu) botaoMenu.setAttribute('aria-label', textos.menuAria);

    const seletor = document.querySelector('.seletor-idioma');
    if (seletor) seletor.setAttribute('aria-label', textos.seletorAria);

    document.querySelectorAll('.botao-idioma').forEach(botao => {
        const ativo = botao.dataset.lang === idioma;
        botao.classList.toggle('ativo', ativo);
        botao.setAttribute('aria-pressed', String(ativo));
    });
}

function iniciarSeletorIdioma() {
    document.querySelectorAll('.botao-idioma').forEach(botao => {
        const novoBotao = botao.cloneNode(true);
        botao.parentNode.replaceChild(novoBotao, botao);

        novoBotao.addEventListener('click', async () => {
            const idioma = novoBotao.dataset.lang;
            if (!ARQUIVOS_IDIOMA[idioma] || idioma === obterIdiomaAtual()) return;

            localStorage.setItem('idiomaSite', idioma);
            await iniciarSite();
        });
    });
}

async function carregarComponente(nomeArquivo, idElemento, dados) {
    try {
        
        const resposta = await fetch(`${CAMINHO_BASE}/${nomeArquivo}.html`);
        
        if (!resposta.ok) throw new Error(`Erro ao carregar HTML ${nomeArquivo} (404)`);
        const htmlTexto = await resposta.text();
        
        const container = document.getElementById(idElemento);
        if (container) {
            container.innerHTML = htmlTexto;

        
            if (!document.querySelector(`link[href*="${nomeArquivo}.css"]`)) {
                
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                
                
                const caminhoCSS = `${CAMINHO_BASE}/assets/css/${nomeArquivo}.css`;
                link.href = caminhoCSS; 

                document.head.appendChild(link);
            }
            
           
            try {
                
                const modulo = await import(`./${nomeArquivo}.js`);
                if (modulo.iniciar) { 
                    modulo.iniciar(dados); 
                }
            } catch (erroJs) {
                
            }
        }
    } catch (erro) {
        console.error(`Erro fatal componente ${nomeArquivo}:`, erro);
    }
}

async function iniciarSite() {
    try {
        const idioma = obterIdiomaAtual();
        aplicarTextosInterface(idioma);
       
        const resp = await fetch(`${CAMINHO_BASE}/${ARQUIVOS_IDIOMA[idioma]}`);
        dadosDoSite = await resp.json();

       
        for (const [nomeComponente, mapa] of Object.entries(MAPA_COMPONENTES)) {
            const dadosParaEnviar = dadosDoSite[mapa.chaveJson];
            if (dadosParaEnviar) {
                await carregarComponente(nomeComponente, mapa.idHtml, dadosParaEnviar);
            }
        }

        iniciarMenu();
        iniciarSeletorIdioma();
        iniciarAnimacoes();

    } catch (erro) {
        console.error("Erro ao iniciar o site (verifique o JSON):", erro);
    }
}

function iniciarAnimacoes() {
    const opcoes = { threshold: 0.1 };
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => { 
            if (entrada.isIntersecting) entrada.target.classList.add('visivel'); 
        });
    }, opcoes);

    setTimeout(() => {
        const elementos = document.querySelectorAll('.animar-ao-rolar, .animar-aparecer, .animar-aparecer-cima');
        elementos.forEach(el => observador.observe(el));
    }, 800); 
}

function iniciarMenu() {
    const botao = document.getElementById('botaoMenuMobile'); 
    const menu = document.getElementById('listaMenu');     
    
    if(botao && menu) {
        const novoBotao = botao.cloneNode(true);
        botao.parentNode.replaceChild(novoBotao, botao);

        novoBotao.addEventListener('click', () => {
            const aberto = menu.classList.toggle('ativo'); 
            novoBotao.setAttribute('aria-expanded', aberto);
        });
        
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('ativo'); 
                novoBotao.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

window.addEventListener('scroll', () => {
    const nav = document.getElementById('navegacao');
    if (nav) {
        if(window.scrollY > 40) nav.classList.add('rolagem');
        else nav.classList.remove('rolagem');
    }
});

document.addEventListener('DOMContentLoaded', iniciarSite);

