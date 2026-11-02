'use client';

import React, { useState } from 'react';
import { useProperty } from '@/context/PropertyContext';
import ExportButtons from '@/components/common/ExportButtons';
import { 
  Tractor, 
  Plus, 
  MapPin, 
  Coins, 
  Clock, 
  Receipt, 
  Phone, 
  FileCheck2, 
  Building2,
  UploadCloud,
  Eye,
  Trash2,
  X,
  CheckCircle2,
  FileCheck,
  FileText,
  Image as ImageIcon,
  Pencil,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import { LandDebt } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function LandDebtView() {
  const { user, isReadOnly, canManagePayments, canFullAccess } = useAuth();
  const { 
    projects, 
    landDebts, 
    landPayments, 
    addLandDebt, 
    updateLandDebt,
    deleteLandDebt,
    updateLandDocuments,
    addLandPayment,
    updateLandPaymentReceipt
  } = useProperty();

  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLandForPay, setSelectedLandForPay] = useState<LandDebt | null>(null);
  const [selectedLandDetail, setSelectedLandDetail] = useState<LandDebt | null>(null);
  const [previewImage, setPreviewImage] = useState<{ title: string; src: string } | null>(null);

  // Edit Land Debt state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLandId, setEditLandId] = useState('');
  const [editProjectId, setEditProjectId] = useState('');
  const [editNamaPetani, setEditNamaPetani] = useState('');
  const [editTelepon, setEditTelepon] = useState('');
  const [editLuasTanah, setEditLuasTanah] = useState('');
  const [editAlasHak, setEditAlasHak] = useState('');
  const [editHargaKesepakatan, setEditHargaKesepakatan] = useState(600000000);
  const [editDpDibayar, setEditDpDibayar] = useState(250000000);
  const [editAlamatLahan, setEditAlamatLahan] = useState('');
  const [editKeterangan, setEditKeterangan] = useState('');
  const [editSertifikatImage, setEditSertifikatImage] = useState<string | null>(null);
  const [editPerjanjianImage, setEditPerjanjianImage] = useState<string | null>(null);

  // Delete Land Debt state
  const [deleteLandTarget, setDeleteLandTarget] = useState<LandDebt | null>(null);

  // Form Add Land Debt
  const [projectId, setProjectId] = useState(projects[0]?.id || 'proj-1');
  const [namaPetani, setNamaPetani] = useState('');
  const [telepon, setTelepon] = useState('');
  const [luasTanah, setLuasTanah] = useState('');
  const [alasHak, setAlasHak] = useState('');
  const [hargaKesepakatan, setHargaKesepakatan] = useState(600000000);
  const [dpDibayar, setDpDibayar] = useState(250000000);
  const [alamatLahan, setAlamatLahan] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [sertifikatImage, setSertifikatImage] = useState<string | null>(null);
  const [perjanjianImage, setPerjanjianImage] = useState<string | null>(null);

  const handleUpdateLandDoc = (updates: { sertifikatImage?: string | null; perjanjianImage?: string | null }) => {
    if (!selectedLandDetail) return;
    updateLandDocuments(selectedLandDetail.id, updates);
    setSelectedLandDetail(prev => (prev ? { ...prev, ...updates } : null));
  };

  const handleOpenEditLand = (land: LandDebt) => {
    setEditLandId(land.id);
    setEditProjectId(land.projectId);
    setEditNamaPetani(land.namaPetani);
    setEditTelepon(land.telepon);
    setEditLuasTanah(land.luasTanah);
    setEditAlasHak(land.alasHak);
    setEditHargaKesepakatan(land.hargaKesepakatan);
    setEditDpDibayar(land.dpDibayar);
    setEditAlamatLahan(land.alamatLahan || '');
    setEditKeterangan(land.keterangan || '');
    setEditSertifikatImage(land.sertifikatImage || null);
    setEditPerjanjianImage(land.perjanjianImage || null);
    setShowEditModal(true);
  };

  const handleEditLandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editLandId || !editNamaPetani.trim()) return;

    updateLandDebt(editLandId, {
      projectId: editProjectId,
      namaPetani: editNamaPetani.trim(),
      telepon: editTelepon.trim(),
      luasTanah: editLuasTanah.trim(),
      alasHak: editAlasHak.trim(),
      hargaKesepakatan: Number(editHargaKesepakatan),
      dpDibayar: Number(editDpDibayar),
      alamatLahan: editAlamatLahan.trim() || undefined,
      keterangan: editKeterangan.trim() || undefined,
      sertifikatImage: editSertifikatImage,
      perjanjianImage: editPerjanjianImage
    });

    if (selectedLandDetail && selectedLandDetail.id === editLandId) {
      setSelectedLandDetail(prev => prev ? {
        ...prev,
        projectId: editProjectId,
        namaPetani: editNamaPetani.trim(),
        telepon: editTelepon.trim(),
        luasTanah: editLuasTanah.trim(),
        alasHak: editAlasHak.trim(),
        hargaKesepakatan: Number(editHargaKesepakatan),
        dpDibayar: Number(editDpDibayar),
        alamatLahan: editAlamatLahan.trim() || undefined,
        keterangan: editKeterangan.trim() || undefined,
        sertifikatImage: editSertifikatImage,
        perjanjianImage: editPerjanjianImage
      } : null);
    }

    setShowEditModal(false);
  };

  const handleConfirmDeleteLand = () => {
    if (!deleteLandTarget) return;
    deleteLandDebt(deleteLandTarget.id);
    if (selectedLandDetail && selectedLandDetail.id === deleteLandTarget.id) {
      setSelectedLandDetail(null);
    }
    setDeleteLandTarget(null);
  };

  // Form Land Payment
  const [payNominal, setPayNominal] = useState(50000000);
  const [payMetode, setPayMetode] = useState('Transfer Bank Mandiri');
  const [payKeterangan, setPayKeterangan] = useState('Cicilan Pembayaran Tanah Mentah');
  const [payKwitansiImage, setPayKwitansiImage] = useState<string | null>(null);

  // Helper membaca file upload slip lokal
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string | null) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert('Ukuran file maksimal 8 MB!');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setter(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleLandReceiptUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    paymentId: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert('Ukuran file maksimal 8 MB!');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      updateLandPaymentReceipt(paymentId, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const generateSampleDoc = (title: string, subtitle: string, bg: string) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380">
      <rect width="600" height="380" fill="${bg}" rx="12"/>
      <rect x="20" y="20" width="560" height="340" fill="none" stroke="white" stroke-width="2" stroke-dasharray="6,6" opacity="0.4"/>
      <circle cx="300" cy="140" r="45" fill="white" opacity="0.2"/>
      <text x="300" y="215" font-family="Arial" font-size="22" font-weight="bold" fill="white" text-anchor="middle">${title}</text>
      <text x="300" y="245" font-family="Arial" font-size="14" fill="white" opacity="0.8" text-anchor="middle">${subtitle}</text>
      <text x="300" y="280" font-family="Arial" font-size="12" fill="white" opacity="0.6" text-anchor="middle">PT ADAM PROPERTY INDONESIA - KAS BESAR</text>
    </svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  };

  // Filtering per Lahan Proyek (agar catatan hutang tidak tercampur)
  const filteredLands = landDebts.filter(l => 
    selectedProjectId === 'all' || l.projectId === selectedProjectId
  );

  const totalNilaiTanah = filteredLands.reduce((sum, l) => sum + l.hargaKesepakatan, 0);
  const totalTerbayar = filteredLands.reduce((sum, l) => sum + l.dpDibayar + l.totalCicilan, 0);
  const totalSisaHutang = filteredLands.reduce((sum, l) => sum + l.sisaHutang, 0);

  const activeProjectLabel = selectedProjectId === 'all' 
    ? 'Semua Lahan Proyek (Rekap Terpadu)' 
    : (projects.find(p => p.id === selectedProjectId)?.nama || 'Lahan Terpilih');

  const getExportData = () => ({
    filename: `Laporan-Hutang-Lahan-${new Date().toISOString().split('T')[0]}`,
    title: 'Laporan Hutang Lahan & Pembebasan Tanah Petani',
    subtitle: activeProjectLabel,
    category: 'KEWAJIBAN & HUTANG TANAH INDUK',
    headers: ['Nama Proyek', 'Pemilik Lahan / Petani', 'Luas Tanah', 'Alas Hak', 'Harga Kesepakatan (Rp)', 'Total Terbayar (Rp)', 'Sisa Hutang (Rp)', 'Status Bayar'],
    rows: filteredLands.map(l => [
      l.projectNama,
      l.namaPetani,
      l.luasTanah,
      l.alasHak,
      `Rp ${l.hargaKesepakatan.toLocaleString('id-ID')}`,
      `Rp ${(l.dpDibayar + l.totalCicilan).toLocaleString('id-ID')}`,
      `Rp ${l.sisaHutang.toLocaleString('id-ID')}`,
      l.status === 'lunas' ? 'LUNAS' : 'BELUM LUNAS'
    ]),
    summary: [
      { label: 'Total Kesepakatan Tanah', value: `Rp ${totalNilaiTanah.toLocaleString('id-ID')}` },
      { label: 'Total Uang Terbayar', value: `Rp ${totalTerbayar.toLocaleString('id-ID')}` },
      { label: 'Sisa Kewajiban Hutang', value: `Rp ${totalSisaHutang.toLocaleString('id-ID')}` },
      { label: 'Jumlah Lahan', value: `${filteredLands.length} Lahan` }
    ]
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLandDebt({
      projectId,
      namaPetani,
      telepon,
      luasTanah,
      alasHak,
      hargaKesepakatan: Number(hargaKesepakatan),
      dpDibayar: Number(dpDibayar),
      alamatLahan,
      keterangan,
      sertifikatImage,
      perjanjianImage
    });
    setShowAddModal(false);
    setNamaPetani('');
    setTelepon('');
    setLuasTanah('');
    setAlasHak('');
    setAlamatLahan('');
    setKeterangan('');
    setSertifikatImage(null);
    setPerjanjianImage(null);
  };

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLandForPay) return;

    addLandPayment({
      landDebtId: selectedLandForPay.id,
      tanggal: new Date().toISOString().split('T')[0],
      nominal: Number(payNominal),
      metode: payMetode,
      keterangan: payKeterangan,
      kwitansiImage: payKwitansiImage
    });

    setSelectedLandForPay(null);
    setPayNominal(50000000);
    setPayKwitansiImage(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full min-w-0">
      {/* Header & Per-Lahan Selector */}
      <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
              <Tractor className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
              <span>Hutang Tanah ke Petani</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 hidden sm:block">
              Pencatatan pembebasan lahan mentah, perjanjian jual beli notaris, dan cicilan bertahap.
            </p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap w-full sm:w-auto justify-between sm:justify-end">
            {canFullAccess && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg sm:rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">+ Beli Lahan Petani Baru</span>
                <span className="sm:hidden">+ Beli Lahan</span>
              </button>
            )}
            {isReadOnly && (
              <div className="px-2.5 sm:px-3.5 py-1.5 bg-amber-100/90 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 select-none shrink-0">
                <Eye className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline">Monitoring Lahan (Read-Only)</span>
                <span className="sm:hidden">Pantau</span>
              </div>
            )}
            {user?.role === 'admin' && (
              <div className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-xl text-[11px] font-semibold flex items-center gap-1">
                <Coins className="w-3 h-3 text-blue-600" />
                <span>Admin Kasir</span>
              </div>
            )}
            <ExportButtons getData={getExportData} />
          </div>
        </div>

        {/* DROPDOWN FILTER PILIH LAHAN AGAR TIDAK TERCAMPUR */}
        <div className="p-3 sm:p-3.5 bg-gradient-to-r from-amber-50 via-amber-50/70 to-orange-50 rounded-xl border border-amber-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs font-bold shadow-xs shrink-0">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
                Filter Lahan Proyek:
              </span>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="mt-0.5 px-2.5 py-1 border-2 border-amber-400 rounded-lg text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-2xs max-w-[200px] sm:max-w-none truncate"
              >
                <option value="all">Semua Lahan (Rekap Gabungan)</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.nama}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-amber-950 bg-white/80 px-2.5 py-1 rounded-lg border border-amber-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span className="truncate">Fokus: <b className="text-amber-800">{activeProjectLabel}</b></span>
          </div>
        </div>
      </div>

      {/* 4 Financial Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2.5 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-lg sm:text-xl shrink-0">
            <Tractor className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">Pemilik Lahan</p>
            <h3 className="text-base sm:text-xl font-bold text-slate-800 font-mono truncate">{filteredLands.length}</h3>
            <p className="text-[9px] sm:text-[11px] text-slate-400 truncate">Petani / Penjual</p>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2.5 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-lg sm:text-xl shrink-0">
            <Coins className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">Nilai Tanah</p>
            <h3 className="text-xs sm:text-xl font-bold text-slate-800 font-mono truncate">
              Rp {totalNilaiTanah.toLocaleString('id-ID')}
            </h3>
            <p className="text-[9px] sm:text-[11px] text-slate-400 truncate">Akta Notaris</p>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2.5 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg sm:text-xl shrink-0">
            <FileCheck2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">Sudah Dibayar</p>
            <h3 className="text-xs sm:text-xl font-bold text-emerald-600 font-mono truncate">
              Rp {totalTerbayar.toLocaleString('id-ID')}
            </h3>
            <p className="text-[9px] sm:text-[11px] text-emerald-600 font-medium truncate">DP + Cicilan</p>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-rose-200 shadow-xs flex items-center gap-2.5 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-lg sm:text-xl shrink-0">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">Sisa Hutang</p>
            <h3 className="text-xs sm:text-xl font-bold text-rose-600 font-mono truncate">
              Rp {totalSisaHutang.toLocaleString('id-ID')}
            </h3>
            <p className="text-[9px] sm:text-[11px] text-slate-400 truncate">Kewajiban Belum Bayar</p>
          </div>
        </div>
      </div>

      {/* Table Data Lahan Petani */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs overflow-hidden w-full min-w-0">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Petani / Pemilik</th>
                <th className="py-3 px-4">Proyek & Alas Hak</th>
                <th className="py-3 px-4 text-right">Kesepakatan</th>
                <th className="py-3 px-4 text-right">DP & Cicilan</th>
                <th className="py-3 px-4 text-right">Sisa Hutang</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center w-40">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredLands.map((land) => {
                const isLunas = land.status === 'lunas';
                const terbayar = land.dpDibayar + land.totalCicilan;

                return (
                  <tr key={land.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 text-sm">{land.namaPetani}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" /> {land.telepon}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 truncate">{land.alamatLahan}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-amber-900 block">{land.projectNama}</span>
                      <span className="text-[11px] text-slate-600 block">{land.luasTanah}</span>
                      <span className="text-[11px] text-slate-400 font-mono block">{land.alasHak}</span>
                      
                      {/* Status Dokumen Legalitas Lahan */}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        {land.sertifikatImage ? (
                          <button
                            type="button"
                            onClick={() => setPreviewImage({ title: `Sertifikat Induk: ${land.namaPetani} (${land.projectNama})`, src: land.sertifikatImage! })}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition"
                            title="Klik untuk melihat Sertifikat Induk"
                          >
                            <FileCheck className="w-3 h-3 text-emerald-700" />
                            <span>SHM</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">SHM: -</span>
                        )}

                        {land.perjanjianImage ? (
                          <button
                            type="button"
                            onClick={() => setPreviewImage({ title: `Akta PPJB / Notaris: ${land.namaPetani} (${land.projectNama})`, src: land.perjanjianImage! })}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 hover:bg-blue-200 transition"
                            title="Klik untuk melihat Akta PPJB"
                          >
                            <FileText className="w-3 h-3 text-blue-700" />
                            <span>PPJB</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">PPJB: -</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      Rp {land.hargaKesepakatan.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                      Rp {terbayar.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-rose-600">
                      Rp {land.sisaHutang.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          isLunas
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isLunas ? 'Lunas' : 'Belum Lunas'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {!isLunas && !isReadOnly && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedLandForPay(land);
                              setPayKwitansiImage(null);
                            }}
                            className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition inline-flex items-center gap-1 shadow-2xs cursor-pointer"
                          >
                            <Coins className="w-3.5 h-3.5" />
                            <span>Cicil</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedLandDetail(land)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>Riwayat</span>
                        </button>
                        {canFullAccess && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenEditLand(land)}
                              title="Edit Data Lahan Petani"
                              className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold transition inline-flex items-center cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteLandTarget(land)}
                              title="Hapus Catatan Lahan Petani"
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition inline-flex items-center cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredLands.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-xs">
            Belum ada catatan pembelian lahan petani untuk proyek ini.
          </div>
        )}
      </div>

      {/* Modal Bayar Cicilan ke Petani */}
      {selectedLandForPay && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-start pb-3 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Bayar Cicilan Lahan Petani</h3>
                <p className="text-xs text-slate-500">
                  Kepada: {selectedLandForPay.namaPetani} &bull; {selectedLandForPay.projectNama}
                </p>
              </div>
              <button 
                onClick={() => setSelectedLandForPay(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePaySubmit} className="space-y-3 text-xs">
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 flex justify-between items-center text-rose-950">
                <span>Sisa Kewajiban Hutang:</span>
                <span className="font-bold text-sm font-mono">
                  Rp {selectedLandForPay.sisaHutang.toLocaleString('id-ID')}
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nominal Cicilan Dibayarkan (Rp) *</label>
                <input
                  type="number"
                  required
                  value={payNominal}
                  onChange={(e) => setPayNominal(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-rose-700 text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Metode Transfer / Pembayaran</label>
                <input
                  type="text"
                  value={payMetode}
                  onChange={(e) => setPayMetode(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Keterangan Cicilan</label>
                <input
                  type="text"
                  value={payKeterangan}
                  onChange={(e) => setPayKeterangan(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              {/* UPLOAD BUKTI SLIP TRANSFER / PEMBAYARAN KE PETANI */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                    <Receipt className="w-4 h-4 text-amber-600" />
                    <span>Upload Bukti Bayar / Slip Transfer Bank</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-medium">Opsional</span>
                    <button
                      type="button"
                      onClick={() => {
                        const sampleSlip = generateSampleDoc(
                          'BUKTI TRANSFER BANK - CICILAN LAHAN',
                          `Nominal: Rp ${payNominal.toLocaleString('id-ID')} • ${selectedLandForPay.namaPetani} (${selectedLandForPay.projectNama})`,
                          '#9a3412'
                        );
                        setPayKwitansiImage(sampleSlip);
                      }}
                      className="text-[10px] px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded font-semibold transition"
                    >
                      + Isi Sampel Slip Bank
                    </button>
                  </div>
                </div>

                {payKwitansiImage ? (
                  <div className="space-y-1.5">
                    <div className="relative h-28 w-full rounded-lg overflow-hidden border border-amber-300 bg-slate-100 group">
                      <img
                        src={payKwitansiImage}
                        alt="Bukti Transfer Lahan"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewImage({ title: `Bukti Transfer Lahan: ${selectedLandForPay.namaPetani} - Rp ${payNominal.toLocaleString('id-ID')}`, src: payKwitansiImage })}
                          className="px-2.5 py-1 bg-white text-slate-900 rounded-md font-bold text-[11px] flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> Lihat
                        </button>
                        <button
                          type="button"
                          onClick={() => setPayKwitansiImage(null)}
                          className="px-2.5 py-1 bg-rose-600 text-white rounded-md font-bold text-[11px] flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Hapus
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-amber-800 font-semibold truncate flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-amber-600" /> Slip transfer siap diarsipkan ke kas keluar
                      </span>
                      <button
                        type="button"
                        onClick={() => setPayKwitansiImage(null)}
                        className="text-rose-600 hover:underline font-semibold"
                      >
                        Ganti Berkas
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-300 hover:border-amber-400 bg-white hover:bg-amber-50/30 rounded-xl p-3 text-center cursor-pointer transition flex flex-col items-center justify-center h-24">
                    <UploadCloud className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="font-bold text-slate-700 text-xs">Pilih File Bukti Transfer / Kwitansi</span>
                    <span className="text-[10px] text-slate-400">JPG, PNG, atau screenshot mutasi m-Banking (Maks 8MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setPayKwitansiImage)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-800 text-[11px]">
                ℹ️ Pembayaran ini otomatis mengurangi saldo Kas Besar dan mencatat mutasi keluar resmi.
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedLandForPay(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Bayar & Kurangi Kas Besar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Riwayat Cicilan */}
      {selectedLandDetail && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-start pb-3 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedLandDetail.namaPetani}</h3>
                <p className="text-xs text-slate-500">
                  {selectedLandDetail.projectNama} &bull; {selectedLandDetail.luasTanah}
                </p>
              </div>
              <button 
                onClick={() => setSelectedLandDetail(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 pr-1 custom-scrollbar flex-1">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Kesepakatan</span>
                  <span className="font-bold text-xs font-mono">
                    Rp {selectedLandDetail.hargaKesepakatan.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-emerald-800">
                  <span className="text-[10px] block">Terbayar</span>
                  <span className="font-bold text-xs font-mono">
                    Rp {(selectedLandDetail.dpDibayar + selectedLandDetail.totalCicilan).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-rose-800">
                  <span className="text-[10px] block">Sisa Hutang</span>
                  <span className="font-bold text-xs font-mono">
                    Rp {selectedLandDetail.sisaHutang.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* BERKAS DOKUMEN LEGALITAS LAHAN INDUK */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  <span>Berkas Dokumen Legalitas Lahan Induk</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Dokumen 1: Sertifikat Induk */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 text-[11px]">Sertifikat / Alas Hak</span>
                      {selectedLandDetail.sertifikatImage && (
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                          Terunggah
                        </span>
                      )}
                    </div>

                    {selectedLandDetail.sertifikatImage ? (
                      <div className="space-y-1.5">
                        <div className="relative h-24 w-full rounded-lg overflow-hidden border border-emerald-300 bg-slate-100 group">
                          <img
                            src={selectedLandDetail.sertifikatImage}
                            alt="Sertifikat Induk"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setPreviewImage({ title: `Sertifikat Induk: ${selectedLandDetail.namaPetani} (${selectedLandDetail.projectNama})`, src: selectedLandDetail.sertifikatImage! })}
                              className="px-2 py-1 bg-white text-slate-900 rounded font-bold text-[10px] flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" /> Lihat
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateLandDoc({ sertifikatImage: null })}
                              className="px-2 py-1 bg-rose-600 text-white rounded font-bold text-[10px] flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> Hapus
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <button
                            type="button"
                            onClick={() => setPreviewImage({ title: `Sertifikat Induk: ${selectedLandDetail.namaPetani} (${selectedLandDetail.projectNama})`, src: selectedLandDetail.sertifikatImage! })}
                            className="text-emerald-700 hover:underline font-bold flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" /> Lihat Dokumen
                          </button>
                          <label className="text-slate-500 hover:text-slate-800 cursor-pointer underline font-medium">
                            <span>Ganti Berkas</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, (val) => handleUpdateLandDoc({ sertifikatImage: val }))}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-3 flex flex-col items-center justify-center gap-1 text-center cursor-pointer transition bg-slate-50/50 hover:bg-emerald-50/30">
                          <UploadCloud className="w-5 h-5 text-slate-400" />
                          <span className="font-semibold text-slate-700 text-[11px]">Upload Foto Sertifikat</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, (val) => handleUpdateLandDoc({ sertifikatImage: val }))}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const sample = generateSampleDoc(
                              'SERTIFIKAT INDUK LAHAN',
                              `${selectedLandDetail.alasHak} • ${selectedLandDetail.luasTanah} • ${selectedLandDetail.namaPetani}`,
                              '#065f46'
                            );
                            handleUpdateLandDoc({ sertifikatImage: sample });
                          }}
                          className="w-full py-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
                        >
                          + Pasang Sampel Sertifikat
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Dokumen 2: Akta Notaris PPJB */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 text-[11px]">Surat Perjanjian / Akta PPJB</span>
                      {selectedLandDetail.perjanjianImage && (
                        <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full font-bold">
                          Terunggah
                        </span>
                      )}
                    </div>

                    {selectedLandDetail.perjanjianImage ? (
                      <div className="space-y-1.5">
                        <div className="relative h-24 w-full rounded-lg overflow-hidden border border-blue-300 bg-slate-100 group">
                          <img
                            src={selectedLandDetail.perjanjianImage}
                            alt="Akta PPJB"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setPreviewImage({ title: `Akta PPJB: ${selectedLandDetail.namaPetani} (${selectedLandDetail.projectNama})`, src: selectedLandDetail.perjanjianImage! })}
                              className="px-2 py-1 bg-white text-slate-900 rounded font-bold text-[10px] flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" /> Lihat
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateLandDoc({ perjanjianImage: null })}
                              className="px-2 py-1 bg-rose-600 text-white rounded font-bold text-[10px] flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> Hapus
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <button
                            type="button"
                            onClick={() => setPreviewImage({ title: `Akta PPJB: ${selectedLandDetail.namaPetani} (${selectedLandDetail.projectNama})`, src: selectedLandDetail.perjanjianImage! })}
                            className="text-blue-700 hover:underline font-bold flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" /> Lihat Berkas
                          </button>
                          <label className="text-slate-500 hover:text-slate-800 cursor-pointer underline font-medium">
                            <span>Ganti Berkas</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, (val) => handleUpdateLandDoc({ perjanjianImage: val }))}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-3 flex flex-col items-center justify-center gap-1 text-center cursor-pointer transition bg-slate-50/50 hover:bg-blue-50/30">
                          <UploadCloud className="w-5 h-5 text-slate-400" />
                          <span className="font-semibold text-slate-700 text-[11px]">Upload Foto Akta PPJB</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, (val) => handleUpdateLandDoc({ perjanjianImage: val }))}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const sample = generateSampleDoc(
                              'AKTA NOTARIS & PPJB LAHAN',
                              `PPJB Pembebasan Lahan • ${selectedLandDetail.namaPetani} • ${selectedLandDetail.projectNama}`,
                              '#1e40af'
                            );
                            handleUpdateLandDoc({ perjanjianImage: sample });
                          }}
                          className="w-full py-1 text-[10px] font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition"
                        >
                          + Pasang Sampel Akta PPJB
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700">Riwayat Pembayaran ke Petani:</h4>
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Uang Muka (DP Awal Pembebasan Lahan)</span>
                    <span className="font-mono text-emerald-700">
                      Rp {selectedLandDetail.dpDibayar.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">Saat penandatanganan PPJB di hadapan Notaris</span>
                </div>

                {landPayments.filter(p => p.landDebtId === selectedLandDetail.id).map(pay => (
                  <div key={pay.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">{pay.keterangan}</span>
                      <span className="font-mono font-bold text-emerald-700">
                        Rp {pay.nominal.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Tanggal: {pay.tanggal}</span>
                      <span>Metode: {pay.metode}</span>
                    </div>

                    {/* Baris Bukti Slip Pembayaran ke Petani */}
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                        <Receipt className="w-3.5 h-3.5 text-amber-600" />
                        <span>Bukti Slip / Nota Pembayaran:</span>
                      </span>

                      {pay.kwitansiImage ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPreviewImage({ title: `Bukti Transfer Lahan: ${pay.keterangan} - Rp ${pay.nominal.toLocaleString('id-ID')}`, src: pay.kwitansiImage! })}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-bold text-[10px] transition"
                          >
                            <Eye className="w-3 h-3 text-amber-700" />
                            <span>Lihat Slip Transfer</span>
                          </button>
                          <label className="text-[10px] text-slate-500 hover:text-slate-800 cursor-pointer font-semibold underline">
                            <span>Ganti</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleLandReceiptUpload(e, pay.id)}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => updateLandPaymentReceipt(pay.id, null)}
                            className="text-[10px] text-rose-600 hover:text-rose-700 font-semibold"
                          >
                            Hapus
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-400 italic">Belum ada slip</span>
                          <label className="text-[10px] px-2 py-0.5 bg-white border border-slate-300 hover:border-amber-400 text-slate-700 rounded font-semibold cursor-pointer transition flex items-center gap-1 shadow-2xs">
                            <UploadCloud className="w-3 h-3 text-slate-500" />
                            <span>Upload Slip</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleLandReceiptUpload(e, pay.id)}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const sample = generateSampleDoc(
                                'BUKTI TRANSFER BANK - CICILAN LAHAN',
                                `Nominal: Rp ${pay.nominal.toLocaleString('id-ID')} • ${pay.keterangan}`,
                                '#9a3412'
                              );
                              updateLandPaymentReceipt(pay.id, sample);
                            }}
                            className="text-[10px] px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded font-semibold transition"
                          >
                            + Sampel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              {canFullAccess && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const land = selectedLandDetail;
                      setSelectedLandDetail(null);
                      handleOpenEditLand(land);
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit Data Lahan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const land = selectedLandDetail;
                      setSelectedLandDetail(null);
                      setDeleteLandTarget(land);
                    }}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Lahan</span>
                  </button>
                </div>
              )}
              <button
                onClick={() => setSelectedLandDetail(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl ml-auto cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Beli Lahan Petani Baru */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              + Catat Pembelian Lahan Mentah ke Petani
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Induk Lahan Proyek *</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-white"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.nama}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Petani / Penjual *</label>
                  <input
                    type="text"
                    required
                    value={namaPetani}
                    onChange={(e) => setNamaPetani(e.target.value)}
                    placeholder="Contoh: Bpk. H. Sugeng"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">No. WhatsApp</label>
                  <input
                    type="text"
                    value={telepon}
                    onChange={(e) => setTelepon(e.target.value)}
                    placeholder="081234xxxx"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Luas Tanah *</label>
                  <input
                    type="text"
                    required
                    value={luasTanah}
                    onChange={(e) => setLuasTanah(e.target.value)}
                    placeholder="6.000 m² (428 Ru)"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Alas Hak / Surat Tanah *</label>
                  <input
                    type="text"
                    required
                    value={alasHak}
                    onChange={(e) => setAlasHak(e.target.value)}
                    placeholder="Letter C No. 45 / SHM No. 12"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Harga Kesepakatan (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={hargaKesepakatan}
                    onChange={(e) => setHargaKesepakatan(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">DP Awal Dibayar (Rp)</label>
                  <input
                    type="number"
                    required
                    value={dpDibayar}
                    onChange={(e) => setDpDibayar(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-rose-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Lokasi Lahan</label>
                <input
                  type="text"
                  value={alamatLahan}
                  onChange={(e) => setAlamatLahan(e.target.value)}
                  placeholder="Sebelah barat pasar desa..."
                  className="w-full border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan Perjanjian Notaris</label>
                <input
                  type="text"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="No. Akta Notaris, skema tempo 6 bulan..."
                  className="w-full border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              {/* UPLOAD BERKAS DOKUMEN LEGALITAS LAHAN */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  <span>Upload Berkas Legalitas Lahan Induk (Opsional)</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Sertifikat Induk */}
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 text-[11px]">Sertifikat / Alas Hak</span>
                      {sertifikatImage && (
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                          Terunggah
                        </span>
                      )}
                    </div>
                    {sertifikatImage ? (
                      <div className="space-y-1">
                        <div className="relative h-20 w-full rounded-lg overflow-hidden border border-emerald-300 bg-slate-100 group">
                          <img src={sertifikatImage} alt="Sertifikat" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => setPreviewImage({ title: 'Preview Sertifikat Induk', src: sertifikatImage })}
                              className="px-2 py-0.5 bg-white text-slate-900 rounded font-bold text-[10px]"
                            >
                              Lihat
                            </button>
                            <button
                              type="button"
                              onClick={() => setSertifikatImage(null)}
                              className="px-2 py-0.5 bg-rose-600 text-white rounded font-bold text-[10px]"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-2.5 flex flex-col items-center justify-center gap-0.5 text-center cursor-pointer transition bg-slate-50/50 hover:bg-emerald-50/30">
                          <UploadCloud className="w-4 h-4 text-slate-400" />
                          <span className="font-semibold text-slate-700 text-[10px]">Upload Sertifikat</span>
                          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setSertifikatImage)} className="hidden" />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const sample = generateSampleDoc('SERTIFIKAT INDUK LAHAN', `${alasHak || 'SHM / Letter C'} • ${luasTanah || 'Tanah Mentah'}`, '#065f46');
                            setSertifikatImage(sample);
                          }}
                          className="w-full py-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
                        >
                          + Sampel SHM
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Akta Notaris PPJB */}
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 text-[11px]">Akta Notaris / PPJB</span>
                      {perjanjianImage && (
                        <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full font-bold">
                          Terunggah
                        </span>
                      )}
                    </div>
                    {perjanjianImage ? (
                      <div className="space-y-1">
                        <div className="relative h-20 w-full rounded-lg overflow-hidden border border-blue-300 bg-slate-100 group">
                          <img src={perjanjianImage} alt="Akta PPJB" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => setPreviewImage({ title: 'Preview Akta PPJB', src: perjanjianImage })}
                              className="px-2 py-0.5 bg-white text-slate-900 rounded font-bold text-[10px]"
                            >
                              Lihat
                            </button>
                            <button
                              type="button"
                              onClick={() => setPerjanjianImage(null)}
                              className="px-2 py-0.5 bg-rose-600 text-white rounded font-bold text-[10px]"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-2.5 flex flex-col items-center justify-center gap-0.5 text-center cursor-pointer transition bg-slate-50/50 hover:bg-blue-50/30">
                          <UploadCloud className="w-4 h-4 text-slate-400" />
                          <span className="font-semibold text-slate-700 text-[10px]">Upload Akta PPJB</span>
                          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setPerjanjianImage)} className="hidden" />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const sample = generateSampleDoc('AKTA NOTARIS & PPJB LAHAN', `Perjanjian Pembebasan Lahan • ${namaPetani || 'Pemilik'}`, '#1e40af');
                            setPerjanjianImage(sample);
                          }}
                          className="w-full py-1 text-[10px] font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition"
                        >
                          + Sampel PPJB
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Simpan Lahan & Catat DP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4">
          <div className="w-full flex justify-between items-center text-white max-w-4xl pb-2 border-b border-white/20">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-sm">{previewImage.title}</span>
            </div>
            <button
              onClick={() => setPreviewImage(null)}
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition cursor-pointer"
            >
              ✕ Tutup [ESC]
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-4 max-w-4xl max-h-[82vh] overflow-hidden">
            <img
              src={previewImage.src}
              alt="Preview Berkas"
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/10"
            />
          </div>

          <div className="text-white/60 text-xs text-center pb-2">
            Klik Tutup untuk kembali ke aplikasi
          </div>
        </div>
      )}

      {/* Modal Edit Lahan Petani */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Edit Catatan Lahan Petani
                  </h3>
                  <p className="text-xs text-slate-500">Perbaiki rincian tanah mentah, harga kesepakatan, dan dokumen</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditLandSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Induk Lahan Proyek *</label>
                <select
                  value={editProjectId}
                  onChange={(e) => setEditProjectId(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.nama} ({p.lokasi})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Petani / Pemilik *</label>
                  <input
                    type="text"
                    value={editNamaPetani}
                    onChange={(e) => setEditNamaPetani(e.target.value)}
                    placeholder="Contoh: Bpk. Suwardi"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nomor Telepon / WhatsApp</label>
                  <input
                    type="text"
                    value={editTelepon}
                    onChange={(e) => setEditTelepon(e.target.value)}
                    placeholder="081234567890"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Luas Tanah Mentah *</label>
                  <input
                    type="text"
                    value={editLuasTanah}
                    onChange={(e) => setEditLuasTanah(e.target.value)}
                    placeholder="Contoh: 5.620 m²"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Alas Hak Tanah *</label>
                  <input
                    type="text"
                    value={editAlasHak}
                    onChange={(e) => setEditAlasHak(e.target.value)}
                    placeholder="SHM No. 42 / Letter C"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Harga Kesepakatan (Rp) *</label>
                  <input
                    type="number"
                    min="0"
                    step="1000000"
                    value={editHargaKesepakatan}
                    onChange={(e) => setEditHargaKesepakatan(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Rp {Number(editHargaKesepakatan).toLocaleString('id-ID')}
                  </span>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">DP Awal Dibayar (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    step="1000000"
                    value={editDpDibayar}
                    onChange={(e) => setEditDpDibayar(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-[10px] text-emerald-600 mt-0.5 block">
                    Rp {Number(editDpDibayar).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Alamat / Lokasi Lahan</label>
                <input
                  type="text"
                  value={editAlamatLahan}
                  onChange={(e) => setEditAlamatLahan(e.target.value)}
                  placeholder="Contoh: Jl. Punden Gg 3, RT 42 RW 03, Jatikerto"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan Notaris / PPJB</label>
                <textarea
                  rows={2}
                  value={editKeterangan}
                  onChange={(e) => setEditKeterangan(e.target.value)}
                  placeholder="Keterangan tambahan perjanjian jual beli..."
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Upload & Update Berkas Dokumen Lahan */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <span className="font-bold text-slate-800 block text-[11px]">
                  Berkas Legalitas Lahan (SHM & Akta PPJB):
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Sertifikat Induk */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-700 text-[11px]">Sertifikat Induk / Alas Hak</span>
                      {editSertifikatImage && (
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                          Terpasang
                        </span>
                      )}
                    </div>
                    {editSertifikatImage ? (
                      <div className="space-y-1.5">
                        <div className="relative h-20 w-full rounded-lg overflow-hidden border border-emerald-300 bg-white group">
                          <img src={editSertifikatImage} alt="Sertifikat Induk" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setPreviewImage({ title: `Sertifikat: ${editNamaPetani}`, src: editSertifikatImage })}
                              className="px-2 py-1 bg-white text-slate-900 rounded font-bold text-[10px]"
                            >
                              Lihat
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditSertifikatImage(null)}
                              className="px-2 py-1 bg-rose-600 text-white rounded font-bold text-[10px]"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <label className="text-emerald-700 hover:underline font-bold cursor-pointer">
                            <span>Ganti File</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, setEditSertifikatImage)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-lg p-2.5 flex flex-col items-center justify-center gap-1 text-center cursor-pointer bg-white">
                          <UploadCloud className="w-4 h-4 text-slate-400" />
                          <span className="font-semibold text-slate-600 text-[10px]">Upload Foto Sertifikat</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, setEditSertifikatImage)}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const sample = generateSampleDoc(
                              'SERTIFIKAT INDUK LAHAN',
                              `${editAlasHak || 'SHM'} • ${editLuasTanah || 'Tanah'} • ${editNamaPetani || 'Petani'}`,
                              '#065f46'
                            );
                            setEditSertifikatImage(sample);
                          }}
                          className="w-full py-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
                        >
                          + Sampel SHM
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Akta PPJB */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-700 text-[11px]">Akta Notaris PPJB</span>
                      {editPerjanjianImage && (
                        <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full font-bold">
                          Terpasang
                        </span>
                      )}
                    </div>
                    {editPerjanjianImage ? (
                      <div className="space-y-1.5">
                        <div className="relative h-20 w-full rounded-lg overflow-hidden border border-blue-300 bg-white group">
                          <img src={editPerjanjianImage} alt="Akta PPJB" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setPreviewImage({ title: `Akta PPJB: ${editNamaPetani}`, src: editPerjanjianImage })}
                              className="px-2 py-1 bg-white text-slate-900 rounded font-bold text-[10px]"
                            >
                              Lihat
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditPerjanjianImage(null)}
                              className="px-2 py-1 bg-rose-600 text-white rounded font-bold text-[10px]"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <label className="text-blue-700 hover:underline font-bold cursor-pointer">
                            <span>Ganti File</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, setEditPerjanjianImage)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-lg p-2.5 flex flex-col items-center justify-center gap-1 text-center cursor-pointer bg-white">
                          <UploadCloud className="w-4 h-4 text-slate-400" />
                          <span className="font-semibold text-slate-600 text-[10px]">Upload Foto Akta PPJB</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, setEditPerjanjianImage)}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const sample = generateSampleDoc(
                              'AKTA NOTARIS & PPJB LAHAN',
                              `PPJB Pembebasan • ${editNamaPetani || 'Petani'}`,
                              '#1e40af'
                            );
                            setEditPerjanjianImage(sample);
                          }}
                          className="w-full py-1 text-[10px] font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition"
                        >
                          + Sampel PPJB
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs transition active:scale-95 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Perubahan Lahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Lahan Petani */}
      {deleteLandTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Hapus Catatan Lahan Petani?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tindakan ini akan menghapus data pembelian lahan mentah ini secara permanen.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Petani / Penjual:</span>
                <span className="font-bold text-slate-900">{deleteLandTarget.namaPetani}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Proyek Kawasan:</span>
                <span className="font-semibold text-slate-800">{deleteLandTarget.projectNama}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Luas & Alas Hak:</span>
                <span className="font-semibold text-slate-700">{deleteLandTarget.luasTanah} ({deleteLandTarget.alasHak})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nilai Kesepakatan:</span>
                <span className="font-bold text-slate-900 font-mono">Rp {deleteLandTarget.hargaKesepakatan.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sudah Terbayar:</span>
                <span className="font-bold text-emerald-600 font-mono">Rp {(deleteLandTarget.dpDibayar + deleteLandTarget.totalCicilan).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sisa Hutang:</span>
                <span className="font-bold text-rose-600 font-mono">Rp {deleteLandTarget.sisaHutang.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900 space-y-1">
              <span className="font-bold flex items-center gap-1 text-rose-800">
                <AlertCircle className="w-4 h-4" /> Perhatian:
              </span>
              <p className="text-[11px] text-rose-700">
                Menghapus catatan ini juga akan membersihkan riwayat slip pembayaran cicilan terkait lahan ini dari database.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteLandTarget(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteLand}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Data Lahan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
