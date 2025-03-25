import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, Firestore } from 'firebase/firestore';
import { collection } from 'firebase/firestore';

console.log('Firebase initialization started');

// Log all environment variables (except API key)
console.log('Environment variables:', {
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
});

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

console.log('Firebase config prepared:', {
  ...firebaseConfig,
  apiKey: '[REDACTED]'
});

// Validate required config values
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);
if (missingFields.length > 0) {
  console.error('Missing Firebase configuration fields:', missingFields);
  throw new Error('Missing required Firebase configuration fields');
}

let app: FirebaseApp;
let db: Firestore;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized successfully');
  
  // Initialize Firestore
  db = getFirestore(app);
  console.log('Firestore database initialized successfully');

  // Test the connection by creating a test collection
  const testCollection = collection(db, 'test');
  console.log('Test collection reference created:', testCollection);

  // Enable offline persistence
  enableIndexedDbPersistence(db)
    .then(() => {
      console.log('Offline persistence enabled');
    })
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.warn('The current browser does not support persistence.');
      } else {
        console.error('Error enabling persistence:', err);
      }
    });
} catch (error) {
  console.error('Error initializing Firebase:', error);
  if (error instanceof Error) {
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
  }
  throw error;
}

export { db }; 