if (!userData) {
  openOverlay('auth', 'noclose')
} else {
SEND('page page_rows', 'GET', 'feed').then(
  result => {
    if (result[0] == 200) {
      renderVacancyGrid(result[1],'grid')
      if (Object.keys(JSON.parse(result[1])).length < document.querySelector('[data-id="page_rows"]').value) {
        document.querySelector("#loadmorebtn").style.display='none'
      }
    }
  });


//load more button
function loadMore(that) {
  document.querySelector("input[data-id='page']").value = parseInt(document.querySelector("input[data-id='page']").value) + 1;
  that.classList.add("loading");
  that.style.display='flex'
  SEND('page page_rows', 'GET', 'feed').then(
    result => {
      if (result[0] == 200 && result[1] != '[]') {
        renderVacancyGrid(result[1],'grid')
        that.classList.remove("loading");
        if (Object.keys(JSON.parse(result[1])).length < document.querySelector('[data-id="page_rows"]').value) {
          that.style.display='none'
        }
      } else {
        that.style.display='none'
      }
    });
}
function renderVacancyGrid(that,grid) {
  let cloneTemplateGlobal = tmpl.content.cloneNode(true)
  let parent = document.getElementById(grid)
  for (const [key, value] of Object.entries(JSON.parse(that))) {
    let cloneTemplate = cloneTemplateGlobal.cloneNode(true)
    img = cloneTemplate.querySelector("img");
    valid = cloneTemplate.querySelector("valid");
    companylink = cloneTemplate.querySelector("valid>a");
    link = cloneTemplate.querySelector("column>a");
    date = cloneTemplate.querySelector("column>tag-xxxs>p");
    statustag = cloneTemplate.querySelectorAll("inline>tag-xs")[0];
    statustagtext = cloneTemplate.querySelectorAll("inline>tag-xs>p")[0];
    statustagicon = cloneTemplate.querySelectorAll("inline>tag-xs>icon")[0];
    views = cloneTemplate.querySelectorAll("inline>tag-xs>p")[1];
    applies = cloneTemplate.querySelectorAll("inline>tag-xs>p")[2];
    edit = cloneTemplate.querySelectorAll("column>row>tag-l")[0];
    ototklicc = cloneTemplate.querySelectorAll("column>row>tag-l")[1];


    valid.className = value.company_card.verified


    if (value.company_card.logo_image == undefined) {
      value.company_card.logo_image = 'https://static.otkli.cc/svg/default-avatars/avatar-' + Math.floor(Math.random() * 10) + '.svg'
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


    views.textContent = value.vacancy_card.view_count
    applies.textContent = value.applies

    edit.setAttribute('onclick', 'window.open(`' + main_url + 'edit/vacancy/' + value.vacancy_card.code + '`,`_blank`);');

    switch (value.status) {
      case 10:
        statustag.className = "button-gray-light";
        statustagtext.textContent = "В черновике";
        break;
      case 20:
        statustag.className = "button-gray-light";
        statustagtext.textContent = "На модерации";
        break;
      case 30:
        statustag.className = "button-red-contrast";
        statustagtext.textContent = "Отклонена";
        statustagicon.className = "i-close";
        break;
      case 40:
        statustag.className = "button-blue-dark";
        statustagtext.textContent = "Опубликована";
        statustagicon.className = "i-superlike";
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
