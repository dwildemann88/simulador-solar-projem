function bar(value){
  const progress = document.getElementById('bar');

  if(progress){
    progress.style.width = value + '%';
  }
}

function trackVisibleStep(id){
  const map = {
    step1: [1, 'bill_range'],
    step2: [2, 'city'],
    step3: [3, 'roof_type'],
    step4: [4, 'purchase_timing']
  };

  if(map[id] && typeof trackStepView === 'function'){
    trackStepView(map[id][0], map[id][1]);
  }

  if(id === 'preResultado' && typeof trackContactView === 'function'){
    trackContactView();
  }
}

function show(id){
  document.querySelectorAll('.step').forEach(step => {
    step.classList.add('hidden');
    step.classList.remove('is-active');
  });

  const nextStep = document.getElementById(id);

  if(nextStep){
    nextStep.classList.remove('hidden');
    nextStep.classList.add('is-active');
    trackVisibleStep(id);
  }
}

function setActiveCard(selector, element){
  document.querySelectorAll(selector).forEach(card => {
    card.classList.remove('active');
  });

  element.classList.add('active');
}

function showFieldError(message){
  clearFieldError();

  const error = document.createElement('div');
  error.className = 'error-message';
  error.id = 'fieldError';
  error.setAttribute('role', 'alert');
  error.innerText = message;

  const activeStep = document.querySelector('.step:not(.hidden)');
  if(!activeStep) return;

  activeStep.appendChild(error);
  activeStep.classList.remove('is-shaking');
  void activeStep.offsetWidth;
  activeStep.classList.add('is-shaking');
}

function clearFieldError(){
  const currentError = document.getElementById('fieldError');

  if(currentError){
    currentError.remove();
  }
}
