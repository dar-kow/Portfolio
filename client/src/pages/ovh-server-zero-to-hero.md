# Instrukcja konfiguracji serwera na OVH od podstaw

Poniżej znajduje się szczegółowa instrukcja, jak skonfigurować serwer na OVH od zera, obejmująca wszystkie podstawowe kroki.

## Spis treści
1. [Podstawowa konfiguracja użytkownika i bezpieczeństwa](#1-podstawowa-konfiguracja-użytkownika-i-bezpieczeństwa)
2. [Instalacja i konfiguracja środowiska Docker](#2-instalacja-i-konfiguracja-środowiska-docker)
3. [Konfiguracja NGINX jako reverse proxy](#3-konfiguracja-nginx-jako-reverse-proxy)
4. [Wdrożenie Let's Encrypt dla SSL](#4-wdrożenie-lets-encrypt-dla-ssl)
5. [Konfiguracja stosu monitorowania](#5-konfiguracja-stosu-monitorowania)
6. [Konfiguracja serwera plików (Nextcloud)](#6-konfiguracja-serwera-plików-nextcloud)
7. [Konfiguracja serwera poczty](#7-konfiguracja-serwera-poczty)
8. [Konfiguracja portfolio](#8-konfiguracja-portfolio)
9. [Informacje dodatkowe](#9-informacje-dodatkowe)

## 1. Podstawowa konfiguracja użytkownika i bezpieczeństwa

### 1.1 Utworzenie użytkownika ****deployer****


```bash
# Dodaj nowego użytkownika
sudo adduser deployer

# Dodaj użytkownika do grupy sudo
sudo usermod -aG sudo deployer
```

### 1.2 Konfiguracja SSH i sudo dla nowego użytkownika

```bash
# Przełącz się na użytkownika deployer
sudo su - deployer

# Utwórz katalog .ssh i ustaw odpowiednie uprawnienia
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Utwórz plik authorized_keys
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Dodaj swój klucz publiczny do authorized_keys
echo "TWÓJ_KLUCZ_PUBLICZNY_SSH" > ~/.ssh/authorized_keys

# Wróć do poprzedniego użytkownika
exit
```

### 1.3 Zabezpieczenie konfiguracji SSH

```bash
# Edytuj plik konfiguracyjny SSH
sudo nano /etc/ssh/sshd_config
```

Zmodyfikuj następujące linie:
```
# Wyłącz logowanie na roota
PermitRootLogin no

# Wyłącz logowanie hasłem (tylko klucze)
PasswordAuthentication no

# Określ port SSH (opcjonalnie możesz zmienić z 22 na inny)
Port 22

# Ograniczenie czasu bezczynności
ClientAliveInterval 300
ClientAliveCountMax 2
```

Zrestartuj usługę SSH:
```bash
sudo systemctl restart sshd
```

### 1.4 Konfiguracja sudo dla użytkownika deployer

```bash
# Utwórz plik konfiguracyjny sudo dla użytkownika deployer
sudo visudo -f /etc/sudoers.d/deployer
```

Dodaj następującą linię:
```
deployer ALL=(ALL) NOPASSWD: ALL
```

### 1.5 Konfiguracja firewall (UFW)

```bash
# Zainstaluj UFW
sudo apt update
sudo apt install ufw

# Ustaw domyślne zasady
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Zezwól na SSH
sudo ufw allow ssh

# Zezwól na HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Włącz firewall
sudo ufw enable

# Sprawdź status
sudo ufw status verbose
```

## 2. Instalacja i konfiguracja środowiska Docker

### 2.1 Instalacja Docker Engine

```bash
# Aktualizacja pakietów
sudo apt update

# Instalacja wymaganych pakietów
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Dodanie oficjalnego klucza GPG Dockera
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Dodanie repozytorium Docker
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# Aktualizacja listy pakietów
sudo apt update

# Instalacja Dockera
sudo apt install -y docker-ce docker-ce-cli containerd.io
```

### 2.2 Instalacja Docker Compose

```bash
# Instalacja Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Nadanie uprawnień wykonywania
sudo chmod +x /usr/local/bin/docker-compose

# Sprawdzenie wersji
docker-compose --version
```

### 2.3 Konfiguracja uprawnień Docker dla użytkownika

```bash
# Dodanie użytkownika do grupy docker
sudo usermod -aG docker $USER
sudo usermod -aG docker deployer

# Zastosowanie zmian (wylogowanie i zalogowanie ponownie)
# lub uruchomienie poniższej komendy
newgrp docker
```

### 2.4 Utworzenie struktury katalogów dla kontenerów

```bash
# Utworzenie głównych katalogów dla Dockera
sudo mkdir -p /opt/docker/monitoring/grafana
sudo mkdir -p /opt/docker/monitoring/loki
sudo mkdir -p /opt/docker/monitoring/prometheus
sudo mkdir -p /opt/docker/file
sudo mkdir -p /opt/docker/mail
sudo mkdir -p /opt/docker/apps/portfolio

# Zmiana właściciela katalogów
sudo chown -R $USER:$USER /opt/docker

# Nadanie odpowiednich uprawnień
sudo chmod -R 755 /opt/docker
```

## 3. Konfiguracja NGINX jako reverse proxy

### 3.1 Instalacja NGINX

```bash
# Aktualizacja pakietów
sudo apt update

# Instalacja NGINX
sudo apt install -y nginx

# Uruchomienie NGINX i włączenie autostartu
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 3.2 Podstawowa konfiguracja NGINX

```bash
# Tworzenie katalogów dla konfiguracji
sudo mkdir -p /etc/nginx/sites-available
sudo mkdir -p /etc/nginx/sites-enabled
sudo mkdir -p /etc/nginx/snippets

# Edycja głównego pliku konfiguracyjnego
sudo nano /etc/nginx/nginx.conf
```

Wklej poniższą konfigurację:

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
    # Podstawowe ustawienia
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;

    # MIME
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logi
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

    # Dołączanie konfiguracji
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;

    # Limity czasowe dla proxy
    proxy_connect_timeout 300;
    proxy_send_timeout 300;
    proxy_read_timeout 300;
    send_timeout 300;
}
```

### 3.3 Przygotowanie snippetów pod SSL

```bash
# Tworzenie snippetu SSL
sudo nano /etc/nginx/snippets/ssl-params.conf
```

Wklej poniższą konfigurację:

```nginx
# Protokoły SSL/TLS
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;

# Parametry Diffie-Hellman
ssl_dhparam /etc/nginx/dhparam.pem;

# Sesje SSL
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:10m;
ssl_session_tickets off;

# HSTS (15768000 sekund = 6 miesięcy)
add_header Strict-Transport-Security "max-age=15768000; includeSubDomains; preload";

# OCSP Stapling
ssl_stapling on;
ssl_stapling_verify on;

# Resolver DNS
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;

# Dodatkowe nagłówki bezpieczeństwa
add_header X-Frame-Options SAMEORIGIN;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
```

### 3.4 Generowanie silnych parametrów Diffie-Hellman

```bash
# Generowanie parametrów Diffie-Hellman
sudo openssl dhparam -out /etc/nginx/dhparam.pem 2048
```

### 3.5 Utworzenie domyślnej konfiguracji dla domen

```bash
# Tworzenie konfiguracji dla domeny głównej
sudo nano /etc/nginx/sites-available/example.com  # Zmień na swoją domenę
```

Wklej poniższą konfigurację (zmień domenę na swoją):

```nginx
server {
    listen 80;
    listen [::]:80;
    
    server_name example.com www.example.com;  # Zmień na swoją domenę
    
    # Przekierowanie na HTTPS (będzie aktywowane po skonfigurowaniu SSL)
    # return 301 https://$host$request_uri;
    
    location / {
        root /var/www/html;
        index index.html index.htm;
    }
}
```

```bash
# Utwórz katalog dla plików HTML
sudo mkdir -p /var/www/html

# Utwórz podstawowy plik index.html
sudo nano /var/www/html/index.html
```

Dodaj prosty plik HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Strona w budowie</title>
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
    <h1>Strona w budowie</h1>
    <p>Serwer działa poprawnie. Strona w trakcie konfiguracji.</p>
</body>
</html>
```

Aktywowanie konfiguracji:

```bash
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/  # Zmień na swoją domenę
sudo rm -f /etc/nginx/sites-enabled/default  # Usunięcie domyślnej konfiguracji
sudo nginx -t  # Sprawdzenie składni
sudo systemctl reload nginx  # Przeładowanie konfiguracji
```

## 4. Wdrożenie Let's Encrypt dla SSL

### 4.1 Instalacja Certbot

```bash
# Aktualizacja pakietów
sudo apt update

# Instalacja Certbot i wtyczki dla NGINX
sudo apt install -y certbot python3-certbot-nginx
```

### 4.2 Przygotowanie konfiguracji dla subdomen

Przed uzyskaniem certyfikatów, utwórz podstawową konfigurację NGINX dla wszystkich subdomen:

```bash
# Utwórz plik konfiguracyjny dla wszystkich subdomen
sudo nano /etc/nginx/sites-available/subdomains.example.com  # Zmień na swoją domenę
```

Wklej następującą konfigurację (dostosuj nazwy domen):

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

Aktywuj konfigurację:

```bash
sudo ln -s /etc/nginx/sites-available/subdomains.example.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4.3 Pozyskanie certyfikatów dla domen

```bash
# Pozyskanie certyfikatu dla domeny głównej i wszystkich subdomen
sudo certbot --nginx -d example.com -d www.example.com -d prometheus.example.com -d loki.example.com -d grafana.example.com -d mail.example.com -d files.example.com -d portfolio.example.com -d monitoring.example.com
```

Podczas procesu zostaniesz poproszony o:
- Podanie adresu e-mail do powiadomień
- Akceptację warunków korzystania z usługi
- Wybór, czy chcesz przekierowywać HTTP na HTTPS

### 4.4 Konfiguracja automatycznego odnawiania certyfikatów

```bash
# Sprawdzenie czy automatyczne odnawianie jest skonfigurowane
sudo systemctl status certbot.timer

# Test procesu odnowienia (bez faktycznego odnowienia)
sudo certbot renew --dry-run
```

### 4.5 Konfiguracja subdomen

Po uzyskaniu certyfikatów, utwórz szczegółowe pliki konfiguracyjne dla każdej subdomeny:

```bash
# Monitoring (Grafana, Prometheus, Loki)
sudo nano /etc/nginx/sites-available/monitoring.example.com  # Zmień na swoją domenę
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
# Serwer plików
sudo nano /etc/nginx/sites-available/files.example.com  # Zmień na swoją domenę
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
# Serwer poczty
sudo nano /etc/nginx/sites-available/mail.example.com  # Zmień na swoją domenę
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
sudo nano /etc/nginx/sites-available/portfolio.example.com  # Zmień na swoją domenę
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

Aktywuj wszystkie konfiguracje:

```bash
sudo ln -s /etc/nginx/sites-available/monitoring.example.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/files.example.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/mail.example.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/portfolio.example.com /etc/nginx/sites-enabled/

# Usuń tymczasowy plik konfiguracyjny
sudo rm /etc/nginx/sites-enabled/subdomains.example.com

sudo nginx -t
sudo systemctl reload nginx
```

## 5. Konfiguracja stosu monitorowania

### 5.1 Przygotowanie pliku docker-compose.yml dla stosu monitorowania

```bash
# Przejdź do katalogu monitorowania
cd /opt/docker/monitoring

# Utwórz plik docker-compose.yml
nano docker-compose.yml
```

Wklej poniższą konfigurację:

```yaml
version: '3.8'

networks:
  monitoring:
    driver: bridge

volumes:
  prometheus_data: {}
  grafana_data: {}
  # loki_data: {}  # Odkomentuj, jeśli chcesz używać Loki

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
      - GF_SECURITY_ADMIN_PASSWORD=<strong-password>  # Zmień to na bezpieczne hasło!
      - GF_USERS_ALLOW_SIGN_UP=false
    ports:
      - "3000:3000"
    networks:
      - monitoring
    labels:
      org.label-schema.group: "monitoring"

  # Loki i Promtail są opcjonalne - odkomentuj jeśli chcesz ich używać
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

### 5.2 Przygotowanie konfiguracji Prometheus

```bash
# Utwórz katalog dla konfiguracji Prometheus
mkdir -p /opt/docker/monitoring/prometheus

# Utwórz plik konfiguracyjny Prometheus
nano /opt/docker/monitoring/prometheus/prometheus.yml
```

Wklej poniższą konfigurację:

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

### 5.3 Przygotowanie konfiguracji Grafana

```bash
# Utwórz katalogi dla konfiguracji Grafana
mkdir -p /opt/docker/monitoring/grafana/provisioning/datasources
mkdir -p /opt/docker/monitoring/grafana/provisioning/dashboards

# Utwórz plik konfiguracyjny źródeł danych
nano /opt/docker/monitoring/grafana/provisioning/datasources/datasource.yml
```

Wklej poniższą konfigurację:

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

### 5.4 Uruchomienie stosu monitorowania

```bash
# Uruchom kontenery
cd /opt/docker/monitoring
docker-compose up -d
```

### 5.5 Zabezpieczenie dostępu do Prometheus

```bash
# Zainstaluj narzędzie do generowania haseł
sudo apt install -y apache2-utils

# Utwórz plik z hasłami (zastąp 'admin_user' i 'your_password' własnymi wartościami)
sudo htpasswd -c /etc/nginx/.htpasswd admin_user
```

## 6. Konfiguracja serwera plików (Nextcloud)

### 6.1 Przygotowanie docker-compose.yml dla Nextcloud

```bash
# Utwórz katalog dla Nextcloud
cd /opt/docker/file

# Utwórz plik docker-compose.yml
nano docker-compose.yml
```

Wklej poniższą konfigurację:

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
      - MYSQL_ROOT_PASSWORD=<strong-db-root-password>  # Zmień to!
      - MYSQL_PASSWORD=<strong-db-password>  # Zmień to!
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
      - MYSQL_PASSWORD=<strong-db-password>  # Zmień to!
      - MYSQL_DATABASE=nextcloud
      - MYSQL_USER=nextcloud
      - MYSQL_HOST=db
      - NEXTCLOUD_TRUSTED_DOMAINS=files.example.com  # Zmień na swoją domenę
      - NEXTCLOUD_ADMIN_USER=admin
      - NEXTCLOUD_ADMIN_PASSWORD=<strong-admin-password>  # Zmień to!
    networks:
      - nextcloud_network
    ports:
      - 8081:80  # Używamy portu 8081, ponieważ 8080 jest już używany przez cAdvisor

networks:
  nextcloud_network:
```

### 6.2 Konfiguracja NGINX jako reverse proxy dla Nextcloud

```bash
# Edytuj plik konfiguracyjny dla serwera plików
sudo nano /etc/nginx/sites-available/files.example.com  # Zmień na swoją domenę
```

Zaktualizuj konfigurację:

```nginx
## 6.2 Konfiguracja NGINX jako reverse proxy dla Nextcloud (kontynuacja)

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

    # Ustawienia specyficzne dla Nextcloud
    add_header Strict-Transport-Security "max-age=15768000; includeSubDomains; preload;" always;
    add_header Referrer-Policy "no-referrer" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Download-Options "noopen" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Permitted-Cross-Domain-Policies "none" always;
    add_header X-Robots-Tag "noindex, nofollow" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Wyłączenie ograniczeń rozmiaru dla uploadu plików
    client_max_body_size 0;

    location / {
        proxy_pass http://localhost:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_buffering off;
        proxy_request_buffering off;
        
        # Zwiększenie timeoutów dla długo trwających operacji
        proxy_connect_timeout 3600s;
        proxy_send_timeout 3600s;
        proxy_read_timeout 3600s;
    }
}
```

### 6.3 Uruchomienie Nextcloud

```bash
# Uruchom kontenery
cd /opt/docker/file
docker-compose up -d
```

Sprawdź działanie Nextcloud pod adresem https://files.example.com i zaloguj się używając danych:
- Użytkownik: admin
- Hasło: <strong-admin-password> (lub to, które ustawiłeś w docker-compose.yml)

## 7. Konfiguracja serwera poczty

### 7.1 Przygotowanie docker-compose.yml dla serwera poczty

```bash
# Przejdź do katalogu serwera poczty
cd /opt/docker/mail

# Utwórz plik docker-compose.yml
nano docker-compose.yml
```

Wklej poniższą konfigurację:

```yaml
version: '3'

networks:
  mail_network:
    driver: bridge

services:
  mailserver:
    image: docker.io/mailserver/docker-mailserver:latest
    container_name: mailserver
    hostname: mail.example.com  # Zmień na swoją domenę
    domainname: example.com  # Zmień na swoją domenę
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

### 7.2 Przygotowanie certyfikatów dla serwera poczty

```bash
# Utwórz strukturę katalogów
mkdir -p /opt/docker/mail/config/cert

# Skopiuj certyfikaty
sudo cp /etc/letsencrypt/live/example.com/fullchain.pem /opt/docker/mail/config/cert/cert.pem
sudo cp /etc/letsencrypt/live/example.com/privkey.pem /opt/docker/mail/config/cert/privkey.pem

# Ustaw odpowiednie uprawnienia
sudo chown -R $USER:$USER /opt/docker/mail
sudo chmod -R 600 /opt/docker/mail/config/cert
```

### 7.3 Uruchomienie serwera poczty i konfiguracja kont

```bash
# Utwórz potrzebne katalogi
mkdir -p /opt/docker/mail/mail-data
mkdir -p /opt/docker/mail/mail-state
mkdir -p /opt/docker/mail/mail-logs
mkdir -p /opt/docker/mail/config

# Uruchom kontenery
cd /opt/docker/mail
docker-compose up -d

# Pobierz narzędzie setup.sh
curl -L https://raw.githubusercontent.com/docker-mailserver/docker-mailserver/master/setup.sh -o setup.sh
chmod +x setup.sh

# Utwórz konto e-mail (przykład)
docker exec -it mailserver setup email add admin@example.com  # Zostaniesz poproszony o hasło
```

### 7.4 Konfiguracja DKIM

```bash
# Wygeneruj klucze DKIM
docker exec -it mailserver setup config dkim

# Wyświetl wygenerowany klucz DKIM
docker exec -it mailserver cat /tmp/docker-mailserver/opendkim/keys/example.com/mail.txt
```

### 7.5 Konfiguracja NGINX jako reverse proxy dla Roundcube

```bash
# Edytuj plik konfiguracyjny dla mail.example.com
sudo nano /etc/nginx/sites-available/mail.example.com  # Zmień na swoją domenę
```

Wklej zaktualizowaną konfigurację:

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

### 7.6 Konfiguracja DNS dla poczty

W panelu zarządzania DNS swojej domeny, dodaj następujące rekordy:

1. **Rekord MX**:
   - Typ: MX
   - Nazwa: @ (lub twoja domena)
   - Wartość: mail.example.com
   - Priorytet: 10

2. **Rekord SPF**:
   - Typ: TXT
   - Nazwa: @ (lub twoja domena)
   - Wartość: `v=spf1 a mx ip4:<your-server-ip> -all`

3. **Rekord DKIM**:
   - Typ: TXT
   - Nazwa: mail._domainkey
   - Wartość: skopiuj z wyjścia polecenia `cat /tmp/docker-mailserver/opendkim/keys/example.com/mail.txt`

4. **Rekord DMARC**:
   - Typ: TXT
   - Nazwa: _dmarc
   - Wartość: `v=DMARC1; p=none; rua=mailto:admin@example.com; ruf=mailto:admin@example.com; pct=100`

## 8. Konfiguracja portfolio

### 8.1 Struktura katalogów

```bash
# Utwórz katalog dla aplikacji
mkdir -p /opt/docker/apps/portfolio
```

### 8.2 Konfiguracja Docker dla portfolio

```bash
# Przejdź do katalogu portfolio
cd /opt/docker/apps/portfolio

# Utwórz plik docker-compose.yml
nano docker-compose.yml
```

Zawartość pliku docker-compose.yml:

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

### 8.3 Utworzenie Dockerfile dla aplikacji React

```bash
# Utwórz plik Dockerfile
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

### 8.4 Przygotowanie konfiguracji NGINX dla kontenera

```bash
# Utwórz plik nginx.conf
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

### 8.5 Konfiguracja NGINX jako proxy dla portfolio

```bash
# Edytuj plik konfiguracyjny NGINX dla portfolio
sudo nano /etc/nginx/sites-available/portfolio.example.com  # Zmień na swoją domenę
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

### 8.6 Uruchomienie portfolio

```bash
# Przeładuj konfigurację NGINX
sudo nginx -t
sudo systemctl reload nginx

# Uruchom kontener portfolio
cd /opt/docker/apps/portfolio
docker-compose up -d
```

## 9. Informacje dodatkowe

### 9.1 Uwagi dotyczące bezpieczeństwa

1. **Regularnie aktualizuj system i aplikacje**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Monitoruj logi systemowe**:
   ```bash
   sudo journalctl -f
   ```

3. **Utwórz kopie zapasowe ważnych danych**:
   - Certyfikaty SSL
   - Konfiguracja NGINX
   - Dane z kontenerów Docker

### 9.2 Rozwiązywanie problemów

1. **Sprawdzanie statusu usług**:
   ```bash
   systemctl status nginx
   docker ps
   ```

2. **Sprawdzanie logów**:
   ```bash
   docker logs [nazwa_kontenera]
   sudo tail -f /var/log/nginx/error.log
   ```

3. **Testowanie konfiguracji NGINX**:
   ```bash
   sudo nginx -t
   ```

4. **Restart usług**:
   ```bash
   sudo systemctl restart nginx
   docker-compose down && docker-compose up -d
   ```

### 9.3 Przydatne polecenia

- **Aktualizacja kontenerów Docker**:
  ```bash
  docker-compose pull
  docker-compose up -d
  ```

- **Czyszczenie nieużywanych obrazów Docker**:
  ```bash
  docker system prune -a
  ```

- **Odnowienie certyfikatów SSL**:
  ```bash
  sudo certbot renew
  ```

- **Dodawanie nowych kont e-mail**:
  ```bash
  docker exec -it mailserver setup email add [email]
  ```

- **Sprawdzanie użycia dysku**:
  ```bash
  df -h
  du -sh /opt/docker/*
  ```

Ta instrukcja powinna umożliwić pełną konfigurację serwera na OVH, od podstawowej konfiguracji systemu, przez instalację i konfigurację wszystkich potrzebnych usług, aż po zabezpieczenia i rozwiązywanie typowych problemów.