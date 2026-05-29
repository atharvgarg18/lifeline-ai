# DevOps & Deployment - LifeLine AI

Infrastructure, containerization, and deployment configuration for LifeLine AI.

---

## Quick Start - Local Development

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your API keys
# Then start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## Docker Compose Setup

### Services Included

| Service | Port | Purpose |
|---------|------|---------|
| **mongodb** | 27017 | Primary database |
| **redis** | 6379 | Cache & sessions |
| **backend** | 3000 | Node.js API server |
| **frontend** | 3001 | Next.js web app |
| **ai-services** | 8000 | Python ML services |
| **nginx** | 80, 443 | Reverse proxy (optional) |
| **mongo-express** | 8082 | MongoDB UI (debug) |
| **redis-commander** | 8083 | Redis UI (debug) |

### Basic Commands

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d backend

# Stop all services
docker-compose down

# Stop and remove volumes (reset data!)
docker-compose down -v

# View service logs
docker-compose logs backend

# Follow logs
docker-compose logs -f ai-services

# Execute command in container
docker-compose exec backend npm run db:migrate

# Rebuild service
docker-compose build backend
docker-compose up -d backend

# View service health
docker-compose ps

# Access container shell
docker-compose exec mongo mongosh
docker-compose exec backend bash
```

---

## Environment Variables (.env)

```bash
# ============================================
# API Keys (Get from respective services)
# ============================================
GOOGLE_MAPS_API_KEY=your-google-maps-key
GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-api-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token

# ============================================
# Frontend Configuration
# ============================================
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token

# ============================================
# Deployment Configuration
# ============================================
NODE_ENV=development
DEPLOYMENT_ENVIRONMENT=development  # development|staging|production
DEPLOY_REGION=us-east-1

# ============================================
# Database Configuration
# ============================================
MONGODB_USERNAME=admin
MONGODB_PASSWORD=password123
MONGODB_REPLICA_SET=rs0

REDIS_PASSWORD=redis123

# ============================================
# Security
# ============================================
JWT_SECRET=dev-secret-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production

# ============================================
# Services Configuration
# ============================================
BACKEND_PORT=3000
FRONTEND_PORT=3001
AI_SERVICES_PORT=8000

# ============================================
# Logging
# ============================================
LOG_LEVEL=debug
SENTRY_DSN=your-sentry-dsn
```

---

## Deployment Strategies

### 1. Local Development (docker-compose)

For developers working on the codebase.

```bash
cd devops
docker-compose up -d
# Access: http://localhost:3001
```

### 2. Staging Deployment (GCP/AWS)

```bash
# Deploy to staging environment
./deploy.sh staging

# View logs
gcloud logs read --limit 50 --filter='severity>=WARNING'

# Scale services
gcloud run services update lifeline-backend --max-instances 10
```

### 3. Production Deployment

```bash
# Deploy to production (with approval gate)
./deploy.sh production

# Rollback if needed
gcloud run services update lifeline-backend --revision lifeline-backend@old

# Monitor
gcloud monitoring dashboards list
```

---

## Kubernetes Deployment (Optional)

For large-scale deployments:

```yaml
# kubernetes/backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: lifeline-backend
  labels:
    app: lifeline
    tier: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: lifeline-backend
  template:
    metadata:
      labels:
        app: lifeline-backend
    spec:
      containers:
      - name: backend
        image: gcr.io/lifeline-project/backend:latest
        ports:
        - containerPort: 3000
        env:
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: mongodb-uri
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/v1/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/v1/health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
```

Deploy with:
```bash
kubectl apply -f kubernetes/
kubectl get pods
kubectl logs pod-name
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy LifeLine AI

on:
  push:
    branches: [develop, main]
  pull_request:
    branches: [develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Test Backend
        run: |
          cd backend
          npm install
          npm run test
          npm run lint
      
      - name: Test Frontend
        run: |
          cd frontend
          npm install
          npm run test
          npm run lint
      
      - name: Test AI Services
        run: |
          cd ai-services
          pip install -r requirements.txt
          pytest
  
  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop' || github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker Images
        run: |
          docker build -t backend:${{ github.sha }} -f devops/Dockerfile.backend ./backend
          docker build -t frontend:${{ github.sha }} -f devops/Dockerfile.frontend ./frontend
      
      - name: Push to Registry
        run: |
          echo ${{ secrets.GCP_KEY }} | docker login -u _json_key --password-stdin https://gcr.io
          docker tag backend:${{ github.sha }} gcr.io/lifeline-project/backend:${{ github.sha }}
          docker push gcr.io/lifeline-project/backend:${{ github.sha }}
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Production
        run: |
          gcloud auth activate-service-account --key-file=${{ secrets.GCP_SA_KEY }}
          gcloud run deploy lifeline-backend \
            --image gcr.io/lifeline-project/backend:${{ github.sha }} \
            --region us-central1 \
            --allow-unauthenticated
```

---

## Monitoring & Logging

### Setup Monitoring

```bash
# Using Google Cloud Monitoring
gcloud monitoring timeseries create \
  --metric-kind GAUGE \
  --value-type DOUBLE \
  --metric-descriptor-type emergency_response_time

# View metrics dashboard
gcloud monitoring dashboards list
gcloud monitoring dashboards describe <DASHBOARD_ID>
```

### Key Metrics to Monitor

```
Backend:
- Request latency (p50, p95, p99)
- Error rate by endpoint
- Database connection pool utilization
- Cache hit ratio

Frontend:
- Page load time
- Time to interactive
- JavaScript error rate

AI Services:
- Model inference time
- API response time
- Error rate
```

### Setup Alerts

```bash
# Create alert for high error rate
gcloud alpha monitoring policies create \
  --notification-channels=$CHANNEL_ID \
  --display-name="High Error Rate" \
  --condition-display-name="Error rate > 5%" \
  --condition-metric-kind DELTA \
  --condition-metric-type logging.googleapis.com/user_error_count
```

---

## Backup & Recovery

### Database Backup

```bash
# Backup MongoDB
docker-compose exec mongo mongodump --archive=/backup/lifeline-$(date +%Y%m%d).archive

# Restore MongoDB
docker-compose exec mongo mongorestore --archive=/backup/lifeline-20240527.archive

# Backup to cloud
gsutil -m cp /backup/lifeline-*.archive gs://lifeline-backups/
```

### Backup Strategy

| Database | Frequency | Retention | Location |
|----------|-----------|-----------|----------|
| MongoDB | Daily | 30 days | GCS |
| Redis | Hourly | 7 days | Local |
| Backups | Weekly archive | 1 year | Cold storage |

---

## Disaster Recovery

### Recovery Time Objectives (RTO)

| Service | RTO | RPO |
|---------|-----|-----|
| Backend | 15 min | 1 hour |
| Frontend | 5 min | N/A (stateless) |
| Database | 1 hour | 15 min |

### Recovery Procedures

1. **Database Recovery**
   ```bash
   # Restore from backup
   mongorestore --archive=lifeline-backup.archive
   
   # Verify data
   mongosh lifeline > db.collections()
   ```

2. **Service Recovery**
   ```bash
   # Restart services
   kubectl restart deployment lifeline-backend
   
   # Check status
   kubectl get pods
   kubectl logs pod-name
   ```

3. **Failover**
   ```bash
   # Switch DNS to backup region
   gcloud dns record-sets update lifeline-api.example.com \
     --new-data=<backup-ip> \
     --ttl=60
   ```

---

## Performance Tuning

### Database Optimization

```bash
# Create indexes
docker-compose exec mongo mongosh
> db.emergencySOS.createIndex({ status: 1, createdAt: -1 })
> db.emergencySOS.createIndex({ location: "2dsphere" })

# Analyze query performance
> db.emergencySOS.explain("executionStats").find({ status: "INITIATED" })
```

### Application Scaling

```bash
# Horizontal scaling (add replicas)
kubectl scale deployment lifeline-backend --replicas=5

# Vertical scaling (increase resources)
kubectl set resources deployment lifeline-backend \
  --limits=cpu=1000m,memory=1Gi \
  --requests=cpu=500m,memory=512Mi
```

### Caching Strategy

```bash
# Redis optimization
docker-compose exec redis redis-cli INFO
docker-compose exec redis redis-cli CONFIG GET maxmemory
docker-compose exec redis redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

---

## Security Hardening

### Network Security

```yaml
# Network Policy - Only allow necessary traffic
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: lifeline-deny-all
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: lifeline-frontend
    ports:
    - protocol: TCP
      port: 3000
```

### Secrets Management

```bash
# Store secrets in cloud secret manager
gcloud secrets create db-password --data-file=- < password.txt

# Use in deployment
gcloud run deploy lifeline-backend \
  --set-env-vars DB_PASSWORD=$(gcloud secrets versions access latest --secret=db-password)
```

### SSL/TLS Configuration

```bash
# Create self-signed certificate (development)
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365

# Production: Use Let's Encrypt
certbot certonly --standalone -d lifeline-api.example.com
```

---

## Troubleshooting

### Service Won't Start

```bash
# Check logs
docker-compose logs service-name

# Check health
docker-compose ps

# Rebuild and restart
docker-compose build service-name
docker-compose up -d service-name
```

### Database Connection Error

```bash
# Verify MongoDB is running and healthy
docker-compose exec mongo mongosh admin --eval "db.runCommand('ping')"

# Check network connectivity
docker network inspect lifeline-network
```

### Performance Issues

```bash
# Check resource usage
docker stats

# View slow queries
docker-compose exec mongo mongosh
> db.setProfilingLevel(1, { slowms: 100 })
> db.system.profile.find().sort({ ts: -1 }).limit(10).pretty()
```

---

## Cost Optimization

| Service | Monthly Cost | Optimization |
|---------|--------------|--------------|
| Cloud SQL (managed DB) | $500-2000 | Use shared instance |
| Compute (VMs/Container) | $300-1500 | Auto-scaling, reserved capacity |
| Networking | $100-500 | CDN, VPC peering |
| Storage | $50-200 | Delete old backups |

**Total Estimated**: $1000-4000/month for production

---

## Documentation

- [Development Guide](../docs/DEVELOPMENT_GUIDE.md)
- [Architecture](../docs/ARCHITECTURE.md)
- [API Specification](../docs/API_SPECIFICATION.md)

---

**Last Updated**: May 27, 2026
