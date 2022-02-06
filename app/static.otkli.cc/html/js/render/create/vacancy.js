if (!userData) {
  openOverlay('auth', 'noclose')
} else {

document.querySelector("input[data-id='comp_code']").value=path_url.split('/')[3]


  function toNote() {
    document.querySelector("input[data-id='status']").value = 10
    SEND('create_vac vac_owner_list vac_viewer_list geos professions', 'POST', 'vacancy').then(
      result => {
        if (result[0] == 200) {
          window.location.href = main_url+'dashboard/';
        } else {
          popup('Не удалось перенести сохранить черновик', 'i-close', 'red')
        }
      });
  }
  function toModerate() {
    document.querySelector("input[data-id='status']").value = 20
    SEND('create_vac vac_owner_list vac_viewer_list geos professions', 'POST', 'vacancy').then(
      result => {
        if (result[0] == 200) {
          window.location.href = main_url+'dashboard/';
        } else {
          popup('Не удалось отправить на модерацию', 'i-close', 'red')
        }
      });
  }
}
