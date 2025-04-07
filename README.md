# 2DU - Task Management App

A modern, responsive task management application built with React, TypeScript, and Material-UI.

## Features

- 📱 Responsive design with collapsible sidebar
- 🌓 Dark/Light mode support
- 🔐 User authentication
- 📅 Multiple views (Today, Upcoming, Calendar, Tags, Completed)
- 🎨 Beautiful Material-UI components
- 📦 Drag and drop task reordering
- 🏷️ Tag-based task organization
- 📝 Rich task details (title, description, due date, tags)
- 📊 Task analytics and reporting
- 🔄 Real-time updates
- 📤 Import/Export functionality
- 🔍 Advanced search and filtering
- 📱 PWA support

## Tech Stack

- React 18
- TypeScript 5
- Material-UI 5
- React Router 6
- React Beautiful DnD
- Date-fns
- Firebase (Authentication, Firestore)
- Vite
- Jest & Cypress for testing
- Sentry for error tracking
- Analytics integration

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher) or yarn (v1.22 or higher)
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/2du.git
cd 2du
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit the `.env` file with your Firebase configuration and other required variables.

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment Variables

The following environment variables are required:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Sentry Configuration
VITE_SENTRY_DSN=your_sentry_dsn

# Analytics Configuration
VITE_ANALYTICS_ID=your_analytics_id

# Application Configuration
VITE_APP_NAME=2DU
VITE_APP_VERSION=1.0.0
```

## Deployment

### Production Build

1. Create a production build:
```bash
npm run build
# or
yarn build
```

2. Preview the production build:
```bash
npm run preview
# or
yarn preview
```

### Firebase Deployment

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase:
```bash
firebase init
```

4. Deploy to Firebase:
```bash
firebase deploy
```

## Testing

### Unit Tests

Run unit tests:
```bash
npm test
# or
yarn test
```

### End-to-End Tests

Run E2E tests:
```bash
npm run test:e2e
# or
yarn test:e2e
```

### Test Coverage

Generate test coverage report:
```bash
npm run test:coverage
# or
yarn test:coverage
```

## Project Structure

```
src/
├── components/          # React components
│   ├── routes/         # Route components
│   ├── AuthForm.tsx    # Authentication form
│   ├── Sidebar.tsx     # Navigation sidebar
│   ├── TaskList.tsx    # Task list component
│   └── TaskModal.tsx   # Task creation/editing modal
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication context
│   └── ThemeContext.tsx # Theme context
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
│   ├── analytics.ts    # Analytics integration
│   ├── errorReporting.ts # Error reporting
│   └── sentry.ts       # Sentry integration
├── types/              # TypeScript type definitions
├── styles/             # Global styles
├── assets/             # Static assets
└── App.tsx            # Main application component
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

1. **Firebase Authentication Issues**
   - Verify Firebase configuration in `.env`
   - Check Firebase Console for authentication settings
   - Ensure proper CORS configuration

2. **Build Issues**
   - Clear node_modules and reinstall dependencies
   - Check for version conflicts in package.json
   - Verify TypeScript configuration

3. **Testing Issues**
   - Clear Jest cache: `npm test -- --clearCache`
   - Update Cypress: `npx cypress update`
   - Check test environment variables

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
