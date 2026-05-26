# ARCHITECTURE SUMMARY - LifeLine AI

Quick reference guide for the complete LifeLine AI project architecture.

---

## 🎯 Project at a Glance

**Name**: LifeLine AI - Emergency Healthcare Coordination Platform  
**Vision**: Reducing emergency response time and making healthcare accessible for everyone using AI  
**Status**: Architecture & Setup Phase  
**Team Size**: 4 independent teams (Backend, Frontend, AI, DevOps)

---

## 📁 Directory Structure Overview

```
lifeline-ai/
├── docs/                          # Documentation (all teams)
│   ├── ARCHITECTURE.md           # System design (THIS IS THE BIBLE)
│   ├── API_SPECIFICATION.md      # API contracts
│   ├── DATABASE_SCHEMA.md        # Data models
│   ├── DEVELOPMENT_GUIDE.md      # Development standards
│   └── DEPLOYMENT_GUIDE.md       # DevOps
│
├── backend/                       # Node.js/Express API
│   ├── src/modules/              # 22 feature modules (independent)
│   ├── src/services/             # Cross-module business logic
│   └── README.md
│
├── frontend/                      # Next.js 14 web app
│   ├── app/                      # Next.js App Router
│   ├── components/               # React components
│   └── README.md
│
├── ai-services/                  # Python ML services
│   ├── src/modules/              # Triage, Route, Translator, etc.
│   └── README.md
│
├── shared/                        # Shared types & constants
│   ├── types/                    # TypeScript definitions
│   ├── constants/                # Shared constants
│   └── utils/                    # Common utilities
│
├── devops/                        # Infrastructure
│   ├── docker-compose.yml        # Local development
│   ├── Dockerfile.*              # Container definitions
│   └── README.md
│
└── README.md                      # Project overview
```

---

## 🏗️ Architecture Overview

### Tier 1: API Gateway
- **Frontend** → HTTPS + WebSocket → API Gateway
- Handles: CORS, rate limiting, request validation

### Tier 2: Application Layer
```
┌─ Backend (Node.js/Express) ─────────┐
│                                      │
│ ┌──────────────────────────────────┐ │
│ │  22 Modules (Independent)        │ │
│ ├──────────────────────────────────┤ │
│ │ • Emergency SOS                  │ │
│ │ • Ambulance Dispatch             │ │
│ │ • Hospital Finder                │ │
│ │ • AI Triage Integration          │ │
│ │ • Notifications                  │ │
│ │ • [18 more...]                   │ │
│ └──────────────────────────────────┘ │
│                                      │
│ Services Layer:                      │
│ • Location Service                   │
│ • Auth Service                       │
│ • AI Service Client                  │
│ • Notification Service               │
└──────────────────────────────────────┘
```

### Tier 3: Data Layer
- **MongoDB**: Primary database
- **Redis**: Cache & real-time data
- **External APIs**: Maps, Gemini, SMS

### Tier 4: AI/ML Layer
```
┌─ AI Services (Python) ─────────────┐
│                                    │
│ • Triage Analyzer (Severity)       │
│ • Route Optimizer (Traffic AI)     │
│ • Symptom Analyzer (Categorization)│
│ • Language Translator (Multilingual)│
│ • Complaint Analyzer (Patterns)    │
│ • Hotspot Detector (Analytics)     │
└────────────────────────────────────┘
```

---

## 🔗 Key Integrations

### Real-Time Communication
```
Frontend (WebSocket) ←→ Backend (Socket.io)
                          ↓
                    Broadcast to all
                  connected clients in
                  emergency room
```

### Database Relations
```
Users ─┬──→ Patients ──→ EmergencySOS ──┬──→ Ambulances
       │                                 ├──→ Hospitals
       ├──→ Doctors ──────────────────────┴──→ Triage Data
       │
       └──→ Ambulance Drivers ────────────→ Locations
```

### API Communication
```
Frontend ──→ Backend API ──┬──→ MongoDB
                           ├──→ Redis
                           ├──→ AI Services
                           └──→ External APIs
```

---

## 📊 Core Features (22 Modules)

| # | Module | Backend | Frontend | AI | Status |
|---|--------|---------|----------|-------|--------|
| 1 | Emergency SOS | ✅ | ✅ | - | Design |
| 2 | Ambulance Network | ✅ | ✅ | ✅ | Design |
| 3 | Route Optimization | ✅ | ✅ | ✅ | Design |
| 4 | Hospital Recommendation | ✅ | ✅ | ✅ | Design |
| 5 | Patient Health Profile | ✅ | ✅ | - | Design |
| 6 | AI Triage | ✅ | ✅ | ✅ | Design |
| 7 | Doctor Assignment | ✅ | ✅ | ✅ | Design |
| 8 | Multilingual Support | ✅ | ✅ | ✅ | Design |
| 9 | Offline Mode | ✅ | ✅ | - | Design |
| 10 | Voice Assistant | ✅ | ✅ | ✅ | Design |
| ... | [12 more] | ✅ | ✅ | [varies] | Design |

---

## 🚀 Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | Next.js 14 + React 18 | SSR, performance, SEO |
| **Backend** | Node.js + Express + TypeScript | Type-safe, scalable, JavaScript ecosystem |
| **Database** | MongoDB | Flexible schema, real-time queries, scalable |
| **Cache** | Redis | Fast session/data caching, pub-sub |
| **AI/ML** | Python + Gemini/OpenAI | ML libraries, scalability |
| **Real-time** | Socket.io + WebSockets | Live tracking, notifications |
| **Deployment** | Docker + Kubernetes | Container orchestration, scaling |
| **Monitoring** | Sentry + CloudWatch | Error tracking, observability |

---

## 📋 Critical API Endpoints

### Emergency SOS
```
POST   /api/v1/emergency/sos/trigger
GET    /api/v1/emergency/:emergencyId
POST   /api/v1/emergency/:emergencyId/cancel
```

### Ambulance
```
GET    /api/v1/ambulance/nearest
POST   /api/v1/ambulance/:ambulanceId/assign
POST   /api/v1/ambulance/:ambulanceId/location
GET    /api/v1/ambulance/:ambulanceId/tracking
```

### Hospital
```
GET    /api/v1/hospital/nearby
POST   /api/v1/hospital/:hospitalId/admit-patient
GET    /api/v1/hospital/:hospitalId/status
```

### AI Triage
```
POST   /api/v1/ai/triage/analyze
GET    /api/v1/ai/triage/:triageId
```

See [API_SPECIFICATION.md](docs/API_SPECIFICATION.md) for complete API details.

---

## 🗄️ Database Schema Overview

### Key Collections

**Users** → Store all user accounts (Patients, Doctors, Drivers)  
**Patients** → Patient health profiles + medical history  
**EmergencySOS** → Emergency incidents + status tracking  
**Ambulances** → Ambulance fleet + current status  
**AmbulanceLocations** → Real-time GPS data (TTL: 7 days)  
**Hospitals** → Hospital info + bed availability  
**TriageData** → AI triage results  
**Complaints** → User complaints + analytics  
**Notifications** → User notifications (TTL: 90 days)  
**Analytics** → Aggregated metrics (TTL: 1 year)  

See [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) for complete schema.

---

## 🔐 Security Architecture

```
┌────────────────────────────────────┐
│  Frontend (HTTPS only)             │
└────────────┬───────────────────────┘
             │
             ↓
┌────────────────────────────────────┐
│  JWT Authentication                │
│  (Access + Refresh tokens)         │
└────────────┬───────────────────────┘
             │
             ↓
┌────────────────────────────────────┐
│  Rate Limiting                     │
│  (100 req/min per user)            │
└────────────┬───────────────────────┘
             │
             ↓
┌────────────────────────────────────┐
│  RBAC (Role-Based Access Control)  │
│  - PATIENT                         │
│  - DOCTOR                          │
│  - AMBULANCE_DRIVER                │
│  - HOSPITAL_ADMIN                  │
│  - SYSTEM_ADMIN                    │
└────────────┬───────────────────────┘
             │
             ↓
┌────────────────────────────────────┐
│  Input Validation                  │
│  (All fields validated)            │
└────────────┬───────────────────────┘
             │
             ↓
┌────────────────────────────────────┐
│  Database (Encrypted at rest)      │
│  Sensitive fields encrypted        │
└────────────────────────────────────┘
```

---

## 📈 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| API Response Time (p95) | <200ms | N/A (Setup) |
| Page Load Time | <3s | N/A (Setup) |
| Emergency Response Time | <5 min | N/A (Setup) |
| Database Query Time | <50ms | N/A (Setup) |
| Cache Hit Rate | >70% | N/A (Setup) |
| Uptime | 99.9% | N/A (Setup) |

---

## 🚢 Deployment Architecture

### Local Development
```
docker-compose up -d
→ Spins up: MongoDB, Redis, Backend, Frontend, AI Services
→ Hot reload enabled
```

### Staging
```
Google Cloud / AWS
→ Cloud SQL (managed MongoDB)
→ Cloud Run (containerized services)
→ Cloud CDN (frontend)
→ Cloud Logging (monitoring)
```

### Production
```
Multi-Region Setup:
→ Load Balancer (Global)
→ Kubernetes Cluster (Auto-scaling)
→ Managed Database (Replicated)
→ CDN (Cloudflare)
→ Monitoring (Datadog/New Relic)
```

---

## 📚 Documentation Map

| Document | Purpose | Audience |
|----------|---------|----------|
| **[README.md](README.md)** | Project overview | Everyone |
| **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** | System design patterns | Backend, DevOps |
| **[API_SPECIFICATION.md](docs/API_SPECIFICATION.md)** | API contracts | Backend, Frontend |
| **[DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)** | Data models | Backend, DevOps |
| **[DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md)** | Development standards | All developers |
| **[backend/README.md](backend/README.md)** | Backend setup | Backend team |
| **[frontend/README.md](frontend/README.md)** | Frontend setup | Frontend team |
| **[ai-services/README.md](ai-services/README.md)** | AI setup | AI team |
| **[devops/README.md](devops/README.md)** | DevOps & deployment | DevOps team |

---

## 🎬 Quick Start Commands

### Local Development
```bash
# Setup
git clone <repo>
cd lifeline-ai
cp devops/.env.example devops/.env
# Edit .env with your API keys

# Start services
cd devops
docker-compose up -d

# Install dependencies
cd ../backend && npm install
cd ../frontend && npm install
cd ../ai-services && pip install -r requirements.txt

# Run dev servers
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd frontend && npm run dev
# Terminal 3: cd ai-services && python app.py
```

### Run Tests
```bash
cd backend && npm test
cd ../frontend && npm test
cd ../ai-services && pytest
```

### Deploy
```bash
# See devops/README.md for detailed deployment instructions
./deploy.sh staging
./deploy.sh production
```

---

## 🤝 Team Responsibilities

### Backend Team
- REST API implementation
- Database operations
- External API integration
- Business logic

### Frontend Team
- UI/UX components
- State management
- API client integration
- Responsive design

### AI Team
- Model development
- Triage system
- Route optimization
- Analytics

### DevOps Team
- Infrastructure
- Containerization
- CI/CD pipelines
- Monitoring

---

## ⚠️ Critical Success Factors

1. **Strict adherence to architecture** - Modular design enables parallel development
2. **Type safety** - TypeScript prevents bugs at compile time
3. **Testing discipline** - Unit + integration tests catch issues early
4. **Code review process** - Maintain code quality
5. **Performance optimization** - Meet response time SLAs
6. **Security mindset** - Encrypt sensitive data, validate inputs
7. **Documentation** - Keep docs updated as code evolves

---

## 📞 Getting Help

- **Architecture questions**: See [ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **API details**: See [API_SPECIFICATION.md](docs/API_SPECIFICATION.md)
- **Database**: See [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)
- **Development setup**: See [DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md)
- **Team-specific**: See README.md in respective folder

---

## 📝 Version History

| Date | Version | Status |
|------|---------|--------|
| May 27, 2026 | 1.0 | Architecture Complete |
| TBD | 1.1 | Initial Development |
| TBD | 1.2 | Testing & QA |
| TBD | 2.0 | Production Release |

---

## 🎯 Next Steps

1. **Week 1-2**: Database setup & migrations
2. **Week 2-4**: Core modules (SOS, Ambulance, Hospital)
3. **Week 4-5**: AI service integration
4. **Week 5-6**: Testing & optimization
5. **Week 6-7**: Security audit & deployment

---

**Project Status**: 🟡 In Architecture Phase  
**Last Updated**: May 27, 2026  
**Maintained by**: Architecture Team  

---

## Quick Links

- [GitHub Repository](#) (link)
- [Jira Board](#) (link)
- [Design Figma](#) (link)
- [Slack Channel](#) (link)
- [Project Wiki](#) (link)

---

**This is your north star. Refer back to this document frequently. Keep it updated as architecture evolves.**
