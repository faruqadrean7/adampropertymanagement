'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, UserRole } from '@/types';

export const DEMO_USERS: Record<UserRole, AuthUser> = {
  direktur: {
    id: 'usr-1',
    email: 'direktur@adamproperty.co.id',
    nama: 'Adam Malik, S.T.',
    jabatan: 'Direktur Utama',
    role: 'direktur'
  },
  keuangan: {
    id: 'usr-2',
    email: 'keuangan@adamproperty.co.id',
    nama: 'Siti Nurhaliza, S.Ak.',
    jabatan: 'Kasir & Admin Keuangan',
    role: 'keuangan'
  },
  marketing: {
    id: 'usr-3',
    email: 'marketing@adamproperty.co.id',
    nama: 'Budi Santoso',
    jabatan: 'Senior Marketing Executive',
    role: 'marketing'
  },
  operasional: {
    id: 'usr-4',
    email: 'survey@adamproperty.co.id',
    nama: 'Wahyudi Prasetyo',
    jabatan: 'Koordinator Survey & Patok',
    role: 'operasional'
  },
  legal: {
    id: 'usr-5',
    email: 'legal@adamproperty.co.id',
    nama: 'Anwar Sadat, S.H., M.Kn.',
    jabatan: 'Legalitas & Notaris PPJB',
    role: 'legal'
  }
};

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  quickLogin: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session from localStorage on initial load
  useEffect(() => {
    try {
      const stored = localStorage.getItem('adam_property_auth_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse stored auth user', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    // Simulate network latency / Supabase Auth call
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Check predefined users or match email pattern
    const matchedRole = Object.keys(DEMO_USERS).find(
      key => DEMO_USERS[key as UserRole].email.toLowerCase() === email.toLowerCase()
    ) as UserRole | undefined;

    let loggedInUser: AuthUser;

    if (matchedRole) {
      loggedInUser = DEMO_USERS[matchedRole];
    } else if (email && password) {
      // Default to Direktur if custom email provided
      loggedInUser = {
        id: `usr-${Date.now()}`,
        email,
        nama: email.split('@')[0].toUpperCase(),
        jabatan: 'Executive Staff',
        role: 'direktur'
      };
    } else {
      setIsLoading(false);
      return { success: false, message: 'Email dan password wajib diisi!' };
    }

    setUser(loggedInUser);
    localStorage.setItem('adam_property_auth_user', JSON.stringify(loggedInUser));
    setIsLoading(false);
    return { success: true };
  };

  const quickLogin = (role: UserRole) => {
    const target = DEMO_USERS[role] || DEMO_USERS.direktur;
    setUser(target);
    localStorage.setItem('adam_property_auth_user', JSON.stringify(target));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adam_property_auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        quickLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
