! function renderProfile() {
  if (!userData) {
    endpoint = "company/" + path_url.split('/')[2]
    param = "";
  } else {
    endpoint = "company"
    param = 'code=' + path_url.split('/')[2]
  }
  AJAX(param, 'GET', endpoint).then(
    result => {
      result = JSON.parse(result[1])
      document.querySelector('header>h1').innerHTML = result.name
      document.querySelector('title').innerHTML = result.name+' – '+siteName
      document.querySelector('meta[name=Description]').innerHTML = result.about
      document.querySelector('input[data-id="company"]').value = result.name
      onloadrender()
    });
  ! function renderProfile() {
    if (!userData) {
      endpoint = "search/anon"
      usertype = 'anon'
    } else {
      endpoint = "search"
      usertype = userData.utype
    }
  }();
}();


function onloadrender() {
  SEND('page page_rows professions parent_professions company geo parent_company experience deadline popular', 'GET', endpoint).then(
    result => {
      if (result[0] == 200) {
        if (result[1]=='[]') {
          document.querySelector("grid").classList.add("fullwidth")
          document.querySelector("grid").innerHTML = `<h3 style="color: var(--gray);">Ничего не найдено</h3>`;
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


function findButton(that) {
  document.querySelector(`input[data-id='page']`).value = 1;
  that.classList.add("loading");
  SEND('page page_rows professions parent_professions company parent_company geo parent_company experience deadline popular', 'GET', endpoint).then(
    result => {
      if (result[0] == 200) {
        document.querySelector("grid").innerHTML = "";
        that.classList.remove("loading")
        document.querySelector("#loadmorebtn").classList.remove("loading")
        document.querySelector("grid").classList.remove("fullwidth")
        if (result[1]=='[]') {
          document.querySelector("grid").classList.add("fullwidth")
          document.querySelector("grid").innerHTML = `<h3 style="color: var(--gray);">Ничего не найдено</h3>`;
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
function loadMore(that) {
  document.querySelector("input[data-id='page']").value = parseInt(document.querySelector("input[data-id='page']").value) + 1;
  that.classList.add("loading");
  that.style.display='flex'
  SEND('page page_rows professions parent_professions company parent_company geo parent_company experience deadline popular', 'GET', endpoint).then(
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

    valid.className = value.company_card.verified

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
    companylink.href = main_url + 'company/' + value.company_card.code
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
        currency.className = 'i-euro'
        break;
      case 'USD':
        currency.className = 'i-dollar'
        break;
      default:

    }

    geo.textContent = value.geos.join(', ');


    moredetails.setAttribute('onclick', 'window.open(`' + main_url + 'vacancy/' + value.vacancy_card.code + '`,`_blank`);');

    if (value.cus_status == 30) {
      fav.querySelector('label>input[type=checkbox]').checked = true
    }
    if ((value.cus_status == 30 || value.cus_status == 20 || value.cus_status == 10 || value.cus_status == null) && (usertype == 'anon' || usertype == 'CUS')) {
      fav.addEventListener("click", function(event) {
        if (event.target.checked == true) {
          toBookmark(true)
        } else {
          toBookmark(false)
        }
      })
    } else {
      fav.remove()
      if (usertype == 'anon' || usertype == 'CUS') {
        switch (value.cus_status) {
          case 40:
            moredetails.className = "button-gray-light";
            moredetailstext.textContent = "Редактировать отклик";
            break;
          case 50:
            moredetails.className = "button-gray-light";
            moredetailstext.textContent = "Отклик отскорен";
            moredetailsicon.className = "i-superlike";
            break;
        }
      } else {
        switch (value.vacancy_card.status) {
          case 10:
            moredetails.className = "button-gray-light";
            moredetailstext.textContent = "Вакансия в черновике";
            break;
          case 20:
            moredetails.className = "button-gray-light";
            moredetailstext.textContent = "Отправлена на модерацию";
            break;
          case 30:
            moredetails.className = "button-red-light";
            moredetailstext.textContent = "Отклонена";
            moredetailsicon.className = "i-cross";
            break;
          case 40:
            moredetails.className = "button-purp-light";
            moredetailstext.textContent = "Опубликована";
            moredetailsicon.className = "i-superlike";
            break;
          case 50:
            moredetails.className = "button-gray-light";
            moredetailstext.textContent = "В архиве";
            moredetailsicon.className = "i-archive";
            break;
        }
      }
    }
    //fav.setAttribute('onclick', 'window.open(`https://test`,`_blank`);');
    //fav.style.display = "flex";
    //fav.querySelector('input').checked = "true";

    parent.append(cloneTemplate.cloneNode(true))
  }
}
