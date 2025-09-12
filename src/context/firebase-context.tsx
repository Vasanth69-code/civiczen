
"use client";

import { createContext, useContext, ReactNode, useMemo } from 'react';
import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

interface FirebaseContextType {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const app = useMemo(() => {
    if (!firebaseConfig.apiKey) {
      // Return a dummy app object or handle appropriately if config is not set
      // This avoids crashing on server-side rendering or build time if env vars are not available
      return {} as FirebaseApp; 
    }
    return !getApps().length ? initializeApp(firebaseConfig) : getApp();
  }, []);

  const auth = useMemo(() => {
    if (!app || !app.options) return {} as Auth;
    return getAuth(app)
  }, [app]);

  const db = useMemo(() => {
    if (!app || !app.options) return {} as Firestore;
    return getFirestore(app);
  }, [app]);
  
  if (!firebaseConfig.apiKey) {
    return <>{children}</>;
  }


  return (
    <FirebaseContext.Provider value={{ app, auth, db }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
