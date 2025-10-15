# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### 1. Database Setup (Neon.tech - Recommended)
1. Go to [Neon.tech](https://neon.tech) and create a free account
2. Create a new project called "clear-choice-insight"
3. Copy your connection details

### 2. Environment Configuration
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your Neon.tech credentials

# Frontend  
cp frontend/env.example frontend/.env
# No changes needed for local development
```

### 3. Database Schema
1. In Neon.tech console, go to SQL Editor
2. Copy and paste the entire content of `backend/schema.sql`
3. Click "Run" to create all tables

### 4. Install Dependencies
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install

# AI Service
cd ../ai-service
pip install -r requirements.txt
```

### 5. Start Development Environment

**Windows:**
```bash
./start-dev.bat
```

**Linux/Mac:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

### 6. Access the Application
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3001
- **AI Service**: http://localhost:8000

## 🔧 Manual Start (if scripts don't work)

**Terminal 1 - AI Service:**
```bash
cd ai-service
python main.py
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

## ✅ Verification

1. **Frontend**: Visit http://localhost:8080 - should see the landing page
2. **Backend**: Visit http://localhost:3001/health - should see API status
3. **AI Service**: Visit http://localhost:8000/health - should see AI service status

## 🐛 Troubleshooting

**Port conflicts**: If ports are in use, change them in:
- Frontend: `vite.config.ts` (port 8080)
- Backend: `backend/.env` (PORT=3001)
- AI Service: `ai-service/main.py` (port 8000)

**Database connection**: Verify your Neon.tech credentials in `backend/.env`

**Python issues**: Ensure you're using Python 3.9+ and have pip installed

## 📚 Next Steps

1. Test the product submission flow
2. Check AI question generation
3. Download a transparency report
4. Read the full documentation in `docs/`

---

**Need help?** Check the main README.md or create an issue on GitHub.

