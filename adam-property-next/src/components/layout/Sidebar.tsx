'use client';

import React from 'react';
import Image from 'next/image';
import { useProperty } from '@/context/PropertyContext';
import { NavTab } from '@/types';
import { 
  BarChart3, 
  MapPin, 
  Users, 
  Tractor, 
  Vault, 
  Coins, 
  Boxes, 
  UserCheck, 
  Plus, 
  Database, 
  RotateCw,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrimaryModal?: () => void;
}

export default function Sidebar({ isOpen, onClose, onOpenPrimaryModal }: SidebarProps) {
  const { activeTab, setActiveTab, syncAllToCashbook } = useProperty();

  const navItems: { tab: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { tab: 'dashboard', label: 'Executive Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { tab: 'kavling', label: '1. Peta & Site Plan Kavling', icon: <MapPin className="w-4 h-4" /> },
    { tab: 'customer', label: '2. Customer & Barter', icon: <Users className="w-4 h-4" /> },
    { tab: 'landDebt', label: '3. Hutang Lahan Petani', icon: <Tractor className="w-4 h-4" /> },
    { tab: 'cashbook', label: '4. Kas Besar (General Ledger)', icon: <Vault className="w-4 h-4" /> },
    { tab: 'pettyCash', label: '5. Kas Kecil Kantor', icon: <Coins className="w-4 h-4" /> },
    { tab: 'inventory', label: '6. Inventaris & Aset Tetap', icon: <Boxes className="w-4 h-4" /> },
    { tab: 'employee', label: '7. Karyawan & Payroll Gaji', icon: <UserCheck className="w-4 h-4" /> },
  ];

  const getPrimaryActionLabel = () => {
    switch (activeTab) {
      case 'dashboard': return '+ Tambah Kavling Baru';
      case 'kavling': return '+ Tambah Kavling Baru';
      case 'customer': return '+ Tambah Customer';
      case 'landDebt': return '+ Beli Lahan Petani';
      case 'cashbook': return '+ Catat Kas Besar';
      case 'pettyCash': return '+ Top Up Kas Kecil';
      case 'inventory': return '+ Tambah Inventaris';
      case 'employee': return '+ Tambah Karyawan';
      default: return '+ Tambah Data';
    }
  };

  const handleExportBackup = () => {
    const data = {
      timestamp: new Date().toISOString(),
      company: 'PT Adam Property Indonesia',
      note: 'Next.js + Supabase Ready Backup'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `adam-property-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Corporate Sidebar */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 bottom-0 w-72 shrink-0 h-screen flex flex-col justify-between border-r border-slate-800/80 text-white z-50 transition-transform duration-300 ease-in-out select-none bg-gradient-to-b from-[#091220] via-[#0d1b2e] to-[#052e24] ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand & Identity Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-lg shadow-black/40 border border-white/20 shrink-0">
                <img 
                  src="/assets/logo-icon.svg" 
                  alt="Logo PT Adam Property Indonesia" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-[13px] font-black tracking-tight text-white leading-tight truncate">
                  PT Adam Property
                </h1>
                <div className="text-[12px] font-black text-rose-400 leading-tight">
                  Indonesia
                </div>
                <div className="text-[9px] font-semibold text-slate-400 leading-tight tracking-wider uppercase">
                  Developer Utama
                </div>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* System Status Pill */}
          <div className="mt-4 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-[10px]">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Sistem Terhubung
            </span>
            <span className="font-bold text-emerald-400 font-mono">v7.0 NEXT.JS</span>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Modul Utama ERP
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => {
                    setActiveTab(item.tab);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold border border-emerald-400/30 shadow-md shadow-emerald-950/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span className="truncate flex-1">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-3.5 border-t border-white/10 shrink-0 space-y-2.5 bg-black/20">
          <button 
            onClick={onOpenPrimaryModal}
            className="w-full py-2.5 px-4 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 active:scale-[0.98] rounded-xl shadow-lg shadow-emerald-950/40 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{getPrimaryActionLabel()}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={handleExportBackup}
              className="px-2.5 py-2 text-[11px] font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition flex items-center justify-center gap-1.5"
              title="Cadangkan Database"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Backup</span>
            </button>
            <button 
              onClick={syncAllToCashbook}
              className="px-2.5 py-2 text-[11px] font-semibold text-teal-300 hover:text-teal-200 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-400/20 rounded-lg transition flex items-center justify-center gap-1.5"
              title="Sinkronisasi Seluruh Transaksi ke Kas Besar"
            >
              <RotateCw className="w-3.5 h-3.5 text-teal-400" />
              <span>Sinkron Kas</span>
            </button>
          </div>

          <div className="text-[10px] text-center text-slate-400 pt-1">
            PT Adam Property Indonesia &bull; Next.js 16
          </div>
        </div>
      </aside>
    </>
  );
}
