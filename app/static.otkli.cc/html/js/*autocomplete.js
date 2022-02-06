async function ajaxJson(target,parent) {
  if (!vacancyArray[target]) {
    let url = 'https://static.otkli.cc/js/json/' + target + '.json';
    vacancyArray.join(target);
    vacancyArray[target] = [];

    let response = await fetch(url);

    const reader = response.body.getReader();
    const contentLength = +response.headers.get('Content-Length');
    let receivedLength = 0;
    let chunks = [];
    while (true) {
      const {
        done,
        value
      } = await reader.read();
      if (done) {
        document.getElementById("myBar").style.transition="none";
        document.getElementById("myBar").style.width = "0%"
        break;
      }
      chunks.push(value);
      receivedLength += value.length;
      receivedprcnt = Math.round((receivedLength / contentLength) * 100) + "%";
      document.getElementById("myBar").style.transition = "var(--transition)";
      document.getElementById("myBar").style.width = receivedprcnt
      console.log(`Receieved ${receivedprcnt}`)
    }
    let chunksAll = new Uint8Array(receivedLength); // (4.1)
    let position = 0;
    for (let chunk of chunks) {
      chunksAll.set(chunk, position); // (4.2)
      position += chunk.length;
    }
    return await JSON.parse(new TextDecoder("utf-8").decode(chunksAll));
  } else {return await vacancyArray[target]}
}
let vacancyArray = [];
async function autocomplete(that) {
  let target = that.parentNode.getAttribute("data-target");
  let values = that.value.toUpperCase().split(" ");
  vacancyArray[target] = await ajaxJson(target);

  if (that.value.length > 2) {

    let autocompleteBody = [];


    for (let vacancy of vacancyArray[target]) {
      let autocompleteSuggestion = [];
      let j = 0;
      for (let synArray of vacancy['vacs']) {
        let i = 0
        values.forEach(element => {
          if (synArray['syn'].toUpperCase().indexOf(element) != -1) {
            i++
          }
        })

        if (i == values.length && j < 3) {
          autocompleteSuggestion.val = vacancy['val'];
          autocompleteSuggestion.id = vacancy['id'];
          autocompleteSuggestion.push(synArray['val']);
          j++
        }
        if (i < values.length) {

          if (document.querySelector('dropdown-content[id="' + target + '"]')) {

            let node = document.querySelector('dropdown-content[id="' + target + '"]');
            for (let i = node.childNodes.length - 1; i >= 0; i--) {
              if (node.childNodes[i].tagName == "SPAN") {
                node.removeChild(node.childNodes[i]);
              }
            }
          }
        }
      }

      if (autocompleteSuggestion.length != 0) {
        autocompleteBody.push(autocompleteSuggestion);
      }
    }
//console.log(autocompleteBody);
    if (autocompleteBody.length != 0) {

      let countz = 0;
      let autocompleteText = "";
      for (let autocompleteSuggestion of autocompleteBody) {
        if (countz < 3) {
          let id = autocompleteSuggestion.id;
          let val = autocompleteSuggestion.val;
          autocompleteText += "<span class='dropdown-content-header' onclick='autocompleteTag(this);' tabindex='0' data-id='sub_" + target + "' data-target='" + target + "' data-val='" + val + "'><b>" + val + "</b></span>";
          delete autocompleteSuggestion.id;
          delete autocompleteSuggestion.val;
          for (let autocompleteVacancy of autocompleteSuggestion) {
            autocompleteText += "<span class='dropdown-content-child' onclick='autocompleteTag(this);' tabindex='0' data-id='" + target + "' data-target='" + target + "' data-val='" + autocompleteVacancy + "'>" + autocompleteVacancy + "</span>";
          }
          countz = countz + 1
        }
      }

      if (document.querySelector('dropdown-content[id="' + target + '"]')) {
        document.querySelector('dropdown-content[id="' + target + '"]').insertAdjacentHTML('beforeend', autocompleteText);
      } else {
        document.querySelector("search[data-target='"+target+"']").parentNode.insertAdjacentHTML('beforeend', '<dropdown-content id="' + target + '" ></dropdown-content>');
        document.querySelector('dropdown-content[id="' + target + '"]').insertAdjacentHTML('beforeend', autocompleteText);
      }

    }
    autocompleteBody = [];
  } else {

    // Оч странно но ноде чайлд лист это лайв элемент, поэтому удаление в форич работает некорректно, необходимо использовать удаление в обратном порядке

    if (document.querySelector('dropdown-content[id="' + target + '"]')) {

      let node = document.querySelector('dropdown-content[id="' + target + '"]');
      for (let i = node.childNodes.length - 1; i >= 0; i--) {
        if (node.childNodes[i].tagName == "SPAN") {
          node.removeChild(node.childNodes[i]);
        }
      }
      if (!document.querySelector('dropdown-content[id="' + target + '"]>checkbox-parent')) {
        document.querySelector('dropdown-content[id="' + target + '"]').remove()
      }
    }

  }
  //add enter to click on dropdown item
  document.querySelectorAll('span[data-target="' + target + '"]').forEach(item => {
    item.tabIndex = 0;
    item.addEventListener("keyup", function(event) {
      if (event.keyCode === 13) {
        item.click()
      }
    })
  });
}
//add tag to input
function autocompleteTag(that) {
  target = that.getAttribute("data-target");
  val = that.getAttribute("data-val");
  id = that.getAttribute("data-id");
  addTag(target, val, id);

  if (document.querySelector('dropdown-content[id="' + target + '"]')) {
    let node = document.querySelector('dropdown-content[id="' + target + '"]');
    for (let i = node.childNodes.length - 1; i >= 0; i--) {
      if (node.childNodes[i].tagName == "SPAN") {
        node.removeChild(node.childNodes[i]);
      }
    }
    if (!document.querySelector('dropdown-content[id="' + target + '"]>checkbox-parent')) {
      document.querySelector('dropdown-content[id="' + target + '"]').remove()
    }
  }

}
