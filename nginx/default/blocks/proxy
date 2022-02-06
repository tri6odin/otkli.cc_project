upstream backend
{
  server api.otkli.cc:8080;
}

# Set cache dir
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=one:100m;

# Set cache key to include identifying components
proxy_cache_key $scheme$proxy_host$request_uri;

# Add cache status to log
log_format cache '$remote_addr - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent" cs=$upstream_cache_status';


server
{
  server_name proxy.otkli.cc;
  access_log off;
  log_not_found off;

  client_body_timeout	5s;
  client_header_timeout	5s;

  add_header X-Cache-Status $upstream_cache_status;
  #add_header       'Access-Control-Allow-Origin' '*';

  proxy_redirect off;
  proxy_set_header Host $host;
  proxy_set_header X-Forwarded-Host $host;
  proxy_set_header X-Forwarded-Server $host;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Real-IP $remote_addr;

  proxy_cache_valid 200 302 1m;
  proxy_cache_valid 404 0m;

  location /
  {
    deny all;
  }
  location ~ /\.
  {
    deny all;
  }
  location /v1.0/auth/
  {
    proxy_pass https://backend;
  }
  location /v1.0/profile/
  {
    proxy_pass https://backend;
  }
  location /v1.0/company/
  {
    proxy_pass https://backend;
  }
  location /v1.0/vacancy/
  {
    proxy_pass https://backend;
  }
  location /v1.0/groups/
  {
    proxy_pass https://backend;
  }
  location /v1.0/scoring/
  {
    proxy_pass https://backend;
  }
  location /v1.0/result/
  {
    proxy_pass https://backend;
  }
  location /v1.0/feed/
  {
    proxy_pass https://backend;
  }
  location /v1.0/fav/
  {
    proxy_pass https://backend;
  }
  location /v1.0/search/
  {
    proxy_ignore_headers X-Accel-Expires Expires Cache-Control;
    proxy_pass https://backend;

    proxy_cache one;
  }
  location ~ /v1.0/vacancy/[^\?]
  {
    proxy_ignore_headers X-Accel-Expires Expires Cache-Control;
    proxy_pass https://backend;

    proxy_cache one;
  }
  location ~ /v1.0/profile/[^\?]
  {
    proxy_ignore_headers X-Accel-Expires Expires Cache-Control;
    proxy_pass https://backend;

    proxy_cache one;
  }
  location ~ /v1.0/company/[^\?]
  {
    proxy_ignore_headers X-Accel-Expires Expires Cache-Control;
    proxy_pass https://backend;

    proxy_cache one;
  }

  listen 443 ssl http2; # managed by Certbot
  ssl_certificate /etc/letsencrypt/live/proxy.otkli.cc/fullchain.pem; # managed by Certbot
  ssl_certificate_key /etc/letsencrypt/live/proxy.otkli.cc/privkey.pem; # managed by Certbot
  ssl_ciphers EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
  ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}
server
{
  if ($host = proxy.otkli.cc)
  {
    return 301 https://$host$request_uri;
    } # managed by Certbo
  }
  # managed by Certbot

  server_name proxy.otkli.cc;
  listen 80;
  return 404; # managed by Certbot
}
