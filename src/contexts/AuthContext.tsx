import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '../services/auth.service';
import type { User } from '../types/user.types';

/**
 * AuthContext Interface
 * Defines the shape of the authentication context
 */
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User>;
  signInWithEmail: (email: string, password: string) => Promise<User>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<User>;
  signOut: () => Promise<void>;
}

/**
 * AuthContext
 * Provides authentication state and methods to components
 * Validates: Requirements 1.5
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider Component
 * Manages authentication state and provides it to the component tree
 * Handles session persistence across page refreshes
 * Validates: Requirements 1.5
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to authentication state changes
    // This handles session persistence across page refreshes
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  /**
   * Sign in with Google OAuth
   * Validates: Requirements 1.1
   */
  const signInWithGoogle = async (): Promise<User> => {
    const user = await authService.signInWithGoogle();
    setUser(user);
    return user;
  };

  /**
   * Sign in with email and password
   * Validates: Requirements 1.2
   */
  const signInWithEmail = async (email: string, password: string): Promise<User> => {
    const user = await authService.signInWithEmail(email, password);
    setUser(user);
    return user;
  };

  /**
   * Sign up with email and password
   * Validates: Requirements 1.2
   */
  const signUpWithEmail = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<User> => {
    const user = await authService.signUpWithEmail(email, password, displayName);
    setUser(user);
    return user;
  };

  /**
   * Sign out the current user
   * Validates: Requirements 1.1, 1.2
   */
  const signOut = async (): Promise<void> => {
    await authService.signOut();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth Hook
 * Custom hook to access the authentication context
 * Throws an error if used outside of AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
