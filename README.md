# Cruizr - Intelligent Social Discovery Platform

[![Deploy to Firebase](https://github.com/AndySDisIT/studio/actions/workflows/firebase-deploy.yml/badge.svg)](https://github.com/AndySDisIT/studio/actions)
[![Next.js](https://img.shields.io/badge/Next.js-15.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-App%20Hosting-orange)](https://firebase.google.com/)

Cruizr is a next-generation social discovery platform that connects people in the real world through intelligent, safe, and contextual social interactions. Built with cutting-edge AI technology and modern web frameworks, Cruizr reimagines how people meet and interact in physical spaces.

## ✨ Features

### 🗺️ **Location-Based Discovery**
- Real-time interactive maps powered by Mapbox
- Discover people and events in your vicinity
- Realm-based location filtering (bars, cafes, parks, etc.)
- Dynamic map visualization with custom markers

### 🤖 **AI-Powered Features**
- **Smart Profile Generation**: AI-generated profile summaries using Google Gemini
- **Avatar Generator**: Create unique profile pictures with AI
- **Intelligent Icebreakers**: Context-aware conversation starters
- **Compatibility Matching**: AI-driven user matching based on interests and context

### 💬 **Social Features**
- Direct messaging system
- User profiles with interests and preferences
- Event discovery and participation
- Safe and verified user interactions

### 🎨 **Modern UI/UX**
- Beautiful dark mode interface
- Responsive design for mobile and desktop
- Smooth animations with Framer Motion
- Accessible components built with Radix UI

## 🚀 Quick Start

Get started with Cruizr in minutes:

```bash
# Clone the repository
git clone https://github.com/AndySDisIT/studio.git
cd studio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run the development server
npm run dev
```

Visit [http://localhost:9002](http://localhost:9002) to see the app in action!

📖 **For detailed setup instructions, see [QUICKSTART.md](./QUICKSTART.md)**

## 📋 Prerequisites

- **Node.js** 20 or higher
- **npm** (comes with Node.js)
- **Mapbox Access Token** - [Get one here](https://account.mapbox.com/access-tokens/)
- **Google AI API Key** - [Get one here](https://aistudio.google.com/)

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Framer Motion](https://www.framer.com/motion/)** - Animations
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives

### Backend & Services
- **[Firebase App Hosting](https://firebase.google.com/docs/app-hosting)** - Hosting platform
- **[Firebase](https://firebase.google.com/)** - Authentication, Firestore, Storage (future)
- **[Genkit](https://firebase.google.com/docs/genkit)** - AI framework by Firebase
- **[Google Gemini](https://ai.google.dev/)** - Large language model for AI features
- **[Mapbox](https://www.mapbox.com/)** - Maps and location services

### Development Tools
- **ESLint** - Code linting
- **TypeScript Compiler** - Type checking
- **GitHub Actions** - CI/CD pipeline

## 📁 Project Structure

```
studio/
├── src/
│   ├── app/                      # Next.js app router
│   │   ├── dashboard/           # Main dashboard
│   │   ├── avatar-generator/    # AI avatar generator
│   │   ├── layout.tsx           # Root layout
│   │   └── globals.css          # Global styles
│   ├── components/              # React components
│   │   └── ui/                 # Reusable UI components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   └── ai/                     # Genkit AI flows and configuration
├── public/                      # Static assets
├── docs/                        # Documentation
├── .github/workflows/           # CI/CD workflows
├── apphosting.yaml             # Firebase App Hosting config
├── firebase.json               # Firebase configuration
├── firestore.rules             # Firestore security rules
├── storage.rules               # Storage security rules
└── .env.example                # Environment variables template
```

## 🌐 Environment Variables

Cruizr requires several environment variables to function. Copy `.env.example` to `.env.local` and fill in your values:

### Required for Local Development
```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
GOOGLE_GENAI_API_KEY=your_google_ai_key
```

### Required for Production
```env
# All of the above, plus:
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on obtaining these values.

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start development server with Turbopack
npm run genkit:dev      # Start Genkit development environment
npm run genkit:watch    # Start Genkit with hot reload

# Production
npm run build           # Build for production
npm start              # Start production server

# Code Quality
npm run lint           # Run ESLint
npm run typecheck      # Run TypeScript type checking
```

## 🚀 Deployment

Cruizr uses Firebase App Hosting with automated GitHub Actions CI/CD.

### Automatic Deployment

1. Push to the `main` branch
2. GitHub Actions automatically:
   - Runs tests and linting
   - Builds the application
   - Deploys to Firebase

### Manual Deployment

```bash
npm run build
firebase deploy
```

📖 **For complete deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

## 🔒 Security

Cruizr implements multiple security layers:

- **Firebase Security Rules** - Database and storage access control
- **Environment Variables** - Sensitive data protection
- **Type Safety** - TypeScript for compile-time safety
- **Input Validation** - Zod schema validation
- **Rate Limiting** - API usage controls (via Firebase)

Security rules are defined in:
- `firestore.rules` - Firestore database rules
- `storage.rules` - Firebase Storage rules

## 📖 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 5 minutes
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide
- **[docs/blueprint.md](./docs/blueprint.md)** - Architecture and design decisions

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code:
- Passes all linting checks (`npm run lint`)
- Passes type checking (`npm run typecheck`)
- Includes appropriate documentation
- Follows the existing code style

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature request? Please create an issue on GitHub:

1. Check if the issue already exists
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Screenshots if applicable

## 📄 License

This project is private and proprietary. All rights reserved.

## 🙏 Acknowledgments

- **Firebase** - For the amazing App Hosting platform and Genkit framework
- **Google** - For Gemini AI model access
- **Mapbox** - For beautiful map rendering
- **Vercel** - For Next.js and the incredible developer experience
- **shadcn/ui** - For beautiful and accessible UI components

## 📞 Support

Need help? Here are some resources:

- **Documentation**: Check [QUICKSTART.md](./QUICKSTART.md) and [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues**: [GitHub Issues](https://github.com/AndySDisIT/studio/issues)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Firebase Docs**: [firebase.google.com/docs](https://firebase.google.com/docs)

---

**Built with ❤️ using Next.js, Firebase, and AI**


