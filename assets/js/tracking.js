window.dataLayer = window.dataLayer || [];

function track(eventName, data = {}){
  window.dataLayer.push({
    event: eventName,
    ...data
  });

  console.log('TRACK:', eventName, data);
}

function gerarEventId(){
  return Date.now().toString(36) +
    Math.random().toString(36).slice(2,11);
}
