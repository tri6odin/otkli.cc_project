function favSearch() {
  SEND('fav_search_name vacancy sub_vacancy company sub_company geo sub_geo timestamp popular money exp', 'POST', 'feed');
}

//navigation visibility (top/bottom)
const mediaQuery = window.matchMedia('(max-width: 780px)')

function handleTabletChange(e) {
  if (e.matches) {
    window.addEventListener("scroll", function() {
      if (document.querySelector("header")) {
        headerheight = document.querySelector("header").clientHeight
      } else {
        headerheight = 0
      }
      if ((this.pageYOffset > (document.querySelector("top-nav").clientHeight + headerheight)) & (this.pageYOffset < (document.body.scrollHeight - document.querySelector("footer").clientHeight - window.screen
          .height))) {
        document.querySelector("bottom-nav").style.display = "flex"
      } else {
        document.querySelector("bottom-nav").style.display = "none"
      }
    })
  }
}
mediaQuery.addListener(handleTabletChange)
handleTabletChange(mediaQuery)

//bottom navigation Content
if (userData) {
  document.querySelector('bottom-nav').innerHTML = `
  <label>
    <input type="checkbox">
    <tag-l class="checkbox-blue">
      <icon class="i-plus"></icon>
    </tag-l>
  </label>
  <vhr></vhr>
  <label>
    <input type="checkbox">
    <tag-l class="checkbox-blue" onclick="location.href='` + main_url + `feed/'">
      <icon class="i-hr"></icon>
    </tag-l>
  </label>
  <vhr></vhr>
  <label>
    <input type="checkbox">
    <tag-l class="checkbox-blue" onclick="location.href='` + main_url + `edit/profile/'">
      <icon class="i-settings"></icon>
    </tag-l>
  </label>
  `;
  if (path_url == '/') {
    document.querySelector("label>tag-l>icon[class='i-plus']").setAttribute('onclick', "favSearch();")

  } else {
    let buttonnode = document.querySelector("label>tag-l>icon[class='i-plus']")
    buttonnode.className = "i-search"
    buttonnode.removeAttribute('onclick')
    buttonnode.setAttribute('onclick', "location.href='`+ main_url+`'")
  }



  if (path_url.includes('/edit/profile/')) {
    document.querySelector("label>tag-l>icon[class='i-settings']").parentNode.previousElementSibling.checked = "true"
  }
  if (path_url.includes('/feed/')) {
    document.querySelector("label>tag-l>icon[class='i-hr']").parentNode.previousElementSibling.checked = "true"
  }
} else {
  document.querySelector('bottom-nav').innerHTML = `
  <label>
    <tag-l class="checkbox-blue" onclick="openOverlay('justreg');">
      <icon class="i-plus"></icon>
    </tag-l>
  </label>
  <vhr></vhr>
  <label>
    <tag-l class="checkbox-blue" onclick="openOverlay('justreg');">
      <icon class="i-hr"></icon>
    </tag-l>
  </label>
  <vhr></vhr>
  <label>
    <tag-l class="checkbox-blue" onclick="openOverlay('justreg');">
      <icon class="i-settings"></icon>
    </tag-l>
  </label>
  `;
}


if (userData) {
  if (userData['img'] && userData['img'].includes('webp')) {
    userData.img = userData.img.split('/')
    userData.img.splice(4, 1, '76')
    userData.img = userData.img.join().replace(/,/g, "/");
  } else if (userData['img'].includes('.js')) {
    userData.img = static_url+'svg/default-avatars/avatar-' + Math.floor(Math.random() * 10) + '.svg'
  }

  document.querySelector('top-nav>div>row[class="xs"]').innerHTML = `
    <a href="` + main_url + `edit/profile">
    <tag-m class="button-purp-light hide-m circ-btn">
      <icon class="i-settings"></icon>
    </tag-m></a>
</a>
    <a href="` + main_url + 'profile/' + userData.code + `" target="_blank">
      <img class="small" src="` + userData.img + `">
    </a>
`;
} else {
  document.querySelector('top-nav>div>row[class="xs"]').innerHTML = `
      <tag-m class="button-white-contrast" tabindex="0" onclick="openOverlay('auth');">
        <icon class="i-profile"></icon>
        <p class="hide-m">Войти</p>
      </tag-m>
`;
}
