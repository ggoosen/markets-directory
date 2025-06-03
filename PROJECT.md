# SA Markets Directory - Project Charter

## Project Overview

**SA Markets Directory** is a comprehensive digital marketplace platform designed to connect local markets, stallholders (vendors), and customers across South Australia. The platform serves as a centralized hub for discovering, managing, and participating in local markets throughout the state.

## Project Vision

To become Australia's leading marketplace discovery platform, starting with South Australia, that strengthens local communities by making it easier for people to find and participate in local markets while providing stallholders and market organizers with the tools they need to grow their businesses.

## What We Are Building

### Core Platform Components

#### 1. **Multi-User Web Application**
- **React + Vite + Tailwind CSS** frontend for fast, responsive user experience
- **PocketBase** backend providing real-time database, authentication, and file storage
- **Role-based authentication** supporting three distinct user types:
  - **Customers**: Market discovery, favorites, reviews
  - **Stallholders**: Business profiles, market applications, performance tracking
  - **Market Organizers**: Market management, stallholder applications, analytics

#### 2. **Market Discovery System**
- Comprehensive market listings with detailed information (location, schedule, facilities)
- Advanced search and filtering (location, category, date, amenities)
- Interactive market detail pages with photos, vendor lists, and reviews
- Location-based search with distance calculations
- Market categorization (Farmers, Craft, Community, Specialty, Food, Vintage)

#### 3. **Stallholder Management Platform**
- Business profile creation and management
- Market application system with status tracking
- Portfolio showcase with photos and product categories
- Review and rating system for reputation building
- Application history and performance analytics

#### 4. **Market Organizer Tools**
- Market listing creation and management
- Stallholder application review and approval workflow
- Market analytics and performance tracking
- Communication tools for stallholder coordination
- Stall space and pricing management

#### 5. **Application & Booking System**
- Stallholder-to-market application workflow
- Application status tracking (pending, approved, rejected, waitlisted)
- Market organizer review and approval interface
- Integration with payment processing for fees
- Automated notifications and communication

## Technical Architecture

### Technology Stack
- **Frontend**: React 19.x with Vite build tool
- **UI Framework**: Tailwind CSS for responsive design
- **Backend**: PocketBase (Go-based BaaS)
- **Database**: SQLite (via PocketBase) with automatic backups
- **Authentication**: PocketBase built-in auth with JWT tokens
- **File Storage**: PocketBase file handling for images
- **Routing**: React Router for SPA navigation
- **State Management**: React Context + Custom hooks
- **Icons**: Lucide React icon library

### Security Features
- Input validation and sanitization
- Australian-specific validation (ABN, phone numbers, postcodes)
- Rate limiting for API calls
- Audit logging for all user actions
- Password strength requirements
- Role-based access control
- Data encryption for sensitive information

### Deployment Strategy
- **Development**: Local PocketBase + Vite dev server
- **Production**: 
  - Frontend: Netlify (free tier: 100GB bandwidth)
  - Backend: PocketHost (free tier for MVP, $0/month)
  - **Total cost**: $0 to start, scales affordably

## Database Schema

### Core Collections
1. **Users** (Built-in PocketBase with custom fields)
   - Basic auth + role, phone, verification status, subscription tier

2. **Markets**
   - Complete market information, location data, scheduling, facilities, pricing

3. **Market Categories**
   - Organized market types with visual styling

4. **Stallholders**
   - Business profiles, product categories, requirements, ratings

5. **Applications**
   - Market application workflow with status tracking and payment info

6. **Reviews**
   - User feedback system for markets and stallholders

## Monetization Strategy

### Phase 1: Free Growth (0-6 months)
- Free platform for all users to build network effects
- Focus on user acquisition and data collection

### Phase 2: Freemium Model (6-18 months)
**Market Organizers:**
- Free: Basic listing, up to 20 applications/month
- Pro ($29/month): Unlimited applications, premium features, analytics
- Enterprise ($99/month): Multi-market management, API access

**Stallholders:**
- Free: Basic profile, 5 applications/month
- Basic ($15/month): Unlimited applications, enhanced profiles
- Premium ($39/month): Priority placement, analytics, verified badges

### Phase 3: Marketplace Services (18+ months)
- Transaction fees (2-3% on processed bookings)
- Lead generation services
- Advertising and promoted listings
- Value-added services (insurance, payment processing)

### Phase 4: Advanced Revenue
- White-label licensing to councils/organizations
- Market trend data insights
- Equipment marketplace
- Training and certification programs

## Geographic Expansion Plan

### Phase 1: South Australia (Launch)
- All major SA markets and regional centers
- Focus on Adelaide metro and key regional markets

### Phase 2: Australia-wide (Month 6-18)
- Victoria → NSW → QLD → WA → TAS → NT
- State-by-state rollout with local partnerships

### Phase 3: New Zealand (Year 2+)
- Similar market structure and regulatory environment

## Current Development Status

### ✅ Completed (MVP Foundation)
- Complete React application structure
- Authentication system with role-based access
- Market listing and search functionality
- Stallholder profile management
- Application workflow system
- Security and validation framework
- Responsive UI with Tailwind CSS
- PocketBase integration and services
- Database schema design

### 🔧 Immediate Tasks (Phase 1 - Week 1-2)
1. **PocketBase Setup**
   - Create all database collections using provided schema
   - Configure API access rules
   - Import sample data for testing

2. **Core Functionality Testing**
   - User registration and authentication flow
   - Market creation and listing
   - Stallholder profile creation
   - Application submission workflow

3. **UI Polish**
   - Mobile responsiveness refinements
   - Loading states and error handling
   - Form validation feedback
   - Image upload functionality

### 🚀 Phase 2 Development (Week 3-8)
1. **Enhanced Features**
   - Email notifications (Resend integration)
   - Advanced search with geolocation
   - Photo galleries and market showcases
   - Review and rating system implementation

2. **Payment Integration**
   - Stripe integration for subscription payments
   - Application fee processing
   - Market organizer payment dashboards

3. **Analytics & Reporting**
   - User activity tracking
   - Market performance metrics
   - Stallholder success analytics
   - Revenue reporting

### 📈 Phase 3 Scaling (Month 3-6)
1. **Geographic Expansion**
   - Multi-state data management
   - Location-based features
   - State-specific market regulations

2. **Advanced Platform Features**
   - Real-time messaging between users
   - Calendar integration for market schedules
   - Mobile app development (React Native)
   - Admin dashboard for platform management

3. **Business Development**
   - Partnership integrations
   - API for third-party developers
   - White-label solutions

## Success Metrics

### Technical KPIs
- Platform uptime: >99.5%
- Page load times: <2 seconds
- User registration conversion: >60%
- Application completion rate: >80%

### Business KPIs
- Markets listed: 50+ (3 months), 200+ (6 months)
- Active stallholders: 100+ (3 months), 500+ (6 months)
- Monthly active users: 1,000+ (3 months), 5,000+ (6 months)
- Revenue: $1,000/month (6 months), $10,000/month (12 months)

### User Experience KPIs
- Net Promoter Score: >50
- User retention rate: >70% (30 days)
- Support ticket resolution: <24 hours
- User satisfaction rating: >4.5/5

## Risk Management

### Technical Risks
- **PocketBase scaling limitations**: Monitor and plan migration to dedicated infrastructure
- **Data backup and recovery**: Implement automated backup strategies
- **Security vulnerabilities**: Regular security audits and updates

### Business Risks
- **Market adoption**: Strong MVP testing and user feedback loops
- **Competition**: Focus on local community connections and superior UX
- **Regulatory changes**: Stay informed on marketplace regulations

### Mitigation Strategies
- Agile development with regular user feedback
- Robust testing and quality assurance processes
- Clear data ownership and export capabilities
- Strong community engagement and support

## Project Timeline

### Month 1-2: MVP Launch
- Complete PocketBase setup and testing
- Deploy production environment
- Launch with 10-20 pilot markets in Adelaide
- Gather initial user feedback

### Month 3-4: Feature Enhancement
- Implement payment processing
- Add advanced search capabilities
- Launch marketing and user acquisition
- Expand to regional SA markets

### Month 5-6: Scale Preparation
- Performance optimization
- Interstate expansion planning
- Partnership development
- Premium feature rollout

This charter serves as the definitive guide for the SA Markets Directory project, ensuring all development efforts align with the core vision of connecting and strengthening local market communities across Australia.