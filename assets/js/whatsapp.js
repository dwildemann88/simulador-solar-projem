function whats(){
  state.whatsappClicked = true;
  trackWhatsappClick();

  const mensagem =
    `Olá! Fiz minha simulação de energia solar no site da PROJEM e gostaria de receber minha análise completa.\n\n` +
    `Código da simulação: ${state.leadId}\n` +
    `Cidade: ${state.cidade}\n` +
    `Conta informada: ${formatCurrency(state.conta)}\n` +
    `Perfil: ${state.tipoImovel}\n` +
    `Prazo: ${state.prazoCompra}`;

  const url =
    'https://wa.me/555599686302?text=' +
    encodeURIComponent(mensagem);

  window.location.href = url;
}
