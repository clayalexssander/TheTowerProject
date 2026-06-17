const API_URL = "http://localhost:3000/api";
let charts = {};

function traduzir(texto) {
  return window.translateAppText ? window.translateAppText(texto) : texto;
}

document.addEventListener("DOMContentLoaded", async () => {
  // elementos modal
  const modal = document.getElementById("modalPagamento");
  const openBtn = document.getElementById("openPagamento");
  const closeBtn = document.getElementById("closePagamento");
  const cancelarBtn = document.getElementById("btnCancelarPagamento");
  const confirmarBtn = document.getElementById("btnConfirmarPagamento");
  const mensagemDiv = document.getElementById("mensagemPagamento");
  const selectMensalidade = document.getElementById("selectMensalidade");

  openBtn.addEventListener("click", async () => {
    await carregarMensalidades();
    modal.classList.add("show");
  });
  closeBtn.addEventListener("click", () => modal.classList.remove("show"));
  cancelarBtn.addEventListener("click", () => modal.classList.remove("show"));

  confirmarBtn.addEventListener("click", async () => {
    mensagemDiv.textContent = "";
    const email = document.getElementById("emailAluno").value.trim();
    const id_mens = selectMensalidade.value;
    if (!email || !id_mens) { mensagemDiv.innerHTML = '<span class="bad">Preencha email e mensalidade.</span>'; return; }

    try {
      confirmarBtn.disabled = true;
      const res = await fetch(`${API_URL}/financas/pagamento`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email_aluno: email, id_mensalidade: Number(id_mens) })
      });
      const data = await res.json();
      if(data.success){
        mensagemDiv.innerHTML = `<span class="good">${data.message}</span>`;
        // atualizar dashboard
        await carregarDashboard();
        setTimeout(()=> modal.classList.remove("show"), 900);
      } else {
        mensagemDiv.innerHTML = `<span class="bad">${data.message || 'Erro'}</span>`;
      }
    } catch (err){
      console.error(err);
      mensagemDiv.innerHTML = `<span class="bad">Erro de comunicação com o servidor.</span>`;
    } finally { confirmarBtn.disabled = false; }
  });

  // inicializa graficos e dados
  await carregarDashboard();
  // atualiza periodicamente (p.ex. a cada 60s)
  setInterval(()=>{ carregarDashboard().catch(()=>{}); }, 60000);
});

async function carregarMensalidades() {
  const sel = document.getElementById("selectMensalidade");
  sel.innerHTML = "<option>Carregando...</option>";
  try {
    const res = await fetch(`${API_URL}/financas/mensalidades`);
    const data = await res.json();
    sel.innerHTML = "";
    if(data.success && Array.isArray(data.data)){
      data.data.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m.id_mensalidade;
        opt.text = `${m.tipo} — R$ ${Number(m.valor).toFixed(2)}`;
        sel.appendChild(opt);
      });
      if(sel.options.length === 0) sel.innerHTML = "<option value=''>Nenhuma mensalidade</option>";
    } else {
      sel.innerHTML = "<option value=''>Erro ao carregar</option>";
    }
  } catch (err) {
    sel.innerHTML = "<option value=''>Erro</option>";
  }
}

async function carregarDashboard(){
  await Promise.all([
    carregarProjecao(),
    carregarTendencia(),
    carregarLtv(),
    carregarPrev3(),
    carregarImpacto(),
    carregarInadimplentes()
  ]);
}
async function carregarProjecao(){
  try{
    const res = await fetch(`${API_URL}/financas/projecao`);
    const payload = await res.json();
    if(!payload.success) return;

    const d = payload.data[0] || {};
    document.getElementById("kpiReceita").textContent = `R$ ${Number(d.receita_realizada || 0).toFixed(2)}`;
    document.getElementById("kpiProjetada").textContent = `R$ ${Number(d.receita_total_projetada || 0).toFixed(2)}`;
    document.getElementById("kpiPendentes").textContent = `${d.alunos_nao_bolsistas_pendentes || 0}`;

    const ctx = document.getElementById("chartProjecao").getContext("2d");
    const labels = ["✅ Pagos", "⏳ Pendentes", "🎓 Bolsistas"];
    const values = [
      Number(d.alunos_nao_bolsistas_que_ja_pagaram || 0),
      Number(d.alunos_nao_bolsistas_pendentes || 0),
      Number(d.total_bolsistas || 0)
    ];
    
    if(charts.projecao) charts.projecao.destroy();
    charts.projecao = new Chart(ctx, {
      type: 'pie',
      data: { 
        labels: labels.map(traduzir), 
        datasets: [{ 
          data: values,
          backgroundColor: ['#10b981', '#f59e0b', '#3b82f6'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }] 
      },
      options: { 
        plugins: {
          legend: { 
            position: 'bottom',
            labels: { usePointStyle: true, padding: 20 }
          }
        },
        responsive: true
        // REMOVIDO: maintainAspectRatio: false
      }
    });
  }catch(err){ console.error("projecao",err); }
}



async function carregarTendencia(){
  try{
    const res = await fetch(`${API_URL}/financas/tendencia`);
    const payload = await res.json();
    if(!payload.success) return;
    const rows = payload.data;

    const labels = rows.map(r => r.nome_mes);
    const values = rows.map(r => Number(r.receita_mensal || 0));
    const ctx = document.getElementById("chartTendencia").getContext("2d");
    if(charts.tendencia) charts.tendencia.destroy();
    charts.tendencia = new Chart(ctx, {
      type: 'line',
      data: { labels: labels.map(traduzir), datasets: [{ label: traduzir('Receita mensal'), data: values, fill:false, tension:0.2 }] },
      options:{plugins:{legend:{display:false}},responsive:true}
    });
  }catch(err){ console.error("tendencia",err); }
}

async function carregarLtv(){
  try{
    const res = await fetch(`${API_URL}/financas/ltv`);
    const payload = await res.json();
    if(!payload.success) return;
    
    const top = (payload.data || []).slice(0,6);
    const labels = top.map(t=> t.nome_aluno?.split(' ')[0] || ('ID '+t.id_aluno));
    const values = top.map(t=> Number(t.receita_total_gerada || 0));

    const ctx = document.getElementById("chartLtv").getContext("2d");
    if(charts.ltv) charts.ltv.destroy();
    charts.ltv = new Chart(ctx, {
      type: 'bar',
      data: { 
        labels: labels.map(traduzir), 
        datasets: [{ 
          label: traduzir('Receita Total (R$)'),
          data: values,
          backgroundColor: '#7c3aed',
          borderRadius: 6,
          borderWidth: 0
        }] 
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false }
        },
        responsive: true,
        // REMOVIDO: maintainAspectRatio: false
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { callback: value => 'R$ ' + value.toLocaleString('pt-BR') }
          },
          y: {
            grid: { display: false }
          }
        }
      }
    });
  }catch(err){ console.error("ltv",err); }
}

async function carregarPrev3(){
  try{
    const res = await fetch(`${API_URL}/financas/prev3`);
    const payload = await res.json();
    if(!payload.success) return;
    const rows = payload.data;
    const labels = rows.map(r=> r.mes_ano_nome);
    const values = rows.map(r=> Number(r.receita_projetada || 0));
    
    const ctx = document.getElementById("chartPrev3").getContext("2d");
    if(charts.prev3) charts.prev3.destroy();
    charts.prev3 = new Chart(ctx, {
      type: 'bar',
      data: { 
        labels: labels.map(traduzir), 
        datasets: [{ 
          label: traduzir('Receita Projetada'), 
          data: values, 
          backgroundColor: [
            '#ec4899',
            '#8b5cf6', 
            '#06b6d4'
          ],
          borderRadius: 8,
          borderWidth: 0
        }] 
      },
      options: {
        plugins: {
          legend: { display: false }
        },
        responsive: true,
        // REMOVIDO: maintainAspectRatio: false
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { callback: value => 'R$ ' + value.toLocaleString('pt-BR') }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }catch(err){ console.error("prev3",err); }
}

async function carregarImpacto(){
  try{
    const res = await fetch(`${API_URL}/financas/impacto_bolsistas`);
    const payload = await res.json();
    if(!payload.success) return;
    const d = payload.data[0] || {};
    document.getElementById("impact_total").textContent = d.total_alunos_ativos ?? '-';
    document.getElementById("impact_bolsistas").textContent = d.total_bolsistas ?? '-';
    document.getElementById("impact_receita").textContent = `R$ ${Number(d.receita_mensal_atual||0).toFixed(2)}`;
    document.getElementById("impact_impacto").textContent = `R$ ${Number(d.impacto_mensal_bolsistas||0).toFixed(2)}`;
  }catch(err){ console.error("impacto",err); }
}

async function carregarInadimplentes(){
  const container = document.getElementById("listaInadimplentes");
  container.innerHTML = "Carregando...";
  try{
    const res = await fetch(`${API_URL}/financas/inadimplentes`);
    const payload = await res.json();
    if(!payload.success) { container.innerHTML = "Erro ao carregar"; return; }
    const rows = payload.data;
    if(!rows || rows.length === 0) { container.innerHTML = "<div>Nenhum inadimplente.</div>"; return;}
    const table = document.createElement("table");
    table.className = "table";
    table.innerHTML = `<tr><th>Aluno</th><th>Cidade</th><th>Dias sem pagar</th><th>Valor devido</th><th>Status</th></tr>`;
    rows.forEach(r=>{
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${r.nome_aluno}</td><td>${r.cidade}</td>
        <td>${r.dias_sem_pagar}</td><td>R$ ${Number(r.valor_devido||0).toFixed(2)}</td>
        <td>${r.status}</td>`;
      table.appendChild(tr);
    });
    container.innerHTML = "";
    container.appendChild(table);
  }catch(err){ console.error("inadimplentes",err); container.innerHTML = "Erro ao carregar"; }
}

function irPara(pagina){
    window.location.href = pagina;
}
