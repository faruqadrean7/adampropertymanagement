'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, UserRole, ROLE_PERMISSIONS, RolePermission } from '@/types';
import { supabaseSignIn, supabaseSignOut, isSupabaseConfigured } from '@/lib/supabaseService';

export const DEMO_USERS: Record<UserRole, AuthUser> = {
  management: {
    id: 'usr-management',
    email: 'management@adamproperty.co.id',
    nama: 'Bpk. Ir. H. Adam Malik',
    jabatan: 'Direksi Management (Hanya Lihat)',
    role: 'management'
  },
  it_manager: {
    id: 'usr-it-manager',
    email: 'it.manager@adamproperty.co.id',
    nama: 'Budi Santoso, S.Kom',
    jabatan: 'Head of IT & Super Administrator',
    role: 'it_manager'
  },
  admin: {
    id: 'usr-admin',
    email: 'admin@adamproperty.co.id',
    nama: 'Siti Nurhaliza, S.Ak.',
    jabatan: 'Admin Keuangan & Kasir Pembayaran',
    role: 'admin'
  }
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

    const matchedRole = Object.keys(DEMO_USERS).find(
      key => DEMO_USERS[key as UserRole].email.toLowerCase() === email.trim().toLowerCase()
    ) as UserRole | undefined;

    let loggedInUser: AuthUser;

    if (matchedRole) {
      loggedInUser = DEMO_USERS[matchedRole];
    } else {
      // Default to management (view-only) for unknown custom accounts
      loggedInUser = {
        id: `usr-${Date.now()}`,
        email: email.trim(),
        nama: email.split('@')[0].toUpperCase(),
        jabatan: 'Staff Monitoring',
        role: 'management'
      };
    }

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
