# ⚡ Cruizr Quick Start Guide

Get your Cruizr instance running in 5 minutes!

## 1. Clone & Install

```bash
git clone <your-repo-url>
cd studio
npm install
```

## 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your credentials
# Minimum required:
# - NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
# - GOOGLE_GENAI_API_KEY (for AI features)
```

### Get API Keys

**Mapbox Token** (Required for maps)
1. Sign up at https://account.mapbox.com/
2. Create a new token
3. Copy to `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`

**Google AI API Key** (Required for AI features)
1. Visit https://aistudio.google.com/app/apikey
2. Create API key
3. Copy to `GOOGLE_GENAI_API_KEY`

**Firebase** (Required for full functionality)
1. Create project at https://console.firebase.google.com/
2. Add web app to get configuration
3. Copy all Firebase config values to .env.local

## 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:9002 🎉

## 4. Test the Application

### Login Page (/)
- Modern dark theme
- Email/password form
- Google OAuth button

### Dashboard (/dashboard)
- 6 realm cards (Connect, Social, Dating, Hook Up, Party, Ghost)
- Avatar generator link
- Realm selection interface

### Map View (/map)
- Interactive Mapbox map
- Sidebar with realm navigation
- VeilMode™ privacy controls

### Avatar Generator (/avatar-generator)
- AI-powered avatar styling
- Style selection dropdown
- Photo upload interface

## 5. Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 6. Deploy to Firebase (Optional)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init

# Deploy
firebase deploy
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.

## Troubleshooting

### Port 9002 already in use
```bash
# Kill process on port 9002
npx kill-port 9002
# Or use different port
PORT=3000 npm run dev
```

### Build errors
```bash
# Clear Next.js cache
rm -rf .next
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Environment variables not loading
- Restart dev server after changing .env.local
- Check variable names match exactly (case-sensitive)
- Ensure NEXT_PUBLIC_ prefix for client-side vars

## Features Overview

✅ **Working Now**
- Modern UI with Radix components
- Dark theme
- Responsive design
- System fonts (no external dependencies)
- Production-ready build
- TypeScript strict mode

🚧 **Needs Configuration**
- Firebase Authentication (add credentials)
- Firestore Database (add credentials)
- Mapbox Maps (add token)
- Google AI (add API key)

📋 **Future Enhancements**
- Real-time messaging
- Push notifications
- Advanced matching algorithms
- Content moderation
- PWA support

## Project Structure

```
studio/
├── src/
│   ├── app/              # Next.js pages
│   │   ├── page.tsx      # Login page
│   │   ├── dashboard/    # Realm selection
│   │   ├── map/          # Interactive map
│   │   └── avatar-generator/
│   ├── components/
│   │   ├── ui/           # Radix UI components
│   │   └── cruizr/       # Custom components
│   ├── ai/               # AI flows
│   │   ├── genkit.ts     # Genkit config
│   │   └── flows/        # AI generation flows
│   ├── lib/              # Utilities
│   └── hooks/            # React hooks
├── public/               # Static assets
├── .env.example          # Environment template
├── firebase.json         # Firebase config
├── firestore.rules       # Database security
├── DEPLOYMENT.md         # Full deployment guide
└── package.json          # Dependencies

```

## Next Steps

1. ✅ Configure environment variables
2. ✅ Test all pages work
3. ⬜ Set up Firebase project
4. ⬜ Configure authentication
5. ⬜ Deploy to production
6. ⬜ Add custom domain

## Resources

- [Full Deployment Guide](./DEPLOYMENT.md)
- [Architecture Documentation](./docs/ARCHITECTURE.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Mapbox Documentation](https://docs.mapbox.com/)

## Support

For issues, questions, or contributions:
- Create an issue in the repository
- Check existing documentation
- Review troubleshooting section

---

**Current Status**: Development-Ready ✅  
**Build Status**: Passing ✅  
**Last Updated**: 2025-12-12
