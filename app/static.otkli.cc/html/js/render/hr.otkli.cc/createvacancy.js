function createVacancy() {
  let page = 1
  let dataobj = {
    'page_rows': 12,
    'page': page,
    'role': 20
  }
  AJAX('code=' + userData.code, 'GET', 'profile').then(
    result => {
      if (result[0] == 200) {
        if (result[1] == '[]') {} else {
          document.querySelector('tovacancy>column').innerHTML = ''
          let button = `
<column class="xs">
          <a href="` + main_url + `create/company/" style="width:100%">
                          <tag-l class="button-purp-dark" tabindex="0" onclick="createVacancy()">
                            <p>Создать компанию</p>
                          </tag-l>
                        </a>
                        <p style="font-size:12px;color:var(--gray-dark)">Если хотите опубликовать вакансию в компании, уже зарегестрированной на нашем сайте – свяжитесь с владельцем компании и запросите доступ.</p>
                        </column>`
          let text = `<h3 style="font-weight:var(--bold)">Прежде чем создать вакансию, создайте компанию</h3>`
          let text2 = `<p style="width:100%;text-align:center;
    font-size: 14px;color: var(--gray-dark);margin-bottom:0px;">Или создайте новую</p>`
          let text3 = `<h3 style="font-weight:var(--bold)">Чтобы продолжить создание вакансии – выберите компанию</h3>`
          document.querySelector('tovacancy>column').insertAdjacentHTML('afterbegin', button);
          if (JSON.parse(result[1]).comp_viewer_list) {
            document.querySelector('tovacancy>column').insertAdjacentHTML('afterbegin', text2);
            for (const [key, value] of Object.entries(JSON.parse(result[1]).comp_viewer_list)) {
              document.querySelector('tovacancy>column').insertAdjacentHTML('afterbegin', '<a style="width:100%" href="' + main_url + 'create/vacancy/' + key + '"><tag-l class="button-purp-light"><b>' + value + '</b></tag-l></a>');
            }
            document.querySelector('tovacancy>column').insertAdjacentHTML('afterbegin', text3);
          } else {
            document.querySelector('tovacancy>column').insertAdjacentHTML('afterbegin', text);
          }



          openOverlay('tovacancy')
        }
      } else {
        popup('Ошибка получения данных', 'i-close', 'red')
      }
    });
}
