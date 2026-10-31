import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => Promise<void>;
  signup: (email: string, password?: string, name?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('travelgenie_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('travelgenie_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('travelgenie_user');
    }
  }, [user]);

  const login = async (email: string, name?: string) => {
    // Simulated or Supabase Auth login
    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email,
      name: name || email.split('@')[0],
    };
    setUser(newUser);
  };

  const signup = async (email: string, _password?: string, name?: string) => {
    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email,
      name: name || email.split('@')[0],
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

