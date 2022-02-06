let authform=`
<closebutton onclick="closeOverlay();">
  <icon class="i-close"></icon>
</closebutton>
<auth>
  <input type="text" data-target="auth" data-id="type" data-valid="true" style="display:none" value="auth">
  <input type="text" data-target="auth" data-id="utype" data-valid="true" style="display:none" value="HR">
  <column class="m">
      <column class="xs">
        <h1 style="text-align:left">
          Вход
        </h1>
        <smalltext>
          <tag-xxs class="button-gray-dark" tabindex="0" onclick="authToReg(this.parentNode.parentNode);">
            <icon class="i-key"></icon>
            <p>Или пройти регистрацию</p>
          </tag-xxs>
        </smalltext>
        </column>
        <column class="xs">
        <ico-input class="i-dog">
          <input type="email" name="email" placeholder="Ваша почта" data-target="auth"  data-id="email" autocomplete="email" >
        </ico-input>
        <ico-input class="i-key">
          <input type="password" name="password" placeholder="Пароль" data-target="auth" data-id="password" autocomplete="password">
        </ico-input>
        </column>
        <row class="xs fullwidth">
          <tag-l class="button-purp-contrast" tabindex="0" onclick="logIn();">
            <p>Войти</p>
          </tag-l>
          <div id="googleauth"style="
            min-width: 50px;
            border-radius: var(--border-radius-sqr)!important;
            background-color: var(--purp);
            cursor:pointer;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            ">
          </div>
        </row>
      <smalltext style="text-align:left;line-height:18px">
      <p style="font-weight: var(--regular); font-size: 12px; line-height:12px;">Авторизуясь, вы соглашаетесь с </p><a style="font-weight: var(--regular); font-size: 12px; line-height:12px;" href="`+static_url+`pdf/terms.pdf" target="_blank" rel="noopener">правилами пользования сайтом</a> <p style="font-weight: var(--regular); font-size: 12px; line-height:12px;">и даете согласие на </p><a style="font-weight: var(--regular); font-size: 12px; line-height:12px;" href="`+static_url+`pdf/privacy.pdf"  target="_blank" rel="noopener">обработку персональных данных</a>
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
</restore>


<tovacancy style="overflow: scroll;max-height: 100%;justify-content: flex-start;align-items: flex-start;margin-top:20px;margin-bottom:20px">
  <column class="m">

</column>
</tovacancy>



`

document.querySelector('overlay').insertAdjacentHTML('beforeend', authform);
