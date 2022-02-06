if (!localStorage.getItem('user_data')) {
  alert('PLEASE LOG IN');
} else {
  let user_data = JSON.parse(localStorage.getItem('user_data'));
  AJAX('code=' + user_data['code'], 'GET', 'profile').then(
    result => {
      result = JSON.stringify(JSON.parse(result[1]), null, 2);
      var objresult = JSON.parse(result);
      document.querySelector('pre').innerHTML = result;


      document.querySelector('input[data-id="first_name"]').value = objresult['first_name']
      document.querySelector('input[data-id="last_name"]').value = objresult['last_name']
      document.querySelector('textarea[data-id="about"]').value = objresult['about']
      document.querySelector('input[data-id="email"][data-target="settings"]').value = objresult['email']
      document.querySelector('input[data-id="phone"]').value = objresult['phone']


      switch (objresult['prof_view']) {
        case 0:
          document.querySelector('input[value="0"][data-id="prof_view"]').checked = true;
          break;
        case 10:
          document.querySelector('input[value="10"][data-id="prof_view"]').checked = true;
          break;
        case 20:
          document.querySelector('input[value="20"][data-id="prof_view"]').checked = true;
          break;
      }

      switch (objresult['notifications']) {
        case 0:
          document.querySelector('input[value="0"][data-id="notifications"]').checked = true;
          break;
        case 1:
          document.querySelector('input[value="1"][data-id="notifications"]').checked = true;
          break;
        case 2:
          document.querySelector('input[value="2"][data-id="notifications"]').checked = true;
          break;
        case 3:
          document.querySelector('input[value="3"][data-id="notifications"]').checked = true;
          break;
      }
      switch (objresult['reqr_view']) {
        case true:
          document.querySelector('input[value=true][data-id="reqr_view"]').checked = true;
          break;
        case false:
          document.querySelector('input[value=false][data-id="reqr_view"]').checked = true;
          break;
      }







/*
let tmpl = document.querySelector('input[data-parent="job"]').parentNode
let tb = tmpl.parentNode
let clone = document.importNode(tmpl, true);
tb.insertBefore(clone);*/



















    });

    function saveSettings() {
      SEND('settings', 'PUT', 'profile').then(
        result => {
          if (result[0] == 200) {

          } else {
            alert(result[0] + ':' + result[1])
          }
        });
    }
}
