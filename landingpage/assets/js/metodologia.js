function renderizarBanner(dados) {
    const wrapper = document.getElementById('bannerMetodologia');
    if (!wrapper) return;
    
    wrapper.innerHTML = `
        <div class="conteudo-banner container">
            <span class="tag-banner animar-aparecer-cima">${dados.tag}</span>
            <h1 class="titulo-banner animar-aparecer-cima" style="animation-delay: 0.1s">${dados.titulo}</h1>
            <p class="subtitulo-banner animar-aparecer-cima" style="animation-delay: 0.2s">${dados.subtitulo}</p>
            
            <div class="grupo-botoes-banner animar-aparecer-cima" style="animation-delay: 0.3s">
                <button class="btn-banner btn-primario-branco" id="btnVerMetodologia" role="button" aria-label="Ver detalhes">
                    <span class="texto-gradiente">${dados.ctaPrimario}</span>
                </button>
                <button class="btn-banner btn-secundario-transparente" id="btnVerModulos" role="button" aria-label="Ver Módulos">${dados.ctaSecundario}</button>
            </div>
        </div>
        <div class="onda-banner-baixo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" fill="none" preserveAspectRatio="none">
            <path fill="#ffffff" fill-opacity="1" d="M0,96L60,112C120,128,240,160,360,186.7C480,213,600,235,720,224C840,213,960,171,1080,160C1200,149,1320,171,1380,181.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"/></svg>
        </div>
    `;


    setTimeout(() => {
        const btnMetodo = document.getElementById('btnVerMetodologia');
        if (btnMetodo) {
            btnMetodo.onclick = () => {
                const alvo = document.getElementById('secao-diferenciais');
                if (alvo) alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
            };
        }

        const btnModulos = document.getElementById('btnVerModulos');
        if (btnModulos) {
            btnModulos.onclick = () => {
                const alvo = document.getElementById('secao-modulos');
                if (alvo) alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
            };
        }
    }, 100);
}

function renderizarDiferenciais(dados) {
    const titulo = document.getElementById('tituloDiferenciais');
    const subtitulo = document.getElementById('subtituloDiferenciais');
    
    if (titulo) titulo.textContent = dados.titulo;
    if (subtitulo) subtitulo.textContent = dados.subtitulo;
    
    const icones = {
        livro: '<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
        fone: '<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18V6h18v12M3 18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2M3 10h18M3 14h18"/></svg>',
        musica: '<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13M9 18a2 2 0 0 1-2 2H5a2 2 0 0 1 2-2M21 16v-3l-12-2v12l12-2M21 16a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2"/></svg>',
        chat: '<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
    };

    const grade = document.getElementById('gradeDiferenciais');
    if (grade) {
        grade.innerHTML = dados.itens.map(item => `
            <div class="card-diferencial animar-ao-rolar">
                <div class="cabecalho-diferencial">
                    <div class="icone-diferencial ${item.classeIcone}">
                        ${icones[item.classeIcone.replace('icone-', '')] || icones.livro}
                    </div>
                    <h4>${item.titulo}</h4>
                </div>
                <p>${item.descricao}</p>
            </div>
        `).join('');
    }
}

function renderizarLivros(livros, tituloTexto, subtituloTexto) {
    const titulo = document.getElementById('tituloLivros');
    const subtitulo = document.getElementById('subtituloLivros');

    if (titulo) titulo.textContent = tituloTexto;
    if (subtitulo) subtitulo.textContent = subtituloTexto;
    
    const iconesLivros = {
        pilha: '<svg aria-hidden="true" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
        chat: '<svg aria-hidden="true" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
        livro: '<svg aria-hidden="true" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
        volume: '<svg aria-hidden="true" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>',
        balao: '<svg aria-hidden="true" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
        pulso: '<svg aria-hidden="true" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
        maleta: '<svg aria-hidden="true" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>'
    };

    const gradeLivros = document.getElementById('gradeLivros');
    if (gradeLivros) {
        gradeLivros.innerHTML = livros.map((livro, index) => {
            let porcentagem = ((index + 1) / 7) * 100; 
            return `
            <div class="card-livro animar-ao-rolar">
                <div class="cabecalho-livro">
                    <div class="caixa-icone-livro" style="background-color: ${livro.cor}; box-shadow: 0 5px 15px ${livro.cor}40;">
                        ${iconesLivros[livro.icone] || iconesLivros.livro}
                    </div>
                    
                    <div class="caixa-numero-livro">
                    <span class="etiqueta-livro">${livro.label || 'Livro'}</span>
                        <span class="num-livro" style="color: ${livro.cor};">${livro.numLivro}</span>
                    </div>
                </div>

                <h3>${livro.titulo}</h3>

                <div class="tags-livro">
                    <span class="tag-duracao">${livro.duracao}</span>
                    <span class="tag-badge" style="background-color: ${livro.cor};">${livro.nivel}</span>
                </div>

                <p>${livro.descricao}</p>

                <div class="bg-progresso-livro">
                    <div class="preenchimento-progresso" 
                    style="background-color: ${livro.cor}; width:0;" 
                    data-largura="${porcentagem}%">
                    </div>
                </div>
            </div>
        `}).join('');


        setTimeout(() => {
            const observador = new IntersectionObserver((entradas) => {
                entradas.forEach(entrada => {
                    if (entrada.isIntersecting) {
                        const barra = entrada.target;
                        const larguraAlvo = barra.getAttribute('data-largura');
                        if (larguraAlvo) {
                            barra.style.width = larguraAlvo;
                        }
                        observador.unobserve(barra); 
                    }
                });
            }, { threshold: 0.1 }); 

            const barras = document.querySelectorAll('.preenchimento-progresso');
            barras.forEach(b => observador.observe(b));
        }, 200);
    }
}


export function iniciar(dados) {
    if (!dados) return console.error("Dados de 'metodologia' não encontrados.");

    renderizarBanner(dados.banner);
    renderizarDiferenciais(dados.diferenciais);
    renderizarLivros(
        dados.livros.map(livro => ({ ...livro, label: dados.labelLivro })),
        dados.titulo,
        dados.subtitulo
    );
}
