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
    console.log('!!!');
    code = path_url.split('/')[2]
    page_rows = document.querySelector("input[data-id='page_rows_3']").value
    page = document.querySelector("input[data-id='page_3']").value
    renderResult(page_rows, page, code)
  }

  function renderResult(page_rows, page, code) {

    let dataobj = {
      'page_rows': page_rows,
      'page': page,
      'code': code
    }
    decodeObj = {}
    for (const [key, value] of Object.entries(dataobj)) {
      decodeObj[key] = encodeURIComponent(value)
    }
    requestBody = paramObjToQrStr(decodeObj)
    AJAX(requestBody, 'GET', 'result').then(
      result => {
        if (result[0] == 200) {
          resultBody = JSON.parse(result[1])
          console.log(resultBody);

          /*

                    if (Object.keys(resultBody.scored_list).length < document.querySelector('[data-id="page_rows_3"]').value) {
                      document.querySelector('#loadmorebtn3').style.display='none'
                    } else {
                      document.querySelector('#loadmorebtn3').style.display='flex'
                    }

            */
        }
      });
  }

  function loadMore3(that, code) {
    document.querySelector("input[data-id='page_1']").value = parseInt(document.querySelector("input[data-id='page_1']").value) + 1;
    that.classList.add("loading");
    that.style.display = 'flex'

    let dataobj = {
      'page_rows': document.querySelector("input[data-id='page_rows_1']").value,
      'page': document.querySelector("input[data-id='page_1']").value,
      'code': code
    }
    decodeObj = {}
    for (const [key, value] of Object.entries(dataobj)) {
      decodeObj[key] = encodeURIComponent(value)
    }
    requestBody = paramObjToQrStr(decodeObj)
    AJAX(requestBody, 'GET', 'result').then(
      result => {
        let loadmoreBody = JSON.parse(result[1])
        if (result[0] == 200 && loadmoreBody.responses != '[]') {
          that.classList.remove("loading");
          renderResponses(loadmoreBody.responses, 'columncard')
          if (Object.keys(loadmoreBody.responses).length < document.querySelector('[data-id="page_rows_3"]').value) {
            that.style.display = 'none'
          } else {
            that.style.display = 'flex'
          }
        } else {
          that.style.display = 'none'
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

  function renderResultMain(demand, demand_id, demand_list, code) {

    let cloneTemplateGlobal = tmplBody.content.cloneNode(true)
    let parent = document.querySelector('rightpanel')
    cloneTemplateGlobal.querySelector("p").textContent = demand;
    cloneTemplateGlobal.querySelector('#loadmorebtn3').setAttribute('onclick', 'loadMore3(this, "' + code + '")')
    parent.innerHTML = ''
    parent.append(cloneTemplateGlobal.cloneNode(true))
  }

  function renderResultResponses(responses) {
    if (JSON.stringify(responses) == '[]') {
      document.querySelector("#" + target).innerHTML = `
          <column class="m" style="align-items:center;margin: var(--len-m) auto var(--len-m) auto">
            <icon class='i-tray' style="font-size:var(--font-xxl);color:var(--gray)"></icon>
            <tag-xs class="button-gray-dark" style="cursor:default">Новых откликов нет</tag-xs>
          </column>`;
    } else {
      let cloneTemplateGlobal = tmplResponses.content.cloneNode(true)
      let parent = document.querySelector("#" + target)
      parent.append(cloneTemplate.cloneNode(true))
    }
  }


}
