if (!userData) {
  openOverlay('auth', 'noclose')
} else {

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

  if (screensize == 'mobile' || window.screen.width < "780") {
    code = path_url.split('/')[2]
    page_rows = document.querySelector("input[data-id='page_rows_1']").value
    page = document.querySelector("input[data-id='page_1']").value
    renderScoring(page_rows, page, code)
  }


  function renderScoring(page_rows, page, code, demand, scored) {

    let dataobj = {
      'page_rows': page_rows,
      'page': page,
      'code': code
    }
    if (demand) {
      dataobj['demand'] = demand
    }
    if (scored) {
      dataobj['scored'] = scored
    } else {
      dataobj['scored'] = false
    }
    decodeObj = {}
    for (const [key, value] of Object.entries(dataobj)) {
      decodeObj[key] = encodeURIComponent(value)
    }
    requestBody = paramObjToQrStr(decodeObj)
    AJAX(requestBody, 'GET', 'scoring').then(
      result => {






        if (result[0] == 200) {
          demandBody = JSON.parse(result[1])
          document.querySelector("input[data-id='demand']").value = demandBody.demand
          renderScoringMain(demandBody.demand_content, demandBody.demand, demandBody.demands, code)
          renderResponses(demandBody.responses, 'columncard')
          if (Object.keys(demandBody.responses).length < document.querySelector('[data-id="page_rows_2"]').value) {
            document.querySelector('#loadmorebtn1').style.display='none'
          } else {
            document.querySelector('#loadmorebtn1').style.display='flex'
          }
        }






      });
  }

  function loadMore1(that, code) {
    document.querySelector("input[data-id='page_1']").value = parseInt(document.querySelector("input[data-id='page_1']").value) + 1;
    that.classList.add("loading");
    that.style.display = 'flex'

    let dataobj = {
      'page_rows': document.querySelector("input[data-id='page_rows_1']").value,
      'page': document.querySelector("input[data-id='page_1']").value,
      'demand': document.querySelector("input[data-id='demand']").value,
      'code': code,
      'scored': false
    }
    decodeObj = {}
    for (const [key, value] of Object.entries(dataobj)) {
      decodeObj[key] = encodeURIComponent(value)
    }
    requestBody = paramObjToQrStr(decodeObj)
    AJAX(requestBody, 'GET', 'scoring').then(
      result => {
        let loadmoreBody = JSON.parse(result[1])
        if (result[0] == 200 && loadmoreBody.responses != '[]') {
          that.classList.remove("loading");
          renderResponses(loadmoreBody.responses, 'columncard')
          if (Object.keys(loadmoreBody.responses).length < document.querySelector('[data-id="page_rows_1"]').value) {
            that.style.display = 'none'
          } else {
            that.style.display = 'flex'
          }
        } else {
          that.style.display = 'none'
        }
      });
  }

  function loadMore2(that, code) {
    if (document.querySelector("#loadmorebtn2")) {
      loadmorebtn2.remove()
    }

    document.querySelector("input[data-id='page_2']").value = parseInt(document.querySelector("input[data-id='page_2']").value) + 1;
    that.classList.add("loading");
    that.style.display = 'flex'
    columncard_archive.parentNode.style.display="flex"



    let dataobj = {
      'page_rows': document.querySelector("input[data-id='page_rows_2']").value,
      'page': document.querySelector("input[data-id='page_2']").value,
      'demand': document.querySelector("input[data-id='demand']").value,
      'code': code,
      'scored': true
    }
    decodeObj = {}
    for (const [key, value] of Object.entries(dataobj)) {
      decodeObj[key] = encodeURIComponent(value)
    }
    requestBody = paramObjToQrStr(decodeObj)
    AJAX(requestBody, 'GET', 'scoring').then(
      result => {
        let loadmoreBody = JSON.parse(result[1])
        if (result[0] == 200 && loadmoreBody.responses != '[]') {
          that.classList.remove("loading");
document.querySelector("#loadmorebtn2-2").style.display="flex"

          renderResponses(loadmoreBody.responses, 'columncard_archive')
          if (Object.keys(loadmoreBody.responses).length < document.querySelector('[data-id="page_rows_2"]').value) {
            that.style.display = 'none'
            document.querySelector("#loadmorebtn2-2").style.display = 'none'
          } else {
            that.style.display = 'flex'
          }
        } else {
          that.style.display = 'none'
          document.querySelector("#loadmorebtn2-2").style.display = 'none'
        }
      });
  }

  function pagesToNull() {
    document.querySelector("input[data-id='page']").value = '1'
    document.querySelector("input[data-id='page_rows']").value = '12'
    document.querySelector("input[data-id='page_1']").value = '1'
    document.querySelector("input[data-id='page_rows_1']").value = '12'
    document.querySelector("input[data-id='page_2']").value = '0'
    document.querySelector("input[data-id='page_rows_2']").value = '12'
    document.querySelector("input[data-id='page_3']").value = '1'
    document.querySelector("input[data-id='page_rows_3']").value = '12'
  }

  function renderScoringMain(demand, demand_id, demand_list, code) {

    demand_list.forEach((item, i) => {
      if (demand_list.length==1) {
        nextDemand = 'none'
        prevDemand = 'none'
      } else if (item == demand_id && i == '0') {
        let ll = i + 1
        nextDemand = demand_list[ll]
        prevDemand = 'none'
      } else if (item == demand_id && i == demand_list.length-1) {
        let dd = i - 1
        nextDemand = 'none'
        prevDemand = demand_list[dd]
      } else if (item == demand_id) {
        let ll = i + 1
        let dd = i - 1
        nextDemand = demand_list[ll]
        prevDemand = demand_list[dd]
      }
    });

    let cloneTemplateGlobal = tmplBody.content.cloneNode(true)
    let parent = document.querySelector('rightpanel')

    let indicator_demand = cloneTemplateGlobal.querySelector('#indicator_demand')
    let parent_indicator_demand = cloneTemplateGlobal.querySelector('#indicator_demand').parentNode

    cloneTemplateGlobal.querySelector('#indicator_demand').remove()
    demand_list.forEach(item => {
      let style_classname="i-dots"
      if (demand_id == item) {
        style_classname="i-dots-2"
      }
      indicator_demand.className=style_classname
      indicator_demand.setAttribute('onclick', 'pagesToNull();renderScoring("' + document.querySelector("[data-target=page_rows_1]").value + '","' + document.querySelector("[data-target=page_1]").value + '","' + code + '","' + item + '")')
      parent_indicator_demand.append(indicator_demand.cloneNode(true))
    });
      indicator_demand.style.color="var(--purp)"
      indicator_demand.className="i-dots-2"
      indicator_demand.setAttribute('onclick','pagesToNull();renderResult("' + document.querySelector("[data-target=page_rows_3]").value + '","' + document.querySelector("[data-target=page_3]").value + '","' + code + '")')
      parent_indicator_demand.append(indicator_demand.cloneNode(true))







    cloneTemplateGlobal.querySelector("#render_main_text").textContent = demand;
    if (prevDemand == 'none') {
      cloneTemplateGlobal.querySelector('#btnprev').remove()
    } else {
      cloneTemplateGlobal.querySelector('#btnprev').setAttribute('onclick', 'pagesToNull();renderScoring("' + document.querySelector("[data-target=page_rows_1]").value + '","' + document.querySelector("[data-target=page_1]").value + '","' + code + '","' + prevDemand + '")')
    }
    if (nextDemand == 'none') {
      cloneTemplateGlobal.querySelector('#btnprev').style.width="auto"
      cloneTemplateGlobal.querySelector('#btnnext').className="button-purp-contrast"

      cloneTemplateGlobal.querySelector('#btnnext').setAttribute('onclick','pagesToNull();renderResult("' + document.querySelector("[data-target=page_rows_3]").value + '","' + document.querySelector("[data-target=page_3]").value + '","' + code + '")')

      if (cloneTemplateGlobal.querySelector('#btnnext>p')) {
        cloneTemplateGlobal.querySelector('#btnnext>p').textContent="Результат скоринга"
      } else {
        cloneTemplateGlobal.querySelector('#btnnext').insertAdjacentHTML('afterbegin', '<p>Результат скоринга</p>');
      }

    } else {
      cloneTemplateGlobal.querySelector('#btnnext').setAttribute('onclick', 'pagesToNull();renderScoring("' + document.querySelector("[data-target=page_rows_1]").value + '","' + document.querySelector("[data-target=page_1]").value + '","' + code + '","' + nextDemand + '")')
    }


    cloneTemplateGlobal.querySelector('#loadmorebtn1').setAttribute('onclick', 'loadMore1(this, "' + code + '")')
    cloneTemplateGlobal.querySelector('#loadmorebtn2').setAttribute('onclick', 'loadMore2(this, "' + code + '")')
    cloneTemplateGlobal.querySelector('#loadmorebtn2-2').setAttribute('onclick', 'loadMore2(this, "' + code + '")')
    parent.innerHTML = ''
    parent.append(cloneTemplateGlobal.cloneNode(true))
  }

  function renderResponses(responses, target) {



    if (JSON.stringify(responses) == '[]' ) {
      switch (target) {
        case 'columncard':
          document.querySelector("#" + target).insertAdjacentHTML('beforeend',`
          <column class="l" style="align-items:center;padding: var(--len-l);border:1px solid var(--gray-light);border-radius:var(--border-radius-sqr);background-color:white">
          <column class="xs" style="align-items:center;">
            <icon class='i-tray' style="font-size:var(--font-xxl);color:var(--gray)"></icon>
            <tag-xs class="button-gray-dark" style="cursor:default">Новых откликов нет</tag-xs>
          </column>
<hr>
            <smalltext style="text-align:left">
              <p style="font-weight: var(--semibold);">Узнайте как получать </p><a style="font-weight: var(--semibold);" href="a">больше откликов</a>
            </smalltext>
          </column>`)
          break;
        case 'columncard_archive':
          document.querySelector("#" + target).insertAdjacentHTML('beforeend',`
          <column class="m" style="align-items:center;padding: var(--len-l);border:1px solid var(--gray-light);border-radius:var(--border-radius-sqr);">
            <column class="xs" style="align-items:center;">
              <icon class='i-archive' style="font-size:var(--font-xxl);color:var(--gray)"></icon>
              <tag-xs class="button-gray-dark" style="cursor:default">Архивных откликов нет</tag-xs>
            </column>
          </column>`)
          break;
      }
    } else {
    let cloneTemplateGlobal = tmplResponses.content.cloneNode(true)
    let parent = document.querySelector("#" + target)
    parent.style.display="flex"
    for (const [key, value] of Object.entries(responses)) {
      let cloneTemplate = cloneTemplateGlobal.cloneNode(true)
      img = cloneTemplate.querySelector("img");
      /*
      if (value.img_url == undefined || value.img_url == 'null') {
        value.img_url = static_url+'svg/default-avatars/avatar-' + Math.floor(Math.random() * 10) + '.svg'
      } else if (value.img_url.includes(".webp")){
        value.img_url = value.img_url.split('/')
        value.img_url.splice(4, 1, '120')
        value.img_url = value.img_url.join().replace(/,/g, "/");
      }
*/

      if (value.img_url == undefined) {
        value.img_url = static_url+'svg/default-avatars/avatar-' + Math.floor(Math.random() * 10) + '.svg'
      }
      else if (value.img_url.includes('.webp')) {
        value.img_url = value.img_url.split('/')
        value.img_url.splice(4, 1, '120')
        value.img_url = value.img_url.join().replace(/,/g, "/");
      }
      else if (value.img_url.includes('.js')) {
        value.img_url='//'
      }




      img.src = value.img_url
      img.alt = value.name
      profilelink = cloneTemplate.querySelector("a");
      profilelink.href = main_url + 'profile/' + value.profile_code;
      profileName = cloneTemplate.querySelector("b");

      if (!value.last_name && !value.name) {
        fullname='Аноним Анонимович'
      } else if (!value.last_name) {
        fullname = value.name
      } else if (!value.name) {
        fullname = value.last_name
      } else {
        fullname = value.name + " " + value.last_name
      }
      profileName.innerHTML = fullname
      responseContent = cloneTemplate.querySelector("p");
      responseContent.innerHTML = urlify(value.content)
      superlike = cloneTemplate.querySelector(".i-superlike-l").parentNode.previousElementSibling
      like = cloneTemplate.querySelector(".i-like-l").parentNode.previousElementSibling
      dislike = cloneTemplate.querySelector(".i-dislike-l").parentNode.previousElementSibling

      cloneTemplate.querySelectorAll("input[type=radio]").forEach(txtar => {
        txtar.name=value.profile_code
      });

      if (value.grade || value.grade == 0) {

        cloneTemplate.querySelector("column").style.backgroundColor = 'var(--gray-bg)'
        switch (value.grade) {
          case 0:
            dislike.checked = true
            break;
          case 1:
            like.checked = true
            break;
          case 2:
            superlike.checked = true
            break;
        }
      }
      superlike.setAttribute('onclick', 'putScore("' + document.querySelector("input[data-id='demand']").value + '","' + value.profile_code + '","2");');
      like.setAttribute('onclick', 'putScore("' + document.querySelector("input[data-id='demand']").value + '","' + value.profile_code + '","1");');
      dislike.setAttribute('onclick', 'putScore("' + document.querySelector("input[data-id='demand']").value + '","' + value.profile_code + '","0");');

      parent.append(cloneTemplate.cloneNode(true))
    }
  }
  }

  function putScore(dem, code, grade) {
    let dataobj = {
      'demand': dem,
      'profile_code': code,
      'grade': grade
    }
    AJAX(JSON.stringify(dataobj), 'PUT', 'scoring').then(
      result => {
        if (result[0] != 200) {
          popup('Не удалось отскорить отклик', 'i-close', 'red')
        }
      });
  }

}
