# Static server configuration
  * [Node Exporter](#node-exporter)
  * [Nginx](#nginx)

## Node Exporter
Add app user:
```
sudo useradd --no-create-home --shell /bin/false node_exporter
```
Find new release here: https://github.com/prometheus/node_exporter/releases
```
wget https://github.com/.../node_exporter-0.17.0.linux-amd64.tar.gz
tar -xvzf node_exporter-0.17.0.linux-amd64.tar.gz
sudo cp node_exporter-0.17.0.linux-amd64/node_exporter /usr/local/bin/
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
sudo systemctl daemon-reload
sudo systemctl start node_exporter
sudo systemctl status node_exporter
sudo systemctl enable node_exporter
```
## Nginx
