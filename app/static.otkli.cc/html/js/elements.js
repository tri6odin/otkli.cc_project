function emailChangeTrigger(that) {
  if (that.value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(that.value)) {
    that.parentNode.classList.add("data-valid")
    that.setAttribute('data-valid', 'true')
  } else {
    that.parentNode.classList.remove("data-valid")
    that.setAttribute('data-valid', 'false')
  }
}

function passwordChangeTrigger(that) {
  if (that.value.length > 6) {
    that.parentNode.classList.add("data-valid")
    that.setAttribute('data-valid', 'true')
  } else {
    that.parentNode.classList.remove("data-valid")
    that.setAttribute('data-valid', 'false')
  }
}

function removeErrBord(that) {
  if (that.parentNode.nodeName == "ICO-INPUT") {
    that.parentNode.classList.remove('invalidInp')
  } else if (that.parentNode.nodeName == "LABEL") {
    document.querySelectorAll('input[name="' + that.getAttribute("name") + '"]').forEach(labelar => {
      labelar.parentNode.classList.remove('invalidInp')
    })
  } else if (that.parentNode.nodeName == "SEARCH") {
    that.parentNode.classList.remove('invalidInp')
  } else {
    that.classList.remove('invalidInp')
  }
}
//banner
(function banner() {


  let carousel = document.querySelector('banner');
  let indicator = document.querySelector('banner-indicator');
  let elements = document.querySelectorAll('banner > hero');
  let currentIndex = 0;

  function renderIndicator() {
    indicator.innerHTML = '';
    for (let i = 0; i < elements.length; i++) {
      let button = document.createElement('icon');
      button.className = (i === currentIndex ? 'i-dots-2' : 'i-dots');

      (function(i) {
        button.onclick = function() {
          elements[i].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center"
          });
        }
      })(i);
      indicator.appendChild(button);
    }
  }

  let observer = new IntersectionObserver(function(entries, observer) {
    let activated = entries.reduce(function(max, entry) {
      return (entry.intersectionRatio > max.intersectionRatio) ? entry : max;
    });
    if (activated.intersectionRatio > 0) {
      currentIndex = elementIndices[activated.target.getAttribute("id")];
      renderIndicator();
    }
  }, {
    root: carousel,
    threshold: 0.7
  });
  let elementIndices = {};
  for (let i = 0; i < elements.length; i++) {
    elementIndices[elements[i].getAttribute("id")] = i;
    observer.observe(elements[i]);
  }
})();


//collapsible
if (document.querySelectorAll(".collapsible")) {
  document.querySelectorAll(".collapsible").forEach(txtar => {
    txtar.addEventListener("click", function() {
      let content = this.nextElementSibling;
      if (content.style.maxHeight || content.style.minHeight ) {
      //  txtar.style.marginBottom = "0px";
        content.style.maxHeight = null;
        content.style.minHeight = null;
      } else {
      //  txtar.style.marginBottom = "10px";
        content.style.minHeight = content.scrollHeight + "px";
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
}




let observer = new MutationObserver(mutationRecords => {

  //navigation visibility (top/bottom)
  if (document.querySelector("bottom-nav")) {


  let mediaQuery = window.matchMedia('(max-width: 780px)')
  function handleTabletChange(e) {
    if (document.querySelector("header")) {
      headerheight = document.querySelector("top-nav").clientHeight
    } else {
      headerheight = -100
    }
    if (e.matches) {
      if (headerheight == -100) {
        document.querySelector("bottom-nav").style.display = "flex"
      }
      window.addEventListener("scroll", function() {
        if ((this.pageYOffset > headerheight) & (this.pageYOffset < (document.body.scrollHeight - window.screen.height))) {
          document.querySelector("bottom-nav").style.display = "flex"
        } else {
          document.querySelector("bottom-nav").style.display = "none"
        }
      })
    } else {
      document.querySelector("bottom-nav").style.display = "none"
    }
  }
  mediaQuery.addListener(handleTabletChange)
  handleTabletChange(mediaQuery)

}
  // textarea autosize
  if (document.querySelector('textarea')) {
    let lim_height = 800;
    // select all textarea
    document.querySelectorAll('textarea').forEach(txtar => {
      // set max leght
      let lim_symbol = txtar.maxLength;
      let textareAdd = txtar.nextElementSibling

      let textareAddchild
      if (textareAdd && textareAdd.querySelector('icon')) {

        textareAddchild = textareAdd.querySelector('icon').cloneNode()

      }

      txtar.setAttribute('style', 'min-height:82px;height:' + (txtar.scrollHeight) + 'px;');
      // capture textarea keydown
      txtar.oninput = (e) => {
        txtar.style.height = "";
        //set textarea height
        txtar.style.height = Math.min(txtar.scrollHeight, lim_height) + "px";
        textEntered = txtar.value;
        //set span with counter

        if (textEntered.length < 50) {

          if (textareAdd.querySelector('*') != textareAddchild) {
            textareAdd.innerHTML = ''
            textareAdd.append(textareAddchild)
          } else {
            textareAdd.innerHTML = ''
          }
        } else {
          textareAdd.innerHTML = (lim_symbol - (textEntered.length));
          if (textEntered.length < lim_symbol - 100) {
            textareAdd.style.cssText = 'display:flex; color: var(--gray); font-weight:300'
          } else {
            textareAdd.style.cssText = "display:flex; color: var(--red-color); font-weight:600"
          }
        }

        //set style of span

      }
    })
  }
  //remove error border


  //validate default inputs
  document.querySelectorAll('input[type=text],input[type=digit],textarea').forEach(item => {
    item.addEventListener("input", function(event) {
      removeErrBord(event.target)
      event.target.setAttribute('data-valid', 'true')
    })
  });



  //checkbox fill
  function checkboxFill(item) {
    if (item.nextElementSibling.querySelector('icon') && item.nextElementSibling.querySelector('icon').className.includes('like')) {
      let icon = item.nextElementSibling.querySelector('icon')
      if (item.checked) {
        icon.className = icon.className.replace('e-l', 'e')
        document.querySelectorAll('input[type=radio][name=' + item.name + ']').forEach(item2 => {
          console.log(item2);
          let icon2 = item2.nextElementSibling.querySelector('icon')
          if (!item2.checked && !icon2.className.includes('e-l')) {
            icon2.className = icon2.className + '-l'
          }
        })
      }
    }
  }
  //validate reqr checkbox
  document.querySelectorAll('input[type=radio]').forEach(item => {
    checkboxFill(item)

    item.addEventListener("change", function(event) {
      checkboxFill(item)
      removeErrBord(event.target)
    })
  });

  //validate phone
  if (document.querySelector('input[type=tel]')) {
    document.querySelectorAll('input[type=tel]').forEach(item => {
      item.addEventListener('input', function(event) {
        removeErrBord(event.target)
        if (/(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]‌​)\s*)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)([2-9]1[02-9]‌​|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})\s*(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+)\s*)?$/i.test(event.target.value)) {
          event.target.parentNode.classList.add("data-valid")
          event.target.setAttribute('data-valid', 'true')
        } else {
          event.target.parentNode.classList.remove("data-valid")
          event.target.setAttribute('data-valid', 'false')
        }
      })
    });
  }


  //validate email
  if (document.querySelector('input[type=email]')) {
    document.querySelectorAll('input[type=email]').forEach(item => {
      item.addEventListener("input", function(event) {
        removeErrBord(event.target)
        emailChangeTrigger(event.target);
      })
    });
  }


  //validate password (one pass)
  if (document.querySelector('input[type=password]')) {
    document.querySelectorAll('input[type=password]').forEach(item => {
      item.addEventListener("input", function(event) {
        removeErrBord(event.target)
        passwordChangeTrigger(event.target);
      })
    });
  }


  //validate password (two pass)
  if (document.querySelector('.same_pass')) {
    let passwordInput = document.querySelectorAll('.same_pass>ico-input>input')
    passwordInput[0].addEventListener('input', function(event) {
      removeErrBord(passwordInput[0])
      if (passwordInput[0].value == passwordInput[1].value && passwordInput[0].value.length != 0) {
        passwordInput[1].parentNode.classList.add("data-valid")
      } else {
        passwordInput[0].parentNode.classList.remove("data-valid")
        passwordInput[1].parentNode.classList.remove("data-valid")
        passwordInput[1].setAttribute('data-valid', 'false')
      }
      if (passwordInput[0].value.length > 6) {
        event.target.parentNode.classList.add("data-valid")
      } else {
        event.target.parentNode.classList.remove("data-valid")
      }
    })
    passwordInput[1].addEventListener('input', function(event) {
      removeErrBord(passwordInput[1])
      if (passwordInput[0].value == passwordInput[1].value && passwordInput[0].value.length != 0) {
        passwordInput[1].parentNode.classList.add("data-valid");
        passwordInput[1].setAttribute('data-valid', 'true')
      } else {
        passwordInput[1].parentNode.classList.remove("data-valid");
        passwordInput[1].setAttribute('data-valid', 'false')
      }
    })
  }


  //double input (first key => second value)
  if (document.querySelector('.double_input')) {
    document.querySelectorAll('.double_input').forEach(DBLar => {
      let double_input = DBLar.querySelectorAll('.double_input>input')

      double_input[0].addEventListener('input', function(event) {
        double_input[1].setAttribute('data-id', event.target.value)
        double_input[0].setAttribute('data-valid', false)
        double_input[1].setAttribute('data-valid', true)
      })

      double_input[0].onkeydown = function(e) {
        if (e.keyCode == 8 && double_input[1].value == "" && double_input[0].value == "" && DBLar.previousElementSibling) {
          DBLar.remove()
        }
      }
      double_input[1].onkeydown = function(e) {
        double_input[1].setAttribute('data-id', double_input[0].value)
      }
    })
  }


  //demands & terms patch
  if (document.querySelector('.demands>textarea-parent>textarea') || document.querySelector('.terms>textarea-parent>textarea')) {
    document.querySelectorAll('.demands>textarea-parent>textarea,.terms>textarea-parent>textarea').forEach(arr => {
      arr.onkeyup = function(e) {
        if (arr.getAttribute('data-id') == '') {
          let number;
          do {
            number = Math.floor(Math.random() * 999);
          } while (number < 100);
          arr.setAttribute('data-id', number)
        }
      }

      arr.onkeydown = function(e) {
        if (e.keyCode == 8 && arr.value == "" && arr.parentNode.previousElementSibling) {
          arr.parentNode.remove()
        }
      }

    })
  }

  (function searchOnkeyup() {
    let search_array = document.querySelectorAll('search');
    for (let search_element of search_array) {
      if (search_element.querySelector('input').getAttribute('data-target')) {
        search_element.querySelector('input').setAttribute('data-donttouchtarget', 'true')
      }

      search_element.querySelector('input').onkeyup = function(e) {
        e.target.parentNode.scrollLeft = e.target.parentNode.scrollWidth;
        if (e.target.value.length != 0) {
          if (!e.target.getAttribute('data-donttouchtarget')) {
            e.target.setAttribute("data-target", e.target.parentNode.getAttribute("data-target"));
          }
          e.target.setAttribute("data-valid", "true");
        } else {
          if (!e.target.getAttribute('data-donttouchtarget')) {
            e.target.setAttribute("data-target", "");
          }
          e.target.setAttribute("data-valid", "");
        }
        if (e.target.getAttribute('data-autocomplete') == 'true') {
          autocomplete(e.target)
        }

      }
    }
  })();



});
observer.observe(main, {
  childList: true,
  subtree: true,
});
