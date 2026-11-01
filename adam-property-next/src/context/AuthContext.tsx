'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, UserRole, ROLE_PERMISSIONS, RolePermission } from '@/types';
import { supabaseSignIn, supabaseSignOut, isSupabaseConfigured } from '@/lib/supabaseService';

export const USER_CREDENTIALS: Record<UserRole, { email: string; password: string; user: AuthUser }> = {
  management: {
    email: 'management@adamproperty.co.id',
    password: 'adampropertyjaya1!',
    user: {
      id: 'usr-management',
      email: 'management@adamproperty.co.id',
      nama: 'Management',
      jabatan: 'Direksi & Pengawas (Hanya Lihat)',
      role: 'management'
    }
  },
  admin: {
    email: 'admin@adamproperty.co.id',
    password: 'adamproperty1',
    user: {
      id: 'usr-admin',
      email: 'admin@adamproperty.co.id',
      nama: 'Admin',
      jabatan: 'Admin Keuangan & Kasir',
      role: 'admin'
    }
  },
  it_manager: {
    email: 'it.manager@adamproperty.co.id',
    password: 'edc128xk92',
    user: {
      id: 'usr-it-manager',
      email: 'it.manager@adamproperty.co.id',
      nama: 'Faruq Adrean',
      jabatan: 'Head of IT & Administrator',
      role: 'it_manager'
    }
  }
};

export const DEMO_USERS: Record<UserRole, AuthUser> = {
  management: USER_CREDENTIALS.management.user,
  it_manager: USER_CREDENTIALS.it_manager.user,
  admin: USER_CREDENTIALS.admin.user
};

interface AuthContextType {
  user: AuthUser | null;
  permissions: RolePermission;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSupabaseLive: boolean;
  canManagePayments: boolean;
  canRecordCashflow: boolean;
  canFullAccess: boolean;
  isReadOnly: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  quickLogin: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isSupabaseLive = isSupabaseConfigured();

  // Restore session from localStorage on initial load
  useEffect(() => {
    try {
      const stored = localStorage.getItem('adam_property_auth_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Normalize role if legacy role was stored
        if (!['management', 'it_manager', 'admin'].includes(parsed.role)) {
          parsed.role = 'management';
        }
        setUser(parsed);
      }
    } catch (e) {
      console.error('Failed to parse stored auth user', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);

    if (!email || !password) {
      setIsLoading(false);
      return { success: false, message: 'Email dan password wajib diisi!' };
    }

    // 1. Try real Supabase auth if environment variables are plugged in
    if (isSupabaseLive) {
      const supaRes = await supabaseSignIn(email, password);
      if (supaRes.user) {
        setUser(supaRes.user);
        localStorage.setItem('adam_property_auth_user', JSON.stringify(supaRes.user));
        setIsLoading(false);
        return { success: true };
      }
    }

    // 2. Offline / local pre-configured accounts fallback
    await new Promise((resolve) => setTimeout(resolve, 400));

    const inputLower = email.trim().toLowerCase();
    const matchedRole = (Object.keys(USER_CREDENTIALS) as UserRole[]).find(role => {
      const accountEmail = USER_CREDENTIALS[role].email.toLowerCase();
      const username = accountEmail.split('@')[0];
      return inputLower === accountEmail || inputLower === username;
    });

    if (!matchedRole) {
      setIsLoading(false);
      return { 
        success: false, 
        message: 'Akun email tidak terdaftar dalam sistem PT Adam Property.' 
      };
    }

    const targetAccount = USER_CREDENTIALS[matchedRole];
    if (password !== targetAccount.password) {
      setIsLoading(false);
      return { 
        success: false, 
        message: 'Kata sandi (password) salah! Silakan periksa kembali.' 
      };
    }

    const loggedInUser: AuthUser = targetAccount.user;
    setUser(loggedInUser);
    localStorage.setItem('adam_property_auth_user', JSON.stringify(loggedInUser));
    setIsLoading(false);
    return { success: true };
  };

  const quickLogin = (role: UserRole) => {
    const target = DEMO_USERS[role] || DEMO_USERS.management;
    setUser(target);
    localStorage.setItem('adam_property_auth_user', JSON.stringify(target));
  };

  const logout = () => {
    supabaseSignOut();
    setUser(null);
    localStorage.removeItem('adam_property_auth_user');
  };

  const currentRole: UserRole = user?.role || 'management';
  const permissions = ROLE_PERMISSIONS[currentRole];

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        isAuthenticated: !!user,
        isLoading,
        isSupabaseLive,
        canManagePayments: permissions.canManagePayments,
        canRecordCashflow: permissions.canRecordCashflow,
        canFullAccess: permissions.canManageProjects,
        isReadOnly: permissions.isReadOnly,
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
