! function renderCompany() {
  if (!localStorage.getItem('user_data')) {
    endpoint = "company/" + path_url.split('/')[2]
    param = "";
  } else {
    endpoint = "company"
    param = 'code=' + path_url.split('/')[2]
    document.querySelector('input[data-id="code"]').value = path_url.split('/')[2]
  }
  AJAX(param, 'GET', endpoint).then(
    result => {
      result = JSON.stringify(JSON.parse(result[1]), null, 2);
      var objresult = JSON.parse(result);
      document.querySelector('pre').innerHTML = result
      for (const [key, value] of Object.entries(objresult['owner_email'])) {
        document.querySelector('input[data-id="owner_email"]').value = key
      }
      for (const [key, value] of Object.entries(objresult['comp_viewer_list'])) {
        if (value === null) {
          name = key
        } else {
          name = value
        }
        addTag('create_comp', key, 'comp_viewer_list', name);
      }

      document.querySelector('input[data-id="name"]').value = objresult['name']
      document.querySelector('textarea[data-id="about"]').value = objresult['about']

      document.querySelector('input[data-id="color"]').value = objresult['color']
      document.querySelector('input[data-id="sec_color"]').value = objresult['sec_color']


      switch (objresult['sub_name']) {
        case "Малый бизнес":
          document.querySelector('input[value="Малый бизнес"][data-id="sub_name"]').checked = true;
          break;
        case "Средний бизнес":
          document.querySelector('input[value="Средний бизнес"][data-id="sub_name"]').checked = true;
          break;
        case "Крупный бизнес":
          document.querySelector('input[value="Крупный бизнес"][data-id="sub_name"]').checked = true;
          break;
      }


    });
}();



if (!localStorage.getItem('user_data')) {
  alert('PLEASE LOG IN');
} else {
  function toNote() {
    document.querySelector("input[data-id='status']").value = 10
    SEND('create_comp', 'PUT', 'company').then(
      result => {
        if (result[0] == 200) {
          alert(result[0] + ':' + result[1])
        } else {
          alert(result[0] + ':' + result[1])
        }
      });
  }

  function toModerate() {
    document.querySelector("input[data-id='status']").value = 20
    SEND('create_comp', 'PUT', 'company').then(
      result => {
        if (result[0] == 200) {
          alert(result[0] + ':' + result[1])
        } else {
          alert(result[0] + ':' + result[1])
        }
      });
  }

  function toModerate1() {
    document.querySelector("input[data-id='status']").value = 30
    SEND('create_comp', 'PUT', 'company').then(
      result => {
        if (result[0] == 200) {
          alert(result[0] + ':' + result[1])
        } else {
          alert(result[0] + ':' + result[1])
        }
      });
  }

  function toModerate2() {
    document.querySelector("input[data-id='status']").value = 40
    SEND('create_comp', 'PUT', 'company').then(
      result => {
        if (result[0] == 200) {
          alert(result[0] + ':' + result[1])
        } else {
          alert(result[0] + ':' + result[1])
        }
      });
  }

  function toModerate3() {
    document.querySelector("input[data-id='status']").value = 50
    SEND('create_comp', 'PUT', 'company').then(
      result => {
        if (result[0] == 200) {
          alert(result[0] + ':' + result[1])
        } else {
          alert(result[0] + ':' + result[1])
        }
      });
  }
}
