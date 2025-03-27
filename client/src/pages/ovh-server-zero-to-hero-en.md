# OVH Server Configuration Guide from Scratch

Below is a detailed guide on how to configure an OVH server from zero, covering all the basic steps.

## Table of Contents
1. [Basic User and Security Configuration](#1-basic-user-and-security-configuration)
2. [Docker Environment Installation and Configuration](#2-docker-environment-installation-and-configuration)
3. [NGINX Configuration as a Reverse Proxy](#3-nginx-configuration-as-a-reverse-proxy)
4. [Let's Encrypt Implementation for SSL](#4-lets-encrypt-implementation-for-ssl)
5. [Monitoring Stack Configuration](#5-monitoring-stack-configuration)
6. [File Server Configuration (Nextcloud)](#6-file-server-configuration-nextcloud)
7. [Mail Server Configuration](#7-mail-server-configuration)
8. [Portfolio Configuration](#8-portfolio-configuration)
9. [Additional Information](#9-additional-information)

## 1. Basic User and Security Configuration

### 1.1 Creating a `deployer` User

```bash
# Add a new user
sudo adduser deployer

# Add the user to the sudo group
sudo usermod -aG sudo deployer
```

### 1.2 SSH and sudo Configuration for the New User

```bash
# Switch to the deployer user
sudo su - deployer

# Create the .ssh directory and set appropriate permissions
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Create the authorized_keys file
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Add your public SSH key to authorized_keys
echo "YOUR_SSH_PUBLIC_KEY" > ~/.ssh/authorized_keys

# Return to the previous user
exit
```

### 1.3 Securing SSH Configuration

```bash
# Edit the SSH configuration file
sudo nano /etc/ssh/sshd_config
```

Modify the following lines:
```
# Disable root login
PermitRootLogin no

# Disable password login (keys only)
PasswordAuthentication no

# Specify SSH port (optionally, you can change from 22 to another)
Port 22

# Idle time limitations
ClientAliveInterval 300
ClientAliveCountMax 2
```

Restart the SSH service:
```bash
sudo systemctl restart sshd
```

### 1.4 sudo Configuration for the deployer User

```bash
# Create a sudo configuration file for the deployer user
sudo visudo -f /etc/sudoers.d/deployer
```

Add the following line:
```
deployer ALL=(ALL) NOPASSWD: ALL
```

### 1.5 Firewall Configuration (UFW)

```bash
# Install UFW
sudo apt update
sudo apt install ufw

# Set default rules
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH
sudo ufw allow ssh

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable the firewall
sudo ufw enable

# Check status
sudo ufw status verbose
```

## 2. Docker Environment Installation and Configuration

### 2.1 Docker Engine Installation

```bash
# Update packages
sudo apt update

# Install required packages
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Add Docker repository
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# Update package list
sudo apt update

# Install Docker
sudo apt install -y docker-ce docker-ce-cli containerd.io
```

### 2.2 Docker Compose Installation

```bash
# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Set execute permissions
sudo chmod +x /usr/local/bin/docker-compose

# Check version
docker-compose --version
```

### 2.3 Docker Permissions Configuration for the User

```bash
# Add the user to the docker group
sudo usermod -aG docker $USER
sudo usermod -aG docker deployer

# Apply changes (log out and log in again)
# or run the following command
newgrp docker
```

### 2.4 Creating Directory Structure for Containers

```bash
# Create main Docker directories
sudo mkdir -p /opt/docker/monitoring/grafana
sudo mkdir -p /opt/docker/monitoring/loki
sudo mkdir -p /opt/docker/monitoring/prometheus
sudo mkdir -p /opt/docker/file
sudo mkdir -p /opt/docker/mail
sudo mkdir -p /opt/docker/apps/portfolio

# Change directory owner
sudo chown -R $USER:$USER /opt/docker

# Set appropriate permissions
sudo chmod -R 755 /opt/docker
```

## 3. NGINX Configuration as a Reverse Proxy

### 3.1 NGINX Installation

```bash
# Update packages
sudo apt update

# Install NGINX
sudo apt install -y nginx

# Start NGINX and enable autostart
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 3.2 Basic NGINX Configuration

```bash
# Create directories for configuration
sudo mkdir -p /etc/nginx/sites-available
sudo mkdir -p /etc/nginx/sites-enabled
sudo mkdir -p /etc/nginx/snippets

# Edit the main configuration file
sudo nano /etc/nginx/nginx.conf
```

Paste the following configuration:

```nginx
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections 1024;
    multi_accept on;
}

http {
    # Basic settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;

    # MIME
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logs
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Gzip
    gzip on;
    gzip_disable "msie6";
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_buffers 16 8k;
    gzip_http_version 1.1;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Including configurations
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;

    # Proxy timeout limits
    proxy_connect_timeout 300;
    proxy_send_timeout 300;
    proxy_read_timeout 300;
    send_timeout 300;
}
```

### 3.3 Preparing SSL Snippets

```bash
# Creating SSL snippet
sudo nano /etc/nginx/snippets/ssl-params.conf
```

Paste the following configuration:

```nginx
# SSL/TLS protocols
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;

# Diffie-Hellman parameters
ssl_dhparam /etc/nginx/dhparam.pem;

# SSL sessions
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:10m;
ssl_session_tickets off;

# HSTS (15768000 seconds = 6 months)
add_header Strict-Transport-Security "max-age=15768000; includeSubDomains; preload";

# OCSP Stapling
ssl_stapling on;
ssl_stapling_verify on;

# DNS resolver
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;

# Additional security headers
add_header X-Frame-Options SAMEORIGIN;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
```

### 3.4 Generating Strong Diffie-Hellman Parameters

```bash
# Generating Diffie-Hellman parameters
sudo openssl dhparam -out /etc/nginx/dhparam.pem 2048
```

### 3.5 Creating Default Domain Configuration

```bash
# Creating configuration for the main domain
sudo nano /etc/nginx/sites-available/example.com  # Change to your domain
```

Paste the following configuration (change the domain to yours):

```nginx
server {
    listen 80;
    listen [::]:80;
    
    server_name example.com www.example.com;  # Change to your domain
    
    # Redirect to HTTPS (will be activated after SSL configuration)
    # return 301 https://$host$request_uri;
    
    location / {
        root /var/www/html;
        index index.html index.htm;
    }
}
```

```bash
# Create a directory for HTML files
sudo mkdir -p /var/www/html

# Create a basic index.html file
sudo nano /var/www/html/index.html
```

Add a simple HTML file:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Site Under Construction</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
        }
        h1 {
            color: #333;
        }
    </style>
</head>
<body>
    <h1>Site Under Construction</h1>
    <p>Server is working correctly. Site is being configured.</p>
</body>
</html>
```

Activating the configuration:

```bash
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/  # Change to your domain
sudo rm -f /etc/nginx/sites-enabled/default  # Removing default configuration
sudo nginx -t  # Checking syntax
sudo systemctl reload nginx  # Reloading configuration
```

## 4. Let's Encrypt Implementation for SSL

### 4.1 Certbot Installation

```bash
# Update packages
sudo apt update

# Install Certbot and NGINX plugin
sudo apt install -y certbot python3-certbot-nginx
```

### 4.2 Preparing Configuration for Subdomains

Before obtaining certificates, create a basic NGINX configuration for all subdomains:

```bash
# Create a configuration file for all subdomains
sudo nano /etc/nginx/sites-available/subdomains.example.com  # Change to your domain
```

Paste the following configuration (adjust domain names):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name prometheus.example.com loki.example.com grafana.example.com mail.example.com files.example.com portfolio.example.com monitoring.example.com;

    location / {
        root /var/www/html;
        index index.html;
    }
}
```

Activate the configuration:

```bash
sudo ln -s /etc/nginx/sites-available/subdomains.example.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4.3 Obtaining Certificates for Domains

```bash
# Obtaining certificate for the main domain and all subdomains
sudo certbot --nginx -d example.com -d www.example.com -d prometheus.example.com -d loki.example.com -d grafana.example.com -d mail.example.com -d files.example.com -d portfolio.example.com -d monitoring.example.com
```

During the process, you will be asked to:
- Provide an email address for notifications
- Accept the terms of service
- Choose whether to redirect HTTP to HTTPS

### 4.4 Configuring Automatic Certificate Renewal

```bash
# Check if automatic renewal is configured
sudo systemctl status certbot.timer

# Test the renewal process (without actually renewing)
sudo certbot renew --dry-run
```

### 4.5 Configuring Subdomains

After obtaining certificates, create detailed configuration files for each subdomain:

```bash
# Monitoring (Grafana, Prometheus, Loki)
sudo nano /etc/nginx/sites-available/monitoring.example.com  # Change to your domain
```

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name prometheus.example.com loki.example.com grafana.example.com monitoring.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name monitoring.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    include /etc/nginx/snippets/ssl-params.conf;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name grafana.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    include /etc/nginx/snippets/ssl-params.conf;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name prometheus.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    include /etc/nginx/snippets/ssl-params.conf;

    location / {
        proxy_pass http://localhost:9090;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name loki.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    include /etc/nginx/snippets/ssl-params.conf;

    auth_basic "Restricted Access";
    auth_basic_user_file /etc/nginx/.htpasswd;

    location / {
        proxy_pass http://localhost:3100;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# File server
sudo nano /etc/nginx/sites-available/files.example.com  # Change to your domain
```

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name files.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name files.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    include /etc/nginx/snippets/ssl-params.conf;

    location / {
        return 200 "File server placeholder";
    }
}
```

```bash
# Mail server
sudo nano /etc/nginx/sites-available/mail.example.com  # Change to your domain
```

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name mail.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name mail.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    include /etc/nginx/snippets/ssl-params.conf;

    location / {
        return 200 "Mail server placeholder";
    }
}
```

```bash
# Portfolio
sudo nano /etc/nginx/sites-available/portfolio.example.com  # Change to your domain
```

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name portfolio.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name portfolio.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    include /etc/nginx/snippets/ssl-params.conf;

    location / {
        return 200 "Portfolio placeholder";
    }
}
```

Activate all configurations:

```bash
sudo ln -s /etc/nginx/sites-available/monitoring.example.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/files.example.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/mail.example.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/portfolio.example.com /etc/nginx/sites-enabled/

# Remove temporary configuration file
sudo rm /etc/nginx/sites-enabled/subdomains.example.com

sudo nginx -t
sudo systemctl reload nginx
```

## 5. Monitoring Stack Configuration

### 5.1 Preparing docker-compose.yml for the Monitoring Stack

```bash
# Navigate to the monitoring directory
cd /opt/docker/monitoring

# Create docker-compose.yml file
nano docker-compose.yml
```

Paste the following configuration:

```yaml
version: '3.8'

networks:
  monitoring:
    driver: bridge

volumes:
  prometheus_data: {}
  grafana_data: {}
  # loki_data: {}  # Uncomment if you want to use Loki

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: unless-stopped
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--web.enable-lifecycle'
    ports:
      - "9090:9090"
    networks:
      - monitoring
    labels:
      org.label-schema.group: "monitoring"

  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    restart: unless-stopped
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    ports:
      - "9100:9100"
    networks:
      - monitoring
    labels:
      org.label-schema.group: "monitoring"

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    container_name: cadvisor
    restart: unless-stopped
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
      - /dev/disk/:/dev/disk:ro
    ports:
      - "8080:8080"
    networks:
      - monitoring
    labels:
      org.label-schema.group: "monitoring"

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    restart: unless-stopped
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=<strong-password>  # Change this to a secure password!
      - GF_USERS_ALLOW_SIGN_UP=false
    ports:
      - "3000:3000"
    networks:
      - monitoring
    labels:
      org.label-schema.group: "monitoring"

  # Loki and Promtail are optional - uncomment if you want to use them
  # loki:
  #   image: grafana/loki:latest
  #   container_name: loki
  #   restart: unless-stopped
  #   volumes:
  #     - ./loki/config.yml:/etc/loki/config.yml
  #     - loki_data:/loki
  #   command: -config.file=/etc/loki/config.yml
  #   ports:
  #     - "3100:3100"
  #   networks:
  #     - monitoring
  #   labels:
  #     org.label-schema.group: "monitoring"
  #
  # promtail:
  #   image: grafana/promtail:latest
  #   container_name: promtail
  #   restart: unless-stopped
  #   volumes:
  #     - /var/log:/var/log
  #     - ./loki/promtail-config.yml:/etc/promtail/config.yml
  #   command: -config.file=/etc/promtail/config.yml
  #   networks:
  #     - monitoring
  #   labels:
  #     org.label-schema.group: "monitoring"
```

### 5.2 Preparing Prometheus Configuration

```bash
# Create directory for Prometheus configuration
mkdir -p /opt/docker/monitoring/prometheus

# Create Prometheus configuration file
nano /opt/docker/monitoring/prometheus/prometheus.yml
```

Paste the following configuration:

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          # - alertmanager:9093

rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node_exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']
```

### 5.3 Preparing Grafana Configuration

```bash
# Create directories for Grafana configuration
mkdir -p /opt/docker/monitoring/grafana/provisioning/datasources
mkdir -p /opt/docker/monitoring/grafana/provisioning/dashboards

# Create data sources configuration file
nano /opt/docker/monitoring/grafana/provisioning/datasources/datasource.yml
```

Paste the following configuration:

```yaml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true
```

### 5.4 Starting the Monitoring Stack

```bash
# Start containers
cd /opt/docker/monitoring
docker-compose up -d
```

### 5.5 Securing Access to Prometheus

```bash
# Install password generation tool
sudo apt install -y apache2-utils

# Create password file (replace 'admin_user' and 'your_password' with your own values)
sudo htpasswd -c /etc/nginx/.htpasswd admin_user
```

## 6. File Server Configuration (Nextcloud)

### 6.1 Preparing docker-compose.yml for Nextcloud

```bash
# Create directory for Nextcloud
cd /opt/docker/file

# Create docker-compose.yml file
nano docker-compose.yml
```

Paste the following configuration:

```yaml
version: '3'

volumes:
  nextcloud_data:
  nextcloud_db:

services:
  db:
    image: mariadb:10.6
    container_name: nextcloud-db
    command: --transaction-isolation=READ-COMMITTED --log-bin=binlog --binlog-format=ROW
    restart: always
    volumes:
      - nextcloud_db:/var/lib/mysql
    environment:
      - MYSQL_ROOT_PASSWORD=<strong-db-root-password>  # Change this!
      - MYSQL_PASSWORD=<strong-db-password>  # Change this!
      - MYSQL_DATABASE=nextcloud
      - MYSQL_USER=nextcloud
    networks:
      - nextcloud_network

  app:
    image: nextcloud:stable
    container_name: nextcloud-app
    restart: always
    depends_on:
      - db
    volumes:
      - nextcloud_data:/var/www/html
    environment:
      - MYSQL_PASSWORD=<strong-db-password>  # Change this!
      - MYSQL_DATABASE=nextcloud
      - MYSQL_USER=nextcloud
      - MYSQL_HOST=db
      - NEXTCLOUD_TRUSTED_DOMAINS=files.example.com  # Change to your domain
      - NEXTCLOUD_ADMIN_USER=admin
      - NEXTCLOUD_ADMIN_PASSWORD=<strong-admin-password>  # Change this!
    networks:
      - nextcloud_network
    ports:
      - 8081:80  # We use port 8081 because 8080 is already used by cAdvisor

networks:
  nextcloud_network:
```

### 6.2 NGINX Configuration as a Reverse Proxy for Nextcloud

```bash
# Edit configuration file for the file server
sudo nano /etc/nginx/sites-available/files.example.com  # Change to your domain
```

Update the configuration:

```nginx
## 6.2 NGINX Configuration as a Reverse Proxy for Nextcloud (continuation)

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name files.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name files.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    include /etc/nginx/snippets/ssl-params.conf;

    # Nextcloud specific settings
    add_header Strict-Transport-Security "max-age=15768000; includeSubDomains; preload;" always;
    add_header Referrer-Policy "no-referrer" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Download-Options "noopen" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Permitted-Cross-Domain-Policies "none" always;
    add_header X-Robots-Tag "noindex, nofollow" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Disable size limits for file uploads
    client_max_body_size 0;

    location / {
        proxy_pass http://localhost:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_buffering off;
        proxy_request_buffering off;
        
        # Increase timeouts for long-running operations
        proxy_connect_timeout 3600s;
        proxy_send_timeout 3600s;
        proxy_read_timeout 3600s;
    }
}
```

### 6.3 Starting Nextcloud

```bash
# Start containers
cd /opt/docker/file
docker-compose up -d
```

Check Nextcloud at https://files.example.com and log in using:
- Username: admin
- Password: <strong-admin-password> (or the one you set in docker-compose.yml)

## 7. Mail Server Configuration

### 7.1 Preparing docker-compose.yml for the Mail Server

```bash
# Navigate to the mail server directory
cd /opt/docker/mail

# Create docker-compose.yml file
nano docker-compose.yml
```

Paste the following configuration:

```yaml
version: '3'

networks:
  mail_network:
    driver: bridge

services:
  mailserver:
    image: docker.io/mailserver/docker-mailserver:latest
    container_name: mailserver
    hostname: mail.example.com  # Change to your domain
    domainname: example.com  # Change to your domain
    ports:
      - "25:25"    # SMTP
      - "143:143"  # IMAP
      - "587:587"  # Submission
      - "993:993"  # IMAPS
    volumes:
      - ./mail-data:/var/mail
      - ./mail-state:/var/mail-state
      - ./config:/tmp/docker-mailserver/
      - /etc/localtime:/etc/localtime:ro
    environment:
      - ENABLE_SPAMASSASSIN=1
      - ENABLE_CLAMAV=1
      - ENABLE_FAIL2BAN=1
      - SSL_TYPE=manual
      - SSL_CERT_PATH=/tmp/docker-mailserver/cert/cert.pem
      - SSL_KEY_PATH=/tmp/docker-mailserver/cert/privkey.pem
      - PERMIT_DOCKER=connected-networks
    networks:
      mail_network:
    restart: always

  webmail:
    image: roundcube/roundcubemail:latest
    container_name: roundcube
    depends_on:
      - mailserver
    environment:
      - ROUNDCUBEMAIL_DEFAULT_HOST=mailserver
      - ROUNDCUBEMAIL_DEFAULT_PORT=143
      - ROUNDCUBEMAIL_SMTP_SERVER=mailserver
      - ROUNDCUBEMAIL_SMTP_PORT=587
    ports:
      - "8082:80"
    networks:
      mail_network:
    restart: always
```

### 7.2 Preparing Certificates for the Mail Server

```bash
# Create directory structure
mkdir -p /opt/docker/mail/config/cert

# Copy certificates
sudo cp /etc/letsencrypt/live/example.com/fullchain.pem /opt/docker/mail/config/cert/cert.pem
sudo cp /etc/letsencrypt/live/example.com/privkey.pem /opt/docker/mail/config/cert/privkey.pem

# Set appropriate permissions
sudo chown -R $USER:$USER /opt/docker/mail
sudo chmod -R 600 /opt/docker/mail/config/cert
```

### 7.3 Starting the Mail Server and Configuring Accounts

```bash
# Create required directories
mkdir -p /opt/docker/mail/mail-data
mkdir -p /opt/docker/mail/mail-state
mkdir -p /opt/docker/mail/mail-logs
mkdir -p /opt/docker/mail/config

# Start containers
cd /opt/docker/mail
docker-compose up -d

# Download setup.sh tool
curl -L https://raw.githubusercontent.com/docker-mailserver/docker-mailserver/master/setup.sh -o setup.sh
chmod +x setup.sh

# Create an email account (example)
docker exec -it mailserver setup email add admin@example.com  # You will be prompted for a password
```

### 7.4 DKIM Configuration

```bash
# Generate DKIM keys
docker exec -it mailserver setup config dkim

# Display the generated DKIM key
docker exec -it mailserver cat /tmp/docker-mailserver/opendkim/keys/example.com/mail.txt
```

### 7.5 NGINX Configuration as a Reverse Proxy for Roundcube

```bash
# Edit configuration file for mail.example.com
sudo nano /etc/nginx/sites-available/mail.example.com  # Change to your domain
```

Paste the updated configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name mail.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name mail.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    include /etc/nginx/snippets/ssl-params.conf;

    location / {
        proxy_pass http://localhost:8082;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 7.6 DNS Configuration for Mail

In your domain's DNS management panel, add the following records:

1. **MX Record**:
   - Type: MX
   - Name: @ (or your domain)
   - Value: mail.example.com
   - Priority: 10

2. **SPF Record**:
   - Type: TXT
   - Name: @ (or your domain)
   - Value: `v=spf1 a mx ip4:<your-server-ip> -all`

3. **DKIM Record**:
   - Type: TXT
   - Name: mail._domainkey
   - Value: copy from the output of `cat /tmp/docker-mailserver/opendkim/keys/example.com/mail.txt`

4. **DMARC Record**:
   - Type: TXT
   - Name: _dmarc
   - Value: `v=DMARC1; p=none; rua=mailto:admin@example.com; ruf=mailto:admin@example.com; pct=100`

## 8. Portfolio Configuration

### 8.1 Directory Structure

```bash
# Create directory for the application
mkdir -p /opt/docker/apps/portfolio
```

### 8.2 Docker Configuration for the Portfolio

```bash
# Navigate to the portfolio directory
cd /opt/docker/apps/portfolio

# Create docker-compose.yml file
nano docker-compose.yml
```

Content of the docker-compose.yml file:

```yaml
version: "3.8"
services:
  portfolio:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3001:80"
    restart: always
```

### 8.3 Creating Dockerfile for React Application

```bash
# Create Dockerfile
nano Dockerfile
```

```dockerfile
FROM node:18 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 8.4 Preparing NGINX Configuration for the Container

```bash
# Create nginx.conf file
nano nginx.conf
```

```nginx
server {
    listen 80;
    
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}
```

### 8.5 NGINX Configuration as a Proxy for Portfolio

```bash
# Edit NGINX configuration file for portfolio
sudo nano /etc/nginx/sites-available/portfolio.example.com  # Change to your domain
```

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name portfolio.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name portfolio.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    include /etc/nginx/snippets/ssl-params.conf;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 8.6 Starting the Portfolio

```bash
# Reload NGINX configuration
sudo nginx -t
sudo systemctl reload nginx

# Start portfolio container
cd /opt/docker/apps/portfolio
docker-compose up -d
```

## 9. Additional Information

### 9.1 Security Notes

1. **Regularly update the system and applications**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Monitor system logs**:
   ```bash
   sudo journalctl -f
   ```

3. **Create backups of important data**:
   - SSL certificates
   - NGINX configuration
   - Docker container data

### 9.2 Troubleshooting

1. **Checking service status**:
   ```bash
   systemctl status nginx
   docker ps
   ```

2. **Checking logs**:
   ```bash
   docker logs [container_name]
   sudo tail -f /var/log/nginx/error.log
   ```

3. **Testing NGINX configuration**:
   ```bash
   sudo nginx -t
   ```

4. **Restarting services**:
   ```bash
   sudo systemctl restart nginx
   docker-compose down && docker-compose up -d
   ```

### 9.3 Useful Commands

- **Updating Docker containers**:
  ```bash
  docker-compose pull
  docker-compose up -d
  ```

- **Cleaning unused Docker images**:
  ```bash
  docker system prune -a
  ```

- **Renewing SSL certificates**:
  ```bash
  sudo certbot renew
  ```

- **Adding new email accounts**:
  ```bash
  docker exec -it mailserver setup email add [email]
  ```

- **Checking disk usage**:
  ```bash
  df -h
  du -sh /opt/docker/*
  ```

This guide should enable a complete OVH server configuration, from basic system setup, through installation and configuration of all necessary services, to security measures and troubleshooting common issues.