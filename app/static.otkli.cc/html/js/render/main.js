//find button
! function renderProfile() {
  if (!userData) {
    endpoint = "search/anon"
    usertype = 'anon'
  } else {
    endpoint = "search"
    usertype = userData.utype
  }
  onloadrender()
}();

function onloadrender() {
  SEND('page page_rows professions parent_professions company parent_company geos parent_geos experience deadline popular', 'GET', endpoint).then(
    result => {
      if (result[0] == 200) {
        if (result[1]=='[]') {
          document.querySelector("grid").classList.add("fullwidth")
          document.querySelector("grid").innerHTML = `
          <column class="m" style="align-items:center;margin: var(--len-m) auto var(--len-m) auto">
          <icon class='i-notfound' style="font-size:var(--font-xxl);color:var(--gray)"></icon>
          <tag-xs class="button-gray-dark" style="cursor:default">Ничего не найдено</tag-xs>
          </column>
          `;
        } else {
          renderVacancyGrid(result[1],'replace')
        }
        if (Object.keys(JSON.parse(result[1])).length < document.querySelector('[data-id="page_rows"]').value) {
          document.querySelector("#loadmorebtn").style.display = 'none'
        } else {
          document.querySelector("#loadmorebtn").style.display = 'flex'
        }
      } else {
        popup('Ошибка получения данных', 'i-close', 'red')
      }
    });
}

function findButton(that) {
  document.querySelector(`input[data-id='page']`).value = 1;

  SEND('page page_rows professions parent_professions company parent_company geos parent_geos experience deadline popular', 'GET', endpoint).then(
    result => {
      if (result[0] == 200) {
        document.querySelector("grid").innerHTML = "";

        document.querySelector("#loadmorebtn").classList.remove("loading")
        document.querySelector("grid").classList.remove("fullwidth")
        if (result[1]=='[]') {
          document.querySelector("grid").classList.add("fullwidth")
          document.querySelector("grid").innerHTML = `<column class="m" style="align-items:center;margin: var(--len-m) auto var(--len-m) auto">
                    <icon class='i-notfound' style="font-size:var(--font-xxl);color:var(--gray)"></icon>
                    <tag-xs class="button-gray-dark" style="cursor:default">Ничего не найдено</tag-xs>
                    </column>`;
        } else {
          renderVacancyGrid(result[1])
        }
        if (Object.keys(JSON.parse(result[1])).length < document.querySelector('[data-id="page_rows"]').value) {
          document.querySelector("#loadmorebtn").style.display = 'none'
        } else {
          document.querySelector("#loadmorebtn").style.display = 'flex'
        }
      } else {
        popup('Ошибка получения данных', 'i-close', 'red')
      }
    });
}

//load more button

function loadMore(that) {
  document.querySelector("input[data-id='page']").value = parseInt(document.querySelector("input[data-id='page']").value) + 1;
  that.classList.add("loading");
  that.style.display = 'flex'
  SEND('page page_rows professions parent_professions company parent_company geos parent_geos experience deadline popular', 'GET', endpoint).then(
    result => {
      if (result[0] == 200 && result[1] != '[]') {
        renderVacancyGrid(result[1])
        that.classList.remove("loading")
        if (Object.keys(JSON.parse(result[1])).length < document.querySelector('[data-id="page_rows"]').value) {
          document.querySelector("#loadmorebtn").style.display = 'none'
        } else {
          document.querySelector("#loadmorebtn").style.display = 'flex'
        }
      } else {
        that.style.display = 'none'
      }
    });
}

function renderVacancyGrid(that,replace_status) {
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
    moredetails = cloneTemplate.querySelector("column>row>a>tag-l");
    moredetailstext = cloneTemplate.querySelector("column>row>a>tag-l>p");
    moredetailsicon = cloneTemplate.querySelector("column>row>a>tag-l>icon");
    fav = cloneTemplate.querySelector("column>row>label");

if (value.company_card.verified==true) {
  valid.className = 'valid'
}



    //imgsize patch
    if (value.company_card.logo_image == undefined) {
      value.company_card.logo_image = static_url+'svg/default-avatars/avatar-' + Math.floor(Math.random() * 10) + '.svg'
    }
    else if (value.company_card.logo_image.includes('.webp')) {
      value.company_card.logo_image = value.company_card.logo_image.split('/')
      value.company_card.logo_image.splice(4, 1, '120')
      value.company_card.logo_image = value.company_card.logo_image.join().replace(/,/g, "/");
    }
    else if (value.company_card.logo_image.includes('.js')) {
      value.company_card.logo_image='//'
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

    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    if (!value.vacancy_card.salary_lo && !value.vacancy_card.salary_hi) {
      price.textContent = 'Не указана'
    } else if (!value.vacancy_card.salary_lo && value.vacancy_card.salary_hi) {
      price.textContent = 'До ' + numberWithCommas(value.vacancy_card.salary_hi)
    } else if (!value.vacancy_card.salary_hi && value.vacancy_card.salary_lo) {
      price.textContent = 'От ' + numberWithCommas(value.vacancy_card.salary_lo)
    } else {
      price.textContent = numberWithCommas(value.vacancy_card.salary_lo) + ' – ' + numberWithCommas(value.vacancy_card.salary_hi)
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
          break;
          case 'USD':
            currency.className = 'i-usd'
            break;

    }

    geo.textContent = value.geos.join(', ');

    moredetails.parentNode.href = main_url + 'vacancy/' + value.vacancy_card.code
    moredetails.parentNode.alt = value.vacancy_card.title
if (value.cus_status != 'null') {


    switch (value.cus_status) {
      case 10:
      case 20:
          moredetails.className = "button-gray-light";
      case 30:
        if (value.vacancy_card.status == '50') {
          moredetails.className = "button-gray-light";
          moredetailstext.textContent = "В архиве";
          moredetailsicon.className = "i-archive";
        }
        if (value.cus_status == 30) {
          moredetails.className = "button-gray-light";
          fav.querySelector('label>input[type=checkbox]').checked = true
        }

          fav.querySelector('input').setAttribute('onclick', 'toBookmark(this.checked, "' + value.vacancy_card.code + '")')

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
  }
    if (value.vacancy_card.status == '50') {
      fav.remove()
      moredetails.className = "button-gray-light";
      moredetailstext.textContent = "В архиве";
      moredetailsicon.className = "i-archive";
    }

  if (replace_status=='replace') {

    document.querySelectorAll('.skeleton').forEach(item => {
      item.remove()
    });
    if (usertype =='anon') {
      fav.querySelector('input').setAttribute('onclick', 'openOverlay("justreg");checkboxOff(this)')
    }
    parent.append(cloneTemplate.cloneNode(true))
  } else {
    parent.append(cloneTemplate.cloneNode(true))
  }

  }
}

function toBookmark(val, code) {
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
