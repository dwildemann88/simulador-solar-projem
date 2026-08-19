function analyticsGenerateLead(){
  const eventId = gerarEventId();

  const payload = {
    event_id: eventId,
    value: Number(state.economia.toFixed(2)),
    currency: 'BRL',
    valor_conta: state.conta,
    regiao: descobrirRegiao(),
    tipo_imovel: state.tipoTelhado,
    ja_fez_orcamento: state.jaFezOrcamento,
    preferencia_atendimento: state.preferenciaAtendimento
  };

  track('generate_lead', payload);

  return eventId;
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
