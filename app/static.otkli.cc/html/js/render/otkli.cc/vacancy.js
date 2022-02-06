let urlcode = path_url.split('/')[2]

function renderResponseBlock() {

  if (userData) {
    code.value = urlcode
    responseform.innerHTML = `
      <row class="xs fullwidth">
        <tag-l class="button-purp-light first-child" tabindex="0" onclick="sendResponse('false')">
          <p>Откликнуться</p>
          <icon class="i-link"></icon>
        </tag-l>
        <label class="last-child sqr-btn" tabindex="0">
          <input type="checkbox">
          <tag-l class="checkbox-purp button-purp-light">
            <icon class="i-bookmark"></icon>
          </tag-l>
        </label>
      </row>
`

    if (objresult.cus_status == 30) {
      responseform.querySelector('label>input[type=checkbox]').checked = true
    }
    if (objresult.cus_status == 40 || objresult.cus_status == 50) {
      responseform.querySelector('label').remove()
    }
    if (objresult.cus_status == 40) {
      responseform.querySelector('tag-l>p').innerHTML = 'Редактировать отклик'
      responseform.querySelector('tag-l').className = 'button-gray-light'
      responseform.querySelector('tag-l>icon').className = "i-edit";
    }
    if (objresult.cus_status == 50) {
      responseform.querySelector('tag-l>p').innerHTML = 'Отклик отскорен'
      responseform.querySelector('tag-l>icon').className = "i-superlike";
      responseform.querySelector('tag-l').className = 'button-gray-light first-child'
      responseform.querySelector('tag-l').style.cursor = 'default'
      responseform.querySelector('tag-l').removeAttribute("onclick");
      document.querySelectorAll('textarea').forEach((item) => {
        item.readOnly = true
      });
    }
    if (objresult.cus_status == 30 || objresult.cus_status == 20 || objresult.cus_status == 10) {
      responseform.querySelector('label>input[type=checkbox]').setAttribute('onclick', 'toBookmark(this.checked)')
    }

    if (objresult.responses) {
      for (const [key, value] of Object.entries(objresult.responses)) {
        document.querySelector('textarea[data-id="' + key + '"]').value = value
      }
    }

  } else {
    responseform.innerHTML = `
    <column class="m">
     <b>Мы уважаем приватность, поэтому откликаться на вакансии можно без регистрации</b>
  <row class="xs fullwidth double">
  <ico-input class="i-dog">
    <input type="email" name="email" placeholder="Ваша почта" data-requared="true" data-target="response" data-id="email" autocomplete="email" >
  </ico-input>
  <row class="xxs fullwidth">
    <tag-l class="button-purp-light first-child" tabindex="0" onclick="sendResponse('true')">
      <p>Откликнуться</p>
      <icon class="i-link"></icon>
    </tag-l>
    <label class="last-child sqr-btn"  tabindex="0">
      <input type="checkbox" onclick='openOverlay("justreg");checkboxOff(this);'>
      <tag-l class="checkbox-purp button-purp-light">
        <icon class="i-bookmark"></icon>
      </tag-l>
    </label>
    </row>
  </row>
  </column>
  `
  }
  if (objresult.vacancy_card.status == 50) {
    responseform.innerHTML = `
      <row class="xxs fullwidth">
        <tag-l class="button-gray-light first-child" tabindex="0">
          <p>В архиве</p>
          <icon class="i-archive"></icon>
        </tag-l>
      </row>
      `
    responseform.querySelector('tag-l').style.cursor = 'default'
    document.querySelectorAll('textarea').forEach((item) => {
      item.readOnly = true
    });

  }
  //  renderProfile()
}

function renderResponseBlockEdit() {
  responseform.innerHTML = `
      <row class="xs fullwidth">
      <a href="`+main_url+`edit/vacancy/`+urlcode+`/" style="width:100%">
        <tag-l class="button-purp-light first-child" tabindex="0">
          <p>Редактировать</p>
          <icon class="i-edit"></icon>
        </tag-l>
      </row>
`
  //  renderProfile()
}

function sendResponse(anon) {
  if (anon == 'true') {
    endpoint = 'vacancy/' + urlcode
  } else {
    endpoint = 'vacancy'
  }
  SEND('response', 'PUT', endpoint).then(
    result => {
      if (result[0] == 200) {
        switch (objresult.cus_status) {
          case 40:
            popup('Отклик обновлен', 'i-ok', 'purp')
            break;
          default:
            popup('Отклик отправлен', 'i-ok', 'purp')
        }
      } else {
        popup('Отклик не отправлен', 'i-close', 'red')
      }
    });
}

function toBookmark(val) {
  let dataobj = {
    'bookmarked': val,
    'code': urlcode
  }
  AJAX(JSON.stringify(dataobj), 'PUT', 'vacancy').then(
    result => {
      if (result[0] == 200) {
        if (val == true) {
          popup('Вакансия добавлена в закладки', 'i-ok', 'purp')
        } else {
          popup('Вакансия удалена из закладок', 'i-ok', 'purp')
        }
      } else {
        popup('Не удалось добавить в закладки', 'i-close', 'red')
      }
    });
}
/*
function renderProfile() {
  if (!userData) {
    endpoint = "search/anon"
    usertype = 'anon'
  } else {
    endpoint = "search"
    usertype = userData.utype
  }
  document.querySelector("[data-id=professions]").value=objresult.professions.join(', ');
  document.querySelector("[data-id=geo]").value=objresult.geos.join(', ');
  onloadrender()
}

function onloadrender() {
  SEND('page page_rows professions geo', 'GET', endpoint).then(
    result => {
      if (result[0] == 200) {
        renderVacancyGrid(result[1])
        if (Object.keys(JSON.parse(result[1])).length < document.querySelector('[data-id="page_rows"]').value) {
          document.querySelector("#loadmorebtn").style.display = 'none'
        }
      } else {
        popup('Ошибка получения данных', 'i-close', 'red')
      }
    });
}

function loadMore(that) {
  document.querySelector("input[data-id='page']").value = parseInt(document.querySelector("input[data-id='page']").value) + 1;
  that.classList.add("loading");
  that.style.display = 'flex'
  SEND('page page_rows professions geo', 'GET', endpoint).then(
    result => {
      if (result[0] == 200 && result[1] != '[]') {
        renderVacancyGrid(result[1])
        that.classList.remove("loading")
        if (Object.keys(JSON.parse(result[1])).length < document.querySelector('[data-id="page_rows"]').value) {
          that.style.display = 'none'
        }
      } else {
        that.style.display = 'none'
      }
    });
}

function renderVacancyGrid(that) {
  let cloneTemplateGlobal = tmpl.content.cloneNode(true)
  let parent = document.querySelector('grid')
  for (const [key, value] of Object.entries(JSON.parse(that))) {
    let cloneTemplate = cloneTemplateGlobal.cloneNode(true)
    img = cloneTemplate.querySelector("img");
    valid = cloneTemplate.querySelector("valid");
    companylink = cloneTemplate.querySelector("valid>a");
    link = cloneTemplate.querySelector("column>a");
    date = cloneTemplate.querySelector("column>tag-xxxs>p");
    currency = cloneTemplate.querySelectorAll("column>row>tag-xs>icon")[0];
    price = cloneTemplate.querySelectorAll("column>row>tag-xs>p")[0];
    term = cloneTemplate.querySelectorAll("column>row>smalltext>p")[0];
    busyness = cloneTemplate.querySelectorAll("column>row>tag-xs>p")[1];
    geo = cloneTemplate.querySelectorAll("column>row>tag-xs>p")[2];
    views = cloneTemplate.querySelectorAll("column>row>tag-xs>p")[3];
    moredetails = cloneTemplate.querySelector("column>row>tag-l");
    moredetailstext = cloneTemplate.querySelector("column>row>tag-l>p");
    moredetailsicon = cloneTemplate.querySelector("column>row>tag-l>icon");
    fav = cloneTemplate.querySelector("column>row>label");

if (value.company_card.verified==true) {
  valid.className = 'valid'
}

    if (value.company_card.logo_image == undefined) {
      value.company_card.logo_image = 'https://static.offerflow.me/svg/default-avatars/avatar-' + Math.floor(Math.random() * 10) + '.svg'
    } else {
      value.company_card.logo_image = value.company_card.logo_image.split('/')
      value.company_card.logo_image.splice(4, 1, '120')
      value.company_card.logo_image = value.company_card.logo_image.join().replace(/,/g, "/");
    }
    img.src = value.company_card.logo_image
    img.alt = value.company_card.name
    link.href = main_url + 'vacancy/' + value.vacancy_card.code
    link.querySelector('b').innerHTML = value.vacancy_card.title
    if (value.company_card.status==40) {
      companylink.href = main_url + 'company/' + value.company_card.code
    } else {
      companylink.style.pointerEvents= "none";
      companylink.style.cursor= "default";
    }
    postDate = new Date(value.vacancy_card.post_date);
    lastDate = new Date(postDate.setDate(postDate.getDate() + value.vacancy_card.leave_days));
    yourDate = new Date()
    yourDate.toISOString().split('T')[0]

    function treatAsUTC(date) {
      var result = new Date(date);
      result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
      return result;
    }

    function daysBetween(yourDate, lastDate) {
      var millisecondsPerDay = 24 * 60 * 60 * 1000;
      return (treatAsUTC(lastDate) - treatAsUTC(yourDate)) / millisecondsPerDay;
    }
    deadline = Math.round(daysBetween(yourDate, lastDate))

    if (deadline >= 0) {
      switch (deadline) {
        case 0:
          deadline = 'Сегодня последний день для отклика'
          break;
        case 1:
          deadline = 'Один день до закрытия вакансии'
          break;
        case 2:
        case 3:
        case 4:
          deadline = deadline + ' дня до закрытия вакансии'
          break;
        default:
          deadline = deadline + ' дней до закрытия вакансии'
      }
    } else {
      deadline = 'Дедлайн истек'
    }

    date.textContent = deadline
    if (!value.vacancy_card.salary_lo && !value.vacancy_card.salary_hi) {
      price.textContent = 'Не указана'
    } else if (!value.vacancy_card.salary_lo && value.vacancy_card.salary_hi) {
      price.textContent = 'До ' + value.vacancy_card.salary_hi
    } else if (!value.vacancy_card.salary_hi && value.vacancy_card.salary_lo) {
      price.textContent = 'От ' + value.vacancy_card.salary_lo
    } else {
      price.textContent = value.vacancy_card.salary_lo + ' – ' + value.vacancy_card.salary_hi
    }
    switch (value.vacancy_card.busyness) {
      case 10:
        busyness.innerHTML = 'Полная'
        break;
      case 20:
        busyness.innerHTML = 'Частичная'
        break;
      case 30:
        busyness.innerHTML = 'Проектная'
        break;
      case 40:
        busyness.innerHTML = 'Стажировка'
        break;
    }
    switch (value.vacancy_card.term) {
      case 10:
        term.textContent = 'в месяц'
        break;
      case 20:
        term.textContent = 'в год'
        break;
      case 30:
        term.textContent = 'за проект'
        break;
    }
    views.textContent = value.vacancy_card.view_count
    switch (value.vacancy_card.currency) {
      case 'RUB':
        currency.className = 'i-ruble'
        break;
        case 'EUR':
          currency.className = 'i-eur'
          currency2.className = 'i-eur'
          break;
          case 'USD':
            currency.className = 'i-usd'
            currency2.className = 'i-usd'
            break;

    }

    geo.textContent = value.geos.join(', ');
    moredetails.setAttribute('onclick', 'window.open(`' + main_url + 'vacancy/' + value.vacancy_card.code + '`,`_blank`);');


    switch (value.cus_status) {
      case null:
      case 10:
      case 20:
      case 30:
        if (value.vacancy_card.status == '50') {
          moredetails.className = "button-gray-light";
          moredetailstext.textContent = "В архиве";
          moredetailsicon.className = "i-archive";
        }
        if (value.cus_status == 30) {
          fav.querySelector('label>input[type=checkbox]').checked = true
        }
        if (usertype =='anon') {
          fav.querySelector('input').setAttribute('onclick', 'openOverlay("justreg");')
        } else {
          fav.querySelector('input').setAttribute('onclick', 'toBookmark2(this.checked, "' + value.vacancy_card.code + '")')
        }
        break;
      case 40:
        fav.remove()
        moredetails.className = "button-gray-light";
        moredetailsicon.className = "i-edit";
        moredetailstext.textContent = "Редактировать отклик";
        break;
      case 50:
        fav.remove()
        moredetails.className = "button-gray-light";
        moredetailstext.textContent = "Отклик отскорен";
        moredetailsicon.className = "i-superlike";
        break;
    }
    if (value.vacancy_card.status == '50') {
      fav.remove()
      moredetails.className = "button-gray-light";
      moredetailstext.textContent = "В архиве";
      moredetailsicon.className = "i-archive";
    }

    parent.append(cloneTemplate.cloneNode(true))
  }
}

function toBookmark2(val, code) {
  let dataobj = {
    'bookmarked': val,
    'code': code
  }
  AJAX(JSON.stringify(dataobj), 'PUT', 'vacancy').then(
    result => {
      if (result[0] == 200) {
        if (val == true) {
          popup('Вакансия добавлена в закладки', 'i-ok', 'purp')
        } else {
          popup('Вакансия удалена из закладок', 'i-ok', 'purp')
        }
      } else {
        popup('Не удалось добавить в закладки', 'i-close', 'red')
      }
    });
}
*/
