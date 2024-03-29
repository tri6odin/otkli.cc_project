# Default Nginx server 
Nginx server with [VTS](https://github.com/vozlt/nginx-module-vts) (request/response metrics export), [GeoIP](https://github.com/leev/ngx_http_geoip2_module) (detecting countries and cities from which requests come) and [Brotli](https://github.com/google/ngx_brotli) (modern compression algorithm) modules.
Nice little things: TLS1.3, HTTP2, Fail2Ban, hidden Nginx version in response headers for maximum security, and PHP-FPM.

Metrics are collected by [Prometheus](https://github.com/prometheus/prometheus) and visualized by [Grafana](https://github.com/grafana/grafana) – [Metrics server configuration instruction](https://github.com/tri6odin/otkli.cc_project/tree/main/nginx/metrics).
> Endpoint metrics server ([Node exporter](https://github.com/prometheus/node_exporter)) – `status.your_domain/node_metrics`  
> Endpoint metrics Nginx (VTS exporter) – `status.your_domain/status/format/prometheus`


# Table of contents
  * [First steps](#first-steps)
  * [Install dependencies](#install-dependencies)
  * [Postfix](#postfix)
  * [Node Exporter](#node-exporter)
  * [Nginx modules](#nginx-modules)
    + [Brotli](#brotli)
    + [Nginx VTS](#nginx-vts)
    + [GeoIP](#geoip)
  * [Install Nginx](#install-nginx)
    + [RE-Compile Nginx with modules](#re-compile-nginx-with-modules)
    + [Configure Nginx](#configure-nginx)
    + [Edit server blocks](#edit-server-blocks)
    + [SSL](#ssl)
    + [TLS1.3 HTTP2](#tls13-http2)
    + [PHP-FPM](#php-fpm)
    + [Restart nginx](#restart-nginx)
  * [Final checklist](#final-checklist)
    + [Fail2Ban check](#fail2ban-check)
    + [Nginx check](#nginx-check)
    + [SSL renew check](#ssl-renew-check)
    + [PHP-FPM check](#php-fpm-check)
    + [HTTP2 check](#http2-check)
    + [TLS1.3 check](#tls13-check)
    + [Brotli check](#brotli-check)
    + [Node exporter check](#node-exporter-check)
    + [VTS check](#vts-check)
    + [Postfix check](#postfix-check)
## First steps
Go root:
```
sudo su
```
Change host name:
```
hostnamectl set-hostname ___new_name___
```
Install Fail2ban:
```
apt-get update
apt-get install fail2ban
```
Remove Sendmail:
```
apt-get purge sendmail*
```
Install Postfix
```
apt install postfix
```
## Install dependencies
C compiler
```
apt-get install build-essential
```
PCRE & Zlib & OpenSSL
```
apt install -y libpcre3 libpcre3-dev zlib1g zlib1g-dev openssl libssl-dev
```
## Postfix
This configuration sends emails via Amazon SES
```
postconf -e "relayhost = [email-smtp.eu-central-1.amazonaws.com]:587" \
"smtp_sasl_auth_enable = yes" \
"smtp_sasl_security_options = noanonymous" \
"smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd" \
"smtp_use_tls = yes" \
"smtp_tls_security_level = encrypt" \
"smtp_tls_note_starttls_offer = yes"
```
Open conf file `nano /etc/postfix/sasl_passwd` and paste:
```
[email-smtp.eu-central-1.amazonaws.com]:587 AKIARI23VGNCQPP6SFPN:BCP6T0jknGe2txZFHRO39jYx2fnBmfo5u4QfwFuTe/4X
```
After save, create hash, change permission, and add cert:
```
postmap hash:/etc/postfix/sasl_passwd
chown root:root /etc/postfix/sasl_passwd /etc/postfix/sasl_passwd.db
chmod 0600 /etc/postfix/sasl_passwd /etc/postfix/sasl_passwd.db
postconf -e 'smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt'
```
Start Postfix:
```
systemctl start postfix
systemctl reload postfix
systemctl enable postfix
```
## Node Exporter
Add app user:
```
useradd --no-create-home --shell /bin/false node_exporter
```
Find new release here: https://github.com/prometheus/node_exporter/releases
```
cd /tmp
wget https://github.com/prometheus/node_exporter/releases/download/v1.3.1/node_exporter-1.3.1.linux-amd64.tar.gz
tar -xvzf node_exporter-1.3.1.linux-amd64.tar.gz
cp node_exporter-1.3.1.linux-amd64/node_exporter /usr/local/bin/
```
Create service file: `nano /etc/systemd/system/node_exporter.service` and paste:
```
[Unit]
Description=Node Exporter
Wants=network-online.target
After=network-online.target

[Service]
User=node_exporter
Group=node_exporter
ExecStart=/usr/local/bin/node_exporter

[Install]
WantedBy=default.target
```
Start Node Exporter:
```
systemctl daemon-reload
systemctl start node_exporter
systemctl status node_exporter
systemctl enable node_exporter
```
## Nginx modules
### Brotli
Download dynamic module:
```
cd /tmp
git clone https://github.com/google/ngx_brotli --recursive
```
### Nginx VTS
Download dynamic module:
```
cd /tmp
git clone git://github.com/vozlt/nginx-module-vts.git
```
### GeoIP
Installing the geoipupdate package and these dependencies:
```
add-apt-repository ppa:maxmind/ppa
apt update
apt install libmaxminddb0 libmaxminddb-dev mmdb-bin
apt install geoipupdate
```
You need to create an account on the [MaxMind website](https://www.maxmind.com/) which provides these databases. After registering on the site, you can now generate new license key.
Replace `YOUR_ACCOUNT_ID_HERE` and `YOUR_LICENSE_KEY_HERE` in conf file `nano /etc/GeoIP.conf`.
After that, you will be able to update the geoip database:
```
geoipupdate
```
And add CRON update, paste `crontab -e` and paste:
```
geoipupdate
```
Download dynamic module:
```
cd /tmp
git clone https://github.com/leev/ngx_http_geoip2_module.git
```
## Install Nginx
```
apt install nginx
```
### RE-Compile Nginx with modules
```
cd /tmp
wget http://nginx.org/download/nginx-1.18.0.tar.gz
tar zxvf nginx-1.18.0.tar.gz
cd nginx-1.18.0
./configure --add-dynamic-module=/tmp/nginx-module-vts --add-dynamic-module=/tmp/ngx_http_geoip2_module --add-dynamic-module=/tmp/ngx_brotli $(nginx -V) --with-compat
make && make install
```
Move modules
```
cd /usr/local/nginx/modules
mv ngx_http_brotli_filter_module.so /usr/share/nginx/modules
mv ngx_http_brotli_static_module.so /usr/share/nginx/modules
mv ngx_http_geoip2_module.so /usr/share/nginx/modules
mv ngx_http_vhost_traffic_status_module.so /usr/share/nginx/modules
```
### Configure Nginx
Open conf file `nano /etc/nginx/nginx.conf` and paste to root section:
```
load_module modules/ngx_http_brotli_filter_module.so;
load_module modules/ngx_http_brotli_static_module.so;
load_module modules/ngx_http_vhost_traffic_status_module.so;
load_module modules/ngx_http_geoip2_module.so;
```
Paste to http section:
```
# Hide Nginx version from response header
server_tokens off;

# Nginx Vhost Traffic Status
vhost_traffic_status_zone;

# Nginx Vhost GeoIP
geoip2 /usr/share/GeoIP/GeoLite2-Country.mmdb {
    auto_reload 60m;
    $geoip2_metadata_country_build metadata build_epoch;
    $geoip2_data_country_code country iso_code;
    $geoip2_data_country_name country names en;
}
geoip2 /usr/share/GeoIP/GeoLite2-City.mmdb {
    $geoip2_data_city_name country names en;
}

fastcgi_param COUNTRY_CODE $geoip2_data_country_code;
fastcgi_param COUNTRY_NAME $geoip2_data_country_name;

# Nginx Vhost User Agent
map $http_user_agent $filter_user_agent {
  default 'unknown';
  ~iPhone ios;
  ~Android android;
  ~Windows windows;
  ~Macintosh mac;
}

vhost_traffic_status_filter_by_set_key $filter_user_agent agent::*;
vhost_traffic_status_filter_by_set_key $geoip2_data_country_code country::*;
#vhost_traffic_status_filter_by_set_key $status code::$server_name;
#vhost_traffic_status_filter_by_set_key $uri uri::$server_name;
#vhost_traffic_status_filter_by_set_key $vts_2xx_counter 2xx::$server_name;
#vhost_traffic_status_filter_by_set_key $host host::$server_name;

#vhost_traffic_status_limit_traffic in:64G;
#vhost_traffic_status_limit_traffic out:1024G;

#vhost_traffic_status_filter_by_set_key $geoip_country_code country::$server_name;
#vhost_traffic_status_limit_traffic_by_set_key FG@country::$server_name@US out:0;
#vhost_traffic_status_limit_traffic_by_set_key FG@country::$server_name@CN out:0;

#vhost_traffic_status_limit_traffic_by_set_key UG@backend@10.10.10.17:80 in:512G;
#vhost_traffic_status_limit_traffic_by_set_key UG@backend@10.10.10.18:80 in:1024G;

# Nginx Brotli module
brotli_static on;
brotli on;
brotli_comp_level          6;
brotli_types text/plain text/css application/json text/javascript application/javascript image/svg+xml image/x-icon;
```
Restart nginx
```
nginx -t
systemctl restart nginx
```
### Edit server blocks

Remove default server block
```
rm /etc/nginx/sites-available/default
rm /etc/nginx/sites-enabled/default
rm -rf /var/www/html
```
Create new server blocks and add permission
```
mkdir -p /var/www/your_domain/html
chown -R $USER:$USER /var/www/your_domain/html
chmod -R 755 /var/www/your_domain
```
Create server block config for grab metrics `nano /etc/nginx/sites-available/status.your_domain` and paste. Instructions on how to set up a [metrics server](https://github.com/tri6odin/otkli.cc_project/tree/main/nginx/metrics) and [VPN](https://github.com/tri6odin/algo)
```
server
{
  #IP of your metrics server
  allow prometheus.your_domain;
  #IP of your VPN
  allow vpn.your_domain;
  deny all;
  
  server_name status.your_domain;
  
  access_log off;
  error_log off;
  
  location / {
    vhost_traffic_status_bypass_limit on;
    vhost_traffic_status_bypass_stats on;
    vhost_traffic_status_display;
    vhost_traffic_status_display_format html;
  }
  location /node_exporter/
  {
    proxy_pass       http://localhost:9100/metrics;
  }
}
```
>
>Production configurations can be found here: [server blocks of our project](https://github.com/tri6odin/otkli.cc_project/tree/main/nginx/default/blocks)  
>
Create a default `nano /etc/nginx/sites-available/your_domain` and paste:
```
server {
        root /var/www/your_domain/html;
        index index.html index.php;
        server_name your_domain;
        
        location / {
                try_files $uri $uri/ =404;
        }
        location ~ \.php$ {
                include      snippets/fastcgi-php.conf;
                fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
	}
}
```
Create link
```
ln -s /etc/nginx/sites-available/your_domain /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/status.your_domain /etc/nginx/sites-enabled/
```

### SSL
Let's Encrypt SSL for Nginx:
```
apt install certbot python3-certbot-nginx
```
Generate SSL config in block:
```
certbot --nginx -d your_domain -d status.your_domain
certbot renew --dry-run
```
### TLS1.3 HTTP2
Open the configuration file for your domain `nano /etc/nginx/sites-available/your_domain` and add `http2`
```
listen [::]:443 ssl http2 ipv6only=on; 
listen 443 ssl http2; 
```
Locate the line that includes the options-ssl-nginx.conf file and comment it out:
```
#include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
ssl_ciphers EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
```
Repeat this step for each server block.
### PHP-FPM
```
apt install php-fpm
apt-get install php7.4-gd
apt-get install php7.4-curl
systemctl restart php7.4-fpm
```
If php read/write files, u need to take permission
```
chown -R www-data:www-data your_directory
```
Edit filesize `nano /etc/php/7.4/fpm/php.ini` ann press `CTRL + W` for fast search:
```
upload_max_filesize = 10M
post_max_size = 10M
```
### Restart nginx
```
nginx -t
systemctl restart nginx
```

## Final checklist
### Fail2Ban check
```
systemctl restart fail2ban
systemctl status fail2ban
systemctl enable fail2ban
```
### Nginx check
```
nginx -t
systemctl restart nginx
systemctl status nginx
systemctl enable nginx
```
### SSL renew check
```
certbot renew --dry-run
```
### PHP-FPM check
```
systemctl restart php7.4-fpm
systemctl status php7.4-fpm
systemctl enable php7.4-fpm
```
### HTTP2 check
```
curl -I -L https://your_domain
curl -I -L https://status.your_domain
```
### TLS1.3 check
```
openssl s_client -connect your_domain:443 -tls1_3
openssl s_client -connect status.your_domain:443 -tls1_3
```
### Brotli check
```
curl -IL https://your_domain -H "Accept-Encoding: br"
curl -IL https://status.your_domain -H "Accept-Encoding: br"
```
### Node exporter check
```
systemctl restart node_exporter
systemctl status node_exporter
systemctl enable node_exporter
curl https://status.your_domain/node_metricks
```
### VTS check
```
curl https://status.your_domain/status/format/prometheus
```
### Postfix check
Paste `crontab -e` and paste:
```
MAILTO=tri6odin@gmail.com
@reboot echo "System start up"
```
And reboot server:
```
reboot
```
After that you get email from Amazon SES when server veen loaded.





