import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authService } from './auth.service';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Mock Firebase modules
vi.mock('firebase/auth');
vi.mock('firebase/firestore');
vi.mock('../config/firebase.config', () => ({
  auth: {},
  db: {},
}));

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('signInWithGoogle', () => {
    it('should sign in with Google and create user record if not exists', async () => {
      const mockFirebaseUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg',
      };

      vi.mocked(signInWithPopup).mockResolvedValue({
        user: mockFirebaseUser,
      } as any);

      vi.mocked(doc).mockReturnValue({} as any);
      vi.mocked(getDoc).mockResolvedValue({
        exists: () => false,
      } as any);
      vi.mocked(setDoc).mockResolvedValue(undefined);

      const user = await authService.signInWithGoogle();

      expect(user.uid).toBe('test-uid');
      expect(user.email).toBe('test@example.com');
      expect(user.displayName).toBe('Test User');
      expect(setDoc).toHaveBeenCalled();
    });

    it('should sign in with Google and retrieve existing user record', async () => {
      const mockFirebaseUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg',
      };

      const existingUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        role: 'consumer',
        themePreference: 'dark',
      };

      vi.mocked(signInWithPopup).mockResolvedValue({
        user: mockFirebaseUser,
      } as any);

      vi.mocked(doc).mockReturnValue({} as any);
      vi.mocked(getDoc).mockResolvedValue({
        exists: () => true,
        data: () => existingUser,
      } as any);

      const user = await authService.signInWithGoogle();

      expect(user.uid).toBe('test-uid');
      expect(user.role).toBe('consumer');
      expect(user.themePreference).toBe('dark');
      expect(setDoc).not.toHaveBeenCalled();
    });

    it('should throw descriptive error on authentication failure', async () => {
      vi.mocked(signInWithPopup).mockRejectedValue({
        code: 'auth/popup-closed-by-user',
      });

      await expect(authService.signInWithGoogle()).rejects.toThrow(
        'Sign-in popup was closed before completing.'
      );
    });
  });

  describe('signInWithEmail', () => {
    it('should sign in with email and password', async () => {
      const mockFirebaseUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
      };

      vi.mocked(signInWithEmailAndPassword).mockResolvedValue({
        user: mockFirebaseUser,
      } as any);

      vi.mocked(doc).mockReturnValue({} as any);
      vi.mocked(getDoc).mockResolvedValue({
        exists: () => false,
      } as any);
      vi.mocked(setDoc).mockResolvedValue(undefined);

      const user = await authService.signInWithEmail('test@example.com', 'password123');

      expect(user.uid).toBe('test-uid');
      expect(user.email).toBe('test@example.com');
    });

    it('should throw descriptive error for invalid credentials', async () => {
      vi.mocked(signInWithEmailAndPassword).mockRejectedValue({
        code: 'auth/wrong-password',
      });

      await expect(
        authService.signInWithEmail('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Incorrect password. Please try again.');
    });

    it('should throw descriptive error for user not found', async () => {
      vi.mocked(signInWithEmailAndPassword).mockRejectedValue({
        code: 'auth/user-not-found',
      });

      await expect(
        authService.signInWithEmail('nonexistent@example.com', 'password')
      ).rejects.toThrow('No account found with this email address.');
    });
  });

  describe('signUpWithEmail', () => {
    it('should create new user with email and password', async () => {
      const mockFirebaseUser = {
        uid: 'new-uid',
        email: 'newuser@example.com',
        displayName: null,
        photoURL: null,
      };

      vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
        user: mockFirebaseUser,
      } as any);
      vi.mocked(updateProfile).mockResolvedValue(undefined);
      vi.mocked(doc).mockReturnValue({} as any);
      vi.mocked(setDoc).mockResolvedValue(undefined);

      const user = await authService.signUpWithEmail(
        'newuser@example.com',
        'password123',
        'New User'
      );

      expect(user.uid).toBe('new-uid');
      expect(user.email).toBe('newuser@example.com');
      expect(user.displayName).toBe('New User');
      expect(updateProfile).toHaveBeenCalled();
      expect(setDoc).toHaveBeenCalled();
    });

    it('should throw descriptive error for email already in use', async () => {
      vi.mocked(createUserWithEmailAndPassword).mockRejectedValue({
        code: 'auth/email-already-in-use',
      });

      await expect(
        authService.signUpWithEmail('existing@example.com', 'password123', 'User')
      ).rejects.toThrow('An account with this email already exists.');
    });

    it('should throw descriptive error for weak password', async () => {
      vi.mocked(createUserWithEmailAndPassword).mockRejectedValue({
        code: 'auth/weak-password',
      });

      await expect(
        authService.signUpWithEmail('user@example.com', '123', 'User')
      ).rejects.toThrow('Password should be at least 6 characters.');
    });
  });

  describe('signOut', () => {
    it('should sign out the current user', async () => {
      vi.mocked(firebaseSignOut).mockResolvedValue(undefined);

      await authService.signOut();

      expect(firebaseSignOut).toHaveBeenCalled();
    });

    it('should throw descriptive error on sign out failure', async () => {
      vi.mocked(firebaseSignOut).mockRejectedValue({
        code: 'auth/network-request-failed',
      });

      await expect(authService.signOut()).rejects.toThrow(
        'Network error. Please check your connection.'
      );
    });
  });

  describe('onAuthStateChanged', () => {
    it('should call callback with user when authenticated', async () => {
      const mockFirebaseUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
      };

      const existingUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        role: 'creator',
        themePreference: 'light',
      };

      let authCallback: any;
      vi.mocked(firebaseOnAuthStateChanged).mockImplementation((auth, callback) => {
        authCallback = callback;
        return vi.fn();
      });

      vi.mocked(doc).mockReturnValue({} as any);
      vi.mocked(getDoc).mockResolvedValue({
        exists: () => true,
        data: () => existingUser,
      } as any);

      const callback = vi.fn();
      const unsubscribe = authService.onAuthStateChanged(callback);

      // Simulate auth state change
      await authCallback(mockFirebaseUser);

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          uid: 'test-uid',
          email: 'test@example.com',
          role: 'creator',
        })
      );

      expect(typeof unsubscribe).toBe('function');
    });

    it('should call callback with null when not authenticated', async () => {
      let authCallback: any;
      vi.mocked(firebaseOnAuthStateChanged).mockImplementation((auth, callback) => {
        authCallback = callback;
        return vi.fn();
      });

      const callback = vi.fn();
      authService.onAuthStateChanged(callback);

      // Simulate auth state change to null
      await authCallback(null);

      expect(callback).toHaveBeenCalledWith(null);
    });
  });
});
