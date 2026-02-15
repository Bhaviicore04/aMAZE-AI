import { Timestamp } from 'firebase/firestore';

/**
 * User type definition
 * Represents a user in the CreatorSync AI platform
 */
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'creator' | 'consumer' | 'admin';
  interests?: string[];
  niche?: string;
  targetAudience?: string;
  themePreference: 'light' | 'dark';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Goal type definition
 * Represents a user's goal in their vision board
 */
export interface Goal {
  id: string;
  type: 'subscribers' | 'brand-deals' | 'posting-frequency' | 'learning' | 'skill';
  title: string;
  target: number;
  current: number;
  deadline?: Timestamp;
  completed: boolean;
}

/**
 * Note type definition
 * Represents a motivational note in a vision board
 */
export interface Note {
  id: string;
  content: string;
  createdAt: Timestamp;
}

/**
 * Vision Board type definition
 * Represents a user's vision board with goals, images, and notes
 */
export interface VisionBoard {
  id: string;
  userId: string;
  goals: Goal[];
  inspirationImages: string[];
  motivationalNotes: Note[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
