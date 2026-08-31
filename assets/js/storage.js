function createLeadId(){
  if(window.crypto && typeof window.crypto.randomUUID === 'function'){
    return window.crypto.randomUUID();
  }

  return `lead_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,10)}`;
}

function getOrCreateLeadId(){
  const storageKey = 'projem_solar_lead_id';

  try{
    const existing = sessionStorage.getItem(storageKey);
    if(existing) return existing;

    const created = createLeadId();
    sessionStorage.setItem(storageKey, created);
    return created;
  }
  catch(error){
    console.warn('sessionStorage indisponível para lead_id:', error);
    return createLeadId();
  }
}

const state = {
  leadId: getOrCreateLeadId(),
  eventId: '',
  createdAt: new Date().toISOString(),

  conta: 0,
  cidade: '',
  tipoImovel: '',
  prazoCompra: '',

  nome: '',
  telefone: '',

  // Campos legados preservados para manter compatibilidade com integrações atuais.
  jaFezOrcamento: '',
  tipoTelhado: '',
  preferenciaAtendimento: 'WhatsApp',

  // Não são preenchidos com números estimados sem base técnica suficiente.
  economia: 0,
  novaConta: 0,
  total10Anos: 0,
  resultadoEstimado: '',
  qualificacao: '',
  whatsappClicked: false,

  utm: {
    gclid: '',
    gbraid: '',
    wbraid: '',
    fbclid: '',
    source: '',
    medium: '',
    campaign: '',
    content: '',
    term: ''
  }
};

(function captureTrackingParams(){
  const params = new URLSearchParams(window.location.search);

  const trackingParams = {
    gclid: params.get('gclid'),
    gbraid: params.get('gbraid'),
    wbraid: params.get('wbraid'),
    fbclid: params.get('fbclid'),
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_content: params.get('utm_content'),
    utm_term: params.get('utm_term')
  };

  Object.keys(trackingParams).forEach(key => {
    if(trackingParams[key]){
      localStorage.setItem(key, trackingParams[key]);
    }
  });

  state.utm = {
    gclid: localStorage.getItem('gclid') || '',
    gbraid: localStorage.getItem('gbraid') || '',
    wbraid: localStorage.getItem('wbraid') || '',
    fbclid: localStorage.getItem('fbclid') || '',
    source: localStorage.getItem('utm_source') || '',
    medium: localStorage.getItem('utm_medium') || '',
    campaign: localStorage.getItem('utm_campaign') || '',
    content: localStorage.getItem('utm_content') || '',
    term: localStorage.getItem('utm_term') || ''
  };
})();
