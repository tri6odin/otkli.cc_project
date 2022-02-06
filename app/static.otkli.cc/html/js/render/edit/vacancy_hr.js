if (!userData) {
  openOverlay('auth', 'noclose')
} else {
  endpoint = "vacancy"
  param = 'code=' + path_url.split('/')[3]
  document.querySelector("input[data-id='code']").value = path_url.split('/')[3]
  AJAX(param, 'GET', endpoint).then(
    result => {
      result = JSON.stringify(JSON.parse(result[1]), null, 2);
      objresult = JSON.parse(result);
      renderEditVacancy(objresult);
      return objresult = objresultPatch(objresult);
    });
}

function renderEditVacancy(objresult) {
  /*
  function ReverseObject(Obj){
      var TempArr = [];
      var NewObj = [];
      for (var Key in Obj){
          TempArr.push(Key);
      }
      for (var i = TempArr.length-1; i >= 0; i--){
          NewObj[TempArr[i]] = [];
      }
      return NewObj;
  }
*/



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




  if (objresult['vac_owner_list']) {
    for (const [key, value] of Object.entries(ReverseObject(objresult['vac_owner_list']))) {
      if (value === null) {
        name = key
      } else {
        name = value
      }
      addTag('vac_owner_list', key, 'vac_owner_list', 'array', name);
    }
  }
  if (objresult['vac_viewer_list']) {
    for (const [key, value] of Object.entries(ReverseObject(objresult['vac_viewer_list']))) {
      if (value === null) {
        name = key
      } else {
        name = value
      }
      addTag('vac_viewer_list', key, 'vac_viewer_list', 'array', name);
    }
  }
  if (objresult.professions) {
    if (Array.isArray(objresult.professions)) {
      for (const [key, value] of Object.entries(objresult.professions.reverse())) {
        addTag('professions', value, 'professions', 'array', '', '');
      }
    } else {
      addTag('professions', value, 'professions', 'array', '', '');
    }
  }
  if (objresult.geos) {
    if (Array.isArray(objresult.geos)) {
      for (const [key, value] of Object.entries(objresult.geos.reverse())) {
        addTag('geos', value, 'geos', 'array', '', '');
      }
    } else {
      addTag('geos', value, 'geos', 'array', '', '');
    }
  }




  document.querySelector('input[data-id="title"]').value = objresult.vacancy_card.title
  document.querySelector('textarea[data-id="about"]').value = objresult.vacancy_card.about
  document.querySelector('input[data-id="salary_lo"]').value = objresult.vacancy_card.salary_lo
  document.querySelector('input[data-id="salary_hi"]').value = objresult.vacancy_card.salary_hi

  if (objresult.vacancy_card.status == 40 || objresult.vacancy_card.status == 20) {
    document.querySelector('#saveButton').setAttribute('onclick', 'toModerateEdit();')
    document.querySelector('#saveButton>p').innerHTML = "Сохранить изменения";
    document.querySelector('input[data-id="leave_days"]').value = objresult.vacancy_card.leave_days
  }

  if (objresult.vacancy_card.status == 50) {
    document.querySelector('#delButton').setAttribute('onclick', 'toDelete("'+objresult.vacancy_card.code+'");')
    document.querySelector('#delButton').className='button-red-light'
    document.querySelector('#delButton>p').innerHTML = "Удалить вакансию";
    document.querySelector('#delButton>icon').className = "i-delete";
  }

  switch (objresult.vacancy_card.term) {
    case 10:
      document.querySelector('input[value="10"][data-id="term"]').checked = true;
      break;
    case 20:
      document.querySelector('input[value="20"][data-id="term"]').checked = true;
      break;
    case 30:
      document.querySelector('input[value="30"][data-id="term"]').checked = true;
      break;
  }
  switch (objresult.vacancy_card.currency) {
    case "EUR":
      document.querySelector('input[value="EUR"][data-id="currency"]').checked = true;
      break;
    case "RUB":
      document.querySelector('input[value="RUB"][data-id="currency"]').checked = true;
      break;
    case "USD":
      document.querySelector('input[value="USD"][data-id="currency"]').checked = true;
      break;
  }
  switch (objresult.vacancy_card.busyness) {
    case 10:
      document.querySelector('input[value="10"][data-id="busyness"]').checked = true;
      break;
    case 20:
      document.querySelector('input[value="20"][data-id="busyness"]').checked = true;
      break;
    case 30:
      document.querySelector('input[value="30"][data-id="busyness"]').checked = true;
      break;
    case 40:
      document.querySelector('input[value="40"][data-id="busyness"]').checked = true;
      break;
  }
  switch (objresult.vacancy_card.experience) {
    case 10:
      document.querySelector('input[value="10"][data-id="experience"]').checked = true;
      break;
    case 20:
      document.querySelector('input[value="20"][data-id="experience"]').checked = true;
      break;
    case 30:
      document.querySelector('input[value="30"][data-id="experience"]').checked = true;
      break;
  }





  if (objresult.demands) {
    let cloneTemplate = document.querySelector('.demands>textarea-parent')
    let educationInput = cloneTemplate.querySelector("textarea");
    let cloneButton = document.querySelector('.demands>tag-xs').cloneNode(true)
    let parent = document.querySelector('.demands')

    document.querySelector('.demands>textarea-parent').remove();
    document.querySelector('.demands>tag-xs').remove();

    for (const [key, value] of Object.entries(objresult.demands)) {

      educationInput.setAttribute('data-id', key)
      educationInput.setAttribute('data-valid', 'true')
      educationInput.value = value

      parent.append(cloneTemplate.cloneNode(true))
      //console.log(key);
    }
    parent.append(cloneButton)
  }

  if (objresult.terms) {
    let cloneTemplate = document.querySelector('.terms>textarea-parent')
    let educationInput = cloneTemplate.querySelector("textarea");
    let cloneButton = document.querySelector('.terms>tag-xs').cloneNode(true)
    let parent = document.querySelector('.terms')

    document.querySelector('.terms>textarea-parent').remove();
    document.querySelector('.terms>tag-xs').remove();

    for (const [key, value] of Object.entries(objresult.terms)) {

      educationInput.setAttribute('data-id', key)
      educationInput.setAttribute('data-valid', 'true')
      educationInput.value = value

      parent.append(cloneTemplate.cloneNode(true))
      //console.log(key);
    }
    parent.append(cloneButton)
  }
  /*
if (userData.utype=='ADM') {
  rendermetatagsBlock();
}*/

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

function toModerateEdit() {
  document.querySelector("input[data-id='status']").value = 20
  SEND('edit_vac vac_owner_list vac_viewer_list geos professions', 'PUT', 'vacancy').then(
    result => {
      if (result[0] == 200) {
        window.location.href = main_url+'dashboard/';
      } else {
        popup('Не удалось сохранить изменения', 'i-close', 'red')
      }
    });
}




function toDelete(code) {
  let dataobj = {
    "code": code,
    "destroy_all": true
  }
  AJAX(JSON.stringify(dataobj), 'DELETE', 'vacancy').then(
    result => {
      if (result[0] == 200) {
        window.location.href = main_url+'dashboard/';
      }else{

        popup('Не удалось удалить вакансию', 'i-close', 'red')
      }
    });
}
/*
function toDecline() {
  document.querySelector("input[data-id='status']").value = 30
  SEND('edit_vac vac_owner_list vac_viewer_list geos professions metatags', 'PUT', 'vacancy').then(
    result => {
      if (result[0] == 200) {
        window.location.href = 'https://adm.otkli.cc/';
      } else {
        popup('Не удалось отклонить вакансию', 'i-close', 'red')
      }
    });
}

function toAccept() {
  document.querySelector("input[data-id='status']").value = 40
  SEND('edit_vac vac_owner_list vac_viewer_list geos professions metatags', 'PUT', 'vacancy').then(
    result => {
      if (result[0] == 200) {
        window.location.href = 'https://adm.otkli.cc/';
      } else {
        popup('Не удалось опубликовать вакансию', 'i-close', 'red')
      }
    });
}
*/
function toArchive() {
  document.querySelector("input[data-id='status']").value = 50
  SEND('edit_vac vac_owner_list vac_viewer_list geos professions metatags', 'PUT', 'vacancy').then(
    result => {
      if (result[0] == 200) {
          window.location.href = 'https://hr.otkli.cc/dashboard/';
      } else {
        popup('Не удалось перенести в архив', 'i-close', 'red')
      }
    });
}
