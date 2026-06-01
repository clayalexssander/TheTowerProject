export function iniciar(dados) {
    if (!dados) return console.error("Dados de 'planos' não encontrados.");

    const tituloSecao = document.getElementById('tituloPlanos');
    if (tituloSecao && dados.tituloGeral) tituloSecao.textContent = dados.tituloGeral;

    const numeroWhatsapp = dados.whatsapp; 

    const containerGrupo = document.getElementById('containerPlanoGrupo');
    if (containerGrupo && dados.grupo) {
        
        const partesPreco = dados.grupo.preco.split(',');
        const precoMaior = partesPreco[0];
        const centavos = partesPreco[1] || "00";

        const msgGrupo = encodeURIComponent(dados.msgGrupo);

        const linkGrupo = `https://wa.me/${numeroWhatsapp}?text=${msgGrupo}`;

        containerGrupo.innerHTML = `
            <div class="card-plano">
                <div class="conteudo-card">
                    <h3 class="titulo-plano">${dados.grupo.titulo}</h3>

                    <div class="wrapper-preco">
                        <span class="moeda">R$</span>
                        <span class="valor-preco texto-gradiente-azul">${precoMaior}</span>
                        <div class="detalhes-preco">
                            <span class="centavos texto-gradiente-azul">,${centavos}</span> 
                            <span class="periodo">${dados.periodo || '/mes'}</span>
                        </div>
                    </div>

                    <ul class="lista-vantagens">
                        ${dados.grupo.vantagens.map(v => `
                            <li>
                                <svg class="icone-check" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                                ${v}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <a href="${linkGrupo}" class="botao-plano" target="_blank" rel="noopener noreferrer">${dados.ctaGrupo || 'Entrar na Turma'}</a>
            </div>
        `;
    }


    const containerParticular = document.getElementById('containerPlanoParticular');
    if (containerParticular && dados.particulares) {
        
       const msgParticular = encodeURIComponent(dados.msgParticular);
        const linkParticular = `https://wa.me/${numeroWhatsapp}?text=${msgParticular}`;

        containerParticular.innerHTML = `
            <div class="card-plano">
                <div class="conteudo-card">
                    <h3 class="titulo-plano">${dados.particulares.titulo}</h3>

                    <div class="lista-opcoes-limpa">
                        ${dados.particulares.itens.map(item => `
                            <div class="linha-opcao">
                                <div class="info-frequencia">
                                    <span class="texto-freq">${item.frequencia}</span>
                                </div>
                                <div class="info-preco">
                                    <span class="rs-pequeno">R$</span>
                                    <span class="preco-limpo texto-gradiente-vermelho">${item.preco}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <a href="${linkParticular}" class="botao-plano botao-destaque" target="_blank" rel="noopener noreferrer">${dados.ctaParticular || 'Contratar Agora'}</a>
            </div>
        `;
    }
}
