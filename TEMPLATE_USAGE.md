# How to Use This Template

This guide explains how to use this template to create new full-stack projects.

## Creating a New Project from This Template

### Option 1: Copy the Template (Recommended)

```bash
# Copy the entire template folder
cp -r "Full Stack Project Template" my-new-project

# Navigate to your new project
cd my-new-project

# Initialize a new git repository
git init

# Install dependencies
npm run install:all

# Configure environment
cd backend
cp .env.example .env
cd ..

# Start development
npm run dev
```

### Option 2: Use as a Git Template

```bash
# Clone or copy this repository
git clone <your-template-repo> my-new-project

# Or if you've made this a GitHub template:
# Click "Use this template" on GitHub

cd my-new-project

# Install dependencies
npm run install:all

# Configure environment
cd backend
cp .env.example .env
cd ..

# Start development
npm run dev
```

## Customizing Your New Project

### 1. Update Project Information

**Root package.json:**
```json
{
  "name": "my-project-name",
  "description": "My awesome project description",
  "author": "Your Name"
}
```

**Frontend package.json:**
```json
{
  "name": "my-project-frontend"
}
```

**Backend package.json:**
```json
{
  "name": "my-project-backend"
}
```

### 2. Update Branding

**Update the logo and name in:**
- `frontend/src/components/Header.tsx`
- `frontend/src/components/Footer.tsx`
- `frontend/index.html` (title and meta tags)

### 3. Customize Colors

**Edit Tailwind config in `frontend/index.html`:**
```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: {
          // Your custom color palette
          500: '#your-color',
          600: '#your-color',
          700: '#your-color',
        }
      }
    }
  }
}
```

### 4. Add Your Features

**Backend:**
1. Create new controllers in `backend/src/controllers/`
2. Create new routes in `backend/src/routes/`
3. Register routes in `backend/src/server.ts`

**Frontend:**
1. Create new components in `frontend/src/components/`
2. Create new pages in `frontend/src/pages/`
3. Update `frontend/src/App.tsx` to use your pages

### 5. Configure AI Provider (Optional)

Edit `backend/.env`:
```env
# Change from mock to real provider
AI_PROVIDER=openai  # or anthropic, azure
AI_API_KEY=your_api_key_here
AI_MODEL=gpt-4
```

Then implement the actual API calls in `backend/src/services/mcp.service.ts`.

## What to Keep vs. What to Change

### Keep (Core Structure)
- ✅ Overall project structure
- ✅ Build and development scripts
- ✅ TypeScript configuration
- ✅ Vite configuration
- ✅ Express server setup
- ✅ Middleware patterns
- ✅ Component architecture

### Customize (Your Content)
- 🎨 Branding (colors, logo, name)
- 📝 Content (text, images)
- 🔧 Features (add your own)
- 🎯 Business logic
- 📊 Data models
- 🎨 UI components (extend or replace)

### Remove (If Not Needed)
- 🗑️ HelloWorld controller (example only)
- 🗑️ AI Assistant (if not using AI)
- 🗑️ Example components
- 🗑️ Landing page content

## Common Customizations

### Adding a Database

1. **Install database driver:**
```bash
cd backend
npm install mongoose  # for MongoDB
# or
npm install pg        # for PostgreSQL
```

2. **Create database service:**
```typescript
// backend/src/services/database.service.ts
export const connectDatabase = async () => {
  // Your connection logic
};
```

3. **Add to server.ts:**
```typescript
import { connectDatabase } from './services/database.service';

// Before starting server
await connectDatabase();
```

### Adding Authentication

1. **Install packages:**
```bash
cd backend
npm install jsonwebtoken bcrypt
npm install -D @types/jsonwebtoken @types/bcrypt
```

2. **Create auth middleware:**
```typescript
// backend/src/middleware/auth.middleware.ts
export const authenticate = (req, res, next) => {
  // Your auth logic
};
```

3. **Protect routes:**
```typescript
router.get('/protected', authenticate, controller.method);
```

### Adding Routing

1. **Install React Router:**
```bash
cd frontend
npm install react-router-dom
```

2. **Set up routes in App.tsx:**
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/about" element={<About />} />
  </Routes>
</BrowserRouter>
```

### Adding State Management

1. **Install Zustand (recommended) or Redux:**
```bash
cd frontend
npm install zustand
```

2. **Create store:**
```typescript
// frontend/src/store/store.ts
import create from 'zustand';

export const useStore = create((set) => ({
  // Your state here
}));
```

## Deployment

### Frontend (Vercel/Netlify)

```bash
cd frontend
npm run build
# Deploy the 'dist' folder
```

### Backend (Heroku/Railway/Render)

```bash
cd backend
npm run build
npm start
# Set environment variables in hosting dashboard
```

### Full Stack (Single Server)

```bash
# Build both
npm run build

# Serve frontend from backend
# Add to backend/src/server.ts:
app.use(express.static(path.join(__dirname, '../../frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});
```

## Best Practices

1. **Keep the template updated**: Periodically check for updates to dependencies
2. **Follow the patterns**: Use the existing patterns for consistency
3. **Type everything**: Leverage TypeScript for better development experience
4. **Test as you go**: Add tests alongside features
5. **Document changes**: Update README as you add features

## Getting Help

- Review the main [README.md](README.md) for architecture details
- Check [QUICKSTART.md](QUICKSTART.md) for setup issues
- Review example code in the template
- Check component implementations for patterns

## Template Maintenance

If you're maintaining this template for your team:

1. Keep dependencies updated
2. Add common features as needed
3. Document customization patterns
4. Include examples for common tasks
5. Share team-specific conventions

---

Happy building! 🚀
