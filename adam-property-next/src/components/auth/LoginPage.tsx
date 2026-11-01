'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function LoginPage() {
  const { login, isSupabaseLive } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      setErrorMessage(err.message || 'Terjadi kesalahan sistem saat mencoba masuk.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#f8fafc] text-slate-800 antialiased">
      {/* LEFT SECTION: BRAND IDENTITY & VALUE PROPOSITION */}
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
            Platform operasional terpadu PT Adam Property Indonesia untuk monitoring site plan kavling, mutasi kas besar & kas kecil, piutang konsumen, kewajiban tanah mentah petani, hingga penggajian karyawan.
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
              <span>Hutang Petani Per-Lahan & Pencatatan Kwitansi/Slip Sah</span>
            </div>
          </div>
        </div>

        {/* Bottom: Version & Security */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-6 border-t border-white/10 z-10">
          <span>&copy; 2026 PT Adam Property Indonesia. Hak Cipta Dilindungi.</span>
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {isSupabaseLive ? 'SUPABASE CLOUD LIVE' : 'INTERNAL SECURE ERP'}
          </span>
        </div>
      </div>

      {/* RIGHT SECTION: PROPER ENTERPRISE LOGIN FORM */}
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
              Portal Masuk Karyawan
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Gunakan email kantor dan kata sandi yang telah didaftarkan oleh IT Administrator
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span className="font-semibold">{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Alamat Email / ID Pengguna *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh: it.manager@adamproperty.co.id"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition shadow-2xs"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Kata Sandi (Password) *
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Untuk reset kata sandi, hubungi IT Administrator atau Manajemen PT Adam Property Indonesia.');
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
                  placeholder="Masukkan kata sandi Anda"
                  className="w-full pl-10 pr-11 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition shadow-2xs"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
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
                <span className="font-medium text-slate-700">Ingat sesi di perangkat ini</span>
              </label>
              <span className="text-[11px] text-slate-400">256-bit SSL Terenkripsi</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.99] transition shadow-md shadow-slate-900/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Memverifikasi Akses Pengguna...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard ERP</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </>
              )}
            </button>
          </form>

          {/* Secure System Badge & Notice */}
          <div className="pt-6 border-t border-slate-200 text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sistem Hak Akses Berlapis (Management &bull; IT &bull; Admin Kasir)</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Hak cipta &copy; 2026 PT Adam Property Indonesia. Akses hanya untuk staf dan manajemen yang berwenang.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
