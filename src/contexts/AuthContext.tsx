import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock users for demo purposes
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'student@demo.com',
    role: 'student',
    createdAt: new Date('2024-01-15'),
    lastActive: new Date(),
  },
  {
    id: '2',
    name: 'Dr. Sarah Chen',
    email: 'tutor@demo.com',
    role: 'tutor',
    createdAt: new Date('2024-01-10'),
    lastActive: new Date(),
  },
  {
    id: '3',
    name: 'Michael Rodriguez',
    email: 'admin@demo.com',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    lastActive: new Date(),
  },
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('mcat-prep-user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Convert date fields back to Date objects
        if (parsedUser.createdAt) parsedUser.createdAt = new Date(parsedUser.createdAt);
        if (parsedUser.lastActive) parsedUser.lastActive = new Date(parsedUser.lastActive);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('mcat-prep-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'demo123') {
      const userWithLastActive = { ...foundUser, lastActive: new Date() };
      setUser(userWithLastActive);
      localStorage.setItem('mcat-prep-user', JSON.stringify(userWithLastActive));
      
    } else {
      throw new Error('Invalid credentials');
    }
    
    setIsLoading(false);
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      createdAt: new Date(),
      lastActive: new Date(),
    };
    
    setUser(newUser);
    localStorage.setItem('mcat-prep-user', JSON.stringify(newUser));
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mcat-prep-user');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};