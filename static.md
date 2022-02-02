# Static server configuration
  * [Node Exporter](#node-exporter)
  * [Nginx modules](#nginx-modules)
    + [Brotli](#brotli)
    + [Nginx VTS](#nginx-vts)
    + [GeoIP](#geoip)
  * [Install dependencies](#install-dependencies)
  * [Install Nginx PHP-FPM](#install-nginx-php-fpm)
    + [RE-Compile Nginx with modules](#re-compile-nginx-with-modules)
  * [Configure Nginx](#configure-nginx)

## Node Exporter
Add app user:
```
useradd --no-create-home --shell /bin/false node_exporter
```
Find new release here: https://github.com/prometheus/node_exporter/releases
```
wget https://github.com/.../node_exporter-0.17.0.linux-amd64.tar.gz
tar -xvzf node_exporter-0.17.0.linux-amd64.tar.gz
cp node_exporter-0.17.0.linux-amd64/node_exporter /usr/local/bin/
```
Create service file:
```
nano /etc/systemd/system/node_exporter.service
```
And paste:
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
cd tmp
git clone https://github.com/google/ngx_brotli --recursive
```
### Nginx VTS
Download dynamic module:
```
cd tmp
git clone git://github.com/vozlt/nginx-module-vts.git
```
### GeoIP
Installing the geoipupdate package and these dependencies:
```
add-apt-repository ppa:maxmind/ppa
apt update
apt install libmaxminddb0 libmaxminddb-dev mmdb-bin
```
You need to create an account on the MaxMind website which provides these databases. After registering on the site, you can now generate new license key.
In the /etc/GeoIP.conf file, you can now replace YOUR_ACCOUNT_ID_HERE and YOUR_LICENSE_KEY_HERE:
```
nano /etc/GeoIP.conf
```
After that, you will be able to update the geoip database:
```
geoipupdate
```
Download dynamic module:
```
cd tmp
git clone https://github.com/leev/ngx_http_geoip2_module.git
```
## Install dependencies
C compiler
```
apt-get install build-essential
```
**MAYBE U CAN USE THIS**
```
apt install -y libpcre3 libpcre3-dev zlib1g zlib1g-dev openssl libssl-dev
```
PCRE **ONLY 8.44**
```
cd tmp
wget https://deac-ams.dl.sourceforge.net/project/pcre/pcre/8.44/pcre-8.44.tar.gz
tar -zxf pcre-8.44.tar.gz
cd pcre-8.44
./configure
make
make install
```
Zlib
```
cd tmp
wget http://zlib.net/zlib-1.2.11.tar.gz
tar -zxf zlib-1.2.11.tar.gz
cd zlib-1.2.11
./configure
make
make install
```
OpenSSL 
```
cd tmp
wget http://www.openssl.org/source/openssl-1.1.1g.tar.gz
tar -zxf openssl-1.1.1g.tar.gz
cd openssl-1.1.1g
./Configure darwin64-x86_64-cc --prefix=/usr
make
make install
```
## Install Nginx PHP-FPM
```
apt install nginx
apt install php-fpm
```
### RE-Compile Nginx with modules
```
cd tmp
wget http://nginx.org/download/nginx-VERSION.tar.gz
tar zxvf nginx-VERSION.tar.gz
cd nginx-VERSION
./configure --add-dynamic-module=/tmp/nginx-module-vts --add-dynamic-module=/tmp/ngx_http_geoip2_module --add-dynamic-module=/tmp/ngx_brotli $(nginx -V) --with-compat
make && make install
```
Move modules
```
mv ngx_http_brotli_filter_module.so /usr/share/nginx/modules
mv ngx_http_brotli_static_module.so /usr/share/nginx/modules
mv ngx_http_geoip2_module.so /usr/share/nginx/modules
mv ngx_http_vhost_traffic_status_module.so /usr/share/nginx/modules
```
## Configure Nginx
Open conf file:
```
nano etc/nginx/nginx.conf
```
Рaste to root section:
```
load_module modules/ngx_http_brotli_filter_module.so;
load_module modules/ngx_http_brotli_static_module.so;
load_module modules/ngx_http_vhost_traffic_status_module.so;
load_module modules/ngx_http_geoip2_module.so;
```
Paste to http section:
```
# Nginx Vhost Traffic Status
vhost_traffic_status_zone;

# Nginx Vhost GeoIP
geoip2 /usr/share/GeoIP/GeoLite2-Country.mmdb {
    auto_reload 60m;
    $geoip2_metadata_country_build metadata build_epoch;
    $geoip2_data_country_code country iso_code;
    $geoip2_data_country_name country names en;
}

fastcgi_param COUNTRY_CODE $geoip2_data_country_code;
fastcgi_param COUNTRY_NAME $geoip2_data_country_name;

# Nginx Vhost User Agent
map $http_user_agent $filter_user_agent {
  default 'unknown';
  ~iPhone ios;
  ~Android android;
  ~(MSIE|Mozilla) windows;
}

vhost_traffic_status_filter_by_set_key $filter_user_agent agent::*;
vhost_traffic_status_filter_by_set_key $geoip2_data_country_code country::*;
#vhost_traffic_status_filter_by_set_key $status code::$server_name;
#vhost_traffic_status_filter_by_set_key $uri uri::$server_name;
#vhost_traffic_status_filter_by_set_key $vts_2xx_counter 2xx::$server_name;
#vhost_traffic_status_filter_by_set_key $host host::$server_name;

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
## SSl
Let's Encrypt SSL for Nginx:
```
apt install certbot python3-certbot-nginx
```
Generate SSL config in block:
```
certbot --nginx -d example.com
certbot renew --dry-run
```
### TLS1.3 HTTP2
Open the configuration file for your domain:
```
nano /etc/nginx/sites-available/your_domain
```
And add **http2**
```
listen [::]:443 ssl http2 ipv6only=on; 
listen 443 ssl http2; 
```
Locate the line that includes the options-ssl-nginx.conf file and comment it out:
```
#include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
ssl_ciphers EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5;
```



Final check:
```
nginx -t
systemctl restart nginx
systemctl status nginx
systemctl enable nginx
```
HTTP2 check:
```
curl -I -L https://your_domain
```
TLS1.3 check:
```
openssl s_client -connect your_domain:443 -tls1_3
```
Brotli check
```
curl -IL https://your_domain -H "Accept-Encoding: br"
```
Node Exporter check
```
curl http://localhost:9100/metrics
```
VTS check
```
curl http://localhost/status
```
