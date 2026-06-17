const nodemailer = require("nodemailer");
const db = require("../db_config.js");

function criarTransporterEmail() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
}

function obterDestinatarioRelatorio() {
  return process.env.FINANCE_REPORT_EMAIL || process.env.SMTP_FROM || process.env.SMTP_USER || "";
}

function primeiraTabela(resultado) {
  return Array.isArray(resultado) && Array.isArray(resultado[0]) ? resultado[0] : [];
}

async function chamarProcedure(sql) {
  const [resultado] = await db.query(sql);
  return primeiraTabela(resultado);
}

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function formatarNumero(valor) {
  return Number(valor || 0).toLocaleString("pt-BR");
}

function formatarMesAtual(data = new Date()) {
  return data.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric"
  });
}

async function coletarDadosRelatorioFinanceiro() {
  const [
    projecao,
    tendencia,
    ltv,
    previsao3Meses,
    impactoBolsistas,
    inadimplentes,
    naoPagaramMesAtual
  ] = await Promise.all([
    chamarProcedure("CALL sp_projecao_receita();"),
    chamarProcedure("CALL sp_tendencia_sazonalidade_receita();"),
    chamarProcedure("CALL sp_ltv_alunos();"),
    chamarProcedure("CALL sp_prev_receita_3_meses();"),
    chamarProcedure("CALL sp_impac_bolsistas();"),
    chamarProcedure("CALL sp_alunos_inidimplentes();"),
    chamarProcedure("CALL sp_alunos_pagamentos_mes_atual();")
  ]);

  return {
    periodo: formatarMesAtual(),
    projecao: projecao[0] || {},
    tendencia,
    ltv,
    previsao3Meses,
    impactoBolsistas: impactoBolsistas[0] || {},
    inadimplentes,
    naoPagaramMesAtual
  };
}

function linhaTabela(colunas) {
  return `<tr>${colunas.map((coluna) => `<td>${coluna ?? "-"}</td>`).join("")}</tr>`;
}

function montarHtmlRelatorio(dados) {
  const { projecao, impactoBolsistas } = dados;
  const ultimaTendencia = dados.tendencia[dados.tendencia.length - 1] || {};
  const topLtv = dados.ltv.slice(0, 5);
  const inadimplentes = dados.inadimplentes.slice(0, 10);
  const previsoes = dados.previsao3Meses.slice(0, 3);

  return `
    <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.5;">
      <h2 style="margin-bottom: 4px;">Relatorio financeiro mensal - The Tower</h2>
      <p style="margin-top: 0;">Periodo analisado: <strong>${dados.periodo}</strong></p>

      <h3>Resumo do mes</h3>
      <ul>
        <li>Receita realizada: <strong>${formatarMoeda(projecao.receita_realizada)}</strong></li>
        <li>Receita projetada: <strong>${formatarMoeda(projecao.receita_total_projetada)}</strong></li>
        <li>Receita pendente: <strong>${formatarMoeda(projecao.receita_pendente)}</strong></li>
        <li>Alunos pendentes: <strong>${formatarNumero(projecao.alunos_nao_bolsistas_pendentes)}</strong></li>
        <li>Bolsistas ativos: <strong>${formatarNumero(projecao.total_bolsistas)}</strong></li>
      </ul>

      <h3>Tendencia recente</h3>
      <p>
        Ultimo mes registrado: <strong>${ultimaTendencia.nome_mes || "-"}</strong>,
        receita de <strong>${formatarMoeda(ultimaTendencia.receita_mensal)}</strong>
        e variacao mensal de <strong>${formatarNumero(ultimaTendencia.variacao_percentual)}%</strong>.
      </p>

      <h3>Previsao dos proximos 3 meses</h3>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
        <tr><th>Mes</th><th>Receita projetada</th><th>Confianca</th></tr>
        ${previsoes.map((item) => linhaTabela([
          item.mes_ano_nome,
          formatarMoeda(item.receita_projetada),
          item.confianca_previsao
        ])).join("")}
      </table>

      <h3>Impacto de bolsistas</h3>
      <ul>
        <li>Total de alunos ativos: <strong>${formatarNumero(impactoBolsistas.total_alunos_ativos)}</strong></li>
        <li>Receita mensal atual: <strong>${formatarMoeda(impactoBolsistas.receita_mensal_atual)}</strong></li>
        <li>Impacto mensal estimado: <strong>${formatarMoeda(impactoBolsistas.impacto_mensal_bolsistas)}</strong></li>
      </ul>

      <h3>Top alunos por receita</h3>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
        <tr><th>Aluno</th><th>Receita total</th><th>Status</th></tr>
        ${topLtv.map((aluno) => linhaTabela([
          aluno.nome_aluno,
          formatarMoeda(aluno.receita_total_gerada),
          aluno.status_pagamento
        ])).join("")}
      </table>

      <h3>Inadimplentes em destaque</h3>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
        <tr><th>Aluno</th><th>Dias sem pagar</th><th>Valor devido</th><th>Status</th></tr>
        ${inadimplentes.map((aluno) => linhaTabela([
          aluno.nome_aluno,
          aluno.dias_sem_pagar,
          formatarMoeda(aluno.valor_total_debito || aluno.valor_devido),
          aluno.status
        ])).join("")}
      </table>
    </div>
  `;
}

function montarTextoRelatorio(dados) {
  const { projecao, impactoBolsistas } = dados;
  const ultimaTendencia = dados.tendencia[dados.tendencia.length - 1] || {};

  return [
    `Relatorio financeiro mensal - The Tower`,
    `Periodo analisado: ${dados.periodo}`,
    "",
    `Receita realizada: ${formatarMoeda(projecao.receita_realizada)}`,
    `Receita projetada: ${formatarMoeda(projecao.receita_total_projetada)}`,
    `Receita pendente: ${formatarMoeda(projecao.receita_pendente)}`,
    `Alunos pendentes: ${formatarNumero(projecao.alunos_nao_bolsistas_pendentes)}`,
    `Bolsistas ativos: ${formatarNumero(projecao.total_bolsistas)}`,
    "",
    `Ultimo mes registrado: ${ultimaTendencia.nome_mes || "-"}`,
    `Receita do ultimo mes registrado: ${formatarMoeda(ultimaTendencia.receita_mensal)}`,
    `Variacao mensal: ${formatarNumero(ultimaTendencia.variacao_percentual)}%`,
    "",
    `Total de alunos ativos: ${formatarNumero(impactoBolsistas.total_alunos_ativos)}`,
    `Impacto mensal de bolsistas: ${formatarMoeda(impactoBolsistas.impacto_mensal_bolsistas)}`,
    "",
    `Inadimplentes listados: ${formatarNumero(dados.inadimplentes.length)}`,
    `Alunos sem pagamento no mes atual: ${formatarNumero(dados.naoPagaramMesAtual.length)}`
  ].join("\n");
}

async function enviarRelatorioFinanceiroMensal(destinatario = obterDestinatarioRelatorio()) {
  if (!destinatario) {
    throw new Error("Destinatario do relatorio nao configurado. Defina FINANCE_REPORT_EMAIL.");
  }

  const transporter = criarTransporterEmail();

  if (!transporter) {
    throw new Error("SMTP nao configurado. Defina SMTP_HOST, SMTP_PORT, SMTP_USER e SMTP_PASS.");
  }

  const dados = await coletarDadosRelatorioFinanceiro();
  const assunto = `Relatorio financeiro mensal - ${dados.periodo}`;

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: destinatario,
    subject: assunto,
    text: montarTextoRelatorio(dados),
    html: montarHtmlRelatorio(dados)
  });

  return {
    destinatario,
    periodo: dados.periodo,
    messageId: info.messageId
  };
}

module.exports = {
  coletarDadosRelatorioFinanceiro,
  enviarRelatorioFinanceiroMensal,
  obterDestinatarioRelatorio
};
