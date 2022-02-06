const urlname = 'otkli.cc';
const siteName = 'Офферфлоу'

const main_url = document.location.origin+'/';
const subdomain =  window.location.host.split('.')[0]
const api_url = 'https://proxy.'+urlname+'/v1.0/';
const static_url = 'https://static.'+urlname+'/';
const param_url_obj = Object.fromEntries(new URLSearchParams(decodeURIComponent(location.search)));
const path_url = document.location.pathname;
const userData = JSON.parse(localStorage.getItem('userData'));
decodeURIComponent

let objresult
