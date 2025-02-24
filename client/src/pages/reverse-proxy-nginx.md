# Reverse Proxy z NGINX - Jak to ugryźć?

## Czym jest Reverse Proxy?

Reverse proxy to serwer pośredniczący, który działa jako "brama" między klientami a serwerami aplikacji. W przeciwieństwie do zwykłego proxy, które działa po stronie klienta, reverse proxy znajduje się po stronie serwera. Gdy klient wysyła żądanie do serwera, trafia ono najpierw do reverse proxy, który następnie przekierowuje je do odpowiedniego serwera backend, pobiera odpowiedź i przesyła ją z powrotem do klienta.

## Jak działa Reverse Proxy w NGINX?

1. Klient wysyła żądanie HTTP do domeny (np. example.com)
2. Żądanie trafia do serwera NGINX działającego jako reverse proxy
3. NGINX, na podstawie konfiguracji, przekierowuje żądanie do odpowiedniego serwera aplikacji
4. Serwer aplikacji przetwarza żądanie i wysyła odpowiedź do NGINX
5. NGINX przekazuje odpowiedź z powrotem do klienta

Klient komunikuje się wyłącznie z NGINX, nie mając bezpośredniego dostępu do serwerów backend.

## Zalety używania NGINX jako Reverse Proxy

### 1. Zwiększone bezpieczeństwo

- **Izolacja serwerów backend** - serwery aplikacji nie są bezpośrednio wystawione na internet
- **Filtrowanie ruchu** - możliwość blokowania złośliwych żądań za pomocą modułów bezpieczeństwa
- **Ochrona przed atakami DDoS** - limitowanie liczby połączeń i żądań
- **Ukrywanie szczegółów infrastruktury** - klienci nie znają wewnętrznej struktury sieci

### 2. Równoważenie obciążenia (Load Balancing)

- Wbudowane mechanizmy dystrybucji ruchu między wieloma serwerami
- Różne algorytmy równoważenia (round-robin, least connections, ip-hash)
- Sprawdzanie stanu serwerów i automatyczne wyłączanie niesprawnych instancji

### 3. Poprawa wydajności

- **Wydajny caching** - przechowywanie statycznych plików i częstych odpowiedzi
- **Kompresja Gzip/Brotli** - zmniejszanie rozmiaru transferowanych danych
- **SSL Termination** - odciążenie serwerów aplikacji z operacji kryptograficznych
- **HTTP/2 i HTTP/3** - obsługa nowoczesnych protokołów zwiększających wydajność

### 4. Zarządzanie aplikacjami

- **Virtual hosting** - obsługa wielu domen na jednym serwerze
- **Przekierowania URL** - łatwa zmiana struktury adresów bez modyfikacji aplikacji
- **Zmiana nagłówków** - dodawanie lub modyfikacja nagłówków HTTP

## Podstawowa konfiguracja NGINX jako Reverse Proxy

Oto podstawowa konfiguracja NGINX działającego jako reverse proxy:

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://backend_server:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Ta konfiguracja:
- Nasłuchuje na porcie 80 dla żądań do example.com
- Przekierowuje wszystkie żądania do serwera backend działającego na http://backend_server:8080
- Przekazuje oryginalne nagłówki, aby serwer backend znał prawdziwy adres IP klienta i inne informacje

## Konfiguracja NGINX dla Single Page Applications (SPA)

Aplikacje typu Single Page Application (SPA) wymagają specjalnej konfiguracji, ponieważ routing jest obsługiwany po stronie klienta przez JavaScript, a nie przez serwer. Kluczowe jest przekierowanie wszystkich żądań do pliku index.html, aby obsłużyć routing kliencki.

Oto kompletna konfiguracja NGINX dla SPA działającej za reverse proxy:

```nginx
server {
    listen 80;
    server_name spa-example.com;
    
    # Główny folder z plikami statycznymi SPA
    root /var/www/spa-app/dist;
    
    # Przekazywanie API do serwera backend
    location /api/ {
        proxy_pass http://api-server:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Obsługa plików statycznych z cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
    
    # Kluczowa konfiguracja dla SPA - przekierowanie do index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Wyjaśnienie konfiguracji dla SPA:

1. **`try_files $uri $uri/ /index.html;`** - Jest to kluczowa dyrektywa dla SPA:
   - Najpierw NGINX próbuje znaleźć plik odpowiadający żądanemu URI ($uri)
   - Jeśli nie znajdzie pliku, próbuje znaleźć katalog ($uri/)
   - Jeśli ani plik ani katalog nie istnieją, przekierowuje do /index.html

2. Przekazywanie żądań API:
   - Wszystkie żądania do /api/ są kierowane do rzeczywistego serwera API
   - Reszta jest obsługiwana jako część SPA

3. Optymalizacja plików statycznych:
   - Dodajemy nagłówki cache dla plików statycznych, aby zwiększyć wydajność

## Zaawansowana konfiguracja NGINX dla SPA z Reverse Proxy

Oto bardziej rozbudowana konfiguracja z dodatkowymi optymalizacjami:

```nginx
server {
    listen 80;
    server_name spa.example.com;
    
    # Przekierowanie HTTP na HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name spa.example.com;
    
    # Konfiguracja SSL
    ssl_certificate /etc/nginx/ssl/example.com.crt;
    ssl_certificate_key /etc/nginx/ssl/example.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    
    # Główny folder z plikami SPA
    root /var/www/spa-app/dist;
    index index.html;
    
    # Nagłówki bezpieczeństwa
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-XSS-Protection "1; mode=block";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';";
    
    # Kompresja
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Buforowanie proxy
    proxy_buffers 16 16k;
    proxy_buffer_size 16k;
    
    # Przekazywanie do API
    location /api/ {
        proxy_pass http://backend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouty
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Pliki statyczne z długim cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires max;
        add_header Cache-Control "public, immutable, max-age=31536000";
        try_files $uri =404;
    }
    
    # Plik Robots.txt
    location = /robots.txt {
        add_header Content-Type text/plain;
        return 200 "User-agent: *\nDisallow: /api/\n";
    }
    
    # Obsługa SPA
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

Ta rozbudowana konfiguracja zawiera:
- Przekierowanie HTTP na HTTPS
- Obsługę HTTP/2 dla lepszej wydajności
- Nagłówki bezpieczeństwa
- Kompresję dla wszystkich typów plików tekstowych
- Zaawansowane ustawienia buforowania
- Różne strategie cache dla plików statycznych i głównego pliku index.html
- Automatyczną generację pliku robots.txt

## Konfiguracja NGINX dla SPA z wieloma środowiskami

Często potrzebujemy obsługiwać różne środowiska (development, staging, production) na tym samym serwerze:

```nginx
# Upstream servers
upstream backend_production {
    server production-api:3000;
}

upstream backend_staging {
    server staging-api:3000;
}

# Produkcja
server {
    listen 443 ssl http2;
    server_name app.example.com;
    
    root /var/www/production/dist;
    
    location /api/ {
        proxy_pass http://backend_production;
        # standardowe nagłówki proxy
    }
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Staging
server {
    listen 443 ssl http2;
    server_name staging.example.com;
    
    # Podstawowa autentykacja dla środowiska staging
    auth_basic "Restricted Access";
    auth_basic_user_file /etc/nginx/.htpasswd;
    
    root /var/www/staging/dist;
    
    location /api/ {
        proxy_pass http://backend_staging;
        # standardowe nagłówki proxy
    }
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Obsługa wielu aplikacji SPA

Jeśli mamy wiele aplikacji SPA, które chcemy hostować pod różnymi ścieżkami:

```nginx
server {
    listen 443 ssl http2;
    server_name apps.example.com;
    
    # Pierwsza aplikacja SPA
    location /app1/ {
        alias /var/www/app1/dist/;
        try_files $uri $uri/ /app1/index.html;
    }
    
    # Druga aplikacja SPA
    location /app2/ {
        alias /var/www/app2/dist/;
        try_files $uri $uri/ /app2/index.html;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://backend:3000;
        # standardowe nagłówki proxy
    }
}
```

## Dobre praktyki dla NGINX z SPA

1. **Zawsze stosuj HTTPS** - w dzisiejszych czasach HTTPS jest standardem
2. **Ustawiaj odpowiednie nagłówki cache**:
   - Długie cache dla niezmiennych plików (js, css z hash w nazwie)
   - Brak cache dla index.html, aby zapewnić szybkie aktualizacje aplikacji
3. **Używaj HTTP/2** - znacząco poprawia wydajność, szczególnie dla SPA
4. **Włącz kompresję** - zmniejsza rozmiar przesyłanych danych
5. **Monitoruj wydajność** - korzystaj z dostępnych narzędzi do monitorowania
6. **Optymalizuj timeouty** - dostosuj ustawienia timeoutów do specyfiki aplikacji
7. **Implementuj zabezpieczenia** - używaj nagłówków bezpieczeństwa, CORS, itp.
8. **Testuj konfigurację** - używaj `nginx -t` przed zastosowaniem zmian

## Rozwiązywanie problemów z NGINX i SPA

### Problem: Odświeżanie strony prowadzi do błędu 404

**Rozwiązanie**: Upewnij się, że dyrektywa `try_files $uri $uri/ /index.html;` jest poprawnie skonfigurowana. To ona odpowiada za przekierowanie wszystkich nieznalezionych ścieżek do głównego pliku SPA.

### Problem: Aplikacja SPA nie może komunikować się z API

**Rozwiązanie**: Sprawdź konfigurację CORS i upewnij się, że proxy_pass jest poprawnie skonfigurowane:

```nginx
location /api/ {
    proxy_pass http://backend:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    
    # Nagłówki CORS
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
    add_header 'Access-Control-Allow-Headers' 'Origin, X-Requested-With, Content-Type, Accept, Authorization' always;
}
```

### Problem: Zbyt długi czas ładowania aplikacji

**Rozwiązanie**: Zoptymalizuj ustawienia cache i kompresji:

```nginx
# Kompresja
gzip on;
gzip_comp_level 5;
gzip_min_length 256;
gzip_proxied any;
gzip_vary on;
gzip_types
  application/javascript
  application/json
  application/x-javascript
  text/css
  text/javascript
  text/plain;

# Pliki statyczne z odpowiednim cache
location ~* \.(js|css)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Podsumowanie

NGINX jest potężnym narzędziem do obsługi aplikacji SPA jako reverse proxy. Kluczowa dyrektywa `try_files $uri $uri/ /index.html;` zapewnia prawidłowe działanie routingu po stronie klienta, co jest niezbędne dla SPA.

Dzięki zaawansowanym funkcjom NGINX, takim jak równoważenie obciążenia, cache, kompresja i obsługa SSL, możemy znacznie zwiększyć wydajność, bezpieczeństwo i niezawodność naszych aplikacji SPA.

Pamiętaj, że każda konfiguracja powinna być dostosowana do konkretnych potrzeb aplikacji, ale przedstawione wzorce stanowią solidną podstawę, na której można budować rozwiązania dostosowane do specyficznych wymagań.