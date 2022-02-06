! function renderProfile() {
  if (!userData) {
    endpoint = "profile/" + path_url.split('/')[2]
    param = "";
  } else {
    endpoint = "profile"
    param = 'code=' + path_url.split('/')[2]
  }
  AJAX(param, 'GET', endpoint).then(
    result => {
      if (result[0] == 200) {
        objresult = JSON.parse(result[1])

        let cloneTemplate = tmpl_prof.content.cloneNode(true)
        let parent = document.querySelector('main')

        logo_image = cloneTemplate.querySelector("#logo_image");
        logo_image2 = cloneTemplate.querySelector("#logo_image2");
        title = cloneTemplate.querySelector("#title");
        title2 = cloneTemplate.querySelector("#title2");
        about = cloneTemplate.querySelector("#about");
        joblist = cloneTemplate.querySelector("#joblist");
        edulist = cloneTemplate.querySelector("#edulist");
        vacancylist = cloneTemplate.querySelector("#vacancylist");
        companylist = cloneTemplate.querySelector("#companylist");
        skillhead = cloneTemplate.querySelector("#skillhead");
        skilllist = cloneTemplate.querySelector("#skilllist");
        hrhead = cloneTemplate.querySelector("#hrhead");
        lastbutton = cloneTemplate.querySelector("#lastbutton");
        page_title = document.querySelector('title')

        if (objresult.img == undefined) {
          objresult.img = static_url + 'svg/default-avatars/avatar-' + Math.floor(Math.random() * 10) + '.svg'
        } else if (objresult.img.includes('.webp')) {
          objresult.img = objresult.img.split('/')
          objresult.img.splice(4, 1, '120')
          objresult.img = objresult.img.join().replace(/,/g, "/");
        } else if (objresult.img.includes('.js')) {
          objresult.img = static_url + 'svg/default-avatars/avatar-' + Math.floor(Math.random() * 10) + '.svg'
        }

        logo_image.src = objresult.img
        logo_image2.src = objresult.img

        if (!objresult.last_name && !objresult.first_name) {
          fullname = 'Аноним Анонимович'
        } else if (!objresult.last_name) {
          fullname = objresult.first_name
        } else if (!objresult.first_name) {
          fullname = objresult.last_name
        } else {
          fullname = objresult.first_name + " " + objresult.last_name
        }

        logo_image.alt = fullname
        logo_image2.alt = fullname

        title.innerHTML = fullname
        title2.innerHTML = fullname

        page_title.innerHTML = fullname + ' – ' + siteName

        if (objresult.about) {
          objresult.about = objresult.about.replace(/\n/g, " <br> ")
          about.innerHTML = urlify(objresult.about)
        } else {
          about.previousElementSibling.remove()
          about.remove();
        }

        if (!objresult.education && !objresult.job) {
          edulist.parentNode.parentNode.previousElementSibling.previousElementSibling.remove();
          edulist.parentNode.parentNode.previousElementSibling.remove();
          edulist.parentNode.parentNode.remove();
        } else {

          if (objresult.education) {
            let cloneTemplate2 = edulist
            let parent = edulist.parentNode
            edulist.remove();
            for (const [key, value] of Object.entries(objresult.education)) {
              cloneTemplate2.querySelector('b').innerHTML = key;
              cloneTemplate2.querySelector('p').innerHTML = value;
              parent.append(cloneTemplate2.cloneNode(true))
            }
          } else {
            edulist.parentNode.remove();
          }

          if (objresult.job) {
            let cloneTemplate2 = joblist
            let parent = joblist.parentNode
            joblist.remove();
            for (const [key, value] of Object.entries(objresult.job)) {
              cloneTemplate2.querySelector('b').innerHTML = key;
              cloneTemplate2.querySelector('p').innerHTML = value;
              parent.append(cloneTemplate2.cloneNode(true))
            }
          } else {
            joblist.parentNode.remove();
          }
        }

        if (objresult.skills && objresult.skills.length!=0) {
          console.log(objresult.skills);
          let cloneTemplate2 = skilllist
          let parent = skilllist.parentNode
          skilllist.remove();
          for (const [key, value] of Object.entries(objresult.skills)) {
            cloneTemplate2.querySelector('p').innerHTML = value;
            parent.append(cloneTemplate2.cloneNode(true))
          }
        } else {
          if (objresult.utype == 'CUS') {
            skilllist.parentNode.style.width = "100%"
            skilllist.parentNode.innerHTML = `
            <column class="m" style="align-items:center">
            <icon class='i-lock' style="font-size:var(--font-xxl);color:var(--gray)"></icon>
            <tag-xs class="button-gray-dark" style="cursor:default">Скрыто или отсутствует</tag-xs>
            </column>`
          } else {
            skilllist.parentNode.previousElementSibling.remove();
            skilllist.parentNode.remove();
          }
        }

        if (!objresult.vac_owner_list && !objresult.comp_viewer_list) {
          if (objresult.utype == 'HR') {
            companylist.parentNode.parentNode.innerHTML = `
              <column class="m" style="align-items:center">
              <icon class='i-lock' style="font-size:var(--font-xxl);color:var(--gray)"></icon>
              <tag-xs class="button-gray-dark" style="cursor:default">Скрыто или отсутствует</tag-xs>
              </column>
              `
          } else {
            companylist.parentNode.parentNode.previousElementSibling.remove();
            companylist.parentNode.parentNode.remove();
          }
        } else {
          if (objresult.vac_owner_list) {
            let cloneTemplate2 = vacancylist
            let parent = vacancylist.parentNode
            vacancylist.remove();
            for (const [key, value] of Object.entries(objresult.vac_owner_list)) {
              cloneTemplate2.querySelector('a').href = main_url + 'vacancy/' + key;
              cloneTemplate2.querySelector('a').innerHTML = value;
              parent.append(cloneTemplate2.cloneNode(true))
            }
          } else {
            vacancylist.parentNode.remove();
          }
          if (objresult.comp_viewer_list) {
            let cloneTemplate2 = companylist
            let parent = companylist.parentNode
            companylist.remove();
            for (const [key, value] of Object.entries(objresult.comp_viewer_list)) {
              cloneTemplate2.querySelector('a').href = main_url + 'vacancy/' + key;
              cloneTemplate2.querySelector('a').innerHTML = value;
              parent.append(cloneTemplate2.cloneNode(true))
            }
          } else {
            companylist.parentNode.remove();
          }
        }
        if (path_url.split('/')[2] == userData.code) {
          lastbutton.querySelector('p').innerHTML = 'Редактировать профиль'
          lastbutton.querySelector('icon').className = 'i-edit'
          lastbutton.parentNode.href = main_url + 'edit/profile/'
        } else {
          lastbutton.querySelector('p').innerHTML = 'Связаться с пользователем'
          lastbutton.querySelector('icon').className = 'i-dog'
          lastbutton.parentNode.href = 'mailto:' + objresult.email
          lastbutton.parentNode.target = '__blank'
        }

        /*
                switch (objresult.utype) {
                  case 'CUS':
                    hrhead.nextElementSibling.remove();
                    hrhead.remove();
                    break;
                  case 'HR':
                    skillhead.nextElementSibling.remove();
                    skillhead.remove();
                    break;
                  case 'ADM':
                    skillhead.nextElementSibling.remove();
                    skillhead.remove();
                    hrhead.nextElementSibling.remove();
                    hrhead.remove();
                    break;
                }
        */

        parent.append(cloneTemplate.cloneNode(true))
      } else {
        document.querySelector('title').innerHTML = 'Профиль не существует или закрыт – ' + siteName
        document.querySelector('main').style.justifyContent = 'center'
        document.querySelector('main').innerHTML = `
        <column class="m" style="align-items:center">
      <icon class='i-notfound' style="font-size:var(--font-xxl);color:var(--gray)"></icon>
        <tag-xs class="button-gray-dark" style="cursor:default">Профиль не существует или закрыт</tag-xs>
        </column>`
      }
    });
}();
