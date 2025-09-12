
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useFirebase } from './firebase-context';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  sendOtp: (phoneNumber: string) => Promise<void>;
  verifyOtp: (otp: string, name: string) => Promise<any>;
  login: (email: string, pass: string) => Promise<any>; // Kept for admin login
  loginAsAdmin: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const adminRoutes = ['/admin'];
const publicRoutes = ['/login', '/signup', '/forgot-password'];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { auth, db } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!auth || !Object.keys(auth).length) {
        setLoading(false);
        if (!publicRoutes.some(route => pathname.startsWith(route))) {
          router.push('/login');
        }
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db, pathname, router]);

  useEffect(() => {
    if (loading) return;

    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

    if (!user && !isPublicRoute) {
      router.push('/login');
    } else if (user) {
      if (isPublicRoute) {
        router.push(isAdmin ? '/admin/dashboard' : '/report');
      } else if (isAdmin && !isAdminRoute) {
        router.push('/admin/dashboard');
      } else if (!isAdmin && isAdminRoute) {
        router.push('/report');
      }
    }
  }, [user, loading, isAdmin, pathname, router]);

  const sendOtp = async (phoneNumber: string) => {
    if(!auth) throw new Error("Auth not initialized");
    const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
    });
    const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    setConfirmationResult(confirmation);
  };
  
  const verifyOtp = async (otp: string, name: string) => {
    if (!confirmationResult) {
      throw new Error("No OTP confirmation result found. Please try sending the OTP again.");
    }
    const userCredential = await confirmationResult.confirm(otp);
    const user = userCredential.user;
    
    // Create a new user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        phone: user.phoneNumber,
        role: 'citizen',
        createdAt: serverTimestamp(),
    });
    return userCredential;
  };
  
  const login = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const loginAsAdmin = async (email: string, pass: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists() || userDoc.data().role !== 'admin') {
        await logout();
        throw new Error("You are not authorized to access the admin panel.");
    }
    return userCredential;
  }

  const logout = () => {
    return signOut(auth);
  };

  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  }

  const value = { user, loading, isAdmin, sendOtp, verifyOtp, login, loginAsAdmin, logout, resetPassword };
  
  const isPublic = publicRoutes.some(route => pathname.startsWith(route));
  if (loading && !isPublic) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
