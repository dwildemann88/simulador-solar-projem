function startSimulator(){
  trackSimulatorStart();
  show('step1');
  bar(16);
}

function goBack(stepId, progress){
  clearFieldError();
  show(stepId);
  bar(progress);
}

function getCidadeDigitada(){
  const cidadeInput = document.getElementById('cidade') || document.getElementById('cidade_input');
  return cidadeInput ? cidadeInput.value.trim().replace(/\s+/g, ' ') : '';
}

function selectConta(el, valor){
  state.conta = valor;
  setActiveCard('#step1 .option-card', el);

  trackStepComplete(1, 'bill_range', {
    bill_range: valor
  });

  setTimeout(() => {
    show('step2');
    bar(32);
  }, 180);
}

function irStep3(){
  clearFieldError();

  const cidade = getCidadeDigitada();

  if(!cidade){
    showFieldError('Digite sua cidade para continuar.');
    return;
  }

  state.cidade = cidade;

  trackStepComplete(2, 'city', {
    city_region_category: descobrirRegiao()
  });

  show('step3');
  bar(48);
}

function selectTipoTelhado(el, valor){
  state.tipoTelhado = valor;
  setActiveCard('#step3 .option-card', el);

  trackStepComplete(3, 'roof_type', {
    roof_type: valor,
    property_type: valor
  });

  setTimeout(() => {
    show('step4');
    bar(64);
  }, 180);
}

function selectPrazoCompra(el, valor){
  state.prazoCompra = valor;
  setActiveCard('#step4 .option-card', el);

  trackStepComplete(4, 'purchase_timing', {
    purchase_timing: valor
  });

  setTimeout(() => {
    iniciarProcessamento();
  }, 180);
}

function updateLoadingFeed(activeIndex){
  const items = [
    document.getElementById('loading-feed-1'),
    document.getElementById('loading-feed-2')
  ];

  items.forEach((item, index) => {
    if(!item) return;

    item.classList.remove('is-top', 'is-active', 'is-hidden');

    if(index < activeIndex){
      item.classList.add('is-top');
    } else if(index === activeIndex){
      item.classList.add('is-active');
    } else {
      item.classList.add('is-hidden');
    }
  });
}

function iniciarProcessamento(){
  show('processando');
  bar(78);

  document.getElementById('loadingTitle').innerText = 'Calculando sua estimativa';
  document.getElementById('loadingSub').innerText = 'Organizando as informações da sua simulação.';
  updateLoadingFeed(0);

  setTimeout(() => {
    updateLoadingFeed(1);
  }, 650);

  setTimeout(() => {
    calcularResultado();
    show('preResultado');
    bar(88);
  }, 1250);
}

async function mostrarResultado(buttonElement){
  clearFieldError();

  const nome = document.getElementById('nome').value.trim().replace(/\s+/g, ' ');
  const telefone = document.getElementById('telefone').value.replace(/\D/g,'');

  if(!isValidName(nome)){
    showFieldError('Informe seu nome corretamente.');
    return;
  }

  if(!isValidPhone(telefone)){
    showFieldError('Informe um WhatsApp válido com DDD.');
    return;
  }

  state.nome = nome;
  state.telefone = telefone;
  state.cidade = getCidadeDigitada() || state.cidade;

  const submitButton = buttonElement || document.getElementById('contactSubmit');
  const originalLabel = submitButton ? submitButton.innerHTML : '';

  if(submitButton){
    submitButton.disabled = true;
    submitButton.innerHTML = '<span>Confirmando dados...</span>';
  }

  const eventId = state.eventId || analyticsGenerateLead();
  const leadCriado = await salvarLead(eventId);

  if(!leadCriado){
    if(submitButton){
      submitButton.disabled = false;
      submitButton.innerHTML = originalLabel;
    }

    showFieldError('Não conseguimos confirmar o envio. Tente novamente.');
    return;
  }

  trackContactComplete();

  document.getElementById('resultadoStatus').innerText = state.qualificacao;
  document.getElementById('resultadoConta').innerText = formatCurrency(state.conta);
  document.getElementById('resultadoPerfil').innerText = state.tipoTelhado;
  document.getElementById('resultadoPrazo').innerText = state.prazoCompra;

  show('resultado');
  bar(100);
  trackResultPreview();
  trackSimulatorComplete();
}

function isValidName(nome){
  const cleaned = nome.replace(/[^a-zA-ZÀ-ÿ\s]/g,'').trim();
  return cleaned.length >= 3;
}

function isValidPhone(phone){
  if(phone.length < 10 || phone.length > 11) return false;
  if(/^(\d)\1+$/.test(phone)) return false;

  const ddd = Number(phone.slice(0,2));
  if(ddd < 11 || ddd > 99) return false;

  return true;
}

document.addEventListener('DOMContentLoaded', () => {
  trackSimulatorView();

  const telefoneInput = document.getElementById('telefone');

  if(telefoneInput){
    telefoneInput.addEventListener('input', event => {
      let value = event.target.value.replace(/\D/g,'');

      if(value.length > 11){
        value = value.slice(0,11);
      }

      if(value.length > 10){
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
      else if(value.length > 6){
        value = value.replace(/(\d{2})(\d{4,5})(\d{0,4})/, '($1) $2-$3');
      }
      else if(value.length > 2){
        value = value.replace(/(\d{2})(\d+)/, '($1) $2');
      }

      event.target.value = value;
    });
  }
});
