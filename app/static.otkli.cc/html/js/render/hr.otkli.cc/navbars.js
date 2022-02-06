

if (userData) {
  if (userData.img) {
    if (userData.img.includes('.webp')) {
      userData.img = userData.img.split('/')
      userData.img.splice(4, 1, '76')
      userData.img = userData.img.join().replace(/,/g, "/");
    } else if (userData.img.includes('.js')) {
      userData.img = static_url+'svg/default-avatars/avatar-' + Math.floor(Math.random() * 10) + '.svg'
    }
  } else {
    userData.img = static_url+'svg/default-avatars/avatar-' + Math.floor(Math.random() * 10) + '.svg'
  }
  document.querySelector('top-nav>div>row[class="xs"]').innerHTML = `
    <a href="` + main_url + `dashboard">
    <tag-m class="button-purp-light">
      <icon class="i-feed"></icon>
      <b>К вакансиям</b>
    </tag-m>
    </a>
    <a href="` + main_url + `edit/profile">
      <tag-m class="button-purp-light hide-m circ-btn">
        <icon class="i-settings"></icon>
      </tag-m></a>
    <a href="` + main_url + 'profile/' + userData.code + `" target="_blank" rel="noopener">
      <img class="small" src="` + userData.img + `" alt="Аватар">
    </a>
`;
} else {
  document.querySelector('top-nav>div>row[class="xs"]').innerHTML = `
  <a href="https://otkli.cc/" target="_blank">
      <tag-m class="button-black-contrast" tabindex="0">
        <p>Соискателю</p>
        <icon class="i-link"></icon>
      </tag-m>
    </a>
      <tag-m class="button-white-contrast" tabindex="0" onclick="openOverlay('auth');">
        <icon class="i-profile"></icon>
        <p class="hide-m">Войти</p>
      </tag-m>
`;
}
