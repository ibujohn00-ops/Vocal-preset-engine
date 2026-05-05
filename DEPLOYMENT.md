# VocalLab AI - Deployment & Configuration Guide

## Environment Configuration

### Server Environment Variables

Create `.env` in the `server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vocallab

# Authentication
JWT_SECRET=your-super-secret-key-minimum-32-characters
JWT_EXPIRE=7d

# File Uploads
MAX_FILE_SIZE=104857600  # 100MB
UPLOAD_DIR=./uploads
PROCESSED_DIR=./processed

# CORS
FRONTEND_URL=https://yourdomain.com

# Security
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### Client Environment Variables

Create `.env` in the `client` directory:

```env
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_ENV=production
```

## Docker Deployment

### Prerequisites
- Docker
- Docker Compose

### Building Docker Images

```bash
# Build all services
docker-compose build

# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
```

### Server Dockerfile

Create `server/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install FFmpeg
RUN apk add --no-cache ffmpeg

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source
COPY src ./src
COPY tsconfig.json ./

# Build TypeScript
RUN npm run build

# Create upload directories
RUN mkdir -p uploads processed

EXPOSE 5000

CMD ["npm", "start"]
```

### Client Dockerfile

Create `client/Dockerfile`:

```dockerfile
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration

Create `client/nginx.conf`:

```nginx
server {
    listen 3000;
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}
```

## Production Deployment

### AWS EC2 Deployment

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t3.medium or larger
   - Security group: Allow 80, 443, 22

2. **Install Dependencies**
   ```bash
   sudo apt-get update
   sudo apt-get install -y docker.io docker-compose nginx certbot python3-certbot-nginx
   sudo usermod -aG docker $USER
   ```

3. **Setup SSL with Let's Encrypt**
   ```bash
   sudo certbot certonly --standalone -d yourdomain.com
   ```

4. **Configure Nginx Reverse Proxy**
   ```bash
   sudo nano /etc/nginx/sites-available/default
   ```

   Add:
   ```nginx
   upstream backend {
       server localhost:5000;
   }

   upstream frontend {
       server localhost:3000;
   }

   server {
       listen 443 ssl http2;
       server_name yourdomain.com;

       ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

       location /api {
           proxy_pass http://backend;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       location / {
           proxy_pass http://frontend;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }

   server {
       listen 80;
       server_name yourdomain.com;
       return 301 https://$server_name$request_uri;
   }
   ```

5. **Deploy with Docker Compose**
   ```bash
   cd ~/vocallab
   docker-compose up -d
   ```

## Monitoring & Maintenance

### Health Checks

```bash
# Backend health
curl http://localhost:5000/api/health

# Database connection
mongosh mongodb://localhost:27017/vocallab
```

### Backup & Restore

```bash
# Backup MongoDB
mongodump --uri="mongodb://localhost:27017/vocallab" --out=./backup

# Restore MongoDB
mongorestore --uri="mongodb://localhost:27017/vocallab" ./backup

# Backup uploads
tar -czf uploads-backup.tar.gz ./server/uploads
```

### Performance Optimization

1. **Enable Gzip Compression**
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   ```

2. **Configure CDN**
   - Use CloudFront for static assets
   - Cache static files for 30 days

3. **Database Indexing**
   ```javascript
   // Add indexes in MongoDB
   db.users.createIndex({ email: 1 });
   db.presets.createIndex({ userId: 1 });
   db.processingJobs.createIndex({ userId: 1 });
   ```

4. **Rate Limiting**
   - Configured in Express middleware
   - Adjust based on usage patterns

## Troubleshooting

### Out of Memory
```bash
# Increase Docker memory
docker-compose down
docker update --memory 2g vocallab_backend
docker-compose up -d
```

### Database Connection Issues
```bash
# Check MongoDB status
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### File Upload Issues
```bash
# Check directory permissions
ls -la server/uploads

# Fix permissions
chmod -R 755 server/uploads
```
