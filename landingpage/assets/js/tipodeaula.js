export function iniciar(dados) {
    if (!dados) return console.error("Dados de 'tipodeaula' não encontrados.");

    const elementoTitulo = document.getElementById('tituloTipos');
    if(elementoTitulo) elementoTitulo.textContent = dados.titulo;

    const tituloVantagens = document.getElementById('tituloVantagens');
    if (tituloVantagens) tituloVantagens.textContent = dados.tituloVantagens || 'Vantagens';

    const ctaPlanos = document.getElementById('ctaTiposPlanos');
    if (ctaPlanos) ctaPlanos.textContent = dados.ctaPlanos || 'Ver Planos e Precos';

    const grade = document.getElementById('gradeTipos');
    if (grade) {
    
        grade.innerHTML = `
            <div class="card-tipo azul animar-ao-rolar">
                <div class="icone-card">
                    <svg aria-hidden="true" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <h3>${dados.particular.titulo}</h3>
                <p>${dados.particular.descricao}</p>
                <div style="flex-grow: 1; min-height: 10px;"></div> 
            </div>
            
            <div class="card-tipo vermelho animar-ao-rolar">
                <div class="conteudo-dividido"> 
                    <div class="lado-esquerdo">
                        <div class="icone-card">
                            <svg aria-hidden="true" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        </div>
                        <h3>${dados.grupo.titulo}</h3> 
                        <p>${dados.grupo.descricao}</p>
                    </div>

                    <div class="lado-direito">
                        <h4 class="titulo-horario">${dados.horarios.subtitulo}</h4>
                        
                        ${dados.horarios.turmas.map(t => `
                            <div class="item-horario">
                                ${t.nome}: ${t.horario}
                            </div>
                        `).join('')}
                        
                        <div class="aviso-duracao">(${dados.horarios.duracao})</div>
                    </div>
                </div>
            </div>
        `;
    }

    const gradeVantagens = document.getElementById('gradeVantagens');
    if (gradeVantagens) {
        const listaIcones = [
            '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line>',
            '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>',
            '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>',
            '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>',
            '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>'
        ];

        gradeVantagens.innerHTML = dados.vantagens.map((vantagem, i) => `
            <div class="item-vantagem">
                <div class="icone-vantagem">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        ${listaIcones[i] || listaIcones[0]}
                    </svg>
                </div>
                <span>${vantagem}</span>
            </div>
        `).join('');
    }
}
