const ISALES_CONFIG = {
  endpoint: 'https://app.isales.company/formulario/cliente',
  empresaToken: 'HJK1303ISAL567',
  formularioId: 'UFD165TR951',
  iframeName: 'isales_crm_iframe'
};

async function salvarLead(eventId){
  enviarLeadIsales();
  await enviarLeadMake(eventId);
}

async function enviarLeadMake(eventId){
  try{
    await fetch(
      'https://hook.us2.make.com/rdfwi4qnt2vwdv7tva24wm7cntew99yi',
      {
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          nome: state.nome,
          telefone: state.telefone,

          cidade_digitada: state.cidade,
          regiao: descobrirRegiao(),

          conta: state.conta,

          tipo_imovel: state.tipoTelhado,
          ja_fez_orcamento: state.jaFezOrcamento,

          economia: state.economia,

          event_id: eventId,
          origem:'simulador_solar',

          gclid: state.utm.gclid,
          gbraid: state.utm.gbraid,
          wbraid: state.utm.wbraid,

          utm_source: state.utm.source,
          utm_medium: state.utm.medium,
          utm_campaign: state.utm.campaign,
          utm_content: state.utm.content,
          utm_term: state.utm.term
        })
      }
    );

    console.log('Lead enviado para Make');
  }
  catch(error){
    console.error('Erro ao enviar lead para Make:', error);
  }
}

function enviarLeadIsales(){
  try{
    garantirIframeIsales();

    const cidade = typeof getCidadeDigitada === 'function' ? (getCidadeDigitada() || state.cidade) : state.cidade;
    state.cidade = cidade;

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = ISALES_CONFIG.endpoint;
    form.target = ISALES_CONFIG.iframeName;
    form.style.display = 'none';

    const campos = {
      e: ISALES_CONFIG.empresaToken,
      fid: ISALES_CONFIG.formularioId,
      nome: state.nome,
      telefone: state.telefone,
      cidade: cidade,
      valor_energia: String(state.conta || ''),
      redirect: '1'
    };

    Object.entries(campos).forEach(([name, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value || '';
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();

    setTimeout(() => {
      form.remove();
    }, 3000);

    track('isales_lead_submit', {
      valor_conta: state.conta,
      cidade: cidade
    });

    console.log('Lead enviado para iSales');
  }
  catch(error){
    console.error('Erro ao enviar lead para iSales:', error);
  }
}

function garantirIframeIsales(){
  if(document.getElementById(ISALES_CONFIG.iframeName)){
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.name = ISALES_CONFIG.iframeName;
  iframe.id = ISALES_CONFIG.iframeName;
  iframe.title = 'Integração CRM iSales';
  iframe.style.display = 'none';
  iframe.style.visibility = 'hidden';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';

  document.body.appendChild(iframe);
}
