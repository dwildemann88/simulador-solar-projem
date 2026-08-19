function whats(){
  track('click_whatsapp', {
    valor_conta: state.conta,
    cidade: state.cidade,
    preferencia_atendimento: state.preferenciaAtendimento
  });

  const preferencia =
    state.preferenciaAtendimento === 'Visita técnica'
      ? 'Aceito agendar uma visita técnica'
      : `Prefiro atendimento por ${state.preferenciaAtendimento || 'WhatsApp'}`;

  const mensagem =
    `Olá, meu nome é ${state.nome}.\n\n` +
    `Fiz uma simulação de energia solar no site da PROJEM.\n\n` +
    `Cidade: ${state.cidade}\n` +
    `Conta atual: ${formatCurrency(state.conta)}\n` +
    `Economia estimada: ${formatCurrency(state.economia)}\n` +
    `Cobertura: ${state.tipoTelhado}\n` +
    `Preferência de atendimento: ${preferencia}\n\n` +
    `Gostaria de receber uma análise completa.`;

  const url =
    'https://wa.me/555599686302?text=' +
    encodeURIComponent(mensagem);

  window.location.href = url;
}
