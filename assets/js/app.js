function startSimulator(){
  track('simulator_start_click');
  show('step1');
  bar(12);
}

function getCidadeDigitada(){
  const cidadeInput = document.getElementById('cidade') || document.getElementById('cidade_input');
  return cidadeInput ? cidadeInput.value.trim().replace(/\s+/g, ' ') : '';
}

function selectConta(el, valor){
  state.conta = valor;

  track('form_start', {
    valor_conta: valor
  });

  setActiveCard('#step1 .option-card', el);

  setTimeout(() => {
    show('step2');
    bar(30);
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

  track('step_city', {
    cidade: cidade
  });

  show('step3');
  bar(50);
}

function selectOrcamento(el, valor){
  state.jaFezOrcamento = valor;

  track('step_orcamento', {
    status: valor
  });

  setActiveCard('#step3 .option-card', el);

  setTimeout(() => {
    show('step4');
    bar(68);
  }, 180);
}

function updateLoadingFeed(activeIndex){
  const items = [
    document.getElementById('loading-feed-1'),
    document.getElementById('loading-feed-2'),
    document.getElementById('loading-feed-3')
  ];

  items.forEach((item, index) => {
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

function selectTelhado(el, valor){
  state.tipoTelhado = valor;

  track('step_telhado', {
    telhado: valor
  });

  setActiveCard('#step4 .option-card', el);

  show('processando');
  bar(82);

  const phases = [
    {
      title: 'Montando sua estimativa',
      sub: 'Estamos organizando os dados da sua simulação.',
      feedIndex: 0
    },
    {
      title: 'Conferindo sua região',
      sub: 'Usando a cidade informada para ajustar a análise.',
      feedIndex: 1
    },
    {
      title: 'Refinando o resultado',
      sub: 'Considerando o perfil de telhado e a faixa de economia.',
      feedIndex: 2
    }
  ];

  let index = 0;
  document.getElementById('loadingTitle').innerText = phases[0].title;
  document.getElementById('loadingSub').innerText = phases[0].sub;
  updateLoadingFeed(phases[0].feedIndex);

  const interval = setInterval(() => {
    index++;
    if(index < phases.length){
      document.getElementById('loadingTitle').innerText = phases[index].title;
      document.getElementById('loadingSub').innerText = phases[index].sub;
      updateLoadingFeed(phases[index].feedIndex);
    }
  }, 820);

  setTimeout(() => {
    clearInterval(interval);
    calcularResultado();
    show('preResultado');
    bar(92);
  }, 2600);
}

function animateCurrencyValue(elementId, finalValue, duration = 1200){
  const element = document.getElementById(elementId);
  if(!element) return;

  const startTime = performance.now();

  function step(currentTime){
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue = finalValue * eased;

    element.innerText = formatCurrency(currentValue);

    if(progress < 1){
      requestAnimationFrame(step);
    } else {
      element.innerText = formatCurrency(finalValue);
    }
  }

  requestAnimationFrame(step);
}

async function mostrarResultado(){
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

  const eventId = analyticsGenerateLead();
  salvarLead(eventId);

  document.getElementById('economia').innerText = formatCurrency(0);
  document.getElementById('contaAtual').innerText = formatCurrency(0);
  document.getElementById('novaConta').innerText = formatCurrency(0);

  // Exceção solicitada: o valor de 10 anos aparece direto, sem contador.
  document.getElementById('total').innerText = formatCurrency(state.total10Anos);

  show('resultado');
  bar(100);

  setTimeout(() => {
    animateCurrencyValue('economia', state.economia, 1400);
    animateCurrencyValue('contaAtual', state.conta, 1100);
    animateCurrencyValue('novaConta', state.novaConta, 1250);
  }, 120);
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
