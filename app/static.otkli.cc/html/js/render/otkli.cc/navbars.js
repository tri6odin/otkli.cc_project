function URLToArray(url) {
  var request = {};
  var pairs = url.substring(url.indexOf('?') + 1).split('&');
  for (var i = 0; i < pairs.length; i++) {
    if (!pairs[i])
      continue;
    var pair = pairs[i].split('=');
    request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return request;
}
function toFavName(that){
  that.parentNode.previousElementSibling.value=that.textContent
  that.parentNode.previousElementSibling.setAttribute('data-valid','true')
}
function favSearch() {
  let favResult = URLToArray(paramObjToQrStr(crawlParamObj('professions parent_professions company parent_company geos parent_geos experience')))
  let favNameSample = []

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  openOverlay('fav')
  if ('experience' in favResult) {
    favResult.experience = favResult.experience.replace('10', 'Начинающий')
    favResult.experience = favResult.experience.replace('20', 'Уверенный')
    favResult.experience = favResult.experience.replace('30', 'Опытный')
    favNameSample.push(favResult.experience.split(',')[0])
  }
  if ('professions' in favResult) {
    favNameSample.push(favResult.professions.split(',')[0])
  }
  if (favNameSample.length > 0) {
    favVacSample.innerHTML = capitalizeFirstLetter(favNameSample.join(' ').toLowerCase());
  } else {
    if ('parent_professions' in favResult) {
      favNameSample.push(favResult.parent_professions.split(',')[0])
    }
    if ('geos' in favResult) {
      favNameSample.push(favResult.geos.split(',')[0])
    }
    if (favNameSample.length > 0) {
      favVacSample.innerHTML = capitalizeFirstLetter(favNameSample.join(' ').toLowerCase());
    } else {

      if ('company' in favResult) {
        favNameSample.push(favResult.company.split(',')[0])
      }
      if ('parent_geos' in favResult) {
        favNameSample.push(favResult.parent_geos.split(',')[0])
      }
      if (favNameSample.length > 0) {
        favVacSample.innerHTML = capitalizeFirstLetter(favNameSample.join(' ').toLowerCase());
      } else {
        if ('parent_company' in favResult) {
          favNameSample.push(favResult.parent_company.split(',')[0])
        }
        if (favNameSample.length > 0) {
          favVacSample.innerHTML = capitalizeFirstLetter(favNameSample.join(' ').toLowerCase());
        } else {
          favVacSample.innerHTML = 'Все вакансии'
        }
      }
    }
  }
}
function saveFavSearch(){
  if (favname.value.length==0) {
    favname.classList.add('invalidInp')
  } else {
    let favResult = URLToArray(paramObjToQrStr(crawlParamObj('professions parent_professions company parent_company geos parent_geos experience favname')))
    closeOverlay();
    AJAX(paramObjToJSON(favResult), 'POST', 'fav').then(
      result => {
        if (result[0] == 200) {
          popup('Параметры поиска сохранены в ленту', 'i-ok', 'purp')
        } else {
          popup('Ошибка получения данных', 'i-close', 'red')
        }
      });

  }

}


//bottom navigation Content
if (userData) {
  document.querySelector('bottom-nav').innerHTML = `
  <tag-l class="checkbox-blue">
    <icon class="i-star"></icon>
  </tag-l>
  <vhr></vhr>
  <tag-l class="checkbox-blue" onclick="location.href='` + main_url + `feed/'">
    <icon class="i-feed"></icon>
  </tag-l>
  <vhr></vhr>
  <tag-l class="checkbox-blue" onclick="location.href='` + main_url + `edit/profile/'">
    <icon class="i-settings"></icon>
  </tag-l>
  `;
  if (path_url == '/') {
    document.querySelector("#favbtn").setAttribute('onclick', "favSearch();")
    document.querySelector("bottom-nav>tag-l>icon[class='i-star']").setAttribute('onclick', "favSearch();")
  } else {
    let buttonnode = document.querySelector("bottom-nav>tag-l>icon[class='i-star']")
    buttonnode.className = "i-search"
    buttonnode.removeAttribute('onclick')
    buttonnode.setAttribute('onclick', "location.href='" + main_url + "'")
  }
  if (path_url.includes('/edit/profile/')) {
    document.querySelector("bottom-nav>tag-l>icon[class='i-settings']").style.color = "white"
    document.querySelector("bottom-nav>tag-l>icon[class='i-settings']").parentNode.style.backgroundColor = "var(--blue-trans-dark)"
  }
  if (path_url.includes('/feed/')) {
    document.querySelector("bottom-nav>tag-l>icon[class='i-feed']").style.color = "white"
    document.querySelector("bottom-nav>tag-l>icon[class='i-feed']").parentNode.style.backgroundColor = "var(--blue-trans-dark)"
  }
} else {
  document.querySelector("#favbtn").setAttribute('onclick', "openOverlay('justreg');")
  document.querySelector('bottom-nav').innerHTML = `
  <tag-l class="checkbox-blue" onclick="openOverlay('justreg');">
    <icon class="i-search"></icon>
  </tag-l>
  <vhr></vhr>
  <tag-l class="checkbox-blue" onclick="openOverlay('justreg');">
    <icon class="i-feed"></icon>
  </tag-l>
  <vhr></vhr>
  <tag-l class="checkbox-blue" onclick="openOverlay('justreg');">
    <icon class="i-settings"></icon>
  </tag-l>
  `;
}


if (userData) {
  if (userData.img) {
    if (userData.img.includes('.webp')) {
      userData.img = userData.img.split('/')
      userData.img.splice(4, 1, '76')
      userData.img = userData.img.join().replace(/,/g, "/");
    } else if (userData.img.includes('.js')) {
      userData.img = static_url + 'svg/default-avatars/avatar-' + Math.floor(Math.random() * 10) + '.svg'
    }
  } else {
    userData.img = static_url + 'svg/default-avatars/avatar-' + Math.floor(Math.random() * 10) + '.svg'
  }

  document.querySelector('top-nav>div>row[class="xs"]').innerHTML = `
    <a href="` + main_url + `feed">
      <tag-m class="button-purp-light hide-m">
        <icon class="i-feed"></icon>
        <b>Лента вакансий</b>
      </tag-m>
    </a>
    <a href="` + main_url + `edit/profile">
      <tag-m class="button-purp-light hide-m circ-btn">
        <icon class="i-settings"></icon>
      </tag-m></a>
    <a href="` + main_url + 'profile/' + userData.code + `" target="_blank" rel="noopener">
      <img class="small" src="` + userData.img + `" alt="Аватар">
    </a>
`;
} else {

  document.querySelector('top-nav>div>row[class="xs"]').innerHTML = `
  <a href="https://hr.otkli.cc/" target="_blank" rel="noopener">
      <tag-m class="button-black-contrast" tabindex="0">
        <p>Работодателю</p>
        <icon class="i-link"></icon>
      </tag-m>
    </a>
      <tag-m class="button-white-contrast" tabindex="0" onclick="openOverlay('auth');">
        <icon class="i-profile"></icon>
        <p class="hide-m">Войти</p>
      </tag-m>
`;
}
