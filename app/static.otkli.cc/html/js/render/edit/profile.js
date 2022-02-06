if (!userData) {
  openOverlay('auth', 'noclose')
} else {
  AJAX('code=' + userData.code, 'GET', 'profile').then(
    result => {
      result = JSON.stringify(JSON.parse(result[1]), null, 2);
      objresult = JSON.parse(result);
      renderEditProfile(objresult);
      return objresult = objresultPatch(objresult);
    });
}

function renderEditProfile(objresult) {
  document.querySelector('input[data-id="first_name"]').value = objresult['first_name']
  document.querySelector('input[data-id="last_name"]').value = objresult['last_name']
  document.querySelector('textarea[data-id="about"]').value = objresult['about']
  document.querySelector('input[data-id="email"][data-target="settings"]').value = objresult['email']
  document.querySelector('input[data-id="phone"]').value = objresult['phone']

  if (objresult['prof_view'] && document.querySelector('input[data-id="prof_view"]')) {
    switch (objresult['prof_view']) {
      case 10:
        document.querySelector('input[value="10"][data-id="prof_view"]').checked = true;
        break;
      case 20:
        document.querySelector('input[value="20"][data-id="prof_view"]').checked = true;
        break;
      case 30:
        document.querySelector('input[value="30"][data-id="prof_view"]').checked = true;
        break;
    }
  }
  if (document.querySelector('input[data-id="comp_view"]')) {
    switch (objresult['comp_view']) {
      case true:
        document.querySelector('input[value="true"][data-id="comp_view"]').checked = true;
        break;
      case false:
        document.querySelector('input[value="false"][data-id="comp_view"]').checked = true;
        break;
    }
  }

  if (document.querySelector('input[data-id="notifications"]')) {
    switch (objresult['notifications']) {
      case 10:
        document.querySelector('input[value="10"][data-id="notifications"]').checked = true;
        break;
      case 20:
        document.querySelector('input[value="20"][data-id="notifications"]').checked = true;
        break;
      case 30:
        document.querySelector('input[value="30"][data-id="notifications"]').checked = true;
        break;
      case 40:
        document.querySelector('input[value="40"][data-id="notifications"]').checked = true;
        break;
    }
  }


  if (document.querySelector('input[data-id="reqr_view"]')) {
    switch (objresult['reqr_view']) {
      case true:
        document.querySelector('input[value="true"][data-id="reqr_view"]').checked = true;
        break;
      case false:
        document.querySelector('input[value="false"][data-id="reqr_view"]').checked = true;
        break;
    }
  }
  /*
    if (objresult['vac_viewer_list']) {
      for (const [key, value] of Object.entries(objresult['vac_viewer_list'])) {
        let button = `
            <tag-s class="button-purp-dark" onclick="deleteFromListById(this,'vac_viewer_list','` + key + `','profile')">
                <p>` + value + `</p>
                <icon class="i-close"></icon>
            </tag-s>`
        document.body.insertAdjacentHTML('beforeend', button);
      }
      document.body.insertAdjacentHTML('beforeend', '<hr>');
    }
    if (objresult['vac_owner_list']) {
      for (const [key, value] of Object.entries(objresult['vac_owner_list'])) {
        let button = `
            <tag-s class="button-purp-dark" onclick="deleteFromListById(this,'vac_owner_list','` + key + `','profile')">
                <p>` + value + `</p>
                <icon class="i-close"></icon>
            </tag-s>`
        document.body.insertAdjacentHTML('beforeend', button);
      }
      document.body.insertAdjacentHTML('beforeend', '<hr>');
    }
    if (objresult['comp_viewer_list']) {
      for (const [key, value] of Object.entries(objresult['comp_viewer_list'])) {
        let button = `
            <tag-s class="button-purp-dark" onclick="deleteFromListById(this,'comp_viewer_list','` + key + `','profile')">
                <p>` + value + `</p>
                <icon class="i-close"></icon>
            </tag-s>`
        document.body.insertAdjacentHTML('beforeend', button);
      }
      document.body.insertAdjacentHTML('beforeend', '<hr>');
    }

    if (objresult['skills']) {
      for (const [key, value] of Object.entries(objresult['skills'])) {
        let button = `
            <tag-s class="button-purp-dark" onclick="deleteFromListById(this,'skills','` + key + `','profile')">
                <p>` + value + `</p>
                <icon class="i-close"></icon>
            </tag-s>`
        document.body.insertAdjacentHTML('beforeend', button);
      }
      document.body.insertAdjacentHTML('beforeend', '<hr>');
    }*/

  if (objresult['education']) {
    let cloneTemplate = document.querySelector('.education>row')
    let educationInput = cloneTemplate.querySelectorAll("input");
    let cloneButton = document.querySelector('.education>tag-xs').cloneNode(true)
    let parent = document.querySelector('.education')

    document.querySelector('.education>row').remove();
    document.querySelector('.education>tag-xs').remove();

    for (const [key, value] of Object.entries(objresult['education'])) {

      educationInput[0].value = key
      educationInput[1].value = value
      educationInput[1].setAttribute('data-valid', true)
      educationInput[1].setAttribute('data-id', key)
      parent.append(cloneTemplate.cloneNode(true))
    }
    parent.append(cloneButton)
  }

  if (objresult['job']) {
    let cloneTemplate = document.querySelector('.job>row')
    let educationInput = cloneTemplate.querySelectorAll("input");
    let cloneButton = document.querySelector('.job>tag-xs').cloneNode(true)
    let parent = document.querySelector('.job')

    document.querySelector('.job>row').remove();
    document.querySelector('.job>tag-xs').remove();

    for (const [key, value] of Object.entries(objresult['job'])) {

      educationInput[0].value = key
      educationInput[1].value = value
      educationInput[1].setAttribute('data-valid', true)
      educationInput[1].setAttribute('data-id', key)
      parent.append(cloneTemplate.cloneNode(true))
    }
    parent.append(cloneButton)
  }
}

function saveSettings() {
  SEND('settings', 'PUT', 'profile').then(
    result => {
      if (result[0] == 200) {
        popup('Настройки сохранены', 'i-ok', 'purp')
      } else {
        popup('Ошибка сохранения', 'i-close', 'red')
      }
    });
}

function saveProfilePhoto(url) {
  userData.img = static_url + url
  userData.img = userData.img.split('/')
  userData.img.splice(4, 0, '1080')
  userData.img = userData.img.join().replace(/,/g, "/");

  let request = {
    'img': userData.img
  }
  closeOverlay();
  AJAX(JSON.stringify(request), 'PUT', 'profile').then(
    result => {
      if (result[0] == 200) {
        localStorage.setItem('userData', JSON.stringify(userData))
        userData.img = userData.img.split('/')
        userData.img.splice(4, 1, '76')
        userData.img = userData.img.join().replace(/,/g, "/");
        document.querySelector('top-nav').querySelector('img.small').src = userData.img
        popup('Фото обновлено', 'i-ok', 'purp')
      } else {
        popup('Ошибка сохранения', 'i-close', 'red')
      }
    });

}
