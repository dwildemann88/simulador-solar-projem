function calcularResultado(){
  let percentual = 0.72 + (Math.random() * 0.16);

  if(state.tipoTelhado === 'Fibrocimento'){
    percentual += 0.03;
  }

  if(state.tipoTelhado === 'Laje'){
    percentual -= 0.04;
  }

  if(state.jaFezOrcamento === 'Sim'){
    percentual -= 0.03;
  }

  percentual = Math.min(0.90, Math.max(0.68, percentual));

  state.economia = state.conta * percentual;
  state.novaConta = state.conta - state.economia;
  state.total10Anos = state.conta * 120;
}

function formatCurrency(value){
  return Number(value || 0).toLocaleString('pt-BR',{
    style:'currency',
    currency:'BRL'
  });
}
