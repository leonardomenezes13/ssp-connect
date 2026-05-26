'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('ssp_token');
      const storedUser = localStorage.getItem('ssp_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // localStorage corrompido — limpa e força novo login
      localStorage.removeItem('ssp_token');
      localStorage.removeItem('ssp_user');
    } finally {
      setLoading(false);
    }
  }, []);

  function login(userData, tokenData) {
    localStorage.setItem('ssp_token', tokenData);
    localStorage.setItem('ssp_user', JSON.stringify(userData));
    setToken(tokenData);
    setUser(userData);
    if (userData.role === 'ADMIN') {
      router.push('/admin/dashboard');
    } else {
      router.push('/user/dashboard');
    }
  }

  function logout() {
    localStorage.removeItem('ssp_token');
    localStorage.removeItem('ssp_user');
    setToken(null);
    setUser(null);
    router.push('/login');
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
