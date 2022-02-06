server
{

  root /var/www/hr.otkli.cc/html;
  index index.html;

  server_name hr.otkli.cc;

  access_log off;
  log_not_found off;

  rewrite ^([^.\?]*[^/])$ $1/ permanent;

  client_body_timeout	5s;
  client_header_timeout	5s;

  location /
  {
    try_files $uri $uri/ =404;
  }

  location ~ /\.
  {
    deny all;
  }

  location /company
  {
    try_files $uri $uri /company/index.html?$request_uri;
  }

  location /profile
  {
    try_files $uri $uri /profile/index.html?$request_uri;
  }

  location /vacancy
  {
    try_files $uri $uri /vacancy/index.html?$request_uri;
  }

  location /scoring
  {
    try_files $uri $uri /scoring/index.html?$request_uri;
  }

  location /create/vacancy
  {
    try_files $uri $uri /create/vacancy/index.html?$request_uri;
  }

  location /create/company
  {
    try_files $uri $uri /create/company/index.html?$request_uri;
  }

  location /edit/company
  {
    try_files $uri $uri /edit/company/index.html?$request_uri;
  }

  location /edit/vacancy
  {
    try_files $uri $uri /edit/vacancy/index.html?$request_uri;
  }

  location /edit/profile
  {
    try_files $uri $uri /edit/profile/index.html?$request_uri;
  }


    listen 443 ssl http2; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/otkli.cc/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/otkli.cc/privkey.pem; # managed by Certbot
    ssl_ciphers EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server
{
    if ($host = hr.otkli.cc) {
        return 301 https://$host$request_uri;
    } # managed by Certbot



  server_name hr.otkli.cc;
    listen 80;
    return 404; # managed by Certbot


}
