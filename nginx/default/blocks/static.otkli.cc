# Cache settings
#proxy_cache_path     	html/static-cache/ levels=1:2 keys_zone=static-cache:100m inactive=24h max_size=100m;
#fastcgi_cache_path		html/static-cache/ levels=1:2 keys_zone=MYAPP:100m inactive=60m;

# Lim request settings
limit_req_zone $binary_remote_addr zone=lim_webp:100m rate=60r/m;
limit_req_zone $binary_remote_addr zone=lim_php:100m rate=10r/m;

# Internal image resizing server.
server
{
  server_name localhost;
  listen 8888;
  root /var/www/static.otkli.cc/html;

  access_log off;
  log_not_found off;
  vhost_traffic_status_bypass_stats on;


  location ~ "^/webp/(?<width>\d+)/(?<image>.+)$"
  {
    alias /var/www/static.otkli.cc/html/webp/$image;

    image_filter resize $width -;
    image_filter_transparency on;
    image_filter_webp_quality 100;
    image_filter_buffer 2M;

    allow 127.0.0.0/8;
    deny all;
  }

  location /
  {
    try_files $uri $uri/ =404;
    expires -1;

    allow 127.0.0.0/8;
    deny all;
  }
}
server
{
  root /var/www/static.otkli.cc/html;
  index index.php;
  server_name static.otkli.cc;

  rewrite ^([^.\?]*[^/])$ $1/ permanent;
  client_body_timeout 5s;
  client_header_timeout 5s;

  access_log off;
  log_not_found off;

  client_max_body_size 15M;

  proxy_ignore_headers Expires;
  proxy_ignore_headers X-Accel-Expires;
  proxy_ignore_headers Cache-Control;
  proxy_ignore_headers Set-Cookie;

  #proxy_cache       				static-cache;
  #proxy_cache_valid 				200 5m;
  #proxy_cache_valid 				any 1m;

  location ~ /\.
  {
    deny all;
  }

  location /
  {
    try_files $uri $uri/ =404;
    expires -1;
  }

  location ~* \.(?:css|js|json)$
  {
    proxy_pass http://localhost:8888/$request_uri;

    add_header Cache-Control "no-cache, public, must-revalidate, proxy-revalidate";
    add_header X-Cache-Status $upstream_cache_status;
    add_header 'Access-Control-Allow-Origin' '*';
  }

  location ~* \.(?:woff2|svg)
  {
    proxy_pass http://localhost:8888/$request_uri;

    types
    {
      font/x-woff woff2
    }
    types
    {
      image/svg+xml svg
    }

    expires 5m;

    add_header Cache-Control "public";
    add_header X-Cache-Status $upstream_cache_status;
    add_header 'Access-Control-Allow-Origin' '*';
  }

  #Pass requests to your resizing server
  location ~ "^/webp/(?<width>(76|120|1080))/(?<image>.+)$"
  {
    #limit_req         zone=lim_webp burst=50 nodelay;

    proxy_pass http://localhost:8888/webp/$width/$image;

    expires 5m;

    add_header Cache-Control "public";
    add_header X-Cache-Status $upstream_cache_status;
    add_header 'Access-Control-Allow-Origin' '*';
  }

  #I got this from one of the tutorials, apparently it helps avoid the error
  #no resolver defined to resolve localhost
  location /webp
  {
    proxy_pass http://localhost:8888/;
  }

  location ~ \.php$
  {
    limit_req zone=lim_php burst=10;

    #fastcgi_cache 		MYAPP;
    #fastcgi_cache_valid 200 60m;
    #proxy_cache_methods POST;

    include snippets/fastcgi-php.conf;
    fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
    fastcgi_param SCRIPT_FILENAME $document_root/index.php;

    add_header 'Access-Control-Allow-Origin' "$http_origin" always;
  }
  
  listen 443 ssl http2; # managed by Certbot
  ssl_certificate /etc/letsencrypt/live/static.otkli.cc/fullchain.pem; # managed by Certbot
  ssl_certificate_key /etc/letsencrypt/live/static.otkli.cc/privkey.pem; # managed by Certbot
  ssl_ciphers EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
  ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}
server
{
  if ($host = static.otkli.cc)
  {
    return 301 https://$host$request_uri;
    } # managed by Certbo
  }
  # managed by Certbot

  server_name static.otkli.cc;
  listen 80;
  return 404; # managed by Certbot
}
