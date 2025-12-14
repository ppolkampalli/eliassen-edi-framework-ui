# Full Stack Project Template

A modern, production-ready full-stack TypeScript template with React 19, Express.js, Tailwind CSS, and AI Assistant capabilities powered by MCP (Model Context Protocol).

## Features

- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS (CDN)
- **Backend**: Express.js + TypeScript + Node.js
- **AI Integration**: Built-in AI Assistant with MCP infrastructure
- **Components**: Pre-built Header, Footer, Hamburger Menu, and AI Assistant UI
- **API Layer**: RESTful API with example controllers
- **Development**: Hot reload for both frontend and backend
- **TypeScript**: End-to-end type safety with shared types
- **Modern UI**: Responsive design with Tailwind CSS

## Project Structure

```
project-name/
├── frontend/              # React 19 + Vite + TypeScript
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── HamburgerMenu.tsx
│   │   │   └── AIAssistant.tsx
│   │   ├── pages/         # Page components
│   │   │   └── Landing.tsx
│   │   ├── App.tsx        # Main application component
│   │   ├── main.tsx       # Application entry point
│   │   └── index.css      # Global styles
│   ├── public/            # Static assets
│   ├── index.html         # HTML template with Tailwind CDN
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── backend/               # Express.js + TypeScript
│   ├── src/
│   │   ├── routes/        # API route definitions
│   │   │   ├── helloworld.routes.ts
│   │   │   └── ai.routes.ts
│   │   ├── controllers/   # Business logic
│   │   │   ├── helloworld.controller.ts
│   │   │   └── ai.controller.ts
│   │   ├── services/      # MCP and AI services
│   │   │   └── mcp.service.ts
│   │   ├── middleware/    # Express middleware
│   │   │   ├── cors.middleware.ts
│   │   │   └── error.middleware.ts
│   │   └── server.ts      # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── shared/                # Shared utilities and types
│   └── types.ts
├── package.json           # Root package.json with scripts
├── .gitignore
└── README.md              # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm installed
- Git (optional)

### Installation

1. **Clone or download this template**
   ```bash
   # If using as a template, copy the entire folder
   cp -r "Full Stack Project Template" my-new-project
   cd my-new-project
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```
   This command installs dependencies for root, frontend, and backend.

3. **Configure environment variables**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development servers**
   ```bash
   # From root directory
   npm run dev
   ```
   This starts both frontend (port 3000) and backend (port 5000) concurrently.

### Available Scripts

#### Root Level Scripts

- `npm run install:all` - Install dependencies for all projects
- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only the frontend development server
- `npm run dev:backend` - Start only the backend development server
- `npm run build` - Build both frontend and backend for production
- `npm run build:frontend` - Build only the frontend
- `npm run build:backend` - Build only the backend
- `npm start` - Start production backend server

#### Frontend Scripts (in `frontend/` directory)

- `npm run dev` - Start Vite development server (port 3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (if configured)

#### Backend Scripts (in `backend/` directory)

- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server

## Architecture

### Frontend Architecture

The frontend is built with React 19 and uses modern patterns:

- **Component Structure**: Functional components with hooks
- **Styling**: Tailwind CSS via CDN for rapid development
- **State Management**: React hooks (useState, useEffect)
- **API Communication**: Fetch API with proxy configuration
- **Routing**: Single page for simplicity (expand with React Router as needed)

### Backend Architecture

The backend follows MVC patterns:

- **Routes**: Define API endpoints and HTTP methods
- **Controllers**: Handle request/response logic
- **Services**: Business logic and external integrations (MCP)
- **Middleware**: CORS, error handling, logging

### API Endpoints

#### HelloWorld API
- `GET /api/helloworld` - Returns a simple greeting message
- `POST /api/helloworld/greet` - Custom greeting with name

#### AI Assistant API
- `POST /api/ai/chat` - Send message to AI assistant
- `GET /api/ai/health` - Check AI service status

### MCP Infrastructure

The template includes Model Context Protocol (MCP) infrastructure for AI capabilities:

- **MCP Service** (`backend/src/services/mcp.service.ts`): Core MCP integration
- **AI Controller** (`backend/src/controllers/ai.controller.ts`): Handles AI requests
- **AI Routes** (`backend/src/routes/ai.routes.ts`): API endpoints for AI
- **AI Assistant UI** (`frontend/src/components/AIAssistant.tsx`): Chat interface

The MCP service provides a standardized way to integrate AI models and can be extended to support multiple providers (OpenAI, Anthropic, Azure OpenAI, etc.).

## UI Components

### Header Component
- Responsive navigation bar
- Integrated hamburger menu for mobile
- Customizable navigation links

### Footer Component
- Copyright information
- Social media links (customizable)
- Responsive layout

### Hamburger Menu
- Mobile-friendly navigation
- Smooth animations
- Toggleable visibility

### AI Assistant
- Chat interface
- Message history
- Real-time responses
- Collapsible panel
- Loading states

## Customization Guide

### Adding New API Endpoints

1. Create a controller in `backend/src/controllers/`:
   ```typescript
   export const myController = {
     myMethod: async (req, res) => {
       // Your logic here
       res.json({ message: "Success" });
     }
   };
   ```

2. Create routes in `backend/src/routes/`:
   ```typescript
   import express from 'express';
   import { myController } from '../controllers/my.controller';

   const router = express.Router();
   router.get('/endpoint', myController.myMethod);

   export default router;
   ```

3. Register routes in `backend/src/server.ts`:
   ```typescript
   import myRoutes from './routes/my.routes';
   app.use('/api/my', myRoutes);
   ```

### Adding New UI Components

1. Create component in `frontend/src/components/`:
   ```typescript
   export const MyComponent = () => {
     return (
       <div className="p-4">
         {/* Your component */}
       </div>
     );
   };
   ```

2. Import and use in pages or App.tsx:
   ```typescript
   import { MyComponent } from './components/MyComponent';
   ```

### Customizing Tailwind

The template uses Tailwind CSS CDN for simplicity. For production:

1. Install Tailwind as a dependency:
   ```bash
   cd frontend
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

2. Update `index.html` to remove CDN link

3. Configure `tailwind.config.js` with your custom theme

### Environment Variables

Backend environment variables (`.env`):

```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# AI/MCP Configuration
AI_PROVIDER=mock  # Options: mock, openai, anthropic, azure
AI_API_KEY=your_api_key_here
AI_MODEL=gpt-4

# Optional: Database connection strings, API keys, etc.
```

## Production Deployment

### Building for Production

```bash
npm run build
```

This compiles TypeScript and builds optimized frontend assets.

### Deployment Options

#### Option 1: Single Server (Backend serves Frontend)

1. Build both projects
2. Copy `frontend/dist` to `backend/dist/public`
3. Configure backend to serve static files
4. Deploy backend to your hosting provider

#### Option 2: Separate Deployment

1. Deploy frontend to Vercel, Netlify, or similar
2. Deploy backend to Heroku, Railway, or similar
3. Update CORS settings in backend
4. Update API URL in frontend

### Environment Variables in Production

Set these in your hosting provider's dashboard:
- `PORT` (usually auto-assigned)
- `NODE_ENV=production`
- `CORS_ORIGIN` (your frontend URL)
- AI API keys and configuration

## Development Tips

### Hot Reload

- Frontend: Vite provides instant HMR (Hot Module Replacement)
- Backend: Nodemon watches for file changes and restarts server

### Debugging

- Frontend: Use React DevTools browser extension
- Backend: Use `console.log()` or attach debugger to Node process
- API: Test endpoints with Postman or curl

### Code Organization

- Keep components small and focused
- Use shared types for API contracts
- Extract reusable logic into services
- Follow consistent naming conventions

### Performance Optimization

- Use React.memo() for expensive components
- Implement lazy loading for routes
- Optimize images and assets
- Enable production builds for deployment

## Troubleshooting

### Port Already in Use

If ports 3000 or 5000 are already in use:

1. Change port in `backend/.env` (PORT=5001)
2. Update proxy in `frontend/vite.config.ts`
3. Restart servers

### CORS Errors

Ensure `CORS_ORIGIN` in backend `.env` matches your frontend URL.

### TypeScript Errors

Run type checking:
```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm run build
```

### Dependency Issues

Clear and reinstall:
```bash
rm -rf node_modules package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
rm -rf backend/node_modules backend/package-lock.json
npm run install:all
```

## Next Steps

After setting up the template:

1. **Update Project Info**: Edit package.json files with your project name
2. **Customize Design**: Modify Tailwind classes and add your brand colors
3. **Add Features**: Implement your specific business logic
4. **Add Routing**: Install React Router for multi-page applications
5. **Add State Management**: Consider Redux or Zustand for complex state
6. **Add Database**: Integrate MongoDB, PostgreSQL, or your preferred database
7. **Add Authentication**: Implement JWT, OAuth, or session-based auth
8. **Add Testing**: Set up Jest and React Testing Library
9. **Add CI/CD**: Configure GitHub Actions or similar for automated deployments

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Express.js Documentation](https://expressjs.com)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [MCP Protocol Specification](https://modelcontextprotocol.io)

## License

This template is free to use for any purpose. Modify and distribute as needed.

## Support

For issues or questions about this template:
1. Check the troubleshooting section
2. Review the documentation linked above
3. Search for similar issues online

---

**Happy Coding!** 🚀
