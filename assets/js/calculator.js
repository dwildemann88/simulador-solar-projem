function calcularResultado(){
  const valorConta = Number(state.conta || 0);

  let qualificacao = 'Potencial a confirmar';

  if(valorConta >= 1000){
    qualificacao = 'Alto potencial para análise';
  }
  else if(valorConta >= 650){
    qualificacao = 'Bom potencial para análise';
  }
  else if(valorConta > 0){
    qualificacao = 'Potencial inicial para análise';
  }

  state.qualificacao = qualificacao;
  state.resultadoEstimado = qualificacao;

  // O valor médio da conta, isoladamente, não permite estimar com rigor
  // economia percentual, nova conta ou investimento. Esses campos legados
  // permanecem zerados por retrocompatibilidade com integrações existentes.
  state.economia = 0;
  state.novaConta = 0;
  state.total10Anos = 0;
}

function formatCurrency(value){
  return Number(value || 0).toLocaleString('pt-BR',{
    style:'currency',
    currency:'BRL'
  });
}
