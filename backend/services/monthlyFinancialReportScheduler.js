const {
  enviarRelatorioFinanceiroMensal,
  obterDestinatarioRelatorio
} = require("./financialReportService");

const UM_DIA_EM_MS = 24 * 60 * 60 * 1000;
const UM_SEGUNDO_EM_MS = 1000;

function proximaExecucaoMensal(agora = new Date()) {
  const proximoMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 1, 9, 0, 0, 0);
  return proximoMes;
}

function iniciarAgendamentoRelatorioFinanceiroMensal() {
  if (process.env.FINANCE_REPORT_ENABLED === "false") {
    console.log("Relatorio financeiro mensal automatico desativado.");
    return;
  }

  const destinatario = obterDestinatarioRelatorio();
  if (!destinatario) {
    console.log("Relatorio financeiro mensal automatico sem destinatario. Defina FINANCE_REPORT_EMAIL.");
    return;
  }

  const agendarAte = (dataAlvo, tarefa) => {
    const atraso = dataAlvo.getTime() - Date.now();

    if (atraso <= UM_SEGUNDO_EM_MS) {
      setTimeout(tarefa, UM_SEGUNDO_EM_MS);
      return;
    }

    setTimeout(() => agendarAte(dataAlvo, tarefa), Math.min(atraso, UM_DIA_EM_MS));
  };

  const agendar = () => {
    const proximaExecucao = proximaExecucaoMensal();

    console.log(`Proximo relatorio financeiro mensal agendado para ${proximaExecucao.toLocaleString("pt-BR")}.`);

    agendarAte(proximaExecucao, async () => {
      try {
        await enviarRelatorioFinanceiroMensal(destinatario);
        console.log("Relatorio financeiro mensal enviado com sucesso.");
      } catch (erro) {
        console.error("Erro ao enviar relatorio financeiro mensal:", erro.message);
      } finally {
        agendar();
      }
    });
  };

  agendar();
}

module.exports = {
  iniciarAgendamentoRelatorioFinanceiroMensal,
  proximaExecucaoMensal
};
