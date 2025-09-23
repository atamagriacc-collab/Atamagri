import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getDatabase, ref, set, get, push, onValue } from 'firebase/database';
import { useRouter } from 'next/router';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const database = getDatabase(app);

// Initialize Analytics (only in browser)
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  });
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  userDevices: string[];
  userDrone: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  createUser: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userDevices, setUserDevices] = useState<string[]>([]);
  const [userDrone, setUserDrone] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      // Check if user is admin using custom claims
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          const adminClaim = idTokenResult.claims.admin === true || idTokenResult.claims.admin === 'true';
          setIsAdmin(adminClaim);

          // Fallback to email check for backward compatibility
          if (!adminClaim && user.email === 'admin@atamagri.com') {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          // Fallback to email check
          if (user.email === 'admin@atamagri.com') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        }
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const createUser = async (email: string, password: string) => {
    try {
      // Store current user info
      const currentUser = auth.currentUser;

      // Create new user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Sign out the newly created user
      await signOut(auth);

      // If there was a current user (admin), sign them back in
      // Note: In production, use Firebase Admin SDK via Cloud Functions instead
      if (currentUser && currentUser.email) {
        // Admin will need to re-authenticate after creating a user
        // This is a limitation of client-side user creation
        router.push('/login?message=User created successfully. Please sign in again.');
      }

    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, userDevices, userDrone, signIn, signUp, createUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};