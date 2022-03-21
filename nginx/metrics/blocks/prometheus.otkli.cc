server {
  #IP of grafana server
  allow 3.70.142.178;
  #IP of VPN
  allow 3.66.126.220;
  deny all;
  server_name prometheus.otkli.cc;
  location /
    {
      proxy_pass http://localhost:9090;
    }

    listen [::]:443 ssl; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/grafana.otkli.cc/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/grafana.otkli.cc/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server {
    if ($host = prometheus.otkli.cc) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


        listen 80;
        listen [::]:80;

        server_name prometheus.otkli.cc;
    return 404; # managed by Certbot


}
