function analyticsGenerateLead(){
  const eventId = gerarEventId();
  state.eventId = eventId;
  return eventId;
}

function analyticsConfirmLead(eventId){
  const commonData = {
    event_id: eventId,
    lead_id: state.leadId,
    valor_conta: state.conta,
    regiao: descobrirRegiao(),
    tipo_imovel: state.tipoImovel,
    prazo_compra: state.prazoCompra,
    preferencia_atendimento: state.preferenciaAtendimento,
    origem: 'simulador_solar'
  };

  track('generate_lead', {
    ...commonData,
    value: 1,
    currency: 'BRL'
  });

  trackMetaLead(eventId, {
    content_name: 'Simulador Solar',
    content_category: 'Energia Solar',
    valor_conta: state.conta,
    regiao: descobrirRegiao(),
    tipo_imovel: state.tipoImovel,
    prazo_compra: state.prazoCompra,
    preferencia_atendimento: state.preferenciaAtendimento,
    origem: 'simulador_solar'
  });
}

function descobrirRegiao(){
  const santaRosa = [
    'Santa Rosa',
    'Giruá',
    'Senador Salgado Filho',
    'Três de Maio',
    'Horizontina',
    'Santo Cristo'
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
