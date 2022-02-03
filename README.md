# Metrics server configuration
  * [Prometheus](#prometheus)
  * [Grafana](#grafana)
  * [Nginx](#nginx)
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
Create service file:
```
nano /etc/systemd/system/prometheus.service
```
And paste:
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
Edit config:
```
nano /etc/prometheus/prometheus.yml
```
And paste:
```
- job_name: 'frontend_vts'
  scheme: https
  metrics_path: /prometheus
  static_configs:
    - targets: ['status.otkli.cc']

- job_name: 'frontend_node'
  scheme: https
  metrics_path: /node_exporter
  static_configs:
    - targets: ['status.otkli.cc']

- job_name: 'static_vts'
  scheme: https
  metrics_path: /prometheus
  static_configs:
    - targets: ['status.static.otkli.cc']

- job_name: 'static_node'
  scheme: https
  metrics_path: /node_exporter
  static_configs:
    - targets: ['status.static.otkli.cc']

- job_name: 'proxy_vts'
  scheme: https
  metrics_path: /prometheus
  static_configs:
    - targets: ['status.proxy.otkli.cc']

- job_name: 'proxy_node'
  scheme: https
  metrics_path: /node_exporter
  static_configs:
    - targets: ['status.proxy.otkli.cc']
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
Create Prometheus block:
```
nano /etc/nginx/sites-available/prometheus.otkli.cc
```
And paste:
```
upstream prometheus
{
  server 127.0.0.1:9090;
}
server {
  server_name prometheus.otkli.cc;
  location /
    {
      proxy_pass http://prometheus;
    }
}
```
Create Grafana block:
```
nano /etc/nginx/sites-available/grafana.otkli.cc
```
And paste:
```
upstream grafana
{
  server 127.0.0.1:3000;
}
server {
  server_name grafana.otkli.cc;
  location /
    {
      proxy_pass http://grafana;
    }
}
```
Let's Encrypt SSL for Nginx:
```
apt install certbot python3-certbot-nginx
```
Generate SSL config in block:
```
certbot --nginx -d grafana.otkli.cc -d prometheus.otkli.cc
```
Start Nginx:
```
nginx -t
sudo systemctl start nginx
sudo systemctl status nginx
sudo systemctl enable nginx
```


