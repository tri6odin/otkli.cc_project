# Metrics server configuration
# Table of contents
  * [First steps](#first-steps)
  * [Prometheus](#prometheus)
  * [Grafana](#grafana)
  * [Nginx](#nginx)
    + [Edit server blocks](#edit-server-blocks)
    + [SSl](#ssl)
    + [TLS1.3 HTTP2](#tls13-http2)
    + [Restart nginx](#restart-nginx)
  * [Final checklist](#final-checklist)
    + [Fail2Ban](#fail2ban)
    + [Nginx](#nginx-1)
    + [Prometheus](#prometheus-1)
    + [Grafana](#grafana-1)
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
apt-get install fail2ban
```
## Prometheus
Add app user:
```
sudo useradd --no-create-home --shell /bin/false prometheus
```
Find new release here: https://github.com/prometheus/prometheus/releases
```
wget https://github.com/.../prometheus-2.6.0.linux-amd64.tar.gz
tar -xvzf prometheus-2.6.0.linux-amd64.tar.gz
sudo cp prometheus-2.6.0.linux-amd64/prometheus /usr/local/bin/
sudo cp prometheus-2.6.0.linux-amd64/promtool /usr/local/bin/

sudo mkdir /etc/prometheus
sudo cp -r prometheus-2.6.0.linux-amd64/consoles/ \
  /etc/prometheus/consoles
sudo cp -r prometheus-2.6.0.linux-amd64/console_libraries/ \
  /etc/prometheus/console_libraries
sudo cp prometheus-2.6.0.linux-amd64/prometheus.yml \
  /etc/prometheus/
sudo chown -R prometheus:prometheus /etc/prometheus

sudo mkdir /var/lib/prometheus
sudo chown prometheus:prometheus /var/lib/prometheus
```
Create service file `nano /etc/systemd/system/prometheus.service` and paste:
```
[Unit]
Description=Prometheus
Wants=network-online.target
After=network-online.target

[Service]
User=prometheus
Group=prometheus
ExecStart=/usr/local/bin/prometheus \
    --config.file /etc/prometheus/prometheus.yml \
    --storage.tsdb.path /var/lib/prometheus/ \
    --web.console.templates=/etc/prometheus/consoles \
    --web.console.libraries=/etc/prometheus/console_libraries

[Install]
WantedBy=default.target
```
Start Prometheus:
```
sudo systemctl daemon-reload
sudo systemctl start prometheus
sudo systemctl status prometheus
sudo systemctl enable prometheus
```
Production configurations can be found here: [prometheus config of our project](https://github.com/tri6odin/otkli.cc_project/blob/main/nginx/metrics/prometheus/prometheus.yml) 
Edit config `nano /etc/prometheus/prometheus.yml` and paste:
```
- job_name: 'your_domain_vts'
  scheme: https
  metrics_path: /status/format/prometheus
  static_configs:
    - targets: ['your_domain']

- job_name: 'your_domain_node'
  scheme: https
  metrics_path: /node_exporter
  static_configs:
    - targets: ['your_domain']
```      
Restart Prometheus:
```
sudo systemctl restart prometheus
```      
        
## Grafana
To install the latest Enterprise edition:
```
sudo apt-get install -y apt-transport-https
sudo apt-get install -y software-properties-common wget
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -
```
Add this repository for stable releases:
```
echo "deb https://packages.grafana.com/enterprise/deb stable main" | sudo tee -a /etc/apt/sources.list.d/grafana.list
```
After you add the repository:
```
sudo apt-get update
sudo apt-get install grafana-enterprise
```
Start Grafana:
```
sudo systemctl start grafana-server
sudo systemctl status grafana-server
sudo systemctl enable grafana-server
```
## Nginx
Install Nginx:
```
sudo apt install nginx
```
### Edit server blocks
Remove default server block
```
rm /etc/nginx/sites-available/default
rm /etc/nginx/sites-enabled/default
rm -rf /var/www/html
```
 
Production configurations can be found here: [server blocks of our project](https://github.com/tri6odin/otkli.cc_project/tree/main/nginx/metrics/blocks) 

Don't forget to change `your_domain` name. Create Prometheus block `nano /etc/nginx/sites-available/prometheus.your_domain` and paste:
```
server {
  #IP of grafana server
  allow grafana.your_domain;
  #IP of VPN
  allow vpn.your_domain;
  deny all;
  server_name prometheus.your_domain;
  location /
    {
      proxy_pass http://localhost:9090;
    }
}
```
Create Grafana block `nano /etc/nginx/sites-available/grafana.your_domain` and paste:
```
server {
  #IP of VPN
  allow vpn.your_domain;
  deny all;
  server_name grafana.your_domain;
  location /
    {
      proxy_pass http://localhost:3000;
    }
}
```
### SSl
Let's Encrypt SSL for Nginx:
```
apt install certbot python3-certbot-nginx
```
Generate SSL config in block:
```
certbot --nginx -d grafana.your_domain -d prometheus.your_domain
certbot renew --dry-run
```
### TLS1.3 HTTP2
Open the configuration file for your domains `nano /etc/nginx/sites-available/prometheus.your_domain` and add `http2`
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
### Restart nginx
```
nginx -t
systemctl restart nginx
```
## Final checklist
### Fail2Ban
```
systemctl restart fail2ban
systemctl status fail2ban
systemctl enable fail2ban
```
### Nginx
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
### Prometheus
```
systemctl restart prometheus
systemctl status prometheus
systemctl enable prometheus
```
### Grafana
```
systemctl restart grafana-server
systemctl status grafana-server
systemctl enable grafana-server
```




