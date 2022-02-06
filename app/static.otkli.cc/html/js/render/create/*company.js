if (!userData) {
  openOverlay('auth', 'noclose')
} else {
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
  function toModerate() {
    document.querySelector("input[data-id='status']").value = 20
    SEND('create_comp', 'POST', 'company').then(
      result => {
        if (result[0] == 200) {
          alert(result[0] + ':' + result[1])
        } else {
          alert(result[0] + ':' + result[1])
        }
      });
  }
  function toModerate1() {
    document.querySelector("input[data-id='status']").value = 30
    SEND('create_comp', 'POST', 'company').then(
      result => {
        if (result[0] == 200) {
          alert(result[0] + ':' + result[1])
        } else {
          alert(result[0] + ':' + result[1])
        }
      });
  }
  function toModerate2() {
    document.querySelector("input[data-id='status']").value = 40
    SEND('create_comp', 'POST', 'company').then(
      result => {
        if (result[0] == 200) {
          alert(result[0] + ':' + result[1])
        } else {
          alert(result[0] + ':' + result[1])
        }
      });
  }
  function toModerate3() {
    document.querySelector("input[data-id='status']").value = 50
    SEND('create_comp', 'POST', 'company').then(
      result => {
        if (result[0] == 200) {
          alert(result[0] + ':' + result[1])
        } else {
          alert(result[0] + ':' + result[1])
        }
      });
  }

  function saveCompanyPhoto(url) {
    img = 'https://static.otkli.cc/' + url
    img = img.split('/')
    img.splice(4, 0, '1080')
    img = img.join().replace(/,/g, "/");
    document.querySelector('input[data-id="logo_image"]').value=img
    closeOverlay();
  }
}
