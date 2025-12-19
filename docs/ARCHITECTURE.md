# 🏗️ Cruizr Architecture Documentation

## System Overview

Cruizr is a location-based social discovery platform built with modern full-stack technologies, designed for scalability, security, and real-time interactions.

## Tech Stack

### Frontend
- **Framework**: Next.js 15.3.3 (App Router)
- **Language**: TypeScript 5
- **Build Tool**: Turbopack (development), Webpack (production)
- **UI Library**: React 18.3.1
- **Component Library**: Radix UI (40+ accessible components)
- **Styling**: Tailwind CSS 3.4 + CSS Variables
- **Animations**: Framer Motion 11.2
- **Maps**: Mapbox GL 3.4 + React Map GL 7.1
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Hooks (Context API)

### Backend
- **Platform**: Firebase
  - **Authentication**: Firebase Auth (Email/Password, Google OAuth)
  - **Database**: Cloud Firestore (NoSQL)
  - **Storage**: Firebase Storage (image uploads)
  - **Hosting**: Firebase App Hosting (Next.js SSR)
  - **Functions**: Cloud Functions (future serverless endpoints)

### AI Integration
- **Framework**: Google Genkit 1.14
- **Model**: Gemini 2.5 Flash
- **Features**:
  - Avatar generation and styling
  - Profile summary generation
  - Icebreaker suggestions
  - Contextual conversation starters

## Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│                   Client Layer                      │
│  (Next.js App Router + React Components)            │
├─────────────────────────────────────────────────────┤
│              Application Services                   │
│  (AI Flows, Authentication, Real-time Updates)      │
├─────────────────────────────────────────────────────┤
│                 Data Layer                          │
│  (Firestore, Firebase Storage, Geolocation)         │
├─────────────────────────────────────────────────────┤
│              External Services                      │
│  (Google Gemini AI, Mapbox, Firebase Auth)          │
└─────────────────────────────────────────────────────┘
```

## Core Features

### 1. Multi-Realm System
- **Connect**: Professional networking and career development
- **Social**: Community events and platonic connections
- **Dating**: Romantic connections and date planning
- **Hook Up**: Casual encounters and meetup spots
- **Party/Etc**: Exclusive events and curated experiences
- **Ghost**: Anonymous browsing mode across all realms

### 2. Location Services
- Real-time geolocation tracking
- Privacy-focused location fuzzing
- Realm-specific user discovery
- Interactive map visualization
- Proximity-based matching

### 3. AI-Powered Features
- **Avatar Stylizer**: Transform selfies into styled avatars
- **Profile Summarizer**: Generate engaging bio text
- **Icebreaker Engine**: Context-aware conversation starters
- **Smart Matching**: AI-driven compatibility suggestions

### 4. Privacy & Safety (VeilMode™)
- Avatar blurring option
- Name hiding for anonymity
- Location fuzzing (adjustable radius)
- Realm-specific privacy settings
- Report and block functionality

## Data Flow

### User Authentication Flow
```
User Input → Firebase Auth → Token Generation → 
Session Storage → Protected Route Access → 
Firestore User Profile → Dashboard Render
```

### Location Update Flow
```
Browser Geolocation API → Permission Check → 
Coordinates + Realm → Firestore /locations → 
Real-time Listeners → Map Update → 
Nearby User Discovery
```

### AI Generation Flow
```
User Request → Genkit Flow → Gemini API → 
AI Processing → Response Generation → 
Firebase Storage (if image) → Client Render
```

## Database Schema

### Collections

#### `/users/{userId}`
Primary user profile data
- Personal information
- Preferences and settings
- Current realm
- Last activity timestamp

#### `/locations/{userId}`
Real-time location data
- Coordinates (GeoPoint)
- Realm context
- Accuracy and timestamp
- Active status

#### `/conversations/{conversationId}`
Chat sessions between users
- Participant IDs
- Last message preview
- Unread counts
- Realm context

#### `/conversations/{conversationId}/messages/{messageId}`
Individual messages
- Sender ID
- Message content
- Timestamp
- Read status

## Security Model

### Authentication
- Firebase Authentication with email/password
- Google OAuth integration
- JWT tokens for API access
- Session management with secure cookies

### Authorization
- Firestore security rules (role-based)
- User-owned data protection
- Realm-based access control
- Rate limiting on sensitive operations

### Data Privacy
- Encrypted data transmission (HTTPS)
- Optional location fuzzing
- PII protection with VeilMode
- GDPR-compliant data handling

## Performance Optimizations

### Frontend
- Static site generation (SSG) for public pages
- Incremental static regeneration (ISR)
- Image optimization with Next.js Image
- Code splitting and lazy loading
- System fonts (no external requests)

### Backend
- Firestore query optimization with indexes
- Geohash-based location queries
- Cached data with client-side state
- Edge caching for static assets

### AI Services
- Streaming responses for better UX
- Request batching where possible
- Fallback to cached responses
- Rate limiting to control costs

## Deployment Architecture

```
GitHub Repository
    ↓
GitHub Actions CI/CD
    ↓
Firebase App Hosting
    ├→ Cloud Firestore (Database)
    ├→ Firebase Storage (Files)
    ├→ Firebase Auth (Identity)
    └→ Cloud Functions (Serverless)
```

## Scalability Considerations

### Current Capacity
- Firebase Free Tier: 50K reads/day, 20K writes/day
- Suitable for: 100-500 active users
- Storage: 5GB free

### Scale-Up Path
1. **Phase 1** (0-1K users): Current architecture
2. **Phase 2** (1K-10K users): 
   - Upgrade Firebase plan
   - Implement caching layer (Redis)
   - Add CDN for static assets
3. **Phase 3** (10K+ users):
   - Microservices for AI workloads
   - Database sharding by realm
   - Load balancing across regions
   - Dedicated search infrastructure (Algolia)

## Monitoring & Analytics

### Metrics to Track
- User engagement by realm
- Location update frequency
- AI feature usage
- Authentication success rates
- Page load times
- Error rates

### Tools
- Firebase Analytics (user behavior)
- Firebase Performance Monitoring
- Firestore usage metrics
- Cloud Functions logs
- Custom dashboards (future)

## Future Enhancements

### Planned Features
- [ ] Push notifications (FCM)
- [ ] Real-time messaging (WebSockets)
- [ ] Video/voice chat (WebRTC)
- [ ] Advanced matching algorithms
- [ ] Content moderation AI
- [ ] Progressive Web App (PWA)
- [ ] Native mobile apps (React Native)

### Technical Debt
- [ ] Add comprehensive unit tests
- [ ] Implement E2E testing (Playwright)
- [ ] Add API documentation (OpenAPI)
- [ ] Implement error boundaries
- [ ] Add performance profiling
- [ ] Set up staging environment

## Development Workflow

### Local Development
```bash
npm run dev          # Start dev server with Turbopack
npm run genkit:dev   # Start AI development UI
npm run typecheck    # Type checking
npm run build        # Production build
```

### Testing Strategy
- Unit tests: Component logic
- Integration tests: API interactions
- E2E tests: Critical user flows
- Manual testing: UI/UX validation

### Code Quality
- TypeScript strict mode
- ESLint for code linting
- Prettier for code formatting
- Pre-commit hooks (future)
- Code review process

## Troubleshooting Guide

### Common Issues

**Build Failures**
- Clear `.next` cache
- Reinstall node_modules
- Check Node version (18+)

**Firebase Connection Issues**
- Verify environment variables
- Check Firebase project status
- Validate security rules

**Map Not Loading**
- Verify Mapbox token
- Check network connectivity
- Validate CORS settings

**AI Features Not Working**
- Confirm Google AI API key
- Check API quotas
- Verify Genkit configuration

---

**Last Updated**: 2025-12-12  
**Version**: 1.0.0  
**Status**: Production-Ready ✅
