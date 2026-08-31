window.dataLayer = window.dataLayer || [];

const META_PIXEL_ID = '1678481836973630';
const trackedOnce = new Set();

(function initMetaPixel(f,b,e,v,n,t,s){
  if(f.fbq) return;

  n=f.fbq=function(){
    n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments);
  };

  if(!f._fbq) f._fbq=n;
  n.push=n;
  n.loaded=!0;
  n.version='2.0';
  n.queue=[];

  t=b.createElement(e);
  t.async=!0;
  t.src=v;
  s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s);
})(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

fbq('init', META_PIXEL_ID);
fbq('track', 'PageView');

function track(eventName, data = {}){
  try{
    window.dataLayer.push({
      event: eventName,
      ...data
    });

    console.log('TRACK:', eventName, data);
  }
  catch(error){
    console.warn('Falha não bloqueante no tracking:', error);
  }
}

function trackOnce(eventName, data = {}, uniqueKey = eventName){
  if(trackedOnce.has(uniqueKey)) return;
  trackedOnce.add(uniqueKey);
  track(eventName, data);
}

function getTrafficSource(){
  return state.utm.source || (state.utm.gclid ? 'google_ads' : 'direct_or_unknown');
}

function getAnalyticsContext(){
  return {
    lead_id: state.leadId,
    traffic_source: getTrafficSource(),
    experiment_variant: 'qualified_v2'
  };
}

function trackSimulatorView(){
  trackOnce('solar_simulator_view', getAnalyticsContext());
}

function trackSimulatorStart(){
  trackOnce('solar_simulator_start', getAnalyticsContext());
}

function trackStepView(stepNumber, stepName){
  trackOnce(
    'solar_simulator_step_view',
    {
      ...getAnalyticsContext(),
      step_number: stepNumber,
      step_name: stepName
    },
    `step_view_${stepNumber}_${stepName}`
  );
}

function trackStepComplete(stepNumber, stepName, parameters = {}){
  trackOnce(
    'solar_simulator_step_complete',
    {
      ...getAnalyticsContext(),
      step_number: stepNumber,
      step_name: stepName,
      ...parameters
    },
    `step_complete_${stepNumber}_${stepName}`
  );
}

function trackContactView(){
  trackOnce('solar_simulator_contact_view', getAnalyticsContext());
}

function trackContactComplete(){
  trackOnce('solar_simulator_contact_complete', getAnalyticsContext());
}

function trackResultPreview(){
  trackOnce('solar_simulator_result_preview', {
    ...getAnalyticsContext(),
    bill_range: state.conta,
    property_type: state.tipoImovel,
    purchase_timing: state.prazoCompra,
    city_region_category: typeof descobrirRegiao === 'function' ? descobrirRegiao() : 'Outras regiões'
  });
}

function trackSimulatorComplete(){
  trackOnce('solar_simulator_complete', getAnalyticsContext());
}

function trackWhatsappClick(){
  trackOnce('solar_simulator_whatsapp_click', {
    ...getAnalyticsContext(),
    bill_range: state.conta,
    property_type: state.tipoImovel,
    purchase_timing: state.prazoCompra,
    city_region_category: typeof descobrirRegiao === 'function' ? descobrirRegiao() : 'Outras regiões'
  });
}

function trackMetaLead(eventId, data = {}){
  if(typeof window.fbq !== 'function'){
    console.warn('Meta Pixel indisponível; evento Lead não enviado.');
    return;
  }

  window.fbq(
    'track',
    'Lead',
    data,
    { eventID: eventId }
  );

  console.log('META PIXEL: Lead', { event_id: eventId, ...data });
}

function getCookieValue(name){
  const prefix = `${name}=`;
  const cookie = document.cookie
    .split(';')
    .map(item => item.trim())
    .find(item => item.startsWith(prefix));

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : '';
}

function getMetaAttribution(){
  return {
    fbclid: state && state.utm ? state.utm.fbclid : '',
    fbp: getCookieValue('_fbp'),
    fbc: getCookieValue('_fbc')
  };
}

function gerarEventId(){
  if(window.crypto && typeof window.crypto.randomUUID === 'function'){
    return window.crypto.randomUUID();
  }

  return Date.now().toString(36) +
    Math.random().toString(36).slice(2,11);
}
