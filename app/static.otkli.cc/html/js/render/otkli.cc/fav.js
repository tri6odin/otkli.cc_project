if (userData) {
  SEND('', 'GET', 'fav').then(
    result => {
      if (result[0] == 200) {
        let obj_result = JSON.parse(result[1])
        if (Object.keys(obj_result).length != 0) {
          let grid = document.createElement('grid');
          //let hr = document.createElement('hr');
          grid.setAttribute('id', 'grid_fav')
          //document.querySelector('main').insertAdjacentElement('afterbegin', hr)
          document.querySelector('main').insertAdjacentElement('afterbegin', grid)
          renderFavGrid(obj_result)
        } else {
          document.querySelector('main>smalltext').style.marginTop = '0px'
        }
      } else {
        popup('Не удалось загрузить сохраненные параметры поиска', 'i-close', 'red')
      }
    });


  function renderFavGrid(obj_result) {
    let cloneTemplateFav = tmplFav.content.cloneNode(true)
    let parent = document.querySelector('grid[id=grid_fav]')
    for (const [key, value] of Object.entries(obj_result)) {
      let cloneTemplate = cloneTemplateFav.cloneNode(true)
      body = cloneTemplate.querySelector("column");
      header = cloneTemplate.querySelector("column>row>row>b");
      delbutton = cloneTemplate.querySelector("column>row>row>icon[class=i-delete]");




      header.innerHTML = value.name
      body.setAttribute('id', value.name)
      delbutton.setAttribute('onclick', 'delFav("' + value.name + '")');
      header.setAttribute('onclick', 'goToSearch(\'' + JSON.stringify(value) + '\')')


      parent.append(cloneTemplate.cloneNode(true))
    }
  }
}

function delFav(name) {
  let dataobj = {
    'name': name
  }
  AJAX(JSON.stringify(dataobj), 'DELETE', 'fav').then(
    result => {
      if (result[0] == 200) {
        document.querySelector('column[id="' + name + '"]').remove()
        if (document.querySelector('grid[id=grid_fav]').children.length == 0) {
          document.querySelector('grid[id=grid_fav]').remove()
          document.querySelector('main>smalltext').style.marginTop = '0px'
        }
        popup('Cохраненные параметры поиска удалены', 'i-ok', 'purp')
      } else {
        popup('Не удалось удалить сохраненные параметры поиска', 'i-close', 'red')
      }
    });
}

function goToSearch(param) {
  const searchParams = new URLSearchParams();
  param = JSON.parse(param)
  delete param.name
  delete param.apply_time
  delete param.deadline
  delete param.popular
  console.log(param);
  for (const [key, value] of Object.entries(param)) {
    if (value == null) {
      delete param[key]
    }
  }

  const qs = Object.keys(param)
      .map(key => `${key}=${param[key]}`)
      .join('&');

  window.open(main_url+'?action=autofill&'+encodeURIComponent(qs));
}
