server {
  #IP of VPN
  allow 3.66.126.220;
  deny all;
  server_name grafana.otkli.cc;
  location /
    {
      proxy_pass http://localhost:3000;
    }

    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/grafana.otkli.cc/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/grafana.otkli.cc/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server {
    if ($host = grafana.otkli.cc) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


        listen 80;
        listen [::]:80;

        server_name grafana.otkli.cc;
    return 404; # managed by Certbot


}
