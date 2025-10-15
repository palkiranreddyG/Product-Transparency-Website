# Deployment Guide

## Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL database (Neon.tech recommended)
- Git

## Environment Setup

### 1. Database Setup (Neon.tech)
1. Create account at [Neon.tech](https://neon.tech)
2. Create new database project
3. Copy connection details to `.env` file

### 2. Frontend Deployment
```bash
cd frontend
npm install
npm run build
```

### 3. Backend Deployment
```bash
cd backend
npm install
npm start
```

### 4. AI Service Deployment
```bash
cd ai-service
pip install -r requirements.txt
python main.py
```

## Production Environment Variables

### Backend (.env)
```
PGHOST=your-production-host
PGDATABASE=clear_choice_insight
PGUSER=your-production-user
PGPASSWORD=your-production-password
PGPORT=5432
AI_SERVICE_URL=https://your-ai-service-url.com
PORT=3001
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=https://your-frontend-domain.com
```

### AI Service
```
HOST=0.0.0.0
PORT=8000
```

## Database Schema
Run the SQL commands from `backend/schema.sql` on your production database.

## Deployment Platforms

### Vercel (Frontend)
1. Connect GitHub repository
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/dist`

### Railway (Backend)
1. Connect GitHub repository
2. Set start command: `cd backend && npm start`
3. Add environment variables

### Hugging Face Spaces (AI Service)
1. Create new Space
2. Upload `main.py` and `requirements.txt`
3. Set hardware to CPU Basic

## Monitoring
- Health check endpoints available at `/health`
- Logs available through platform dashboards
- Database monitoring through Neon.tech console

## Security Checklist
- [ ] Environment variables properly set
- [ ] CORS origins configured
- [ ] Rate limiting enabled
- [ ] Helmet security headers enabled
- [ ] Database SSL enabled
- [ ] No sensitive data in logs

