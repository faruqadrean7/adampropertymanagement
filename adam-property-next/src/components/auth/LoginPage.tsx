'use client';

import React, { useState } from 'react';
import { useAuth, DEMO_USERS } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  Zap, 
  Loader2 
} from 'lucide-react';

export default function LoginPage() {
  const { login, quickLogin, isLoading } = useAuth();
  const [email, setEmail] = useState('direktur@adamproperty.co.id');
  const [password, setPassword] = useState('adam123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMessage(res.message || 'Login gagal, periksa email dan password.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickSelect = (role: UserRole) => {
    const user = DEMO_USERS[role];
    if (user) {
      setEmail(user.email);
      setPassword('adam123');
      quickLogin(role);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#f8fafc] text-slate-800 antialiased">
      {/* LEFT SECTION: BRAND IDENTITY & ARCHITECTURE SHOWCASE (Hidden on small mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#091220] via-[#0d1b2e] to-[#052e24] text-white p-12 flex-col justify-between relative overflow-hidden select-none">
        {/* Subtle background glow circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Logo */}
        <div className="flex items-center gap-3.5 z-10">
          <div className="w-12 h-12 rounded-2xl bg-white p-2 shadow-xl shadow-black/40 border border-white/20 flex items-center justify-center shrink-0">
            <img 
              src="/assets/logo-icon.svg" 
              alt="Logo PT Adam Property Indonesia" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight leading-tight">
              PT Adam Property
            </h1>
            <div className="text-sm font-black text-rose-400 leading-tight">
              Indonesia
            </div>
            <div className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
              Developer Utama
            </div>
          </div>
        </div>

        {/* Center: System Value Proposition */}
        <div className="space-y-6 max-w-lg z-10 my-auto py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Enterprise Property Management & ERP</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-black text-white tracking-tight leading-snug">
            Sistem Informasi Pengelolaan Kavling, Keuangan & Aset Perusahaan
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed">
            Platform operasional terpadu PT Adam Property Indonesia untuk monitoring site plan kavling, mutasi kas besar & kas kecil, piutang konsumen, kewajiban tanah mentah petani, hingga penggajian marketing.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-slate-200">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">✓</span>
              <span>Site Plan & Peta Kavling Interaktif Real-Time</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-200">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">✓</span>
              <span>Kas Besar (Investor) & Kas Kecil (Operasional & Payroll)</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-200">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">✓</span>
              <span>Hutang Petani Per-Lahan & Dukungan Barter Material Bangunan</span>
            </div>
          </div>
        </div>

        {/* Bottom: Version & Security */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-6 border-t border-white/10 z-10">
          <span>&copy; 2026 PT Adam Property Indonesia</span>
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            NEXT.JS &bull; SUPABASE READY
          </span>
        </div>
      </div>

      {/* RIGHT SECTION: EXECUTIVE LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Top Brand Icon (visible on mobile only) */}
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 p-2 shadow-md flex items-center justify-center shrink-0">
              <img src="/assets/logo-icon.svg" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 leading-tight">PT Adam Property</h2>
              <span className="text-xs font-black text-rose-900" style={{ color: '#881337' }}>Indonesia &bull; Developer Utama</span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Selamat Datang Kembali
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Silakan masuk ke portal kerja internal PT Adam Property Indonesia
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <span className="font-bold">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Alamat Email Kantor
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@adamproperty.co.id"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition shadow-2xs"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Kata Sandi (Password)
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Silakan hubungi Administrator IT atau Direksi PT Adam Property untuk reset kata sandi Anda.');
                  }}
                  className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  Lupa password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition shadow-2xs"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <span className="font-medium text-slate-700">Ingat sesi saya</span>
              </label>
              <span className="text-[11px] text-slate-400">Offline & Cloud Sync</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.99] transition shadow-md shadow-slate-900/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Memverifikasi Kredensial...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard ERP</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </>
              )}
            </button>
          </form>

          {/* Quick Role Test Switcher */}
          <div className="pt-6 border-t border-slate-200">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Login Cepat Berdasarkan Jabatan:</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickSelect('direktur')}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/50 text-left transition flex items-center gap-2 shadow-2xs group"
              >
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0">
                  👔
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 truncate">Direktur Utama</div>
                  <div className="text-[10px] text-slate-500 truncate">Akses Penuh Semua Modul</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect('keuangan')}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-violet-400 hover:bg-violet-50/50 text-left transition flex items-center gap-2 shadow-2xs group"
              >
                <span className="w-7 h-7 rounded-lg bg-violet-100 text-violet-800 flex items-center justify-center text-xs font-bold shrink-0">
                  💰
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-violet-800 truncate">Finance / Kasir</div>
                  <div className="text-[10px] text-slate-500 truncate">Kas Besar & Kas Kecil</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect('marketing')}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/50 text-left transition flex items-center gap-2 shadow-2xs group"
              >
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold shrink-0">
                  🏷️
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-800 truncate">Tim Marketing</div>
                  <div className="text-[10px] text-slate-500 truncate">Kavling & Customer</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect('legal')}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 text-left transition flex items-center gap-2 shadow-2xs group"
              >
                <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold shrink-0">
                  ⚖️
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-amber-800 truncate">Legal & Notaris</div>
                  <div className="text-[10px] text-slate-500 truncate">PPJB & Lahan Petani</div>
                </div>
              </button>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 pt-2">
            PT Adam Property Indonesia &bull; Terproteksi Keamanan Terpusat
          </div>
        </div>
      </div>
    </div>
  );
}
