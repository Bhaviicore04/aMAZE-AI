# aMAZE AI

A modern, AI-powered web application for Content Creators and Content Consumers built with React, TypeScript, Firebase, and Tailwind CSS.

## Features

- **For Content Creators**: AI-powered content idea generation, trending topics, vision boards, content planning, and productivity analytics
- **For Content Consumers**: Personalized content feeds, smart recommendations, AI reflection assistant, and productivity tracking
- **Dual Role Support**: Separate dashboards and features for creators and consumers
- **AI Integration**: Generative AI for content ideas, reflections, and chat assistance
- **Real-time Sync**: Firebase Firestore for instant data synchronization
- **Modern UI**: Responsive design with Tailwind CSS and Framer Motion animations

## Tech Stack
Backend can be deployed using AWS services such as AWS Lambda, DynamoDB, and Cognito. Current prototype uses Firebase for rapid development.
- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Cloud Functions)
- **AI**: Firebase Vertex AI / AI Extensions
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Routing**: React Router v6
- **Testing**: Vitest, fast-check (property-based testing)

## Project Structure

```
aMAZE-AI/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── services/       # Service layer (auth, firestore, AI)
│   ├── hooks/          # Custom React hooks
│   ├── contexts/       # React contexts
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   └── config/         # Configuration files
├── functions/          # Firebase Cloud Functions
├── firestore.rules     # Firestore security rules
└── firebase.json       # Firebase configuration
```

## Setup Instructions

### Prerequisites

- Node.js v25.6.1 or higher
- npm 11.9.0 or higher
- Firebase account

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd aMAZE-AI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure Firebase:
   - Create a new Firebase project at https://console.firebase.google.com
   - Enable Authentication (Google and Email/Password)
   - Create a Firestore database
   - Copy your Firebase configuration values to the `.env` file

5. Deploy Firestore security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

### Testing

Run tests:
```bash
npm run test
```

Run property-based tests:
```bash
npm run test:property
```

## Environment Variables

Create a `.env` file with the following variables:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Firebase Cloud Functions

The AI features are powered by Firebase Cloud Functions. To deploy:

1. Navigate to the functions directory:
   ```bash
   cd functions
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Deploy functions:
   ```bash
   firebase deploy --only functions
   ```

## License

MIT
