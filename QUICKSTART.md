# Quick Start Guide

Get your full-stack application running in 3 simple steps!

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation & Setup

### Step 1: Install Dependencies

```bash
npm run install:all
```

This will install all dependencies for the root, frontend, and backend projects.

### Step 2: Configure Environment

```bash
cd backend
cp .env.example .env
cd ..
```

Edit `backend/.env` if you need to customize settings. The defaults work out of the box.

### Step 3: Start Development Servers

```bash
npm run dev
```

This starts both frontend and backend servers concurrently:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## What's Running?

- **Frontend (React)**: Modern UI with Tailwind CSS
- **Backend (Express)**: RESTful API with TypeScript
- **AI Assistant**: Integrated chat interface (click "AI Assistant" button)

## Test the API

Open http://localhost:3000 in your browser and:

1. See the HelloWorld API greeting on the homepage
2. Try the personalized greeting form
3. Click "AI Assistant" in the header to chat with the AI

## Available Commands

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start only frontend
npm run dev:backend      # Start only backend

# Production Build
npm run build            # Build both projects
npm start                # Start production server

# Individual Projects
cd frontend && npm run dev     # Frontend dev server
cd backend && npm run dev      # Backend dev server
```

## Project Structure

```
project/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   └── App.tsx      # Main app
│   └── package.json
├── backend/           # Express API
│   ├── src/
│   │   ├── routes/      # API routes
│   │   ├── controllers/ # Business logic
│   │   └── services/    # MCP & services
│   └── package.json
└── shared/            # Shared types
```

## Next Steps

1. **Customize the UI**: Edit components in `frontend/src/components/`
2. **Add API Endpoints**: Create new controllers in `backend/src/controllers/`
3. **Configure AI**: Update `backend/.env` with your AI provider settings
4. **Add Features**: Build on top of the template structure

## Troubleshooting

### Port Already in Use

If port 3000 or 5000 is already in use:
1. Update `backend/.env` to change PORT
2. Update `frontend/vite.config.ts` proxy configuration

### Dependencies Issues

```bash
# Clear and reinstall
rm -rf node_modules frontend/node_modules backend/node_modules
rm package-lock.json frontend/package-lock.json backend/package-lock.json
npm run install:all
```

## Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review the code examples in the template
- Check API endpoints at http://localhost:5000/api/health

---

**You're all set!** Start building your application. 🚀
