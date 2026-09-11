const ISALES_CONFIG = {
  endpoint: 'https://app.isales.company/formulario/cliente',
  empresaToken: 'HJK1303ISAL567',
  formularioId: 'UFD165TR951',
  iframeName: 'isales_crm_iframe'
};

let leadSubmissionPromise = null;
let leadConversionTracked = false;
let isalesSubmissionSent = false;

async function salvarLead(eventId){
  if(leadSubmissionPromise){
    return leadSubmissionPromise;
  }

  leadSubmissionPromise = (async () => {
    if(!isalesSubmissionSent){
      enviarLeadIsales();
      isalesSubmissionSent = true;
    }

    const leadCriado = await enviarLeadMake(eventId);

    if(leadCriado && !leadConversionTracked){
      analyticsConfirmLead(eventId);
      leadConversionTracked = true;
    }

    return leadCriado;
  })();

  const result = await leadSubmissionPromise;

  if(!result){
    leadSubmissionPromise = null;
  }

  return result;
}

async function enviarLeadMake(eventId){
  try{
    const metaAttribution = typeof getMetaAttribution === 'function'
      ? getMetaAttribution()
      : { fbclid: state.utm.fbclid || '', fbp: '', fbc: '' };

    const payload = {
      nome: state.nome,
      telefone: state.telefone,
      cidade_digitada: state.cidade,
      regiao: descobrirRegiao(),
      conta: state.conta,

      // Campo correto para a etapa atual.
      tipo_telhado: state.tipoTelhado,

      // Alias legado: historicamente tipo_imovel já carregava o tipo de cobertura/telhado.
      // Mantido temporariamente para não quebrar cenários do Make que ainda dependam dele.
      tipo_imovel: state.tipoTelhado,

      ja_fez_orcamento: state.jaFezOrcamento,
      preferencia_atendimento: state.preferenciaAtendimento,
      economia: state.economia,
      event_id: eventId,
      origem:'simulador_solar',
      gclid: state.utm.gclid,
      gbraid: state.utm.gbraid,
      wbraid: state.utm.wbraid,
      fbclid: metaAttribution.fbclid,
      fbp: metaAttribution.fbp,
      fbc: metaAttribution.fbc,
      utm_source: state.utm.source,
      utm_medium: state.utm.medium,
      utm_campaign: state.utm.campaign,
      utm_content: state.utm.content,
      utm_term: state.utm.term,
      lead_id: state.leadId,
      timestamp: state.createdAt,
      prazo_compra: state.prazoCompra,
      resultado_estimado: state.resultadoEstimado,
      qualificacao: state.qualificacao,
      whatsapp_clicked: state.whatsappClicked,
      experiment_variant: 'qualified_v2'
    };

    const response = await fetch(
      'https://hook.us2.make.com/rdfwi4qnt2vwdv7tva24wm7cntew99yi',
      {
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(payload)
      }
    );

    if(!response.ok){
      throw new Error(`Make respondeu com HTTP ${response.status}`);
    }

    console.log('Lead confirmado pelo Make');
    return true;
  }
  catch(error){
    console.error('Erro ao enviar lead para Make:', error);
    return false;
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
      city_region_category: descobrirRegiao(),
      roof_type: state.tipoTelhado
    });

    console.log('Lead enviado para iSales');
  }
  catch(error){
    console.error('Erro ao enviar lead para iSales:', error);
    isalesSubmissionSent = false;
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
