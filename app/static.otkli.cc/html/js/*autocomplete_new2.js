function levenshtein(s1, s2, costs) {
  var i, j, l1, l2, flip, ch, chl, ii, ii2, cost, cutHalf;
  l1 = s1.length;
  l2 = s2.length;

  costs = costs || {};
  var cr = costs.replace || 1;
  var cri = costs.replaceCase || costs.replace || 1;
  var ci = costs.insert || 1;
  var cd = costs.remove || 1;

  cutHalf = flip = Math.max(l1, l2);

  var minCost = Math.min(cd, ci, cr);
  var minD = Math.max(minCost, (l1 - l2) * cd);
  var minI = Math.max(minCost, (l2 - l1) * ci);
  var buf = new Array((cutHalf * 2) - 1);

  for (i = 0; i <= l2; ++i) {
    buf[i] = i * minD;
  }

  for (i = 0; i < l1; ++i, flip = cutHalf - flip) {
    ch = s1[i];
    chl = ch.toLowerCase();

    buf[flip] = (i + 1) * minI;

    ii = flip;
    ii2 = cutHalf - flip;

    for (j = 0; j < l2; ++j, ++ii, ++ii2) {
      cost = (ch === s2[j] ? 0 : (chl === s2[j].toLowerCase()) ? cri : cr);
      buf[ii + 1] = Math.min(buf[ii2 + 1] + cd, buf[ii] + ci, buf[ii2] + cost);
    }
  }
  return buf[l2 + cutHalf - flip];
}
//console.log(levenshtein(values.join(''), value2['syn']));

async function ajaxJson(target, parent) {
  if (!vacancyArray[target]) {
    let url = static_url + 'json/' + target + '.json';
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
        document.getElementById("myBar").style.transition = "none";
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
  } else {
    return await vacancyArray[target]
  }
}
let vacancyArray = [];
async function autocomplete(that) {
  let target = that.parentNode.getAttribute("data-target");
  let values = that.value.toUpperCase().split(" ");
  vacancyArray[target] = await ajaxJson(target);
  //console.log(vacancyArray[target]);

  if (that.value.length > 2) {
    let autocompleteBody = [];
    for (let [key, value] of Object.entries(vacancyArray[target])) {
      let autocompleteSuggestion = [];
      let j = 0;
      for (let [key2, value2] of Object.entries(value)) {
        let i = 0
        //  console.log(values);
        //  console.log(value2['syn']);



        values.forEach(element => {
          if (value2['syn'].toUpperCase().indexOf(element) != -1) {
            i++
          }
        })

        if (i == values.length && j < 3) {
          autocompleteSuggestion.val = key;
          autocompleteSuggestion.id = key;
          autocompleteSuggestion.push(value2['child_val']);
          j++
        }


        if (i < values.length && document.querySelector('dropdown-content[id="' + target + '"]')) {
          console.log(values.length);
          let node = document.querySelector('dropdown-content[id="' + target + '"]');
          for (let i = node.childNodes.length - 1; i >= 0; i--) {
            if (node.childNodes[i].tagName == "SPAN") {
              node.removeChild(node.childNodes[i]);
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
          autocompleteText += "<span class='dropdown-content-header' onclick='autocompleteTag(this);' tabindex='0' data-id='parent_" + target + "' data-type='array' data-target='" + target + "' data-val='" + val + "'><b>" + val + "</b></span>";
          delete autocompleteSuggestion.id;
          delete autocompleteSuggestion.val;
          for (let autocompleteVacancy of autocompleteSuggestion) {
            autocompleteText += "<span class='dropdown-content-child' onclick='autocompleteTag(this);' tabindex='0' data-id='" + target + "' data-type='array' data-target='" + target + "' data-val='" + autocompleteVacancy + "'>" + autocompleteVacancy + "</span>";
          }
          countz = countz + 1
        }
      }

      if (document.querySelector('dropdown-content[id="' + target + '"]')) {
        document.querySelector('dropdown-content[id="' + target + '"]').insertAdjacentHTML('beforeend', autocompleteText);
      } else {
        document.querySelector("search[data-target='" + target + "']").parentNode.insertAdjacentHTML('beforeend', '<dropdown-content id="' + target + '" ></dropdown-content>');
        document.querySelector('dropdown-content[id="' + target + '"]').insertAdjacentHTML('beforeend', autocompleteText);
      }

    }
    autocompleteBody = [];
    if (document.querySelector('dropdown-content[id="' + target + '"]>span')) {
      document.querySelector('dropdown-content[id="' + target + '"]>checkbox-parent').style.display = 'none'
    }

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
    document.querySelector('dropdown-content[id="' + target + '"]>checkbox-parent').style.display = 'inline'

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
  addTag(target, val, id, that.getAttribute("data-type"), undefined, that.getAttribute("data-parent"));




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
