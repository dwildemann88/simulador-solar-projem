window.dataLayer = window.dataLayer || [];

const META_PIXEL_ID = '1678481836973630';

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
  window.dataLayer.push({
    event: eventName,
    ...data
  });

  console.log('TRACK:', eventName, data);
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

function gerarEventId(){
  if(window.crypto && typeof window.crypto.randomUUID === 'function'){
    return window.crypto.randomUUID();
  }

  return Date.now().toString(36) +
    Math.random().toString(36).slice(2,11);
}
