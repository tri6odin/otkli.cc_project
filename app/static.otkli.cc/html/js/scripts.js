//do something with query string after full page load
document.addEventListener('DOMContentLoaded', function() {

  //display skeleton with delay

  function delay(delayInms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(2);
    }, delayInms);
  });
}
async function skeletonDelay() {
  let delayres = await delay(500);
  document.querySelectorAll('.skeleton').forEach(function(e) {
  e.style.visibility='visible'
});
}
skeletonDelay();


  //open overlay
  if (param_url_obj.overlay) {
    openOverlay(param_url_obj.overlay)
  }
  //after click autofill link
  if (param_url_obj.action == 'autofill') {
    console.log(param_url_obj);
    delete param_url_obj.action;
    for (const [key, value] of Object.entries(param_url_obj)) {
      let value_array = value.split(',');
      let id = key
      let target
      console.log(value_array);
      if ('professions parent_professions experience'.includes(key)) {
        target = 'professions';
      } else if ('company parent_company'.includes(key)) {
        target = 'company';
      } else {
        target = 'geos';
      }
      value_array.forEach((item, i) => {
        console.log(item);
        console.log(id);
        name=item
        if (id=='experience') {
          name = name.replace('10', 'Начинающий')
          name = name.replace('20', 'Уверенный')
          name = name.replace('30', 'Опытный')
        }
        type=''
        addTag(target, item, id, type, name)
      });
    }

    findButton()
    async function scrollToGrid() {
      let delayres = await delay(500);
      document.querySelector('.search').scrollIntoView({block:"start",behavior: "smooth"});
    }
    scrollToGrid();
  }



  //anon otklic
  if (param_url_obj.action == 'otklik') {
    let requestBody = {
      'token': param_url_obj.token
    }
    AJAX(JSON.stringify(requestBody), 'POST', 'vacancy/otk').then(
      result => {
        if (result[0] == 200) {
          popup('Отклик подтвержден', 'i-ok', 'purp')
        } else {
          popup('Ошибка подтверждения отклика', 'i-close', 'red')
        }
        window.history.replaceState(null, null, window.location.pathname);
      });
  }
  //email notification
  if (param_url_obj.action == 'notifications') {
    let requestBody = {
      'token': param_url_obj.token,
      'notifications': param_url_obj.type
    }
    let text
    switch (param_url_obj.type) {
      case 'off':
        text = 'Уведомления отвключены'
        break;
      case 'down':
        text = 'Уведомления будут приходить реже'
        break;

    }
    AJAX(JSON.stringify(requestBody), 'PUT', 'profile/notifications').then(
      result => {
        if (result[0] == 200) {
          popup(text, 'i-ok', 'purp')
        } else {
          popup('Не удалось изменить настройки нотификации', 'i-close', 'red')
        }
        window.history.replaceState(null, null, window.location.pathname);
      });
  }

}, false);

//duplicate button pair
function duplicatePrevElementPair(that) {
  that.parentNode.insertBefore(that.previousElementSibling.cloneNode(true), that);
  that.previousElementSibling.querySelectorAll('input,textarea').forEach(item => {
    item.value = '';
    item.setAttribute('data-valid', '');
    item.setAttribute('data-id', '');
  });
}
//duplicate button
function duplicatePrevElement(that) {
  that.parentNode.insertBefore(that.previousElementSibling.cloneNode(true), that);
  that.previousElementSibling.querySelectorAll('input,textarea').forEach(item => {
    item.value = '';
    item.setAttribute('data-valid', '');
  });
}

// add tabindex and click handler to BTN
document.querySelectorAll('label').forEach(item => {
  item.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      item.click()
    }
  })
});
document.querySelectorAll("tag-xxs, tag-xs, tag-s, tag-m, tag-l, tag-xl").forEach(item => {
  item.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      item.click()
    }
  })
});



//objresult patch
function objresultPatch(objresult) {
  if (objresult.comp_viewer_list) {
    let tempVal = []
    for (const [key, value] of Object.entries(objresult.comp_viewer_list)) {
      tempVal.push(key)
    }
    objresult.comp_viewer_list = tempVal
  }
  if (objresult.vac_viewer_list) {
    let tempVal = []
    for (const [key, value] of Object.entries(objresult.vac_viewer_list)) {
      tempVal.push(key)
    }
    objresult.vac_viewer_list = tempVal
  }
  if (objresult.vac_owner_list) {
    let tempVal = []
    for (const [key, value] of Object.entries(objresult.vac_owner_list)) {
      tempVal.push(key)
    }
    objresult.vac_owner_list = tempVal
  }


  if (objresult.education) {
    let tempVal = []
    for (const [key, value] of Object.entries(objresult.education)) {
      tempVal.push(key)
    }
    objresult.education = tempVal
  }

  if (objresult.job) {
    let tempVal = []
    for (const [key, value] of Object.entries(objresult.job)) {
      tempVal.push(key)
    }
    objresult.job = tempVal
  }
  /*

  */
  return objresult;
}

function objrequestPatch(objrequest) {
  /*
  if (objrequest.demands && !Array.isArray(objrequest.demands)) {
    function objectFlip(obj) {
      const ret = {};
      Object.keys(obj).forEach(key => {
        ret[obj[key]] = key;
      });
      objrequest.demands = ret
    }
    objectFlip(objrequest.demands)
  }
  if (objrequest.terms && !Array.isArray(objrequest.terms)) {
    function objectFlip(obj) {
      const ret = {};
      Object.keys(obj).forEach(key => {
        ret[obj[key]] = key;
      });
      objrequest.terms = ret
    }
    objectFlip(objrequest.terms)
  }  */
  return objrequest;

}
//between array difference
function betweenArrayDifference(arr1, arr2) {
  if (typeof arr1 === 'object' && arr1 !== null && !Array.isArray(arr1)) {
    let tempVal = []
    for (const [key, value] of Object.entries(arr1)) {
      tempVal.push(key)
    }
    arr1 = tempVal
  }
  if (typeof arr2 === 'object' && arr2 !== null && !Array.isArray(arr2)) {
    let tempVal = []
    for (const [key, value] of Object.entries(arr2)) {
      tempVal.push(key)
    }
    arr2 = tempVal
  }
  return arr1.filter(x => !arr2.includes(x));
}

//function delete from list
function deleteFromList(listOflist, code, endpoint) {
  listOflist.split(',').forEach((item, i) => {
    if (objresult && objresult[item] && objrequest[item]) {
      let delElem = betweenArrayDifference(objresult[item], objrequest[item])
      if (delElem.length > 0) {
        let requestBody = {
          [item]: delElem,
          code: code
        }
        AJAX(JSON.stringify(requestBody), 'DELETE', endpoint).then(
          result => {
            return result;
          });
      }
    }
  });
}
//deleteFromList by // ID
function deleteFromListById(that, name, code, endpoint) {
  let requestBody = {
    [name]: [code]
  }
  AJAX(JSON.stringify(requestBody), 'DELETE', endpoint).then(
    result => {
      that.remove();
      return result;
    });
}
//random avatar uploader
! function randAvatar() {
  if (userData) {
    if (userData.img == undefined) {
      let imgUrl = static_url+'svg/default-avatars/avatar-' + Math.floor(Math.random() * 10) + '.svg'
      let img = {
        img: imgUrl,
      };
      AJAX(JSON.stringify(img), 'PUT', 'profile').then(
        result => {
          if (result[0] == 200) {
            userData.img = imgUrl
            localStorage.setItem('userData', JSON.stringify(userData))
          }
        });
    }
  }
}()

if (document.querySelector('cookies')) {
  ! function cookieChecker() {
    if (localStorage.getItem('cookiebanner') != 'false') {
      document.querySelector('cookies').style.display = 'flex'
    }
  }()

  function cookieDeleter(that) {
    that.parentNode.parentNode.remove()
    localStorage.setItem('cookiebanner', 'false');
  }
}
if (document.querySelector('banner')) {
  ! function bannerChecker() {
    if (localStorage.getItem('howtobanner') != 'false') {
      document.querySelector('banner').parentNode.style.display = 'flex'
    } else {
      if (document.querySelector('banner').parentNode.parentNode.childElementCount == 1) {
        document.querySelector('banner').parentNode.parentNode.remove()
      } else {
        document.querySelector('banner').parentNode.remove()
      }
    }
  }()

  function bannerDeleter(that) {
    if (that.parentNode.parentNode.childElementCount == 1) {
      that.parentNode.parentNode.remove()
    } else {
      that.parentNode.remove()
    }

    localStorage.setItem('howtobanner', 'false');
  }
}

function urlify(text) {
    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    return text.replace(urlRegex, function(url,b,c) {
        var url2 = (c == 'www.') ?  'http://' +url : url;
        return '<a style="font-weight: var(--regular);font-size:var(--font-s);line-height: 1.4;" href="' +url2+ '" target="_blank">' + url + '</a>';
    })
}

function checkboxOff(that) {
  that.checked = false
}
