function crawlParamObj(tagtype) {
  let splits = tagtype.split(' ');
  let send_array = Object.values(document.querySelectorAll("input, textarea"))
  let paramObj = {};
  let tempVal
  let errCount = 0
  document.querySelectorAll('.invalidInp').forEach(item => {
    item.classList.remove('invalidInp')
  });

  for (let invalidInp of send_array) {

    let dtarget2
    if (invalidInp.getAttribute("data-target")) {
      dtarget2 = invalidInp.getAttribute("data-target").split().filter(value => splits.includes(value)).length;
    }
if (dtarget2 > 0) {



    if (invalidInp.getAttribute('data-requared') == "true" && (invalidInp.value.length == 0 || invalidInp.getAttribute('data-valid') == "false" || invalidInp.getAttribute('type') == 'radio')) {
      if (invalidInp.parentNode.nodeName == "ICO-INPUT") {
        invalidInp.parentNode.classList.add('invalidInp')
        errCount += 1
      } else if (invalidInp.parentNode.nodeName == "LABEL") {
        let labelarlenghtInvalid = false
        document.querySelectorAll('input[name=' + invalidInp.getAttribute("name") + ']').forEach(labelar => {
          if (labelar.checked) {
            labelarlenghtInvalid = true
          }
        })
        if (labelarlenghtInvalid == false) {
          invalidInp.parentNode.classList.add('invalidInp')
          errCount += 1
        }
      }



      else if (invalidInp.parentNode.nodeName == "SEARCH") {
        if (invalidInp.parentNode.querySelectorAll('input').length==1) {
          invalidInp.parentNode.classList.add('invalidInp')
          errCount += 1
        }
      }





       else {
        invalidInp.classList.add('invalidInp')
        errCount += 1
      }

      if (errCount == 1) {
        invalidInp.scrollIntoView({
          block: "center",
          behavior: "smooth"
        });
      }
    }
  }
  }
  if (errCount == 0) {
    for (let send_element of send_array) {
      let dtarget
      if (send_element.getAttribute("data-target")) {
        dtarget = send_element.getAttribute("data-target").split().filter(value => splits.includes(value)).length;
      }
      if ((send_element.getAttribute('data-valid') == "true" || (send_element.checked == true && send_element.getAttribute('data-valid') != "false")) && dtarget > 0 && send_element.value.length != 0) {
        id = send_element.getAttribute("data-id");
        val = send_element.value.trim();
        if (send_element.getAttribute("data-type")) {
          switch (send_element.getAttribute("data-type")) {
            case "boolean":
              val = (val === 'true');
              break;
            case "integer":
              val = parseInt(val);
              break;
          }
        }
        if (send_element.getAttribute("data-parent")) {

          parent = send_element.getAttribute("data-parent")


          if (parent in paramObj) {
            if (id in paramObj[parent]) {
              if (!Array.isArray(paramObj[parent][id])) {
                tempVal = paramObj[parent][id];
                paramObj[parent][id] = [];
                paramObj[parent][id].push(tempVal, val)
              } else {
                paramObj[parent][id].push(val)
              }
            } else {
              paramObj[parent][id] = val
            }
          } else {
            paramObj[parent] = {}

            if (send_element.getAttribute("data-type") == 'array') {
              paramObj[parent][id] = []
              paramObj[parent][id].push(val)
            } else {
              paramObj[parent][id] = val
            }

          }
        } else if (id in paramObj) {
          if (!Array.isArray(paramObj[id])) {
            tempVal = paramObj[id];
            paramObj[id] = [];
            paramObj[id].push(tempVal, val)
          } else {
            paramObj[id].push(val)
          }
        } else if (send_element.getAttribute("data-type") == 'array') {
          paramObj[id] = []
          paramObj[id].push(val)
        } else {
          paramObj[id] = val
        }
      }
    }
  } else {
    paramObj = false
  }
  return paramObj

}

function paramObjToJSON(paramObj) {
  return JSON.stringify(paramObj)
}

function paramObjToQrStr(paramObj) {
  return Object.keys(paramObj).map(key => key + '=' + paramObj[key]).join('&')
  //return Object.keys(paramObj).map(key => key + '=' + Array.isArray(paramObj[key]) ? JSON.stringify(paramObj[key]) : paramObj[key]).join('&')
}

function SEND(tagtype, type, endpoint) {
  let crawlParamObjSource = crawlParamObj(tagtype)
  if (crawlParamObjSource != false) {
    let requestBody
    if (type == 'GET') {
      decodeObj = {}
      for (const [key, value] of Object.entries(crawlParamObjSource)) {
        decodeObj[key] = encodeURIComponent(value)
      }
      requestBody = paramObjToQrStr(decodeObj)
      //console.log(paramObjToJSON(crawlParamObj(tagtype)));
    } else {
      objrequest = crawlParamObjSource
      requestBody = paramObjToJSON(objrequestPatch(objrequest));
      deleteFromList('comp_viewer_list,vac_viewer_list,vac_owner_list,education,job,demands,terms,responses,professions,geos', objrequest.code, endpoint);
    }
    return AJAX(requestBody, type, endpoint).then(
      result => {
        return result;
      });
  }
}
