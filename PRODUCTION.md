# VocalLab AI - Production Environment Configuration

## Vercel Deployment (Frontend)

### 1. Connect Repository
- Sign in to Vercel
- Import GitHub repository
- Select `client` as root directory

### 2. Environment Variables
```
REACT_APP_API_URL=https://api.vocallab.ai
REACT_APP_ENV=production
```

### 3. Deploy
- Vercel automatically builds on git push
- Preview URLs generated for PRs
- Custom domain configuration available

## Railway/Render Deployment (Backend)

### 1. Backend Service
- Connect GitHub repository
- Root directory: `server`
- Start command: `npm start`

### 2. Environment Variables
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/vocallab
JWT_SECRET=your-secure-key-min-32-chars
JWT_EXPIRE=7d
FRONTEND_URL=https://yourdomain.com

# AWS S3
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
S3_BUCKET_NAME=vocallab-audio

# Redis
REDIS_URL=redis://user:pass@redis-host:6379

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-key
SMTP_FROM=noreply@vocallab.ai

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=104857600
```

### 3. Add-ons
- **MongoDB Atlas**: Managed database
- **Redis**: Caching and session store
- **SendGrid**: Email service

## Database Setup (MongoDB Atlas)

```bash
# 1. Create cluster
# 2. Create user with strong password
# 3. Whitelist IP addresses
# 4. Get connection string
# 5. Update MONGODB_URI in environment
```

## S3 Bucket Configuration

```bash
# Create bucket
aws s3 mb s3://vocallab-audio --region us-east-1

# Set CORS policy
aws s3api put-bucket-cors --bucket vocallab-audio --cors-configuration file://cors.json

# Enable versioning
aws s3api put-bucket-versioning --bucket vocallab-audio --versioning-configuration Status=Enabled

# Set lifecycle policy (auto-delete old files)
aws s3api put-bucket-lifecycle-configuration --bucket vocallab-audio --lifecycle-configuration file://lifecycle.json
```

### CORS Configuration (cors.json)
```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://yourdomain.com"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

### Lifecycle Configuration (lifecycle.json)
```json
{
  "Rules": [
    {
      "Id": "DeleteOldFiles",
      "Status": "Enabled",
      "Prefix": "processed/",
      "Expiration": {
        "Days": 30
      }
    },
    {
      "Id": "DeleteOldUploads",
      "Status": "Enabled",
      "Prefix": "uploads/",
      "Expiration": {
        "Days": 7
      }
    }
  ]
}
```

## CDN Configuration (CloudFront)

```bash
# Create CloudFront distribution
aws cloudfront create-distribution --distribution-config file://distribution.json

# Invalidate cache after updates
aws cloudfront create-invalidation --distribution-id E123ABC --paths "/*"
```

## Domain Setup

### 1. Purchase Domain
- Use Route 53, GoDaddy, or Namecheap

### 2. DNS Configuration
```
Type: CNAME
Name: api
Value: your-railway-or-render-domain
TTL: 3600

Type: A
Name: @
Value: Vercel IP (provided by Vercel)
TTL: 3600
```

### 3. SSL/TLS Certificate
- Vercel: Automatic with custom domain
- Railway/Render: Automatic Let's Encrypt

## Health Monitoring

### 1. Uptime Monitoring
```bash
# Use UptimeRobot or Pingdom
# Monitor endpoints:
# - https://api.vocallab.ai/api/health
# - https://vocallab.ai
```

### 2. Error Tracking
```bash
# Integrate with Sentry
# npm install @sentry/node
```

### 3. Performance Monitoring
```bash
# Use New Relic or DataDog
# Monitor response times, database queries
```

## Backup & Disaster Recovery

```bash
# MongoDB automated backups
# - Automatic daily backups in Atlas
# - 35-day retention

# S3 backup strategy
# - Enable versioning
# - Cross-region replication
# - Lifecycle policies for cost optimization
```

## Cost Optimization

1. **Use Free Tiers**
   - Vercel: 100GB bandwidth/month free
   - MongoDB Atlas: Shared tier free
   - Redis: Upstash free tier

2. **S3 Optimization**
   - Enable S3 Intelligent-Tiering
   - Use lifecycle policies
   - CloudFront caching

3. **API Optimization**
   - Redis caching
   - Database indexing
   - Connection pooling

## Security Checklist

- [ ] Enable HTTPS/TLS everywhere
- [ ] Set strong JWT secret (min 32 chars)
- [ ] Configure rate limiting
- [ ] Enable CORS with specific origins
- [ ] Use security headers (HSTS, CSP, X-Frame-Options)
- [ ] Enable database authentication
- [ ] Use IAM roles for AWS access
- [ ] Enable audit logging
- [ ] Regular security updates
- [ ] Monitor for suspicious activity

## Testing Before Launch

```bash
# 1. Test all API endpoints
# 2. Test file uploads and downloads
# 3. Test processing workflows
# 4. Load testing with artillery or k6
# 5. Security testing with OWASP ZAP
# 6. Cross-browser testing
# 7. Mobile responsiveness
```
