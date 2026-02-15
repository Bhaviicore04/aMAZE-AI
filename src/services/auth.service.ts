import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase.config';
import type { User } from '../types/user.types';

/**
 * Auth Service Interface
 * Defines the contract for authentication operations
 */
export interface IAuthService {
  signInWithGoogle(): Promise<User>;
  signInWithEmail(email: string, password: string): Promise<User>;
  signUpWithEmail(email: string, password: string, displayName: string): Promise<User>;
  signOut(): Promise<void>;
  getCurrentUser(): User | null;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}

/**
 * Converts a Firebase User to our application User type
 * Creates or retrieves the user document from Firestore
 */
async function convertFirebaseUserToUser(firebaseUser: FirebaseUser): Promise<User> {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    // User exists in Firestore, return the stored data
    return userDoc.data() as User;
  } else {
    // New user, create a user document in Firestore
    const newUser: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL || undefined,
      role: 'creator', // Default role, will be updated during onboarding
      themePreference: 'light',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await setDoc(userRef, newUser);
    return newUser;
  }
}

/**
 * Auth Service Implementation
 * Provides authentication methods using Firebase Authentication
 */
class AuthService implements IAuthService {
  /**
   * Sign in with Google OAuth
   * Validates: Requirements 1.1, 1.3
   */
  async signInWithGoogle(): Promise<User> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return await convertFirebaseUserToUser(result.user);
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  /**
   * Sign in with email and password
   * Validates: Requirements 1.2, 1.3
   */
  async signInWithEmail(email: string, password: string): Promise<User> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return await convertFirebaseUserToUser(result.user);
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  /**
   * Sign up with email and password
   * Validates: Requirements 1.2, 1.3
   */
  async signUpWithEmail(email: string, password: string, displayName: string): Promise<User> {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      await updateProfile(result.user, { displayName });
      
      // Create user document in Firestore
      const newUser: User = {
        uid: result.user.uid,
        email: result.user.email || '',
        displayName: displayName,
        photoURL: result.user.photoURL || undefined,
        role: 'creator', // Default role, will be updated during onboarding
        themePreference: 'light',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const userRef = doc(db, 'users', result.user.uid);
      await setDoc(userRef, newUser);

      return newUser;
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  /**
   * Sign out the current user
   * Validates: Requirements 1.1, 1.2
   */
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  /**
   * Get the current authenticated user
   * Returns null if no user is authenticated
   * Validates: Requirements 1.5
   */
  getCurrentUser(): User | null {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      return null;
    }

    // Note: This returns a simplified user object from Firebase Auth
    // For full user data, use onAuthStateChanged or fetch from Firestore
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL || undefined,
      role: 'creator', // Default, should be fetched from Firestore for accuracy
      themePreference: 'light',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
  }

  /**
   * Listen to authentication state changes
   * Validates: Requirements 1.5
   * 
   * @param callback - Function to call when auth state changes
   * @returns Unsubscribe function
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return firebaseOnAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const user = await convertFirebaseUserToUser(firebaseUser);
          callback(user);
        } catch (error) {
          console.error('Error converting Firebase user:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }

  /**
   * Convert Firebase error codes to user-friendly messages
   * Validates: Requirements 1.4
   */
  private getAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'The email address is invalid.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/operation-not-allowed':
        return 'This sign-in method is not enabled.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed before completing.';
      case 'auth/cancelled-popup-request':
        return 'Only one popup request is allowed at a time.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/invalid-credential':
        return 'Invalid credentials. Please check your email and password.';
      default:
        return 'An error occurred during authentication. Please try again.';
    }
  }
}

// Export a singleton instance
export const authService = new AuthService();
