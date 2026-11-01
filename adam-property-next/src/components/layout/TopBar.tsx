'use client';

import React, { useState, useEffect } from 'react';
import { useProperty } from '@/context/PropertyContext';
import { useAuth } from '@/context/AuthContext';
import { Menu, Plus, Calendar, ChevronRight, LogOut, User, Eye, ShieldCheck, Receipt } from 'lucide-react';

interface TopBarProps {
  onToggleSidebar: () => void;
  onOpenPrimaryModal?: () => void;
}

export default function TopBar({ onToggleSidebar, onOpenPrimaryModal }: TopBarProps) {
  const { activeTab } = useProperty();
  const { user, permissions, isReadOnly, canManagePayments, canFullAccess, logout } = useAuth();
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    setCurrentDate(formatted);
  }, []);

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Executive Business Analytics';
      case 'kavling': return '1. Peta & Site Plan Kavling';
      case 'customer': return '2. Data Customer & Piutang';
      case 'landDebt': return '3. Hutang Lahan Petani';
      case 'cashbook': return '4. Buku Kas Besar & Arus Kas';
      case 'pettyCash': return '5. Buku Kas Kecil Kantor';
      case 'inventory': return '6. Inventaris & Aset Kantor';
      case 'employee': return '7. Data Karyawan & Payroll Gaji';
      default: return 'PT Adam Property Indonesia';
    }
  };

  const getButtonText = () => {
    switch (activeTab) {
      case 'dashboard': return '+ Tambah Kavling';
      case 'kavling': return '+ Tambah Kavling';
      case 'customer': return '+ Tambah Customer';
      case 'landDebt': return '+ Beli Lahan';
      case 'cashbook': return '+ Catat Kas';
      case 'pettyCash': return '+ Top Up Kas';
      case 'inventory': return '+ Tambah Aset';
      case 'employee': return '+ Tambah Staf';
      default: return '+ Tambah';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition focus:outline-none"
          title="Buka Navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-50 p-1 border border-slate-200 hidden sm:flex items-center justify-center shrink-0 shadow-2xs">
            <img 
              src="/assets/logo-icon.svg" 
              alt="Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <span className="font-bold text-slate-800">
                PT Adam Property <span className="text-rose-900 font-black">Indonesia</span>
              </span>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-emerald-700 font-bold">{getBreadcrumbTitle()}</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
              {getBreadcrumbTitle()}
            </h2>
          </div>
        </div>
      </div>

      {/* Right: Date Badge, User Info & Quick Action */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          <span>{currentDate || 'Memuat...'}</span>
        </div>

        {user && (
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center text-xs shadow-2xs ${
              user.role === 'it_manager' ? 'bg-emerald-100 text-emerald-800' :
              user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {user.role === 'it_manager' ? '💻' : user.role === 'admin' ? '💳' : '👔'}
            </span>
            <div className="text-left leading-tight hidden lg:block">
              <span className="font-bold text-slate-900 block text-[11px] truncate max-w-[130px]">{user.nama}</span>
              <span className={`text-[9px] font-bold uppercase tracking-wider block ${
                user.role === 'it_manager' ? 'text-emerald-700' :
                user.role === 'admin' ? 'text-blue-700' : 'text-amber-700'
              }`}>
                {user.role === 'it_manager' ? 'IT Manager (Full)' : user.role === 'admin' ? 'Admin Pembayaran' : 'Management (View)'}
              </span>
            </div>
            <button
              onClick={() => {
                if (confirm('Keluar dari sistem?')) {
                  logout();
                }
              }}
              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition ml-1 cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Action Button: Disabled / Read-Only for Management */}
        {isReadOnly ? (
          <div 
            className="px-3.5 py-1.5 text-xs font-bold text-amber-900 bg-amber-50 border border-amber-300 rounded-xl flex items-center gap-1.5 shadow-2xs cursor-not-allowed select-none"
            title="Akun Management memiliki hak akses Hanya Lihat (Read-Only). Transaksi tidak diizinkan."
          >
            <Eye className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Mode Pantau</span>
            <span className="sm:hidden">Pantau</span>
          </div>
        ) : (
          <button
            onClick={onOpenPrimaryModal}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.98] rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>{getButtonText()}</span>
          </button>
        )}
      </div>
    </header>
  );
}
