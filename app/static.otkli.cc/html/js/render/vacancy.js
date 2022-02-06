! function renderProfile() {
  if (!userData) {
    endpoint = "vacancy/" + path_url.split('/')[2]
    param = "";
    usertype = 'ANON';
  } else {
    endpoint = "vacancy"
    param = 'code=' + path_url.split('/')[2]
    usertype = userData.utype
  }
  AJAX(param, 'GET', endpoint).then(
    result => {
      if (result[0] == 200) {
        objresult = JSON.parse(result[1])

        let cloneTemplate = tmpl_vac.content.cloneNode(true)
        let parent = document.querySelector('main')

        logo_image = cloneTemplate.querySelector("#logo_image");
        logo_image2 = cloneTemplate.querySelector("#logo_image2");
        comp_code = cloneTemplate.querySelector("#comp_code");
        comp_code2 = cloneTemplate.querySelector("#comp_code2");
        vac_code = cloneTemplate.querySelector("#vac_code");
        vac_code2 = cloneTemplate.querySelector("#vac_code2");
        title = cloneTemplate.querySelector("#title");
        title2 = cloneTemplate.querySelector("#title2");
        leave_days = cloneTemplate.querySelector("#leave_days");
        leave_days2 = cloneTemplate.querySelector("#leave_days2");
        salary = cloneTemplate.querySelector("#salary");
        salary2 = cloneTemplate.querySelector("#salary2");
        term = cloneTemplate.querySelector("#term");
        term2 = cloneTemplate.querySelector("#term2");
        busyness = cloneTemplate.querySelector("#busyness");
        busyness2 = cloneTemplate.querySelector("#busyness2");
        geo = cloneTemplate.querySelector("#geo");
        geo2 = cloneTemplate.querySelector("#geo2");
        views = cloneTemplate.querySelector("#views");
        views2 = cloneTemplate.querySelector("#views2");
        currency = cloneTemplate.querySelector("#currency");
        currency2 = cloneTemplate.querySelector("#currency2");
        about = cloneTemplate.querySelector("#about");
        demand = cloneTemplate.querySelector("#demand");
        termslist = cloneTemplate.querySelector("#termslist");




        document.querySelector('title').innerHTML = objresult.vacancy_card.title + ' – ' + siteName
        document.querySelector('meta[name=Description]').content = objresult.vacancy_card.about

        //imgsize patch
        if (objresult.company_card.logo_image == undefined) {
          objresult.company_card.logo_image = static_url+'svg/default-avatars/avatar-' + Math.floor(Math.random() * 10) + '.svg'
        } else if (objresult.company_card.logo_image.includes('.webp')) {
          objresult.company_card.logo_image = objresult.company_card.logo_image.split('/')
          objresult.company_card.logo_image.splice(4, 1, '120')
          objresult.company_card.logo_image = objresult.company_card.logo_image.join().replace(/,/g, "/");
        } else if (objresult.company_card.logo_image.includes('.js')) {
          objresult.company_card.logo_image = '//'
        }

        logo_image.src = objresult.company_card.logo_image
        logo_image2.src = objresult.company_card.logo_image

        logo_image.alt = objresult.company_card.name
        logo_image2.alt = objresult.company_card.name
        if (objresult.company_card.status == 40) {
          comp_code.href = main_url + 'company/' + objresult.company_card.code
          comp_code2.href = main_url + 'company/' + objresult.company_card.code
        } else {
          comp_code.style.pointerEvents = "none";
          comp_code.style.cursor = "default";
          comp_code2.style.pointerEvents = "none";
          comp_code2.style.cursor = "default";
        }
        vac_code.href = main_url + 'vacancy/' + objresult.vacancy_card.code
        vac_code2.href = main_url + 'vacancy/' + objresult.vacancy_card.code
        title.innerHTML = objresult.vacancy_card.title
        title2.innerHTML = objresult.vacancy_card.title

        if (objresult.company_card.verified == true) {
          logo_image.parentNode.className = 'valid'
          logo_image2.parentNode.className = 'valid'
        }
        /*
              postDate = new Date(objresult.vacancy_card.post_date);
              lastDate = new Date(postDate.setDate(postDate.getDate() + objresult.vacancy_card.leave_days));
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
              deadline = Math.round(daysBetween(yourDate, lastDate))*/
        if (objresult.vacancy_card.post_date) {
          deadline = objresult.vacancy_card.left_days
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
        leave_days.innerHTML = deadline
        leave_days2.innerHTML = deadline




        if (!objresult.vacancy_card.salary_lo && !objresult.vacancy_card.salary_hi) {
          salary.innerHTML = 'Не указана'
          salary2.innerHTML = 'Не указана'
        } else if (!objresult.vacancy_card.salary_lo && objresult.vacancy_card.salary_hi) {
          salary.innerHTML = 'До ' + objresult.vacancy_card.salary_hi
          salary2.innerHTML = 'До ' + objresult.vacancy_card.salary_hi
        } else if (!objresult.vacancy_card.salary_hi && objresult.vacancy_card.salary_lo) {
          salary.innerHTML = 'От ' + objresult.vacancy_card.salary_lo
          salary2.innerHTML = 'От ' + objresult.vacancy_card.salary_lo
        } else {
          salary.innerHTML = objresult.vacancy_card.salary_lo + ' – ' + objresult.vacancy_card.salary_hi
          salary2.innerHTML = objresult.vacancy_card.salary_lo + ' – ' + objresult.vacancy_card.salary_hi
        }

        switch (objresult.vacancy_card.term) {
          case 10:
            term.innerHTML = 'в месяц'
            term2.innerHTML = 'в месяц'
            break;
          case 20:
            term.innerHTML = 'в год'
            term2.innerHTML = 'в год'
            break;
          case 30:
            term.innerHTML = 'за проект'
            term2.innerHTML = 'за проект'
            break;
        }

        switch (objresult.vacancy_card.busyness) {
          case 10:
            busyness.innerHTML = 'Полная'
            busyness2.innerHTML = 'Полная'
            break;
          case 20:
            busyness.innerHTML = 'Частичная'
            busyness2.innerHTML = 'Частичная'
            break;
          case 30:
            busyness.innerHTML = 'Проектная'
            busyness2.innerHTML = 'Проектная'
            break;
          case 40:
            busyness.innerHTML = 'Стажировка'
            busyness2.innerHTML = 'Стажировка'
            break;
        }

        views.innerHTML = objresult.vacancy_card.view_count
        views2.innerHTML = objresult.vacancy_card.view_count

        about.innerHTML = objresult.vacancy_card.about

        geo.innerHTML = objresult.geos.join(', ');
        geo2.innerHTML = objresult.geos.join(', ');

        switch (objresult.vacancy_card.currency) {
          case 'RUB':
            currency.className = 'i-ruble'
            currency2.className = 'i-ruble'
            break;
          case 'EUR':
            currency.className = 'i-eur'
            currency2.className = 'i-eur'
            break;
          case 'USD':
            currency.className = 'i-usd'
            currency2.className = 'i-usd'
            break;
          default:

        }

        if (objresult.demands) {
          let cloneTemplate2 = demand
          let parent = demand.parentNode
          let i=0
          demand.remove();
          for (const [key, value] of Object.entries(objresult.demands)) {
            cloneTemplate2.querySelector('span').innerHTML = value;
            cloneTemplate2.querySelector('textarea-parent>textarea').setAttribute('data-id', key)
            if (i!=0) {
              console.log(cloneTemplate2.querySelector('textarea-parent>span>icon'));
              cloneTemplate2.querySelector('textarea-parent>span').innerHTML=''
            }
            i++
            parent.append(cloneTemplate2.cloneNode(true))
          }
        }
        if (objresult.terms) {
          let cloneTemplate2 = termslist
          let parent = termslist.parentNode
          termslist.remove();
          for (const [key, value] of Object.entries(objresult.terms)) {
            cloneTemplate2.innerHTML = value;
            parent.append(cloneTemplate2.cloneNode(true))
          }
        }
        parent.append(cloneTemplate.cloneNode(true))
        if (usertype == 'CUS' || usertype == 'ANON') {
          renderResponseBlock();
        } else {
          renderResponseBlockEdit();
        }

      } else {
        console.log('error');
      }
    });
}();
