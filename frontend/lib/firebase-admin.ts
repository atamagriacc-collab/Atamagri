import * as admin from 'firebase-admin';

let initialized = false;

export function initAdmin() {
  if (initialized) {
    return admin;
  }

  try {
    // Initialize with application default credentials (for Vercel/production)
    if (!admin.apps.length) {
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;

      // For development, use the Firebase config from environment variables
      if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        admin.initializeApp({
          projectId,
          databaseURL,
        });
      } else {
        // For production, use service account credentials
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL,
        });
      }
    }
    initialized = true;
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
  }

  return admin;
}

export { admin };