import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { authService } from '../services/auth.service';
import type { User } from '../types/user.types';
import { Timestamp } from 'firebase/firestore';

// Mock the auth service
vi.mock('../services/auth.service', () => ({
  authService: {
    signInWithGoogle: vi.fn(),
    signInWithEmail: vi.fn(),
    signUpWithEmail: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn(),
  },
}));

// Test component that uses the auth context
function TestComponent() {
  const { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut } = useAuth();
  const [error, setError] = React.useState<string | null>(null);

  const handleSignInGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSignInEmail = async () => {
    try {
      await signInWithEmail('test@example.com', 'password');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSignUp = async () => {
    try {
      await signUpWithEmail('test@example.com', 'password', 'Test User');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'ready'}</div>
      <div data-testid="user">{user ? user.email : 'no user'}</div>
      {error && <div data-testid="error">{error}</div>}
      <button onClick={handleSignInGoogle}>Sign In Google</button>
      <button onClick={handleSignInEmail}>Sign In Email</button>
      <button onClick={handleSignUp}>Sign Up</button>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}

describe('AuthContext', () => {
  const mockUser: User = {
    uid: 'test-uid',
    email: 'test@example.com',
    displayName: 'Test User',
    role: 'creator',
    themePreference: 'light',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  let unsubscribe: () => void;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup default mock for onAuthStateChanged
    unsubscribe = vi.fn();
    vi.mocked(authService.onAuthStateChanged).mockImplementation((callback) => {
      // Simulate initial auth state check
      setTimeout(() => callback(null), 0);
      return unsubscribe;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should provide authentication context to children', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Initially loading
    expect(screen.getByTestId('loading')).toHaveTextContent('loading');

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    // No user initially
    expect(screen.getByTestId('user')).toHaveTextContent('no user');
  });

  it('should handle session persistence on mount', async () => {
    // Mock onAuthStateChanged to return a user
    vi.mocked(authService.onAuthStateChanged).mockImplementation((callback) => {
      setTimeout(() => callback(mockUser), 0);
      return unsubscribe;
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for user to be loaded
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
    });

    expect(screen.getByTestId('loading')).toHaveTextContent('ready');
  });

  it('should call signInWithGoogle and update user state', async () => {
    vi.mocked(authService.signInWithGoogle).mockResolvedValue(mockUser);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for initial loading
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    // Click sign in button
    await act(async () => {
      screen.getByText('Sign In Google').click();
    });

    // Verify service was called
    expect(authService.signInWithGoogle).toHaveBeenCalledTimes(1);

    // Wait for user state to update
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
    });
  });

  it('should call signInWithEmail and update user state', async () => {
    vi.mocked(authService.signInWithEmail).mockResolvedValue(mockUser);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    await act(async () => {
      screen.getByText('Sign In Email').click();
    });

    expect(authService.signInWithEmail).toHaveBeenCalledWith('test@example.com', 'password');

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
    });
  });

  it('should call signUpWithEmail and update user state', async () => {
    vi.mocked(authService.signUpWithEmail).mockResolvedValue(mockUser);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    await act(async () => {
      screen.getByText('Sign Up').click();
    });

    expect(authService.signUpWithEmail).toHaveBeenCalledWith(
      'test@example.com',
      'password',
      'Test User'
    );

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
    });
  });

  it('should call signOut and clear user state', async () => {
    // Start with a user
    vi.mocked(authService.onAuthStateChanged).mockImplementation((callback) => {
      setTimeout(() => callback(mockUser), 0);
      return unsubscribe;
    });

    vi.mocked(authService.signOut).mockResolvedValue();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for user to be loaded
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
    });

    // Sign out
    await act(async () => {
      screen.getByText('Sign Out').click();
    });

    expect(authService.signOut).toHaveBeenCalledTimes(1);

    // User should be cleared
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('no user');
    });
  });

  it('should throw error when useAuth is used outside AuthProvider', () => {
    // Suppress console.error for this test
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleError.mockRestore();
  });

  it('should cleanup subscription on unmount', async () => {
    const { unmount } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    // Unmount the component
    unmount();

    // Verify unsubscribe was called
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('should handle authentication errors gracefully', async () => {
    const error = new Error('Authentication failed');
    vi.mocked(authService.signInWithGoogle).mockRejectedValue(error);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    // Attempt to sign in
    await act(async () => {
      screen.getByText('Sign In Google').click();
    });

    // Wait for error to be displayed
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Authentication failed');
    });

    // User should remain null
    expect(screen.getByTestId('user')).toHaveTextContent('no user');
  });
});
