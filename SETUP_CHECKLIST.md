# Setup Checklist - LifeLine AI

Quick reference checklist for all teams to set up and begin development.

---

## ✅ Pre-Setup

- [ ] Clone the repository
- [ ] Install Node.js v18+
- [ ] Install Python 3.10+
- [ ] Install Docker & Docker Compose
- [ ] Install Git
- [ ] Set up IDE: VS Code recommended

---

## ✅ Local Environment Setup (All Teams)

### 1. Copy Environment Configuration

```bash
# Backend
cp backend/.env.example backend/.env.local
# Edit backend/.env.local with your API keys

# Frontend
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local with your API keys

# AI Services
cp ai-services/.env.example ai-services/.env.local
# Edit ai-services/.env.local with your API keys

# DevOps
cp devops/.env.example devops/.env
# Edit devops/.env with your API keys
```

### 2. Start Infrastructure Services

```bash
cd devops
docker-compose up -d

# Verify services are running
docker-compose ps

# Check logs
docker-compose logs -f
```

**Services Started:**
- ✅ MongoDB on `localhost:27017`
- ✅ Redis on `localhost:6379`
- ✅ Optional: mongo-express on `localhost:8081` (debug)
- ✅ Optional: redis-commander on `localhost:8082` (debug)

### 3. Verify Infrastructure

```bash
# Test MongoDB
mongo --eval "db.version()"

# Test Redis
redis-cli ping

# Expected output: PONG
```

---

## ✅ Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Build TypeScript

```bash
npm run build
```

### 3. Run Tests (Verify Setup)

```bash
npm test
```

### 4. Start Development Server

```bash
npm run dev
```

**Expected Output:**
```
Server running on http://localhost:3000
API available at http://localhost:3000/api/v1
WebSocket ready at ws://localhost:3000
```

### 5. Test API Endpoint

```bash
curl http://localhost:3000/api/v1/health
```

**Expected Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-05-27T10:00:00Z"
}
```

---

## ✅ Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Run Type Check

```bash
npm run type-check
```

### 3. Build Next.js

```bash
npm run build
```

### 4. Start Development Server

```bash
npm run dev
```

**Expected Output:**
```
> ready - started server on 0.0.0.0:3001
```

### 5. Access Application

Open `http://localhost:3001` in your browser.

---

## ✅ AI Services Setup

### 1. Create Virtual Environment

```bash
cd ai-services

# Create venv
python -m venv venv

# Activate venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run Tests

```bash
pytest tests/
```

### 4. Start Development Server

```bash
python -m uvicorn src.app:app --host 0.0.0.0 --port 8000 --reload
```

**Expected Output:**
```
INFO:     Application startup complete
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 5. Test API Endpoint

```bash
curl http://localhost:8000/health
```

---

## ✅ Verify Full Stack

### Check All Services Running

```bash
# Backend
curl http://localhost:3000/api/v1/health

# Frontend
curl http://localhost:3001

# AI Services
curl http://localhost:8000/health

# MongoDB
mongo --eval "db.version()"

# Redis
redis-cli ping
```

### Expected Results
- ✅ Backend: 200 OK
- ✅ Frontend: HTML page
- ✅ AI Services: 200 OK
- ✅ MongoDB: Version number
- ✅ Redis: PONG

---

## ✅ Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Follow code standards in [DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md)
- Reference [ARCHITECTURE.md](docs/ARCHITECTURE.md) for design patterns
- Use types from [shared/types/index.ts](shared/types/index.ts)
- Use constants from [shared/constants/index.ts](shared/constants/index.ts)

### 3. Run Tests

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test

# AI Services
cd ai-services && pytest
```

### 4. Format & Lint

```bash
# Backend
npm run lint:fix && npm run format

# Frontend
npm run lint:fix && npm run format

# AI Services
black src/ && isort src/ && flake8 src/
```

### 5. Commit Changes

```bash
git add .
git commit -m "feat: description of changes"
git push origin feature/your-feature-name
```

### 6. Create Pull Request

- Add description of changes
- Reference any related issues
- Request 2 reviewers
- Ensure all checks pass

---

## ✅ API Testing

### Using cURL

```bash
# Trigger Emergency SOS
curl -X POST http://localhost:3000/api/v1/emergency/sos/trigger \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "emergencyType": "MEDICAL",
    "location": "Main Street",
    "latitude": 28.7041,
    "longitude": 77.1025,
    "description": "Test emergency"
  }'
```

### Using Postman

1. Import collection from `/docs/postman-collection.json` (TBD)
2. Set environment variables (Bearer token, URLs)
3. Test endpoints

### Using Thunder Client (VS Code)

1. Install Thunder Client extension
2. Create new request to `http://localhost:3000/api/v1/...`
3. Add authentication headers
4. Test

---

## ✅ Database Setup

### Initialize Collections

```bash
# Connect to MongoDB
mongo

# Select database
use lifeline-ai-dev

# Create collections with schema validation
db.createCollection("users", { validator: { ... } })
db.createCollection("emergencies", { validator: { ... } })
# ... (See DATABASE_SCHEMA.md for all collections)
```

### Create Indexes

```bash
# Location-based queries (2dsphere for geospatial)
db.emergencies.createIndex({"location": "2dsphere"})
db.ambulances.createIndex({"location": "2dsphere"})

# Text search
db.hospitals.createIndex({"name": "text", "address": "text"})

# Status queries
db.emergencies.createIndex({"status": 1, "createdAt": -1})

# TTL index (auto-cleanup after 30 days)
db.ambulanceLocations.createIndex({"createdAt": 1}, {expireAfterSeconds: 2592000})
```

---

## ✅ Common Issues & Solutions

### Backend Issues

**Issue**: MongoDB connection error
```
MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
```bash
# Check if MongoDB is running
docker-compose ps

# Restart MongoDB
docker-compose restart mongo
```

**Issue**: Port 3000 already in use
```
Error: listen EADDRINUSE :::3000
```
**Solution:**
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use different port
PORT=3002 npm run dev
```

### Frontend Issues

**Issue**: Port 3001 already in use
```bash
# Kill process
lsof -i :3001
kill -9 <PID>

# Or use different port
npm run dev -- -p 3002
```

**Issue**: Dependencies conflict
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### AI Services Issues

**Issue**: Python virtual environment not activated
```bash
# Activate venv
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate      # Windows
```

**Issue**: Module not found
```bash
# Ensure requirements installed
pip install -r requirements.txt

# Verify installation
pip list | grep fastapi
```

---

## ✅ Debugging

### Enable Debug Mode

**Backend:**
```javascript
// Set in .env.local
DEBUG=true
LOG_LEVEL=debug
```

**Frontend:**
```javascript
// In console
localStorage.setItem('DEBUG', '*');
```

**AI Services:**
```python
# In .env.local
DEBUG=True
LOG_LEVEL=DEBUG
```

### View Logs

```bash
# Backend
npm run dev  # Logs appear in terminal

# Frontend
npm run dev  # Check browser console (F12)

# AI Services
python -m uvicorn ...  # Logs appear in terminal

# Docker services
docker-compose logs -f
docker-compose logs -f mongo
docker-compose logs -f redis
```

### Test Endpoints with Debugging

```bash
# Enable verbose curl output
curl -v http://localhost:3000/api/v1/health

# Use -H for custom headers
curl -v -H "Authorization: Bearer token" http://localhost:3000/api/v1/...

# Use -d for request body
curl -v -X POST -H "Content-Type: application/json" \
  -d '{"key": "value"}' \
  http://localhost:3000/api/v1/...
```

---

## ✅ IDE Setup (VS Code)

### Recommended Extensions

- ESLint
- Prettier - Code formatter
- TypeScript Vue Plugin (Volar)
- REST Client
- Thunder Client
- MongoDB for VS Code
- Python
- Pylance

### Workspace Settings

Create `.vscode/settings.json`:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[python]": {
    "editor.defaultFormatter": "ms-python.python",
    "editor.formatOnSave": true
  },
  "files.exclude": {
    "**/__pycache__": true,
    "**/node_modules": true
  }
}
```

---

## ✅ Git Configuration

### Set Git User

```bash
git config user.name "Your Name"
git config user.email "your.email@lifeline.ai"
```

### Create Git Aliases (Optional)

```bash
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
```

### Enable Pre-commit Hooks

```bash
# Install husky
npm install husky --save-dev

# Install pre-commit hook
npx husky install
npx husky add .husky/pre-commit "npm run lint && npm run format"
```

---

## ✅ Next Steps

### For Each Team

**Backend Team:**
1. ✅ Complete backend setup above
2. Read [backend/README.md](backend/README.md)
3. Review [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Module Design section
4. Start implementing modules following emergency-sos example
5. Ensure tests pass: `npm test`

**Frontend Team:**
1. ✅ Complete frontend setup above
2. Read [frontend/README.md](frontend/README.md)
3. Review [API_SPECIFICATION.md](docs/API_SPECIFICATION.md)
4. Create components following shared/types
5. Ensure tests pass: `npm test`

**AI Team:**
1. ✅ Complete AI setup above
2. Read [ai-services/README.md](ai-services/README.md)
3. Review model training notebooks
4. Implement services following FastAPI patterns
5. Ensure tests pass: `pytest`

**DevOps Team:**
1. ✅ Complete infrastructure setup above
2. Read [devops/README.md](devops/README.md)
3. Set up monitoring and logging
4. Configure CI/CD pipeline
5. Test deployment workflows

---

## ✅ Success Criteria

You're ready to start development when:

- ✅ All services running (`docker-compose ps`)
- ✅ MongoDB accessible (`mongo --version`)
- ✅ Redis accessible (`redis-cli ping`)
- ✅ Backend responds (`curl localhost:3000/api/v1/health`)
- ✅ Frontend loads (`http://localhost:3001`)
- ✅ AI services running (`curl localhost:8000/health`)
- ✅ Tests passing (all `npm test` pass)
- ✅ IDE configured with extensions
- ✅ Git configured with user info

---

## ✅ Support & Documentation

- **Architecture**: See [ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **API Details**: See [API_SPECIFICATION.md](docs/API_SPECIFICATION.md)
- **Database**: See [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)
- **Development Standards**: See [DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md)
- **Team Guides**: See team-specific README.md files
- **Project Index**: See [PROJECT_INDEX.md](PROJECT_INDEX.md)

---

## ✅ Troubleshooting Checklist

Having issues? Check this in order:

1. **All services running?** → `docker-compose ps`
2. **Correct ports?** → Check `.env.local` files
3. **Dependencies installed?** → Run `npm install` or `pip install -r requirements.txt`
4. **Environment variables set?** → Verify `.env.local` files have keys
5. **TypeScript built?** → Run `npm run build`
6. **Tests passing?** → Run `npm test` or `pytest`
7. **Check logs** → Look for error messages in terminal
8. **Restart services** → `docker-compose restart`
9. **Ask for help** → Check Slack channel

---

## ✅ First Steps (Pick Your Role)

**I'm a Backend Developer:**
→ Follow backend setup → Read [backend/README.md](backend/README.md) → Implement first module

**I'm a Frontend Developer:**
→ Follow frontend setup → Read [frontend/README.md](frontend/README.md) → Build first page

**I'm an AI/ML Engineer:**
→ Follow AI setup → Read [ai-services/README.md](ai-services/README.md) → Train first model

**I'm a DevOps Engineer:**
→ Follow DevOps setup → Read [devops/README.md](devops/README.md) → Set up CI/CD

---

**Setup Last Updated**: May 27, 2026  
**Setup Version**: 1.0.0  
**Status**: ✅ Ready for Development
