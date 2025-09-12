
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { useFirebase } from './firebase-context';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signup: (email: string, pass: string) => Promise<any>;
  login: (email: string, pass: string) => Promise<any>;
  loginAsAdmin: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const adminRoutes = ['/admin'];
const publicRoutes = ['/login', '/signup', '/forgot-password'];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { auth } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const token = await user.getIdTokenResult();
        const isAdminClaim = !!token.claims.admin;
        setIsAdmin(isAdminClaim);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (loading) return;

    const isPublic = publicRoutes.includes(pathname);
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
    
    if (!user && !isPublic) {
      router.push('/login');
    } else if (user && isPublic) {
        router.push('/report');
    } else if (user && isAdminRoute && !isAdmin) {
        router.push('/report'); // Redirect non-admins from admin routes
    } else if (user && !isAdminRoute && isAdmin) {
        router.push('/admin'); // Redirect admins to dashboard if they land on user pages
    }

  }, [user, loading, isAdmin, pathname, router]);


  const signup = (email: string, pass: string) => {
    return createUserWithEmailAndPassword(auth, email, pass);
  };
  
  const login = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const loginAsAdmin = async (email: string, pass: string) => {
    if (email !== 'demo@example.com' || pass !== 'password') {
        throw new Error('Invalid admin credentials');
    }
    return signInWithEmailAndPassword(auth, email, pass);
  }

  const logout = () => {
    return signOut(auth);
  };

  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  }

  const value = { user, loading, isAdmin, signup, login, loginAsAdmin, logout, resetPassword };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isPublic = publicRoutes.includes(pathname);
  if (!user && !isPublic) {
    return (
       <div className="flex h-screen w-full items-center justify-center">
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
