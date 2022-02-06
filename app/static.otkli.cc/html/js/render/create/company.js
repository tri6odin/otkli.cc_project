if (!userData) {
  openOverlay('auth', 'noclose')
} else {
    /*
  function toNote() {
    document.querySelector("input[data-id='status']").value = 10
    SEND('create_comp', 'POST', 'company').then(
      result => {
        if (result[0] == 200) {
          alert(result[0] + ':' + result[1])
        } else {
          alert(result[0] + ':' + result[1])
        }
      });
  }
  */
document.querySelector('input[data-id="logo_image"]').value=static_url+'svg/default-avatars/avatar-' + Math.floor(Math.random() * 10) + '.svg'
  function toModerate() {
    document.querySelector("input[data-id='status']").value = 20
    SEND('create_comp', 'POST', 'company').then(
      result => {
        if (result[0] == 200) {
          createVacancy()
        } else {
          popup('Не удалось отправить на модерацию', 'i-close', 'red')
        }
      });
  }

  function saveCompanyPhoto(url) {
    img = static_url + url
    img = img.split('/')
    img.splice(4, 0, '1080')
    img = img.join().replace(/,/g, "/");
    document.querySelector('.companyavatar').src=img
    document.querySelector('input[data-id="logo_image"]').value=img
    closeOverlay();
      popup('Логотип изменен', 'i-ok', 'purp')
  }
}
