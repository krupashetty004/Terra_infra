import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';

interface AuthContextType {
  user: User | null;
  role: 'admin' | 'user' | null;
  loading: boolean;
  login: (role: 'admin' | 'user') => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'admin' | 'user' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (intendedRole: 'admin' | 'user') => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const currentUser = result.user;
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        role: intendedRole,
      }, { merge: true });
      setRole(intendedRole);
    } catch (error: any) {
      throw new Error('Failed to sign in.');
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
