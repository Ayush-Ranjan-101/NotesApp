import { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('sanctuary_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const signIn = async (credentials) => {
    const res = await api.login(credentials);
    const u = res.data.data.user;
    setUser(u);
    localStorage.setItem('sanctuary_user', JSON.stringify(u));
    return u;
  };

  const signUp = async (data) => {
    const res = await api.register(data);
    const u = res.data.data.user;
    setUser(u);
    localStorage.setItem('sanctuary_user', JSON.stringify(u));
    return u;
  };

  const signOut = async () => {
    try { await api.logout(); } catch { /* ignore */ }
    setUser(null);
    localStorage.removeItem('sanctuary_user');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('sanctuary_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
