let urlcode = path_url.split('/')[2]

function renderResponseBlockEdit() {
  responseform.innerHTML = `
      <row class="xs fullwidth">
      <a href="`+main_url+`edit/vacancy/`+urlcode+`/" style="width:100%">
        <tag-l class="button-purp-light first-child" tabindex="0">
          <p>Редактировать</p>
          <icon class="i-edit"></icon>
        </tag-l>
      </row>
`
}
