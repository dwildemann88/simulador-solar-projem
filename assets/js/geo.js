async function usarLocalizacao(){
  const btn = document.querySelector('.secondary-btn');

  if(!btn){
    return;
  }

  btn.innerText = 'Localizando...';
  btn.disabled = true;

  if(!navigator.geolocation){
    alert('Seu navegador não suporta localização.');
    btn.innerText = 'Usar localização';
    btn.disabled = false;
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try{
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );

        const data = await response.json();

        const cidade =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.municipality ||
          '';

        if(cidade){
          const cidadeInput = document.getElementById('cidade') || document.getElementById('cidade_input');
          if(cidadeInput){
            cidadeInput.value = cidade;
          }
          btn.innerText = 'Cidade identificada';

          setTimeout(() => {
            irStep3();
          }, 400);
        }
        else{
          btn.innerText = 'Digite manualmente';
          btn.disabled = false;
        }
      }
      catch(error){
        console.error(error);
        btn.innerText = 'Digite manualmente';
        btn.disabled = false;
      }
    },
    () => {
      btn.innerText = 'Usar localização';
      btn.disabled = false;
    },
    {
      enableHighAccuracy:false,
      timeout:8000,
      maximumAge:300000
    }
  );
}
