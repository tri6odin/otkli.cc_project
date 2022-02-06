function logIn() {
  SEND('auth', 'GET', 'auth').then(
    result => {
      //200 - auth, 201 - googleauthreg
      if (result[0] == 200) {
        console.log();

        if (JSON.parse(result[1]).utype.toLowerCase() == 'cus' && subdomain=='otkli') {
          localStorage.setItem('userData', result[1]);
          location.href = path_url
        } else if (JSON.parse(result[1]).utype.toLowerCase() == subdomain) {
          localStorage.setItem('userData', result[1]);
          location.href = path_url
        } else {
            popup('Вы ввели логин и пароль от другого подсайта', 'i-close', 'red')
        }

      } else if (result[0] == 201 || result[0] == 202) {
        popup('Письмо отправлено', 'i-ok', 'purp')
      } else {
        switch (result[0]) {
          case 401:
            if (JSON.parse(result[1]).detail == 'не верный логин пароль не ок') {
              popup('Неверный логин или пароль', 'i-close', 'red')
            } else {
              popup('Ошибка аутентификации', 'i-close', 'red')
            }
            break;
          case 406:
              popup('Вам необходимо зарегистрироваться', 'i-close', 'red')
            break;
          case 409:
              popup('Такой пользователь уже существует', 'i-close', 'red')
            break;
          case 425:
              popup('Простите пожалуйста, но вы забанены', 'i-close', 'red')
            break;
          default:
            popup('¯&#92;_(ツ)_/¯', 'i-close', 'red')
        }
      }
    });
}

function logOut() {
  localStorage.removeItem('userData');
  location.href = main_url
}

function restorePass() {
  delete param_url_obj.overlay;
  AJAX(paramObjToJSON(Object.assign(crawlParamObj('restore'), param_url_obj)), 'PUT', 'auth').then(
    result => {
      if (result[0] == 200) {
        location.href = path_url + '?overlay=auth'
      } else {
        switch (result[0]) {
          case 400:
              popup('Короткий пароль', 'i-close', 'red')
            break;
          case 404:
              popup('Пользователь не найден', 'i-close', 'red')
            break;
          case 406:
              popup('Вам необходимо зарегистрироваться', 'i-close', 'red')
            break;
          case 425:
              popup('Простите пожалуйста, но вы забанены', 'i-close', 'red')
            break;
          default:
            popup('¯&#92;_(ツ)_/¯', 'i-close', 'red')
        }

      }
    });

}

function regIn(){
  document.querySelector('auth').querySelector('smalltext>tag-xxs').click()
  openOverlay('auth');
}
//do something with query string after full page load
document.addEventListener('DOMContentLoaded', function() {
  //after click register mail
  if (param_url_obj.action == 'reg') {
    delete param_url_obj.action;
    AJAX(paramObjToJSON(param_url_obj), 'POST', 'auth').then(
      result => {
        if (result[0] == 200) {
          localStorage.setItem('userData', result[1]);
          location.href = path_url
          popup('Успешная атуентификация', 'i-ok', 'purp')
        } else {
          location.href = path_url
          popup('Ошибка регистрации', 'i-close', 'red')
        }
        window.history.replaceState(null, null, window.location.pathname);
      });
  }

}, false);

function authToReg(that) {
  document.querySelector('#googleauth').style.display = "flex";
  that.parentNode.parentNode.querySelector('input[type="text"]').value = 'reg';
  that.parentNode.querySelector('h1').innerHTML = 'Регистрация';
  that.parentNode.querySelector('smalltext').innerHTML = '<tag-xxs class="button-gray-dark" tabindex="0" onclick="regToAuth(this.parentNode.parentNode);"><icon class="i-key"></icon><p>Войти, если уже зарегистрированы</p></tag-xxs>';
  that.parentNode.querySelector('tag-l>p').innerHTML = 'Зарегистрироваться';
  that.parentNode.querySelector('ico-input>input[type="password"]').parentNode.style.display = 'flex';
  that.parentNode.querySelector('ico-input>input[type="password"]').setAttribute('autocomplete', 'new-password');
  that.parentNode.querySelector('smalltext').style.display = 'inline';
  that.parentNode.querySelector('column>tag-xs>p').innerHTML = "Забыли пароль?"
  that.parentNode.querySelector('column>tag-xs').setAttribute('onclick', 'forgotPass(this);');
}

function regToAuth(that) {
  document.querySelector('#googleauth').style.display = "flex";
  that.parentNode.parentNode.querySelector('input[type="text"]').value = 'auth';
  that.parentNode.querySelector('h1').innerHTML = 'Вход';
  that.parentNode.querySelector('smalltext').innerHTML = '<tag-xxs class="button-gray-dark" tabindex="0" onclick="authToReg(this.parentNode.parentNode);"><icon class="i-key"></icon><p>Или пройти регистрацию</p></tag-xxs>';
  that.parentNode.querySelector('tag-l>p').innerHTML = 'Войти';
  that.parentNode.querySelector('ico-input>input[type="password"]').parentNode.style.display = 'flex';
  that.parentNode.querySelector('ico-input>input[type="password"]').setAttribute('autocomplete', 'password');
  that.parentNode.querySelector('smalltext').style.display = 'inline';
  that.parentNode.querySelector('column>tag-xs>p').innerHTML = "Забыли пароль?"
  that.parentNode.querySelector('column>tag-xs').setAttribute('onclick', 'forgotPass(this);');
}

function forgotPass(that) {
  that.parentNode.parentNode.querySelector('input[type="text"]').value = 'restore';
  document.querySelector('#googleauth').style.display = "none";
  that.parentNode.querySelector('ico-input>input[type="password"]').parentNode.style.display = 'none';
  that.parentNode.querySelector('ico-input>input[type="password"]').value = '';
  that.parentNode.querySelector('h1').innerHTML = 'Восстановить пароль';
  that.parentNode.querySelector('smalltext').style.display = 'none';
  that.parentNode.querySelector('tag-l>p').innerHTML = 'Восстановить';
  that.querySelector('p').innerHTML = "Войти или зарегистрироваться";
  that.setAttribute('onclick', 'authToReg(this);');
}

if (document.querySelector('footer')) {
  document.querySelector('footer').innerHTML=`
  <inline class="m" style="text-align:center;width:100%;">
    <p style="color:var(--gray-dark);font-size:12px;line-height:12px;display: inline-flex;height: 12px;vertical-align: middle;">Отклик © 2022 - `+new Date().getFullYear()+`</p>
    <vhr style="display: inline-flex;height: 12px;vertical-align: middle;"></vhr>
    <a href="https://static.otkli.cc/pdf/terms.pdf" target="_blank" rel="noopener" style="color:var(--gray-dark);font-size:12px;vertical-align: middle;height: 12px;line-height:12px;font-weight:var(--regular);display: inline-flex;">Правила пользования сайтом</a>
    <vhr style="display: inline-flex;height: 12px;vertical-align: middle;"></vhr>
    <a href="https://static.otkli.cc/pdf/privacy.pdf" target="_blank" rel="noopener" style="color:var(--gray-dark);font-size:12px;vertical-align: middle;height: 12px;line-height:12px;font-weight:var(--regular);display: inline-flex;">Политика обработки персональных данных</a>
    <vhr style="display: inline-flex;height: 12px;vertical-align: middle;"></vhr>
    <a href="mailto:help@otkli.cc" target="_blank" rel="noopener" style="color:var(--gray-dark);font-size:12px;vertical-align: middle;height: 12px;line-height:12px;font-weight:var(--regular);display: inline-flex;">Связаться с нами</a>
  </inline>
  <inline class="m" style="text-align:center;width:100%;">
    <a href="https://airko.org/" alt='Агентство инновационного развития Калужской области' target="_blank" rel="noopener" style="color:var(--gray-dark);font-size:12px;vertical-align: middle;height: 12px;line-height:12px;font-weight:var(--regular);display: inline-flex;">Агентство инновационного развития Калужской области</a>
    <vhr style="display: inline-flex;height: 12px;vertical-align: middle;"></vhr>
    <a href="https://fasie.ru/" alt='Фонд содействия инновациям' target="_blank" rel="noopener" style="color:var(--gray-dark);font-size:12px;vertical-align: middle;height: 12px;line-height:12px;font-weight:var(--regular);display: inline-flex;">Фонд содействия инновациям</a>
  </inline>
  `
}
if (document.querySelector('cookies')) {
  document.querySelector('cookies').innerHTML=`
    <row class="m">
      <p style="font-weight:300;font-size:14px;">
        Мы <b>используем файлы cookie</b> для работы и улучшения всех своих сайтов. <b>И это прекрасно!</b>
      </p>
      <icon style="cursor:pointer" onclick="cookieDeleter(this);" class='i-close'></icon>
    </row>`
}
