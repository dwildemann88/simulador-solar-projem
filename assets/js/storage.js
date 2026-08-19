const state = {
  conta: 0,
  cidade: '',

  nome: '',
  telefone: '',

  jaFezOrcamento: '',
  tipoTelhado: '',
  preferenciaAtendimento: '',

  economia: 0,
  novaConta: 0,
  total10Anos: 0,

  utm: {
    gclid: '',
    gbraid: '',
    wbraid: '',
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
    source: localStorage.getItem('utm_source') || '',
    medium: localStorage.getItem('utm_medium') || '',
    campaign: localStorage.getItem('utm_campaign') || '',
    content: localStorage.getItem('utm_content') || '',
    term: localStorage.getItem('utm_term') || ''
  };
})();
