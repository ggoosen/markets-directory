# SA Markets Directory

> Australia's leading marketplace discovery platform connecting local markets, stallholders, and customers across South Australia.

![SA Markets Directory](https://img.shields.io/badge/Status-MVP%20Development-blue)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react)
![PocketBase](https://img.shields.io/badge/PocketBase-0.26.0-00D4AA)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-38B2AC?logo=tailwind-css)

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

SA Markets Directory is a comprehensive digital marketplace platform designed to strengthen local communities by making it easier for people to find and participate in local markets. The platform provides tools for market discovery, stallholder management, and organizer administration.

### Key Benefits
- **For Customers**: Discover local markets, fresh produce, and unique crafts
- **For Stallholders**: Find markets, manage applications, build reputation
- **For Organizers**: Manage markets, review applications, track performance

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or later)
- **npm** (v9.0.0 or later) 
- **PocketBase** (v0.26.0 or later)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/sa-markets-directory.git
   cd sa-markets-directory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Download and setup PocketBase**
   ```bash
   # Download PocketBase for your OS from https://pocketbase.io/docs/
   # For Linux/Mac:
   wget https://github.com/pocketbase/pocketbase/releases/download/v0.26.0/pocketbase_0.26.0_linux_amd64.zip
   unzip pocketbase_0.26.0_linux_amd64.zip
   
   # For Windows:
   # Download pocketbase_0.26.0_windows_amd64.zip and extract
   ```

## 🔧 Development Setup

### Starting the Development Environment

You need to run **both** PocketBase (backend) and the React app (frontend) simultaneously:

#### Terminal 1: Start PocketBase Backend
```bash
# Navigate to your project directory
cd sa-markets-directory

# Start PocketBase server
./pocketbase serve

# PocketBase will start on http://localhost:8090
# Admin UI available at http://localhost:8090/_/
```

#### Terminal 2: Start React Frontend
```bash
# In a new terminal, navigate to project directory
cd sa-markets-directory

# Start the React development server
npm run dev

# React app will start on http://localhost:5173
```

### Initial Database Setup

1. **Access PocketBase Admin** (first time only)
   ```bash
   # Open browser and go to:
   http://localhost:8090/_/

   # Create admin account when prompted
   ```

2. **Create Database Collections**
   - Import the provided database schema (see `/docs/database-schema.md`)
   - Or manually create collections using PocketBase Admin UI

3. **Verify Setup**
   ```bash
   # Test database connectivity
   npm run test:database
   
   # Or visit in browser:
   http://localhost:5173/database-test
   ```

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint

# Database
npm run db:start         # Start PocketBase (if configured)
npm run db:backup        # Backup database
npm run test:database    # Verify database setup

# Deployment
npm run deploy           # Deploy to production
```

## 📁 Project Structure

```
sa-markets-directory/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── auth/         # Authentication components
│   │   └── layout/       # Layout components (Header, Footer)
│   ├── contexts/         # React contexts (Auth, etc.)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Configuration and utilities
│   ├── pages/            # Page components
│   ├── services/         # API service layers
│   └── utils/            # Helper functions
├── docs/                 # Project documentation
├── .env                  # Environment variables
├── pocketbase*           # PocketBase executable
└── pb_data/              # PocketBase database files
```

## ✨ Features

### Core Features (Implemented)
- [x] User authentication with role-based access
- [x] Market discovery and search
- [x] Market detail pages
- [x] Role-based dashboards (Customer, Stallholder, Organizer)
- [x] Responsive design for all devices
- [x] Australian-specific validation (ABN, phone, postcodes)

### In Development
- [ ] Market creation and management
- [ ] Stallholder profile system
- [ ] Application workflow
- [ ] Payment integration
- [ ] Review and rating system

### Planned Features
- [ ] Real-time messaging
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Multi-state expansion

## 🛠 Technology Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Icon library

### Backend
- **PocketBase** - Backend-as-a-Service
- **SQLite** - Database (via PocketBase)

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🚦 Development Workflow

### Day-to-Day Development

1. **Start both servers** (do this every time you work on the project):
   ```bash
   # Terminal 1: Start PocketBase
   ./pocketbase serve
   
   # Terminal 2: Start React app
   npm run dev
   ```

2. **Access the applications**:
   - **React App**: http://localhost:5173
   - **PocketBase Admin**: http://localhost:8090/_/
   - **API Docs**: http://localhost:8090/_/docs

3. **Make changes and test**:
   - React changes auto-reload in browser
   - Database changes require PocketBase admin interface

### Environment Variables

Create a `.env` file in the project root:

```env
# PocketBase Configuration
VITE_POCKETBASE_URL=http://localhost:8090

# App Configuration
VITE_APP_NAME=SA Markets Directory
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development

# URLs
VITE_FRONTEND_URL=http://localhost:5173
VITE_API_URL=http://localhost:8090

# Feature Flags
VITE_ENABLE_2FA=true
VITE_ENABLE_EMAIL_VERIFICATION=true
VITE_ENABLE_AUDIT_LOGGING=true

# API Keys (add when needed)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_RESEND_API_KEY=your_resend_api_key_here
VITE_FROM_EMAIL=noreply@samarkets.com.au
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] PocketBase server starts without errors
- [ ] React app loads at http://localhost:5173
- [ ] Can navigate between pages
- [ ] Market listing page shows data
- [ ] Authentication flow works
- [ ] Role-based dashboards display correctly

### Database Testing

```bash
# Verify database setup
curl http://localhost:8090/api/collections/markets/records?perPage=5

# Check specific collection
curl http://localhost:8090/api/collections/market_categories/records
```

## 🚀 Deployment

### Production Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy frontend** (Netlify recommended):
   ```bash
   # Build output in dist/ directory
   # Deploy dist/ to Netlify
   ```

3. **Deploy backend** (PocketHost recommended):
   ```bash
   # Upload pb_data/ to PocketHost
   # Configure production environment variables
   ```

### Environment Setup

**Development**: Local PocketBase + Vite dev server  
**Production**: Netlify (frontend) + PocketHost (backend)  
**Cost**: $0 to start, scales affordably

## 📚 Documentation

- [Database Schema](./docs/database-schema.md)
- [API Documentation](./docs/api.md)
- [Component Guide](./docs/components.md)
- [Deployment Guide](./docs/deployment.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and patterns
- Test all changes thoroughly
- Update documentation as needed
- Use semantic commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email**: hello@samarkets.com.au
- **Documentation**: [Project Wiki](https://github.com/your-username/sa-markets-directory/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/sa-markets-directory/issues)

## 🚧 Current Status

**Phase**: MVP Foundation Complete → Database Integration  
**Version**: 1.0.0-alpha  
**Last Updated**: June 2025

### Immediate Next Steps
1. ✅ Complete PocketBase database setup
2. 🔄 Fix authentication integration
3. 📋 Implement market creation forms
4. 💳 Add payment processing
5. 🚀 Deploy to production

---

**Built with ❤️ for Australian communities**