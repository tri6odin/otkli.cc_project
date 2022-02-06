/*



//timestamp value
document.querySelector("input[data-target='timestamp']").value = new Date().toUTCString()


//onload vacancy

function testvac() {







    let tmpl = document.getElementById('vac-template');

    img = tmpl.content.querySelector("img");
    valid = tmpl.content.querySelector("valid");
    companylink = tmpl.content.querySelector("valid>a");
    link = tmpl.content.querySelector("column>a");
    date = tmpl.content.querySelector("column>tag-xxxs>p");
    currency = tmpl.content.querySelectorAll("column>row>tag-xs>icon")[0];
    price = tmpl.content.querySelectorAll("column>row>tag-xs>p")[0];
    term = tmpl.content.querySelectorAll("column>row>smalltext>p")[0];
    busyness = tmpl.content.querySelectorAll("column>row>tag-xs>p")[1];
    geo = tmpl.content.querySelectorAll("column>row>tag-xs>p")[2];
    views = tmpl.content.querySelectorAll("column>row>tag-xs>p")[3];
    moredetails = tmpl.content.querySelector("column>row>tag-l");
    moredetailstext = tmpl.content.querySelector("column>row>tag-l>p");
    moredetailsicon = tmpl.content.querySelector("column>row>tag-l>icon");
    fav = tmpl.content.querySelector("column>row>label");

    valid.className = "valid";

    img.src = "1";
    img.alt = "2";

    link.href = "3";
    link.innerHTML = "<b>4</b>";

    companylink.href = "5";
    date.textContent = "6";

    currency.className = "7";
    price.textContent = "8";
    term.textContent = "9";

    busyness.textContent = "10";
    geo.textContent = "11";
    views.textContent = "12";

    moredetails.setAttribute('onclick', 'window.open(`https://test`,`_blank`);');
    moredetails.className = "";
    moredetailstext.textContent = "";
    moredetailsicon.className = "";

    fav.setAttribute('onclick', 'window.open(`https://test`,`_blank`);');
    fav.style.display = "flex";
    fav.querySelector('input').checked = "true";

    let tb = document.querySelector("grid");
    let clone = document.importNode(tmpl.content, true);
    tb.appendChild(clone);
}

let observer = new IntersectionObserver(function(entries) {
	if(entries[0].isIntersecting === true)
		document.querySelector('.loadanimation').click()
}, { threshold: [0] });
observer.observe(document.querySelector('.loadanimation'));
*/
