let authform=`
<closebutton onclick="closeOverlay();">
  <icon class="i-close"></icon>
</closebutton>
<auth>
  <input type="text" data-target="auth" data-id="type" data-valid="true" style="display:none" value="auth">
  <input type="text" data-target="auth" data-id="utype" data-valid="true" style="display:none" value="ADM">
  <column class="m">
      <column class="xs">
        <h1 style="text-align:left">
          Войти
        </h1>
        </column>
        <column class="xs">
        <ico-input class="i-dog">
          <input type="email" name="email" placeholder="Ваша почта" data-target="auth"  data-id="email" autocomplete="email" >
        </ico-input>
        <ico-input class="i-key">
          <input type="password" name="password" placeholder="Пароль" data-target="auth" data-id="password" autocomplete="password">
        </ico-input>
        </column>
        <column class="xs">
        <tag-l class="button-purp-contrast" tabindex="0" onclick="logIn();">
          <p>Войти</p>
        </tag-l>

        <tag-l class="button-blue-contrast" tabindex="0" id="googleauth">
          <p>Войти через Google</p>
          <icon class="i-google"></icon>
        </tag-l>
      </column>
      <smalltext style="text-align:left">
      <p>Авторизуясь, вы соглашаетесь с </p><a href="`+static_url+`pdf/terms.pdf" target="_blank" rel="noopener">правилами пользования сайтом</a> <p>и даете согласие на </p><a href="`+static_url+`pdf/privacy.pdf"  target="_blank" rel="noopener">обработку персональных данных</a>
      </smalltext>


      <tag-xs class="button-black-contrast" tabindex="0" onclick="forgotPass(this);">
        <p>Забыли пароль?</p>
      </tag-xs>

    </column>

</auth>
<restore>
  <column class="m">
    <column class="xs">
      <h1 style="text-align:left">
        Введите новый пароль
      </h1>
    </column>
    <column class="xs">
      <ico-input class="i-key">
        <input type="password" name="password" data-valid="true" placeholder="Пароль" data-target="restore" data-id="password" autocomplete="none">
      </ico-input>
      <tag-l class="button-purp-contrast" tabindex="0" onclick="restorePass();">
        <p>Сохранить</p>
      </tag-l>
    </column>
  </column>
</restore>`

document.querySelector('overlay').insertAdjacentHTML('beforeend', authform);
