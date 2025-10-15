# ClearChoice Insight

**AI-powered Product Transparency Platform**

ClearChoice Insight is a comprehensive platform that empowers consumers and businesses to make informed, ethical decisions through AI-powered product analysis. Built on principles of Health, Wisdom, and Virtue.

## 🚀 Features

- **Complete Transparency**: Full disclosure on ingredients, sourcing, manufacturing processes, and ethical practices
- **AI-Powered Analysis**: Intelligent system generates custom questions to uncover hidden product details
- **Detailed Reports**: Comprehensive transparency reports with download and sharing capabilities
- **Trust Verification**: Multi-layered verification ensures information accuracy
- **Health Impact Assessment**: Understand how products affect your wellbeing
- **Ethical Sourcing Analysis**: Learn about labor practices, environmental impact, and social responsibility

## 🏗️ Architecture

```
clear-choice-insight/
├── frontend/          # React + TypeScript + Tailwind CSS
├── backend/           # Node.js + Express + PostgreSQL
├── ai-service/        # FastAPI + Python
└── docs/              # Documentation
```

## 🛠️ Tech Stack

### Frontend
- **React 18** + TypeScript + Vite
- **shadcn/ui** + Tailwind CSS
- **React Router** for navigation
- **React Hook Form** for form management
- **TanStack Query** for API state management

### Backend
- **Node.js** + Express
- **MongoDB Atlas** (production-ready)
- **PDFKit** for report generation
- **Helmet** for security
- **Rate limiting** and CORS

### AI Service
- **FastAPI** + Python
- **Template-based** question generation
- **Category-specific** intelligence
- **Fallback** mechanisms for reliability

## 📦 Installation

### Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB Atlas account (or local MongoDB)

### Quick Start

1. **Clone the repository:**
```bash
git clone <repository-url>
cd clear-choice-insight
```

2. **Set up the database:**
   - Create a MongoDB Atlas account
   - Get your connection string from Atlas dashboard

3. **Configure environment variables:**
```bash
# Copy example files
cp backend/.env.example backend/.env
cp frontend/env.example frontend/.env

# Edit with your database credentials and API keys
```

4. **Install dependencies:**
```bash
# Install all dependencies at once
npm run install:all

# Or manually:
# Frontend
cd frontend && npm install

# Backend
cd ../backend && npm install

# AI Service
cd ../ai-service && pip install -r requirements.txt
```

5. **Start all services:**
```bash
# Development mode (all services)
npm run dev

# Or use platform-specific scripts:
# Windows
./start-dev.bat

# Linux/Mac
chmod +x start-dev.sh
./start-dev.sh
```

## 🔧 Manual Setup

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will be available at `http://localhost:8080`

### Backend
```bash
cd backend
npm install
npm run dev
```
Backend API will be available at `http://localhost:3001`

### AI Service
```bash
cd ai-service
pip install -r requirements.txt
python main.py
```
AI Service will be available at `http://localhost:8000`

## 📊 API Endpoints

### Products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product details
- `GET /api/products` - List products (with pagination)

### Questions
- `POST /api/questions/generate` - Generate AI questions
- `GET /api/questions/product/:id` - Get product questions
- `POST /api/questions/:id/response` - Submit response

### Reports
- `POST /api/reports/generate` - Generate transparency report
- `GET /api/reports/:id/pdf` - Download PDF report
- `GET /api/reports/:id` - Get report data

See `docs/API.md` for detailed documentation.

## 🗄️ Database Schema

The application uses PostgreSQL with the following main tables:
- `products` - Basic product information
- `product_submissions` - Form submission data
- `ai_questions` - Dynamically generated questions
- `user_responses` - Answers to questions
- `transparency_reports` - Generated reports

See `backend/schema.sql` for the complete schema.

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/dist`

### Backend (Railway/Heroku)
1. Connect GitHub repository
2. Set start command: `cd backend && npm start`
3. Add PostgreSQL database
4. Set environment variables

### AI Service (Hugging Face Spaces)
1. Create new Space
2. Upload `main.py` and `requirements.txt`
3. Set hardware to CPU Basic

See `docs/DEPLOYMENT.md` for detailed deployment instructions.

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel:**
   - Import your GitHub repository to Vercel
   - Vercel will automatically detect the configuration

2. **Set Environment Variables in Vercel:**
   ```
   MONGO_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-production-jwt-secret
   CORS_ORIGIN=https://your-app-name.vercel.app
   GEMINI_API_KEY=your-gemini-api-key
   AI_SERVICE_URL=https://your-ai-service-url.vercel.app (optional)
   ```

3. **Deploy:**
   - Vercel will build and deploy automatically
   - Frontend will be available at `https://your-app-name.vercel.app`
   - Backend API at `https://your-app-name.vercel.app/api/*`

### Manual Deployment

For custom deployments, use the provided scripts:
```bash
npm run build    # Build frontend
npm run start    # Start production server
```

## 🔒 Environment Variables

### Backend (.env)
```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Server
PORT=3001
NODE_ENV=production

# Security
JWT_SECRET=your-production-jwt-secret

# CORS (comma-separated for multiple origins)
CORS_ORIGIN=https://your-frontend-domain.vercel.app,https://another-domain.com

# AI Services
AI_SERVICE_URL=https://your-ai-service.vercel.app
GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-api-key
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-domain.vercel.app
VITE_NODE_ENV=production
VITE_AI_SERVICE_URL=https://your-ai-service.vercel.app
```

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# AI service tests
cd ai-service && python -m pytest
```

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions or support:
- Create an issue on GitHub
- Email: support@clearchoiceinsight.com
- Documentation: `docs/` folder

## 🎯 Roadmap

- [ ] User authentication and accounts
- [ ] Advanced AI models for question generation
- [ ] Real-time collaboration features
- [ ] Mobile app (React Native)
- [ ] Blockchain integration for data integrity
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

---

**Built with ❤️ for transparency and ethical consumerism**