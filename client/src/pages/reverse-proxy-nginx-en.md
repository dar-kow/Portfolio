# Reverse Proxy with NGINX - How to Approach It?

## What is a Reverse Proxy?

A reverse proxy is an intermediary server that acts as a "gateway" between clients and application servers. Unlike a regular proxy that works on the client side, a reverse proxy is located on the server side. When a client sends a request to a server, it first reaches the reverse proxy, which then redirects it to the appropriate backend server, retrieves the response, and sends it back to the client.

## How Does a Reverse Proxy Work in NGINX?

1. Client sends an HTTP request to a domain (e.g., example.com)
2. The request reaches the NGINX server acting as a reverse proxy
3. NGINX, based on its configuration, redirects the request to the appropriate application server
4. The application server processes the request and sends a response to NGINX
5. NGINX forwards the response back to the client

The client communicates exclusively with NGINX, without having direct access to the backend servers.

## Advantages of Using NGINX as a Reverse Proxy

### 1. Enhanced Security

- **Backend server isolation** - application servers are not directly exposed to the internet
- **Traffic filtering** - ability to block malicious requests using security modules
- **Protection against DDoS attacks** - limiting the number of connections and requests
- **Hiding infrastructure details** - clients don't know the internal network structure

### 2. Load Balancing

- Built-in mechanisms for distributing traffic among multiple servers
- Various balancing algorithms (round-robin, least connections, ip-hash)
- Server health checking and automatic disabling of malfunctioning instances

### 3. Performance Improvement

- **Efficient caching** - storing static files and frequent responses
- **Gzip/Brotli compression** - reducing the size of transferred data
- **SSL Termination** - offloading cryptographic operations from application servers
- **HTTP/2 and HTTP/3** - support for modern protocols that increase performance

### 4. Application Management

- **Virtual hosting** - handling multiple domains on a single server
- **URL redirections** - easy change of address structure without modifying the application
- **Header modification** - adding or modifying HTTP headers

## Basic NGINX Configuration as a Reverse Proxy

Here's a basic NGINX configuration acting as a reverse proxy:

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

This configuration:
- Listens on port 80 for requests to example.com
- Redirects all requests to the backend server operating on http://backend_server:8080
- Passes original headers so the backend server knows the client's real IP address and other information

## NGINX Configuration for Single Page Applications (SPA)

Single Page Applications (SPAs) require special configuration because routing is handled on the client side by JavaScript, not by the server. It's crucial to redirect all requests to the index.html file to handle client-side routing.

Here's a complete NGINX configuration for an SPA operating behind a reverse proxy:

```nginx
server {
    listen 80;
    server_name spa-example.com;
    
    # Main folder with SPA static files
    root /var/www/spa-app/dist;
    
    # Forwarding API to the backend server
    location /api/ {
        proxy_pass http://api-server:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Handling static files with cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
    
    # Key configuration for SPA - redirecting to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Explanation of SPA Configuration:

1. **`try_files $uri $uri/ /index.html;`** - This is the key directive for SPA:
   - First, NGINX tries to find a file matching the requested URI ($uri)
   - If it doesn't find a file, it tries to find a directory ($uri/)
   - If neither file nor directory exists, it redirects to /index.html

2. Forwarding API requests:
   - All requests to /api/ are directed to the actual API server
   - The rest is handled as part of the SPA

3. Static file optimization:
   - We add cache headers for static files to increase performance

## Advanced NGINX Configuration for SPA with Reverse Proxy

Here's a more elaborate configuration with additional optimizations:

```nginx
server {
    listen 80;
    server_name spa.example.com;
    
    # HTTP to HTTPS redirect
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name spa.example.com;
    
    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/example.com.crt;
    ssl_certificate_key /etc/nginx/ssl/example.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    
    # Main folder with SPA files
    root /var/www/spa-app/dist;
    index index.html;
    
    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-XSS-Protection "1; mode=block";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';";
    
    # Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Proxy buffering
    proxy_buffers 16 16k;
    proxy_buffer_size 16k;
    
    # Forwarding to API
    location /api/ {
        proxy_pass http://backend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Static files with long cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires max;
        add_header Cache-Control "public, immutable, max-age=31536000";
        try_files $uri =404;
    }
    
    # Robots.txt file
    location = /robots.txt {
        add_header Content-Type text/plain;
        return 200 "User-agent: *\nDisallow: /api/\n";
    }
    
    # SPA handling
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

This elaborate configuration includes:
- HTTP to HTTPS redirect
- HTTP/2 support for better performance
- Security headers
- Compression for all text file types
- Advanced buffering settings
- Different caching strategies for static files and the main index.html file
- Automatic robots.txt file generation

## NGINX Configuration for SPA with Multiple Environments

Often we need to handle different environments (development, staging, production) on the same server:

```nginx
# Upstream servers
upstream backend_production {
    server production-api:3000;
}

upstream backend_staging {
    server staging-api:3000;
}

# Production
server {
    listen 443 ssl http2;
    server_name app.example.com;
    
    root /var/www/production/dist;
    
    location /api/ {
        proxy_pass http://backend_production;
        # standard proxy headers
    }
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Staging
server {
    listen 443 ssl http2;
    server_name staging.example.com;
    
    # Basic authentication for staging environment
    auth_basic "Restricted Access";
    auth_basic_user_file /etc/nginx/.htpasswd;
    
    root /var/www/staging/dist;
    
    location /api/ {
        proxy_pass http://backend_staging;
        # standard proxy headers
    }
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Handling Multiple SPA Applications

If we have multiple SPA applications that we want to host under different paths:

```nginx
server {
    listen 443 ssl http2;
    server_name apps.example.com;
    
    # First SPA application
    location /app1/ {
        alias /var/www/app1/dist/;
        try_files $uri $uri/ /app1/index.html;
    }
    
    # Second SPA application
    location /app2/ {
        alias /var/www/app2/dist/;
        try_files $uri $uri/ /app2/index.html;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://backend:3000;
        # standard proxy headers
    }
}
```

## Best Practices for NGINX with SPA

1. **Always use HTTPS** - nowadays HTTPS is the standard
2. **Set appropriate cache headers**:
   - Long cache for immutable files (js, css with hash in the name)
   - No cache for index.html to ensure quick application updates
3. **Use HTTP/2** - significantly improves performance, especially for SPAs
4. **Enable compression** - reduces the size of transferred data
5. **Monitor performance** - use available monitoring tools
6. **Optimize timeouts** - adjust timeout settings to the specifics of your application
7. **Implement security measures** - use security headers, CORS, etc.
8. **Test configuration** - use `nginx -t` before applying changes

## Troubleshooting NGINX and SPA Issues

### Problem: Page refresh leads to 404 error

**Solution**: Make sure the `try_files $uri $uri/ /index.html;` directive is correctly configured. This is responsible for redirecting all unfound paths to the main SPA file.

### Problem: SPA cannot communicate with the API

**Solution**: Check CORS configuration and ensure that proxy_pass is correctly configured:

```nginx
location /api/ {
    proxy_pass http://backend:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    
    # CORS headers
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
    add_header 'Access-Control-Allow-Headers' 'Origin, X-Requested-With, Content-Type, Accept, Authorization' always;
}
```

### Problem: Application loading time is too long

**Solution**: Optimize cache and compression settings:

```nginx
# Compression
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

# Static files with appropriate cache
location ~* \.(js|css)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Summary

NGINX is a powerful tool for handling SPA applications as a reverse proxy. The key directive `try_files $uri $uri/ /index.html;` ensures proper operation of client-side routing, which is essential for SPAs.

Thanks to advanced NGINX features such as load balancing, caching, compression, and SSL handling, we can significantly increase the performance, security, and reliability of our SPA applications.

Remember that each configuration should be tailored to the specific needs of your application, but the presented patterns provide a solid foundation on which you can build solutions adapted to specific requirements.