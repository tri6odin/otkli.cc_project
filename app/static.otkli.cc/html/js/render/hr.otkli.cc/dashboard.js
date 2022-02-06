const mediaQuery = window.matchMedia('(max-width: 780px)')
let screensize

function handleTabletChange(e) {
  if (e.matches) {
    screensize = 'mobile'
  } else {
    screensize = 'desktop'
  }
}

if (!userData) {
  openOverlay('auth', 'noclose')
} else {
  SEND('page page_rows status role', 'GET', 'feed').then(
    result => {
      if (result[0] == 200) {
        document.querySelector("grid").classList.remove("fullwidth")
        if (result[1] == '[]') {

          mediaQuery.addListener(handleTabletChange)
          handleTabletChange(mediaQuery)
          if (screensize == 'mobile' || window.screen.width < "780") {
            document.querySelector("leftpanel").style.display = 'flex'
            document.querySelector("leftpanel").style.height = '100%'
            document.querySelector("leftpanel").style.justifyContent = 'center'
            document.querySelector("grid").innerHTML = `
            <column class="m" style="align-items:center">
                                                          <icon class="i-tray" style="font-size:80px;color:var(--purp-trans-light)"></icon>
                                                          <tag-m class="button-purp-light" tabindex="0" onclick="createVacancy()">

                                                          <b>Создать вакансию</b>
                                                          <icon class="i-plus"></icon>
                                                          </tag-m>
                                                        </column>`;
          } else {
            document.querySelector("rightpanel").innerHTML = `<column class="m" style="align-items:center;height:100%">
                                                          <icon class="i-tray" style="font-size:80px;color:var(--purp-trans-light)"></icon>
                                                          <tag-m class="button-purp-light" tabindex="0" onclick="createVacancy()">
                                                          <b>Создать вакансию</b>
                                                          <icon class="i-plus"></icon>
                                                          </tag-m>
                                                        </column>`;
          }

        } else {

          document.querySelector("rightpanel").innerHTML = `
          <column class="m" style="align-items:center;margin: var(--len-m) auto var(--len-m) auto;height:100%">
            <icon class="i-tray" style="font-size:80px;color:var(--gray)"></icon>
            <tag-xs class="button-gray-dark" style="cursor:default">Выберете вакансию или создайте новую</tag-xs>
          </column>`;


          document.querySelector("leftpanel").style.display = 'flex'
          document.querySelector("vhr-2").style.display = 'flex'
          document.querySelector("hr").style.display = 'flex'
          document.querySelector("leftpanel>tag-xl").style.display = 'flex'
          document.querySelector(".collapsible").style.display = 'flex'
          renderVacancyGrid(result[1], 'grid')
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

  function loadMore(that) {
    document.querySelector("input[data-id='page']").value = parseInt(document.querySelector("input[data-id='page']").value) + 1;
    that.classList.add("loading");
    that.style.display = 'flex'
    SEND('page page_rows status role', 'GET', 'feed').then(
      result => {
        if (result[0] == 200 && result[1] != '[]') {
          renderVacancyGrid(result[1], 'grid')
          that.classList.remove("loading");
          if (Object.keys(JSON.parse(result[1])).length < document.querySelector('[data-id="page_rows"]').value) {
            that.style.display = 'none'
          }
        } else {
          that.style.display = 'none'
        }
      });
  }

  function findButton() {
    document.querySelector(`input[data-id='page']`).value = 1;
    SEND('page page_rows status role', 'GET', 'feed').then(
      result => {
        if (result[0] == 200) {
          document.querySelector("grid").classList.remove("fullwidth")
          document.querySelector("grid").innerHTML = "";
          if (result[1] == '[]') {
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

      fav = cloneTemplate.querySelectorAll("column>row>tag-l")[0];

      moredetails = cloneTemplate.querySelectorAll("column>row>tag-l")[1];
      moredetailstext = cloneTemplate.querySelectorAll("column>row>tag-l>p")[1];
      moredetailsicon = cloneTemplate.querySelectorAll("column>row>tag-l>icon")[1];

      statustag = cloneTemplate.querySelectorAll("inline>tag-xs")[0];
      statustagtext = cloneTemplate.querySelectorAll("inline>tag-xs>p")[0];
      statustagicon = cloneTemplate.querySelectorAll("inline>tag-xs>icon")[0];

      imgtagtext = cloneTemplate.querySelectorAll("inline>tag-xs>p")[1];
      appliestagtext = cloneTemplate.querySelectorAll("inline>tag-xs>p")[2];

      if (value.company_card.verified == true) {
        valid.className = 'valid'
      }

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
      if (value.company_card.status == 40) {
        companylink.href = main_url + 'company/' + value.company_card.code
      } else {
        console.log('black');
        companylink.style.pointerEvents = "none";
        companylink.style.cursor = "default";
        img.style.borderColor = "var(--red)";
      }
      /*
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
      deadline =
      */
      if (value.vacancy_card.post_date) {


        deadline = value.vacancy_card.left_days
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
      } else {
        deadline = 'Вакансия не опубликована'
      }
      date.textContent = deadline
      if (value.vacancy_card.view_count == null) {
        value.vacancy_card.view_count = 0
      }
      imgtagtext.textContent = value.vacancy_card.view_count
      if (value.applies == null) {
        value.applies = 0
      }
      appliestagtext.textContent = value.applies
      const mediaQuery = window.matchMedia('(max-width: 780px)')
      let screensize

      function handleTabletChange(e) {
        if (e.matches) {
          screensize = 'mobile'
        } else {
          screensize = 'desktop'
        }
      }
      mediaQuery.addListener(handleTabletChange)
      handleTabletChange(mediaQuery)
      if (screensize == 'desktop') {
        moredetails.setAttribute('onclick', 'pagesToNull();renderScoring("' + document.querySelector("[data-target=page_rows_1]").value + '","' + document.querySelector("[data-target=page_1]").value + '","' + value.vacancy_card.code + '");');
      } else {
        moredetails.setAttribute('onclick', 'window.open(`' + main_url + 'scoring/' + value.vacancy_card.code + '`);');
      }

      fav.setAttribute('onclick', 'window.open(`' + main_url + 'edit/vacancy/' + value.vacancy_card.code + '`,`_blank`);');

      switch (value.status) {
        case 10:
          statustag.className = "button-gray-light";
          statustagtext.textContent = "В черновике";
          break;
        case 20:
          statustag.className = "button-gray-light";
          statustagtext.textContent = "На модерации";
          statustagicon.className = "i-edit";
          break;
        case 30:
          statustag.className = "button-red-contrast";
          statustagtext.textContent = "Отклонена";
          statustagicon.className = "i-delete";
          break;
        case 40:
          statustag.className = "button-blue-dark";
          statustagtext.textContent = "Опубликована";
          statustagicon.className = "i-ok";
          break;
        case 50:
          statustag.className = "button-gray-light";
          statustagtext.textContent = "В архиве";
          statustagicon.className = "i-archive";
          break;
      }
      parent.append(cloneTemplate.cloneNode(true))
    }
  }


}
