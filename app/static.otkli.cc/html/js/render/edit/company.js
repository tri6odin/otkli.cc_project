if (!userData) {
  openOverlay('auth', 'noclose')
} else {
  endpoint = "company"
  param = 'code=' + path_url.split('/')[3]
  document.querySelector('input[data-id="code"]').value = path_url.split('/')[3]

  AJAX(param, 'GET', endpoint).then(
    result => {
      result = JSON.stringify(JSON.parse(result[1]), null, 2);
      objresult = JSON.parse(result);
      renderEditCompany(objresult);
      return objresult=objresultPatch(objresult);
    });
}

function renderEditCompany(objresult) {
  function ReverseObject(Obj) {
    let NewObj = {};
    let map = new Map();
    let i = 0
    for (const child of Object.entries(Obj)) {
      map.set(i, child);
      i++
    }
    array = Array.from(map, ([name, value]) => ({name,value})).reverse();
    array.forEach((key) => {
      NewObj[key.value[0]] = key.value[1]
    });
    return NewObj
  }
  for (const [key, value] of Object.entries(ReverseObject(objresult['comp_viewer_list']))) {
    if (value === null) {
      name = key
    } else {
      name = value
    }
    addTag('create_comp', key, 'comp_viewer_list', 'array', name);
  }

  document.querySelector('input[data-id="name"]').value = objresult['name']
  document.querySelector('textarea[data-id="about"]').value = objresult['about']
  document.querySelector('input[data-id="owner_email"]').value = objresult['owner_email']
  if (document.querySelector('input[data-id="color"]')) {
    document.querySelector('input[data-id="color"]').value = objresult['color']
  }
  if (document.querySelector('input[data-id="sec_color"]')) {
    document.querySelector('input[data-id="sec_color"]').value = objresult['sec_color']
  }
  if (document.querySelector('input[data-id="synonyms"]')) {
      document.querySelector('input[data-id="synonyms"]').value = objresult['synonyms']
  }

/*
  if (objresult['logo_image'] == undefined) {
    objresult['logo_image'] = 'https://static.otkli.cc/svg/default-avatars/avatar-' + Math.floor(Math.random() * 10) + '.svg'
  } else {
  objresult['logo_image'] = objresult['logo_image'].split('/')
  objresult['logo_image'].splice(4, 1, '120')
  objresult['logo_image'] = objresult['logo_image'].join().replace(/,/g, "/");}
*/




  if (objresult['logo_image'] == undefined) {
    objresult['logo_image'] = static_url+'svg/default-avatars/avatar-' + Math.floor(Math.random() * 10) + '.svg'
  }
  else if (objresult['logo_image'].includes('.webp')) {
    objresult['logo_image'] = objresult['logo_image'].split('/')
    objresult['logo_image'].splice(4, 1, '120')
    objresult['logo_image'] = objresult['logo_image'].join().replace(/,/g, "/");
  }
  else if (objresult['logo_image'].includes('.js')) {
    objresult['logo_image']='//'
  }






  document.querySelector('.companyavatar').src=objresult['logo_image']


  switch (objresult['sub_name']) {
    case "Малый бизнес":
      document.querySelector('input[value="Малый бизнес"][data-id="sub_name"]').checked = true;
      break;
    case "Средний бизнес":
      document.querySelector('input[value="Средний бизнес"][data-id="sub_name"]').checked = true;
      break;
    case "Крупный бизнес":
      document.querySelector('input[value="Крупный бизнес"][data-id="sub_name"]').checked = true;
      break;
  }
if (document.querySelector('[data-id="verified"]')) {
  switch (objresult['verified']) {
    case true:
      document.querySelector('input[value="true"][data-id="verified"]').checked = true;
      break;
    case false:
      document.querySelector('input[value="false"][data-id="verified"]').checked = true;
      break;
  }
}

if ((objresult['status']==40 || objresult['status']==20) && userData.utype=='HR') {
  document.querySelector('#saveButton>p').innerHTML="Сохранить изменения";
}
if (objresult['status']==50 && userData.utype=='HR') {
  document.querySelector('#archiveButton').remove()
}
}


function toNote() {
  document.querySelector("input[data-id='status']").value = 10
  SEND('create_comp', 'PUT', 'company').then(
    result => {
      if (result[0] == 200) {
        window.location.href = main_url+'dashboard/';
      } else {
      popup('Не удалось отправить в черновики', 'i-close', 'red')
      }
    });
}

function toModerate() {
  document.querySelector("input[data-id='status']").value = 20
  SEND('create_comp', 'PUT', 'company').then(
    result => {
      if (result[0] == 200) {
          //window.location.href = main_url+'dashboard';
      } else {
        popup('Не удалось отправить на модерацию', 'i-close', 'red')
      }
    });
}

function toDecline() {
  document.querySelector("input[data-id='status']").value = 30
  SEND('create_comp', 'PUT', 'company').then(
    result => {
      if (result[0] == 200) {
        window.location.href = main_url;
      } else {
        popup('Не удалось отклонить компанию', 'i-close', 'red')
      }
    });
}

function toPublic() {
  document.querySelector("input[data-id='status']").value = 40
  SEND('create_comp', 'PUT', 'company').then(
    result => {
      if (result[0] == 200) {
        window.location.href = main_url;
      } else {
        popup('Не удалось опубликовать компанию', 'i-close', 'red')
      }
    });
}

function toArchive() {
  document.querySelector("input[data-id='status']").value = 50
  SEND('create_comp', 'PUT', 'company').then(
    result => {
      if (result[0] == 200) {
        window.location.href = main_url+'dashboard/';
      } else {
        popup('Не удалось отправить в архив', 'i-close', 'red')
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
