function analyticsGenerateLead(){
  return gerarEventId();
}

function analyticsConfirmLead(eventId){
  const commonData = {
    event_id: eventId,
    valor_conta: state.conta,
    regiao: descobrirRegiao(),
    tipo_imovel: state.tipoTelhado,
    ja_fez_orcamento: state.jaFezOrcamento,
    preferencia_atendimento: state.preferenciaAtendimento,
    origem: 'simulador_solar'
  };

  track('generate_lead', {
    ...commonData,
    value: Number(state.economia.toFixed(2)),
    currency: 'BRL'
  });

  trackMetaLead(eventId, {
    content_name: 'Simulador Solar',
    content_category: 'Energia Solar',
    valor_conta: state.conta,
    regiao: descobrirRegiao(),
    tipo_imovel: state.tipoTelhado,
    ja_fez_orcamento: state.jaFezOrcamento,
    preferencia_atendimento: state.preferenciaAtendimento,
    origem: 'simulador_solar'
  });
}

function descobrirRegiao(){
  const santaRosa = [
    'Santa Rosa',
    'Giruá',
    'Senador Salgado Filho'
  ];

  const missoes = [
    'Santo Ângelo',
    'Guarani das Missões',
    'Cerro Largo',
    'Entre-Ijuís',
    'São Luiz Gonzaga',
    'Sete de Setembro'
  ];

  const ijui = [
    'Ijuí',
    'Cruz Alta',
    'Catuípe'
  ];

  if(santaRosa.includes(state.cidade)){
    return 'Santa Rosa e região';
  }

  if(missoes.includes(state.cidade)){
    return 'Missões';
  }

  if(ijui.includes(state.cidade)){
    return 'Ijuí e região';
  }

  return 'Outras regiões';
}
