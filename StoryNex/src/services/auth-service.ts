import { AppUser } from '../types';
import { auth, isFirebaseConfigured } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';

const LOCAL_USER_KEY = 'storynex_current_user';

export const authService = {
  getCurrentUser(): AppUser | null {
    if (isFirebaseConfigured && auth && auth.currentUser) {
      return {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        displayName: auth.currentUser.displayName || auth.currentUser.email?.split('@')[0] || 'Author',
        photoURL: auth.currentUser.photoURL,
      };
    }
    const raw = localStorage.getItem(LOCAL_USER_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }
    // Return a default author account for instant frictionless testing if none exists
    const guestUser: AppUser = {
      uid: 'author_default_uid',
      email: 'creator@storynex.universe',
      displayName: 'Arthur Vance',
      photoURL: null,
    };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(guestUser));
    return guestUser;
  },

  async login(email: string, pass: string): Promise<AppUser> {
    if (isFirebaseConfigured && auth) {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const user: AppUser = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName || email.split('@')[0],
      };
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
      return user;
    }
    // Local / Dev authentication
    if (!email || !pass) {
      throw new Error("Email and password are required.");
    }
    if (pass.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }
    const user: AppUser = {
      uid: `user_${btoa(email).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16)}`,
      email,
      displayName: email.split('@')[0],
    };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
    return user;
  },

  async register(email: string, pass: string, name?: string): Promise<AppUser> {
    if (isFirebaseConfigured && auth) {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (name && cred.user) {
        await updateProfile(cred.user, { displayName: name });
      }
      const user: AppUser = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: name || email.split('@')[0],
      };
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
      return user;
    }
    if (!email || !pass) throw new Error("Email and password are required.");
    if (pass.length < 6) throw new Error("Password must be at least 6 characters.");

    const user: AppUser = {
      uid: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email,
      displayName: name || email.split('@')[0],
    };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
    return user;
  },

  async logout(): Promise<void> {
    if (isFirebaseConfigured && auth) {
      await firebaseSignOut(auth);
    }
    localStorage.removeItem(LOCAL_USER_KEY);
  },

  onAuthChanged(callback: (user: AppUser | null) => void) {
    if (isFirebaseConfigured && auth) {
      return onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          const user: AppUser = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Author',
            photoURL: fbUser.photoURL,
          };
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
          callback(user);
        } else {
          callback(null);
        }
      });
    } else {
      callback(this.getCurrentUser());
      return () => {};
    }
  }
};
