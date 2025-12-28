# Quick Start Guide - Cruizr App

Get up and running with Cruizr in 5 minutes! This guide covers local development setup.

## Prerequisites

- Node.js 20 or higher
- npm (comes with Node.js)
- Git
- A code editor (VS Code recommended)

## 1. Clone the Repository

```bash
git clone https://github.com/AndySDisIT/studio.git
cd studio
```

## 2. Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, React, Tailwind CSS, and other dependencies.

## 3. Set Up Environment Variables

### Copy the example environment file:

```bash
cp .env.example .env.local
```

### Get Your API Keys

You need two API keys to run the app locally:

#### A. Mapbox Access Token (Required for Maps)

1. Go to [mapbox.com](https://www.mapbox.com/) and sign up/login
2. Navigate to [Account → Access Tokens](https://account.mapbox.com/access-tokens/)
3. Click "Create a token"
4. Copy the token

#### B. Google AI API Key (Required for AI Features)

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API Key"
3. Create or select a project
4. Copy the API key

### Update `.env.local`:

```env
# Required for local development
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
GOOGLE_GENAI_API_KEY=your_google_ai_api_key_here

# Optional - for Firebase features (can skip for basic local dev)
# NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
# NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 4. Run the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:9002](http://localhost:9002)

🎉 **You're now running Cruizr locally!**

## 5. Testing the App

### Main Dashboard
- Navigate to [http://localhost:9002/dashboard](http://localhost:9002/dashboard)
- Explore the social discovery features
- View the interactive map (requires Mapbox token)

### AI Avatar Generator
- Navigate to [http://localhost:9002/avatar-generator](http://localhost:9002/avatar-generator)
- Test the AI-powered avatar generation (requires Google AI key)
- Try different styles and prompts

### Map Features
- The app uses Mapbox GL for interactive maps
- Ensure your Mapbox token is valid
- Check browser console for any map-related errors

## Available Scripts

```bash
# Development server with Turbopack (faster)
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Production build
npm run build

# Start production server
npm start

# Genkit development (for AI features)
npm run genkit:dev

# Genkit with hot reload
npm run genkit:watch
```

## Project Structure

```
studio/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── dashboard/    # Main dashboard page
│   │   ├── avatar-generator/  # AI avatar generator
│   │   └── layout.tsx    # Root layout
│   ├── components/       # Reusable React components
│   │   └── ui/          # shadcn/ui components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   └── ai/              # Genkit AI flows
├── public/              # Static assets
├── docs/                # Documentation
└── .env.local          # Local environment variables (you create this)
```

## Common Issues & Solutions

### Issue: "Module not found" errors

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Issue: Map not loading

**Possible causes:**
- Invalid or missing Mapbox token
- Token doesn't have required scopes

**Solution:**
1. Verify your token is set in `.env.local`
2. Check the browser console for specific errors
3. Ensure the token has `styles:read` and `fonts:read` scopes

### Issue: AI features not working

**Possible causes:**
- Missing or invalid Google AI API key
- API rate limit exceeded

**Solution:**
1. Verify your API key is set in `.env.local`
2. Check [Google AI Studio](https://aistudio.google.com/) for quota limits
3. Review browser console for specific error messages

### Issue: Port 9002 already in use

**Solution:**
```bash
# Change the port in package.json or run:
npm run dev -- -p 3000
```

### Issue: TypeScript errors

**Solution:**
```bash
# Run type checking
npm run typecheck

# If errors persist, ensure all dependencies are installed
npm install
```

### Issue: Build fails with font errors

**Solution:**
This has been fixed in the latest version. The app now uses system fonts instead of Google Fonts. If you still see font-related errors:
```bash
# Pull the latest changes
git pull origin main
npm install
```

## Development Tips

### 1. Hot Reload
- The development server supports hot module replacement (HMR)
- Changes to files automatically reload the browser
- CSS changes apply instantly without page reload

### 2. Debugging
- Use browser DevTools for frontend debugging
- Check the terminal for server-side logs
- Review Next.js build output for optimization tips

### 3. Code Quality
- Run `npm run lint` before committing
- Run `npm run typecheck` to catch TypeScript errors
- Use the VS Code ESLint extension for real-time feedback

### 4. Working with AI Features
- The AI features use Genkit with Google's Gemini model
- Test with `npm run genkit:dev` for a dedicated AI development environment
- Monitor AI usage to stay within free tier limits

## Testing AI Features Locally

### 1. Start the Genkit Development Server

```bash
npm run genkit:dev
```

This opens a local Genkit UI at [http://localhost:4000](http://localhost:4000)

### 2. Test AI Flows

The app includes three main AI flows:
- **Generate Avatar**: Creates profile images from descriptions
- **Generate Profile Summary**: Creates compelling profile summaries
- **Suggest Icebreakers**: Suggests conversation starters

### 3. Using the Genkit UI

1. Select a flow from the dropdown
2. Enter test input data
3. Click "Run" to execute the flow
4. Review the output and streaming results

## Next Steps

### For Local Development
- ✅ Explore the codebase in `src/`
- ✅ Read component documentation in `docs/`
- ✅ Customize the UI theme in `src/app/globals.css`
- ✅ Add new features or pages

### For Production Deployment
- ✅ Read [DEPLOYMENT.md](./DEPLOYMENT.md) for Firebase setup
- ✅ Configure GitHub Actions for CI/CD
- ✅ Set up Firebase security rules
- ✅ Configure custom domain

## Getting Help

### Documentation
- **Deployment:** See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Full README:** See [README.md](./README.md)
- **Architecture:** See [docs/blueprint.md](./docs/blueprint.md)

### Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/)
- [Genkit Documentation](https://firebase.google.com/docs/genkit)

### Support
- Check existing [GitHub Issues](https://github.com/AndySDisIT/studio/issues)
- Create a new issue for bugs or feature requests
- Review pull requests for ongoing work

---

**Happy coding! 🚀**

If you encounter any issues not covered here, please refer to [DEPLOYMENT.md](./DEPLOYMENT.md) or create a GitHub issue.
