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
        about = cloneTemplate.querySelector("#about_block");

        edu_block = cloneTemplate.querySelector("#edu_block");
        edu_list = cloneTemplate.querySelector("#edu_list");
        job_block = cloneTemplate.querySelector("#job_block");
        job_list = cloneTemplate.querySelector("#job_list");

        skills_block = cloneTemplate.querySelector("#skills_block");
        skill_list = cloneTemplate.querySelector("#skill_list");

        company_block = cloneTemplate.querySelector("#company_block");
        company_list = cloneTemplate.querySelector("#company_list");

        vacancy_block = cloneTemplate.querySelector("#vacancy_block");
        vacancy_list = cloneTemplate.querySelector("#vacancy_list");

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


if (!objresult.education) {
  edu_block.previousElementSibling.remove()
  edu_block.remove();
} else {
  let cloneTemplate = edu_list
  let parentTemplate = edu_list.parentNode
  edu_list.remove();
  for (const [key, value] of Object.entries(objresult.education)) {
    cloneTemplate.querySelector('b').innerHTML = key;
    cloneTemplate.querySelector('p').innerHTML = value;
    parentTemplate.append(cloneTemplate.cloneNode(true))
  }
}
if (!objresult.job) {
  job_block.previousElementSibling.remove()
  job_block.remove();
} else {
  let cloneTemplate = job_list
  let parentTemplate = job_list.parentNode
  job_list.remove();
  for (const [key, value] of Object.entries(objresult.job)) {
    cloneTemplate.querySelector('b').innerHTML = key;
    cloneTemplate.querySelector('p').innerHTML = value;
    parentTemplate.append(cloneTemplate.cloneNode(true))
  }
}

if (objresult.skills && objresult.skills.length!=0) {
  let cloneTemplate = skill_list
  let parentTemplate = skill_list.parentNode
  skill_list.remove();
  for (const [key, value] of Object.entries(objresult.skills)) {
    cloneTemplate.querySelector('p').innerHTML = value;
    parentTemplate.append(cloneTemplate.cloneNode(true))
  }
} else {
  if (objresult.utype == 'CUS') {
    skill_list.parentNode.style.width = "100%"
    skill_list.parentNode.style.marginLeft='0px'
    skill_list.parentNode.innerHTML = `
    <column class="m" style="align-items:center;padding: 20px 20px 20px 0;">
    <icon class='i-lock' style="font-size:var(--font-xxl);color:var(--gray)"></icon>
    <tag-xs class="button-gray-dark" style="cursor:default">Скрыты или отсутствуют</tag-xs>
    </column>`
  } else {
    skills_block.previousElementSibling.remove();
    skills_block.remove();
  }
}
if (!objresult.comp_viewer_list) {
  if (objresult.utype == 'HR') {
    company_block.querySelector('column').style.marginLeft='0px'
    company_block.querySelector('column').innerHTML = `
      <column class="m" style="align-items:center;padding: 20px 20px 20px 0;">
      <icon class='i-lock' style="font-size:var(--font-xxl);color:var(--gray)"></icon>
      <tag-xs class="button-gray-dark" style="cursor:default">Скрыты или отсутствуют</tag-xs>
      </column>
      `
  } else {
    company_block.previousElementSibling.remove();
    company_block.remove();
  }
} else {
  let cloneTemplate = company_list
  let parentTemplate = company_list.parentNode
  company_list.remove();
  for (const [key, value] of Object.entries(objresult.comp_viewer_list)) {
    cloneTemplate.href = main_url + 'company/' + key;
    cloneTemplate.innerHTML = value;
    parentTemplate.append(cloneTemplate.cloneNode(true))
  }
}

if (!objresult.vac_owner_list) {
  if (objresult.utype == 'HR') {
    vacancy_block.querySelector('column').style.marginLeft='0px'
    vacancy_block.querySelector('column').innerHTML = `
      <column class="m" style="align-items:center;padding: 20px 20px 20px 0;">
      <icon class='i-lock' style="font-size:var(--font-xxl);color:var(--gray)"></icon>
      <tag-xs class="button-gray-dark" style="cursor:default">Скрыты или отсутствуют</tag-xs>
      </column>
      `
  } else {
    vacancy_block.previousElementSibling.remove();
    vacancy_block.remove();
  }
} else {
  let cloneTemplate = vacancy_list
  let parentTemplate = vacancy_list.parentNode
  vacancy_list.remove();
  for (const [key, value] of Object.entries(objresult.vac_owner_list)) {
    cloneTemplate.href = main_url + 'vacancy/' + key;
    cloneTemplate.innerHTML = value;
    parentTemplate.append(cloneTemplate.cloneNode(true))
  }
}
if (userData) {
  if (path_url.split('/')[2] == userData.code) {
    lastbutton.querySelector('p').innerHTML = 'Редактировать профиль'
    lastbutton.querySelector('icon').className = 'i-edit'
    lastbutton.parentNode.href = main_url + 'edit/profile/'
  } else {
    lastbutton.querySelector('p').innerHTML = 'Связаться с пользователем'
    lastbutton.querySelector('icon').remove()
    lastbutton.parentNode.href = 'mailto:' + objresult.email
    lastbutton.parentNode.target = '__blank'
  }
} else {
  lastbutton.parentNode.previousElementSibling.remove()
lastbutton.parentNode.remove()
}




        parent.append(cloneTemplate.cloneNode(true))
      } else {
        document.querySelector('title').innerHTML = 'Профиль не существует или закрыт – ' + siteName
        document.querySelector('main').style.justifyContent = 'center'
        document.querySelector('main').innerHTML = `
        <column class="m" style="align-items:center;padding: 20px 20px 20px 0;">
      <icon class='i-notfound' style="font-size:var(--font-xxl);color:var(--gray)"></icon>
        <tag-xs class="button-gray-dark" style="cursor:default">Профиль не существует или закрыт</tag-xs>
        </column>`
      }
    });
}();
