const API_URL = window.location.port === "3000" ? "/api" : "http://localhost:3000/api";
let charts = {};

document.addEventListener("DOMContentLoaded", async () => {
  // botão atualizar
  const btnAtualizar = document.getElementById("btnAtualizar");
  btnAtualizar.addEventListener("click", async () => {
    await carregarDashboard();
  });

  // select turma
  const selectTurma = document.getElementById("selectTurma");
  selectTurma.addEventListener("change", async (e) => {
    if (e.target.value) {
      await carregarProgresso(e.target.value);
    }
  });

  // inicializa dashboard
  await carregarDashboard();
  // atualiza periodicamente (p.ex. a cada 60s)
  setInterval(()=>{ carregarDashboard().catch(()=>{}); }, 60000);
});

async function carregarTurmasSelect() {
  const sel = document.getElementById("selectTurma");
  sel.innerHTML = "<option>Carregando...</option>";
  try {
    const res = await fetch(`${API_URL}/dashboard/ranking-turmas`);
    const data = await res.json();
    sel.innerHTML = "";
    if(data.success && Array.isArray(data.data)){
      const optionPadrao = document.createElement("option");
      optionPadrao.value = "";
      optionPadrao.text = "Selecionar turma...";
      sel.appendChild(optionPadrao);
      
      data.data.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t.nome_turma;
        opt.text = `${t.nome_turma} (${t.dia_aula}) - ${t.frequencia_media_percent}%`;
        sel.appendChild(opt);
      });
      if(sel.options.length === 0) sel.innerHTML = "<option value=''>Nenhuma turma</option>";
    } else {
      sel.innerHTML = "<option value=''>Erro ao carregar</option>";
    }
  } catch (err) {
    sel.innerHTML = "<option value=''>Erro</option>";
  }
}

async function carregarDashboard(){
  await Promise.all([
    carregarKPIs(),
    carregarRanking(),
    carregarRetencao(),
    carregarAtencao(),
    carregarSaidas(),
    carregarRisco(),
    carregarTurmasSelect()
  ]);
}

async function carregarKPIs(){
  try{
    // Carrega dados para KPIs
    const [rankingRes, previsaoRes] = await Promise.all([
      fetch(`${API_URL}/dashboard/ranking-turmas`),
      fetch(`${API_URL}/dashboard/previsao-evasao`)
    ]);
    
    const rankingData = await rankingRes.json();
    const previsaoData = await previsaoRes.json();
    
    if(rankingData.success && rankingData.data){
      const turmas = rankingData.data;
      const totalTurmas = turmas.length;
      const freqMedia = turmas.reduce((sum, t) => sum + (Number(t.frequencia_media_percent) || 0), 0) / totalTurmas;
      
      document.getElementById("kpiTotalTurmas").textContent = totalTurmas;
      document.getElementById("kpiFreqMedia").textContent = `${freqMedia.toFixed(1)}%`;
    }
    
    if(previsaoData.success && previsaoData.data){
      const alunosRisco = previsaoData.data.filter(a => 
        a.status_frequencia === 'CRÍTICO' || a.status_frequencia === 'BAIXA '
      ).length;
      
      document.getElementById("kpiAlunosRisco").textContent = alunosRisco;
    }
  }catch(err){ console.error("kpis",err); }
}

async function carregarRanking(){
  try{
    const res = await fetch(`${API_URL}/dashboard/ranking-turmas`);
    const payload = await res.json();
    if(!payload.success) return;
    
    const top10 = payload.data.slice(0,10);
    const labels = top10.map(t => t.nome_turma);
    const values = top10.map(t => Number(t.frequencia_media_percent || 0));
    
    const ctx = document.getElementById("chartRanking").getContext("2d");
    if(charts.ranking) charts.ranking.destroy();
    charts.ranking = new Chart(ctx, {
      type: 'bar',
      data: { 
        labels, 
        datasets: [{ 
          label: 'Frequência Média (%)',
          data: values,
          backgroundColor: values.map(v => 
            v >= 90 ? '#10b981' : 
            v >= 75 ? '#3b82f6' : 
            v >= 60 ? '#f59e0b' : 
            '#ef4444'
          ),
          borderRadius: 6,
          borderWidth: 0
        }] 
      },
      options: { 
        plugins: {
          legend: { display: false }
        },
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: value => value + '%'
            },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }catch(err){ console.error("ranking",err); }
}

async function carregarRetencao(){
  try{
    const res = await fetch(`${API_URL}/dashboard/taxa-retencao`);
    const payload = await res.json();
    if(!payload.success) return;
    const rows = payload.data.slice(0,12);
    
    const labels = rows.map(r => `${r.mes_entrada}/${r.ano_entrada}`);
    const values = rows.map(r => Number(r.taxa_retencao || 0));
    const ctx = document.getElementById("chartRetencao").getContext("2d");
    if(charts.retencao) charts.retencao.destroy();
    charts.retencao = new Chart(ctx, {
      type: 'line',
      data: { 
        labels, 
        datasets: [{ 
          label:'Taxa de Retenção', 
          data: values, 
          fill: false, 
          tension: 0.2,
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)'
        }] 
      },
      options: {
        plugins: { legend: { display: false } },
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { callback: value => value + '%' },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          x: { grid: { display: false } }
        }
      }
    });
  }catch(err){ console.error("retencao",err); }
}

async function carregarAtencao(){
  try{
    const res = await fetch(`${API_URL}/dashboard/turmas-atencao`);
    const payload = await res.json();
    if(!payload.success) return;
    
    const rows = payload.data;
    const labels = rows.map(t => t.nome_turma);
    const frequencias = rows.map(t => Number(t.frequencia || 0));
    
    const ctx = document.getElementById("chartAtencao").getContext("2d");
    if(charts.atencao) charts.atencao.destroy();
    charts.atencao = new Chart(ctx, {
      type: 'bar',
      data: { 
        labels, 
        datasets: [{ 
          label: 'Frequência (%)',
          data: frequencias,
          backgroundColor: '#ef4444',
          borderRadius: 6,
          borderWidth: 0
        }] 
      },
      options: {
        plugins: { legend: { display: false } },
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { callback: value => value + '%' },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }catch(err){ console.error("atencao",err); }
}

async function carregarSaidas(){
  try{
    const res = await fetch(`${API_URL}/dashboard/linha-tempo-saidas`);
    const payload = await res.json();
    if(!payload.success) return;
    const rows = payload.data.slice(0,12);
    
    const labels = rows.map(r => r.periodo);
    const values = rows.map(r => Number(r.total_saidas || 0));
    
    const ctx = document.getElementById("chartSaidas").getContext("2d");
    if(charts.saidas) charts.saidas.destroy();
    charts.saidas = new Chart(ctx, {
      type: 'line',
      data: { 
        labels, 
        datasets: [{ 
          label: 'Saídas', 
          data: values, 
          fill: false, 
          tension: 0.2,
          borderColor: '#ec4899',
          backgroundColor: 'rgba(236, 72, 153, 0.1)'
        }] 
      },
      options: {
        plugins: { legend: { display: false } },
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0 },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          x: { grid: { display: false } }
        }
      }
    });
  }catch(err){ console.error("saidas",err); }
}

async function carregarProgresso(turmaNome){
  try{
    const res = await fetch(`${API_URL}/dashboard/progresso-temporal?turma=${encodeURIComponent(turmaNome)}`);
    const payload = await res.json();
    if(!payload.success || !payload.data.length) return;
    
    const rows = payload.data;
    const labels = rows.map(d => `${String(d.mes).padStart(2, '0')}/${d.ano}`);
    const values = rows.map(d => Number(d.frequencia_mensal || 0));
    
    const ctx = document.getElementById("chartProgresso").getContext("2d");
    if(charts.progresso) charts.progresso.destroy();
    charts.progresso = new Chart(ctx, {
      type: 'line',
      data: { 
        labels, 
        datasets: [{ 
          label: 'Frequência Mensal (%)', 
          data: values, 
          fill: false, 
          tension: 0.2,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)'
        }] 
      },
      options: {
        plugins: { legend: { display: false } },
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { callback: value => value + '%' },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          x: { grid: { display: false } }
        }
      }
    });
  }catch(err){ console.error("progresso",err); }
}

async function carregarRisco(){
  const container = document.getElementById("listaRisco");
  container.innerHTML = "Carregando...";
  try{
    const res = await fetch(`${API_URL}/dashboard/previsao-evasao`);
    const payload = await res.json();
    if(!payload.success) { container.innerHTML = "Erro ao carregar"; return; }
    const rows = payload.data.filter(a => 
      a.status_frequencia === 'CRÍTICO' || a.status_frequencia === 'BAIXA '
    ).slice(0,15);
    
    if(!rows.length) { container.innerHTML = "<div>Nenhum aluno em risco crítico.</div>"; return;}
    
    const table = document.createElement("table");
    table.className = "table";
    table.innerHTML = `
      <tr>
        <th>Aluno</th>
        <th>Turma</th>
        <th>Frequência</th>
        <th>Status</th>
      </tr>
    `;
    
    rows.forEach(r=>{
      const tr = document.createElement("tr");
      const statusClass = r.status_frequencia.trim() === 'CRÍTICO' ? 'bad' : 'warning';
      tr.innerHTML = `
        <td>${r.nome_aluno}</td>
        <td>${r.nome_turma}</td>
        <td>${r.frequencia_geral}%</td>
        <td class="${statusClass}">${r.status_frequencia}</td>
      `;
      table.appendChild(tr);
    });
    
    container.innerHTML = "";
    container.appendChild(table);
  }catch(err){ console.error("risco",err); container.innerHTML = "Erro ao carregar"; }
}

function irPara(pagina){
    window.location.href = pagina;
}
