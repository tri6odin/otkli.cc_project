(function autocompleteUnfocus() {
  // get all of dropdowns on page and define active class
  const dropdowns = Array.from(document.querySelectorAll('.dropdown'))
  const dropdownActiveClass = 'dropdown--active'

  // add event listeners to focusin and focusout to our dropdowns
  dropdowns.forEach(dropdown => {
    //  dropdown.addEventListener('click', focusinListener)
    //  dropdown.addEventListener('focusout', focusoutListener)
    //  dropdown.addEventListener('keypress', keypressListener)
    //  dropdown.addEventListener('focusin', focusinScroll)
  })

  function focusinListener(event) {
    event.target.classList.add(dropdownActiveClass);
  }

  function focusinScroll(event) {
    if (event.target.parentNode.tagName != "AUTOCOMPLETE") {
      event.target.parentNode.scrollIntoView({
        block: "center",
        behavior: "smooth"
      });
    }
  }

  function focusoutListener(event) {
    if (!document.activeElement.classList.contains('dropdown')) {
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove(dropdownActiveClass);
      })
    }

  }

  function keypressListener(event) {
    if (event.key === 'Enter') {
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove(dropdownActiveClass);
      })
    }

  }
})();





(function searchOnkeyup() {
  let search_array = document.querySelectorAll('search');
  for (let search_element of search_array) {

    search_element.querySelector('input').onkeyup = function(e) {
      e.target.parentNode.scrollLeft = e.target.parentNode.scrollWidth;
      if (e.target.value.length != 0) {
        e.target.setAttribute("data-target", e.target.parentNode.getAttribute("data-target"));
        e.target.setAttribute("data-valid", "true");
      } else {
        e.target.setAttribute("data-target", "");
        e.target.setAttribute("data-valid", "");
      }
      if (e.target.getAttribute('data-autocomplete') == 'true') {
        autocomplete(e.target)
      }

    }
  }
})();

(function searchOnkeydown() {
  let search_array = document.querySelectorAll('search');
  for (let search_element of search_array) {
    search_element.querySelector('input').onkeydown = function(e) {

      if (e.which === 32 && e.target.selectionStart === 0) {
        return false;
      }



      target = e.target.parentNode.getAttribute("data-target");
      val = e.target.value;
      id = e.target.getAttribute("data-id");

      if (e.keyCode == 13) {
        if (e.target.value) {
          if (e.target.parentNode.nextElementSibling) {
            if (e.target.parentNode.nextElementSibling.childElementCount == 3 || e.target.parentNode.nextElementSibling.childElementCount == 2) {
              val = e.target.parentNode.nextElementSibling.lastChild.getAttribute("data-val");
              id = e.target.parentNode.nextElementSibling.lastChild.getAttribute("data-id");
            }
          }

          addTag(target, val, id, e.target.getAttribute("data-type"), undefined, e.target.getAttribute("data-parent"));


        }
        e.target.value = "";
        e.preventDefault();
      }

      if (e.keyCode == 8) {

        if (e.target.previousElementSibling != null && e.target.value.length == 0) {
          val = e.target.previousElementSibling.innerHTML;
          id = e.target.previousElementSibling.getAttribute("data-id");
          name = e.target.nextElementSibling.value;

          delTag(target, val, id, name);
        }
      }
    }
  }
})();

/*  clean placeholder  */

function cc_placeholder(target) {
  document.querySelector("search[data-target='" + target + "']>input").value = "";
}
/*  checkbox tag  */

function checkboxTag(that, name) {
  console.log(name,that.getAttribute("data-val"));
  target = that.getAttribute("data-target");
  val = that.getAttribute("data-val");
  id = that.getAttribute("data-id");
  if (!name) {
    name = val
  }
  if (that.checked) {
    that.setAttribute('data-valid', 'false')
    addTag(target, val, id, that.getAttribute("data-type"), name, that.getAttribute("data-parent"));
  } else {
    delTag(target, val, id, name);
  }
}

/*  there checkbox*/

function three_checkbox(that) {

  target = that.getAttribute("data-target");
  val = that.getAttribute("data-val");
  id = that.getAttribute("data-id");

  if (that.getAttribute("data-val") == "unchecked") {
    that.setAttribute("data-val", "true");
    that.innerHTML = (that.getAttribute("data-name") + " ↓");
    that.nextElementSibling.setAttribute("data-valid", "true");
    that.nextElementSibling.value = "true";
    that.style.backgroundColor = "var(--purp)";
  } else if (that.getAttribute("data-val") == "true") {
    that.setAttribute("data-val", "false");
    that.innerHTML = (that.getAttribute("data-name") + " ↑");
    that.nextElementSibling.setAttribute("data-valid", "true");
    that.nextElementSibling.value = "false";
  } else if (that.getAttribute("data-val") == "false") {
    that.setAttribute("data-val", "unchecked");
    that.innerHTML = (that.getAttribute("data-name"));
    that.nextElementSibling.setAttribute("data-valid", "");
    that.nextElementSibling.value = "";
    that.style.backgroundColor = "var(--gray)";
  }
}

/*  add tag  */

function addTag(target, val, id, type, name, parent) {
  val = val.trim()
  if (!name) {
    name = val
  }
  let tag = document.createElement('tag-s');


  let hid_close = document.createElement('icon');
  hid_close.className = "i-close"
  hid_close.style.marginLeft = "10px"
  hid_close.style.display = 'none'


  tag.innerHTML = name;
  tag.appendChild(hid_close);
  tag.setAttribute("data-valid", "true");
  tag.className = "button-purp-dark";
  tag.setAttribute("data-target", target);
  tag.tabIndex = 0;
  if (parent) {
    //console.log(parent);
    tag.setAttribute("data-parent", parent);
  }
  if (type) {
    tag.setAttribute("data-type", type);
  }
  if (name) {
    tag.setAttribute("data-val", val);
  }
  tag.addEventListener("keydown", function(e) {
    if (e.keyCode === 8) {
      //name = e.target.nextElementSibling.value;
      delTag(e.target.parentNode.getAttribute("data-target"), tag.innerHTML, tag.getAttribute("data-id"), tag.getAttribute("data-val"))
    }
  });
  hid_close.addEventListener("click", function(e) {
    console.log(tag.getAttribute("data-val"),tag.value,tag.nextElementSibling.value);
    delTag(hid_close.parentNode.parentNode.getAttribute("data-target"), tag.innerHTML, tag.getAttribute("data-id"), tag.getAttribute("data-val"))
    });
  tag.addEventListener("focus", function(e) {
    tag.querySelector('icon').style.display = 'flex'
  });
  tag.addEventListener("blur", function(e) {
    tag.querySelector('icon').style.display = 'none'
  });

  let hid_inp = document.createElement('input');
  hid_inp.setAttribute("data-target", target);
  hid_inp.value = val;
  hid_inp.setAttribute("data-id", id);
  hid_inp.setAttribute("data-valid", "true");
  hid_inp.style.display = "none"
  if (type) {
    hid_inp.setAttribute("data-type", type);
  }
  if (name) {
    hid_inp.setAttribute("data-val", val);
  }
  if (parent) {
    //  console.log(parent);
    hid_inp.setAttribute("data-parent", parent);
  }


  let child = document.querySelector("search[data-target='" + target + "']>input");

  document.querySelector("search[data-target='" + target + "']").insertBefore(tag, child);
  document.querySelector("search[data-target='" + target + "']").classList.remove('invalidInp')
  document.querySelector("search[data-target='" + target + "']").insertBefore(hid_inp, child.nextSibling);

  cc_placeholder(target);

  document.querySelector("search[data-target='" + target + "']").scrollLeft = document.querySelector("search[data-target='" + target + "']").scrollWidth;
}

/*  delete tag  */

function delTag(target, val, id, name) {
  console.log(target, val, id, name);
  /*
    console.log(target);
    console.log(val);
    console.log(id);
    console.log(name);
    */

  let tag_array = document.querySelectorAll("[data-valid='true']");
  for (let tag_element of tag_array) {
    if ((tag_element.value == val || tag_element.innerHTML == val || tag_element.getAttribute("data-val") == name) && tag_element.getAttribute("data-target") == target) {
      tag_element.remove();
    }
  }

  let del_tag_array = document.querySelectorAll("input[type='checkbox']");
  for (let del_tag_element of del_tag_array) {
    if ((del_tag_element.getAttribute("data-val") == val || del_tag_element.getAttribute("data-val") == name) && del_tag_element.getAttribute("data-target") == target) {
      del_tag_element.checked = false;
    }
  }
  cc_placeholder(target);
}
