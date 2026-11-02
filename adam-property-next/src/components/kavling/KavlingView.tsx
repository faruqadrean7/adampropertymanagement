'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useProperty } from '@/context/PropertyContext';
import ExportButtons from '@/components/common/ExportButtons';
import { 
  Building2, 
  Plus, 
  Zap, 
  Search, 
  DoorOpen, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Tag, 
  Maximize2,
  X,
  MapPin,
  Tractor,
  Coins,
  FileCheck2,
  FileText,
  UploadCloud,
  Eye,
  Trash2,
  Receipt,
  FileCheck,
  ShieldCheck,
  AlertCircle,
  Pencil,
  AlertTriangle,
  FileSpreadsheet,
  CloudUpload,
  UserCheck,
  User,
  Users,
  Link2,
  Check
} from 'lucide-react';
import { Project, Kavling } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function KavlingView() {
  const { user, isReadOnly, canFullAccess, canManagePayments } = useAuth();
  const { 
    projects, 
    selectedProjectId, 
    setSelectedProjectId, 
    kavlings, 
    addProject,
    updateProject,
    deleteProject,
    addKavling, 
    addMultipleKavlings,
    updateKavling,
    deleteKavling,
    addBatchKavling,
    updateKavlingStatus,
    syncAllToSupabase,
    refreshCloudData,
    customers,
    payments,
    assignCustomerToKavling,
    assignCustomerToMultipleKavlings,
    unlinkCustomerFromSpecificKavling,
    unlinkCustomerFromKavling
  } = useProperty();

  const [statusFilter, setStatusFilter] = useState<'all' | 'terbuka' | 'booking' | 'terjual'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  
  // Modals state
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [selectedKavling, setSelectedKavling] = useState<Kavling | null>(null);

  // Modal Hubungkan Customer ke Kavling (Dukungan Multi-Kavling)
  const [assignKavlingTarget, setAssignKavlingTarget] = useState<Kavling | null>(null);
  const [assignCustId, setAssignCustId] = useState<string>('');
  const [assignPrice, setAssignPrice] = useState<number>(0);
  const [assignMode, setAssignMode] = useState<'add' | 'replace'>('add');
  const [assignCustSearch, setAssignCustSearch] = useState('');

  // Edit & Delete states for Kavling
  const [showEditKavlingModal, setShowEditKavlingModal] = useState(false);
  const [editKavId, setEditKavId] = useState('');
  const [editProjectId, setEditProjectId] = useState('');
  const [editBlok, setEditBlok] = useState('');
  const [editNomor, setEditNomor] = useState('');
  const [editLuas, setEditLuas] = useState(84);
  const [editDimensi, setEditDimensi] = useState('');
  const [editHarga, setEditHarga] = useState(120000000);
  const [editTipe, setEditTipe] = useState('Hunian Standar');
  const [editStatus, setEditStatus] = useState<'terbuka' | 'booking' | 'terjual'>('terbuka');
  const [editKeterangan, setEditKeterangan] = useState('');
  const [deleteKavlingTarget, setDeleteKavlingTarget] = useState<Kavling | null>(null);

  // Edit & Delete states for Project (Lahan Induk)
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [editProjId, setEditProjId] = useState('');
  const [editProjNama, setEditProjNama] = useState('');
  const [editProjLokasi, setEditProjLokasi] = useState('');
  const [editProjDeskripsi, setEditProjDeskripsi] = useState('');
  const [deleteProjectTarget, setDeleteProjectTarget] = useState<Project | null>(null);

  // Form states for Add Induk Kavling / Project & Finansial Lahan Mentah
  const [projNama, setProjNama] = useState('');
  const [projLokasi, setProjLokasi] = useState('');
  const [projDeskripsi, setProjDeskripsi] = useState('');
  const [projHasLandDebt, setProjHasLandDebt] = useState(true);
  const [projNamaPetani, setProjNamaPetani] = useState('');
  const [projTeleponPetani, setProjTeleponPetani] = useState('');
  const [projLuasTanah, setProjLuasTanah] = useState('');
  const [projAlasHak, setProjAlasHak] = useState('');
  const [projHargaKesepakatan, setProjHargaKesepakatan] = useState<number>(500000000);
  const [projDpDibayar, setProjDpDibayar] = useState<number>(150000000);
  const [projMetodeBayarDp, setProjMetodeBayarDp] = useState('Transfer Bank Mandiri');
  const [projCatatanHutang, setProjCatatanHutang] = useState('');
  const [projSertifikatImage, setProjSertifikatImage] = useState<string | null>(null);
  const [projPerjanjianImage, setProjPerjanjianImage] = useState<string | null>(null);

  // Lightbox preview for document viewing
  const [previewDocImage, setPreviewDocImage] = useState<{ title: string; src: string } | null>(null);

  // Form states for Add Single Kavling
  const [formProjectId, setFormProjectId] = useState('');
  const [formBlok, setFormBlok] = useState('Blok A');
  const [formNomor, setFormNomor] = useState('A-04');
  const [formLuas, setFormLuas] = useState(84);
  const [formDimensi, setFormDimensi] = useState('6 x 14 meter');
  const [formHarga, setFormHarga] = useState(120000000);
  const [formTipe, setFormTipe] = useState('Hunian Standar');
  const [formKeterangan, setFormKeterangan] = useState('Siap bangun, hadap timur');

  // Form states for Batch Kavling
  const [batchProjectId, setBatchProjectId] = useState('');
  const [batchBlok, setBatchBlok] = useState('Blok B');
  const [batchPrefix, setBatchPrefix] = useState('B');
  const [batchStart, setBatchStart] = useState(1);
  const [batchCount, setBatchCount] = useState(5);
  const [batchLuas, setBatchLuas] = useState(84);
  const [batchDimensi, setBatchDimensi] = useState('6 x 14 meter');
  const [batchHarga, setBatchHarga] = useState(120000000);

  // Helper untuk membaca file upload gambar
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

  const generateSampleDoc = (title: string, subtitle: string, bg: string) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380">
      <rect width="600" height="380" fill="${bg}" rx="12"/>
      <rect x="20" y="20" width="560" height="340" fill="none" stroke="white" stroke-width="2" stroke-dasharray="6,6" opacity="0.4"/>
      <circle cx="300" cy="140" r="45" fill="white" opacity="0.2"/>
      <text x="300" y="215" font-family="Arial" font-size="22" font-weight="bold" fill="white" text-anchor="middle">${title}</text>
      <text x="300" y="245" font-family="Arial" font-size="14" fill="white" opacity="0.8" text-anchor="middle">${subtitle}</text>
      <text x="300" y="280" font-family="Arial" font-size="12" fill="white" opacity="0.6" text-anchor="middle">PT ADAM PROPERTY INDONESIA - LEGALITAS LAHAN</text>
    </svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  };

  // Filtered Kavling list
  const activeProject = projects.find(p => p.id === selectedProjectId);
  const filteredKavlings = kavlings.filter(k => {
    const matchProject = selectedProjectId === 'all' || k.projectId === selectedProjectId;
    const matchStatus = statusFilter === 'all' || k.status === statusFilter;
    const matchSearch = searchQuery === '' || 
      `${k.blok} ${k.nomor} ${k.customerNama || ''} ${k.tipe}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchProject && matchStatus && matchSearch;
  });

  const totalLots = kavlings.filter(k => selectedProjectId === 'all' || k.projectId === selectedProjectId).length;
  const openLots = kavlings.filter(k => (selectedProjectId === 'all' || k.projectId === selectedProjectId) && k.status === 'terbuka').length;
  const bookingLots = kavlings.filter(k => (selectedProjectId === 'all' || k.projectId === selectedProjectId) && k.status === 'booking').length;
  const soldLots = kavlings.filter(k => (selectedProjectId === 'all' || k.projectId === selectedProjectId) && k.status === 'terjual').length;

  const getExportData = () => ({
    filename: `Laporan-Siteplan-Kavling-${new Date().toISOString().split('T')[0]}`,
    title: 'Laporan Master Kavling & Status Penjualan Unit',
    subtitle: activeProject?.nama || 'Semua Cluster Lahan',
    category: 'DATA MASTER KAVLING',
    headers: ['Nomor Unit', 'Blok', 'Tipe', 'Luas (m²)', 'Dimensi', 'Harga (Rp)', 'Status Unit', 'Nama Konsumen / Pembeli', 'Keterangan'],
    rows: filteredKavlings.map(k => [
      k.nomor,
      k.blok,
      k.tipe,
      k.luas,
      k.dimensi,
      `Rp ${k.harga.toLocaleString('id-ID')}`,
      k.status.toUpperCase(),
      k.customerNama || '-',
      k.keterangan || '-'
    ]),
    summary: [
      { label: 'Total Kavling', value: `${totalLots} Unit` },
      { label: 'Unit Terjual / Lunas', value: `${soldLots} Unit` },
      { label: 'Unit Booking', value: `${bookingLots} Unit` },
      { label: 'Unit Siap Jual', value: `${openLots} Unit` }
    ]
  });

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projNama.trim() || !projLokasi.trim()) {
      alert('Nama kawasan dan lokasi proyek wajib diisi!');
      return;
    }
    if (projHasLandDebt && (!projNamaPetani.trim() || !projLuasTanah.trim() || !projAlasHak.trim())) {
      alert('Nama pemilik lahan, luas tanah mentah, dan alas hak wajib diisi!');
      return;
    }

    const newProj = addProject({
      nama: projNama.trim(),
      lokasi: projLokasi.trim(),
      deskripsi: projDeskripsi.trim() || undefined,
      hasLandDebt: projHasLandDebt,
      namaPetani: projNamaPetani.trim() || undefined,
      teleponPetani: projTeleponPetani.trim() || undefined,
      luasTanah: projLuasTanah.trim() || undefined,
      alasHak: projAlasHak.trim() || undefined,
      hargaKesepakatan: projHasLandDebt ? Number(projHargaKesepakatan) : 0,
      dpDibayar: projHasLandDebt ? Number(projDpDibayar) : 0,
      metodeBayarDp: projMetodeBayarDp,
      catatanHutang: projCatatanHutang.trim() || undefined,
      sertifikatImage: projSertifikatImage,
      perjanjianImage: projPerjanjianImage
    });

    setSelectedProjectId(newProj.id);
    setShowProjectModal(false);

    // Reset Form
    setProjNama('');
    setProjLokasi('');
    setProjDeskripsi('');
    setProjNamaPetani('');
    setProjTeleponPetani('');
    setProjLuasTanah('');
    setProjAlasHak('');
    setProjHargaKesepakatan(500000000);
    setProjDpDibayar(150000000);
    setProjCatatanHutang('');
    setProjSertifikatImage(null);
    setProjPerjanjianImage(null);
  };

  const handleOpenAddModal = () => {
    setFormProjectId(selectedProjectId !== 'all' ? selectedProjectId : (projects[0]?.id || ''));
    setShowAddModal(true);
  };

  const handleOpenBatchModal = () => {
    setBatchProjectId(selectedProjectId !== 'all' ? selectedProjectId : (projects[0]?.id || ''));
    setShowBatchModal(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const projId = formProjectId || (selectedProjectId === 'all' ? (projects[0]?.id || 'proj-1') : selectedProjectId);
    addKavling({
      projectId: projId,
      blok: formBlok,
      nomor: formNomor,
      luas: Number(formLuas),
      dimensi: formDimensi,
      harga: Number(formHarga),
      tipe: formTipe,
      status: 'terbuka',
      customerId: null,
      customerNama: null,
      keterangan: formKeterangan
    });
    setShowAddModal(false);
  };

  const handleBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const projId = batchProjectId || (selectedProjectId === 'all' ? (projects[0]?.id || 'proj-1') : selectedProjectId);
    addBatchKavling(
      batchBlok,
      batchPrefix,
      Number(batchStart),
      Number(batchCount),
      Number(batchLuas),
      batchDimensi,
      Number(batchHarga),
      'Hunian Standar',
      projId
    );
    setShowBatchModal(false);
  };

  // Handlers for Edit & Delete Kavling
  const handleOpenEditKavling = (kav: Kavling) => {
    setEditKavId(kav.id);
    setEditProjectId(kav.projectId);
    setEditBlok(kav.blok);
    setEditNomor(kav.nomor);
    setEditLuas(kav.luas);
    setEditDimensi(kav.dimensi);
    setEditHarga(kav.harga);
    setEditTipe(kav.tipe);
    setEditStatus(kav.status);
    setEditKeterangan(kav.keterangan || '');
    setShowEditKavlingModal(true);
  };

  const handleEditKavlingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editKavId) return;
    updateKavling(editKavId, {
      projectId: editProjectId,
      blok: editBlok.trim(),
      nomor: editNomor.trim(),
      luas: Number(editLuas),
      dimensi: editDimensi.trim(),
      harga: Number(editHarga),
      tipe: editTipe,
      status: editStatus,
      keterangan: editKeterangan.trim() || undefined
    });
    if (selectedKavling && selectedKavling.id === editKavId) {
      setSelectedKavling({
        ...selectedKavling,
        projectId: editProjectId,
        blok: editBlok.trim(),
        nomor: editNomor.trim(),
        luas: Number(editLuas),
        dimensi: editDimensi.trim(),
        harga: Number(editHarga),
        tipe: editTipe,
        status: editStatus,
        keterangan: editKeterangan.trim() || undefined
      });
    }
    setShowEditKavlingModal(false);
  };

  const handleConfirmDeleteKavling = () => {
    if (!deleteKavlingTarget) return;
    deleteKavling(deleteKavlingTarget.id);
    if (selectedKavling && selectedKavling.id === deleteKavlingTarget.id) {
      setSelectedKavling(null);
    }
    setDeleteKavlingTarget(null);
  };

  // Handlers for Edit & Delete Project (Lahan Induk)
  const handleOpenEditProject = (proj: Project) => {
    setEditProjId(proj.id);
    setEditProjNama(proj.nama);
    setEditProjLokasi(proj.lokasi);
    setEditProjDeskripsi(proj.deskripsi || '');
    setShowEditProjectModal(true);
  };

  const handleEditProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProjId || !editProjNama.trim()) return;
    updateProject(editProjId, {
      nama: editProjNama.trim(),
      lokasi: editProjLokasi.trim(),
      deskripsi: editProjDeskripsi.trim() || undefined
    });
    setShowEditProjectModal(false);
  };

  const handleConfirmDeleteProject = () => {
    if (!deleteProjectTarget) return;
    deleteProject(deleteProjectTarget.id);
    setDeleteProjectTarget(null);
  };

  // Handler for Excel Import
  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const rows: any[] = XLSX.utils.sheet_to_json(ws, { defval: '' });

        if (!rows || rows.length === 0) {
          alert('File Excel kosong atau tidak memiliki baris data!');
          return;
        }

        const projId = selectedProjectId !== 'all' ? selectedProjectId : (projects[0]?.id || 'proj-bm1');
        const importedLots: Kavling[] = [];

        rows.forEach((r, idx) => {
          const nomor = String(r.nomor || r.kode_kavling || r.kode || r.unit || r['Kode Kavling'] || r['Nomor Unit'] || `KAV-${idx + 1}`).trim();
          const blok = String(r.blok || r.Blok || r['Nama Blok'] || 'Blok A').trim();
          const luas = Number(r.luas || r['Luas (m²)'] || r['Luas'] || 84);
          const dimensi = String(r.dimensi || r.ukuran || r['Dimensi'] || r['Ukuran'] || '6 x 14 meter').trim();
          const harga = Number(r.harga || r.harga_jual || r['Harga Jual'] || r['Harga'] || 120000000);
          const tipe = String(r.tipe || r['Tipe'] || 'Hunian Standar').trim();
          const rawStatus = String(r.status || r['Status'] || 'terbuka').toLowerCase().trim();
          const status: 'terbuka' | 'booking' | 'terjual' = 
            rawStatus === 'booking' ? 'booking' : (rawStatus === 'terjual' || rawStatus === 'lunas' ? 'terjual' : 'terbuka');
          const keterangan = String(r.keterangan || r['Keterangan'] || r['Catatan'] || '').trim();

          importedLots.push({
            id: `kav-imp-${Date.now()}-${idx}`,
            projectId: projId,
            blok,
            nomor,
            luas: isNaN(luas) ? 84 : luas,
            dimensi,
            harga: isNaN(harga) ? 120000000 : harga,
            tipe,
            status,
            customerId: null,
            customerNama: null,
            keterangan: keterangan || undefined
          });
        });

        addMultipleKavlings(importedLots);
        alert(`Berhasil mengimpor ${importedLots.length} data kavling dari Excel! Data telah tersimpan secara permanen.`);
      } catch (err: any) {
        alert('Gagal membaca file Excel: ' + (err?.message || 'Format tidak didukung'));
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  const handleCloudSync = async () => {
    setIsSyncingCloud(true);
    const res = await syncAllToSupabase();
    await refreshCloudData();
    setIsSyncingCloud(false);
    alert(res.message);
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full min-w-0">
      {/* Management Read-Only Banner */}
      {isReadOnly && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-3.5 text-xs text-amber-900 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <b>Mode Management (Read-Only):</b> Anda memiliki akses memantau seluruh site plan, harga, dan pembeli. Penambahan master kavling dan perubahan status dikunci.
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 border border-amber-300 rounded-md shrink-0">
            Hanya Lihat
          </span>
        </div>
      )}

      {/* Top Bar Controls */}
      <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 shrink-0">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Induk:
            </span>
            <select
              value={selectedProjectId}
              onChange={(e) => {
                if (e.target.value === '__NEW_PROJECT__') {
                  if (canFullAccess) {
                    setShowProjectModal(true);
                  } else {
                    alert('Hanya IT Manager yang berwenang menambah induk proyek baru!');
                  }
                } else {
                  setSelectedProjectId(e.target.value);
                }
              }}
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 border-2 border-emerald-600/30 rounded-xl text-xs sm:text-sm font-bold text-slate-800 bg-emerald-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer max-w-[200px] sm:max-w-none truncate"
            >
              <option value="all">Semua Lahan Proyek</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.nama}</option>
              ))}
              {canFullAccess && (
                <option value="__NEW_PROJECT__" className="text-emerald-700 font-bold bg-emerald-50">
                  + Tambah Induk Proyek Baru...
                </option>
              )}
            </select>

            {/* Quick Edit & Delete Induk Proyek / Lahan */}
            {selectedProjectId !== 'all' && activeProject && canFullAccess && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleOpenEditProject(activeProject)}
                  title="Edit Data Lahan / Induk Proyek Ini"
                  className="px-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Edit Lahan</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteProjectTarget(activeProject)}
                  title="Hapus Lahan / Induk Proyek Ini"
                  className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Hapus</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons depending on Role */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap w-full lg:w-auto justify-between lg:justify-end">
          {isReadOnly ? (
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 text-xs font-semibold flex items-center gap-1.5 border border-slate-200">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>Akses Monitoring Unit</span>
            </div>
          ) : (
            <>
              {canFullAccess && (
                <>
                  <button
                    onClick={() => setShowProjectModal(true)}
                    className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg sm:rounded-xl transition flex items-center gap-1 active:scale-95 shadow-2xs cursor-pointer shrink-0"
                  >
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">+ Induk Proyek Baru</span>
                    <span className="sm:hidden">+ Induk</span>
                  </button>
                  <button
                    onClick={handleOpenBatchModal}
                    className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg sm:rounded-xl transition flex items-center gap-1 active:scale-95 cursor-pointer shrink-0"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span className="hidden sm:inline">+ Buat Blok Sekaligus</span>
                    <span className="sm:hidden">+ Batch Blok</span>
                  </button>
                  <label
                    title="Upload file data kavling Excel (.xlsx, .xls, .csv)"
                    className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg sm:rounded-xl transition flex items-center gap-1 active:scale-95 shadow-2xs cursor-pointer shrink-0"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">Upload Excel Kavling</span>
                    <span className="sm:hidden">Excel</span>
                    <input
                      type="file"
                      accept=".xlsx, .xls, .csv"
                      onChange={handleImportExcel}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleCloudSync}
                    disabled={isSyncingCloud}
                    title="Upload dan sinkronkan semua kavling ke Cloud Database Supabase agar langsung muncul di semua perangkat"
                    className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded-lg sm:rounded-xl transition flex items-center gap-1 active:scale-95 shadow-2xs cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    <CloudUpload className={`w-3.5 h-3.5 text-blue-600 ${isSyncingCloud ? 'animate-bounce' : ''}`} />
                    <span className="hidden sm:inline">{isSyncingCloud ? 'Menyinkronkan...' : 'Sync Cloud (Semua HP/PC)'}</span>
                    <span className="sm:hidden">Sync</span>
                  </button>
                  <button
                    onClick={handleOpenAddModal}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] rounded-lg sm:rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">+ Tambah Kavling Baru</span>
                    <span className="sm:hidden">+ Kavling</span>
                  </button>
                </>
              )}
              {user?.role === 'admin' && (
                <div className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-800 text-[11px] font-semibold flex items-center gap-1 border border-blue-200">
                  <Receipt className="w-3 h-3 text-blue-600" />
                  <span>Admin Pembayaran</span>
                </div>
              )}
            </>
          )}
          <ExportButtons getData={getExportData} />
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-base sm:text-lg shrink-0">
            <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">Total Kavling</p>
            <h3 className="text-base sm:text-xl font-bold text-slate-800 font-mono truncate">{totalLots}</h3>
            <p className="text-[9px] sm:text-[11px] text-slate-400 truncate">{activeProject?.nama || 'Semua Lahan'}</p>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-emerald-200 shadow-xs flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-base sm:text-lg shrink-0">
            <DoorOpen className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">Kavling Terbuka</p>
            <h3 className="text-base sm:text-xl font-bold text-emerald-600 font-mono truncate">{openLots}</h3>
            <p className="text-[9px] sm:text-[11px] text-emerald-600 font-medium truncate">Siap Jual</p>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-amber-200 shadow-xs flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-base sm:text-lg shrink-0">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">Kavling Booking</p>
            <h3 className="text-base sm:text-xl font-bold text-amber-600 font-mono truncate">{bookingLots}</h3>
            <p className="text-[9px] sm:text-[11px] text-amber-600 font-medium truncate">Terbayar DP</p>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-rose-200 shadow-xs flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-base sm:text-lg shrink-0">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">Kavling Terjual</p>
            <h3 className="text-base sm:text-xl font-bold text-rose-600 font-mono truncate">{soldLots}</h3>
            <p className="text-[9px] sm:text-[11px] text-rose-600 font-medium truncate">Pelunasan Sah</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nomor kavling / blok / pembeli..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition ${statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Semua ({totalLots})
          </button>
          <button
            onClick={() => setStatusFilter('terbuka')}
            className={`px-3 py-1.5 rounded-lg transition ${statusFilter === 'terbuka' ? 'bg-emerald-600 text-white shadow-xs font-bold' : 'text-emerald-700 hover:bg-emerald-100/50'}`}
          >
            Terbuka ({openLots})
          </button>
          <button
            onClick={() => setStatusFilter('booking')}
            className={`px-3 py-1.5 rounded-lg transition ${statusFilter === 'booking' ? 'bg-amber-600 text-white shadow-xs font-bold' : 'text-amber-700 hover:bg-amber-100/50'}`}
          >
            Booking ({bookingLots})
          </button>
          <button
            onClick={() => setStatusFilter('terjual')}
            className={`px-3 py-1.5 rounded-lg transition ${statusFilter === 'terjual' ? 'bg-rose-600 text-white shadow-xs font-bold' : 'text-rose-700 hover:bg-rose-100/50'}`}
          >
            Terjual ({soldLots})
          </button>
        </div>
      </div>

      {/* Kavling Interactive Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredKavlings.map((kav) => {
          const isTerbuka = kav.status === 'terbuka';
          const isBooking = kav.status === 'booking';
          const isTerjual = kav.status === 'terjual';

          return (
            <div
              key={kav.id}
              onClick={() => setSelectedKavling(kav)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5 bg-white ${
                isTerbuka
                  ? 'border-emerald-300 hover:border-emerald-500'
                  : isBooking
                  ? 'border-amber-300 hover:border-amber-500'
                  : 'border-rose-300 hover:border-rose-500'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {kav.blok}
                  </span>
                  <h4 className="text-xl font-black text-slate-900 tracking-tight font-mono">
                    {kav.nomor}
                  </h4>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isTerbuka
                        ? 'bg-emerald-100 text-emerald-800'
                        : isBooking
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {kav.status}
                  </span>
                  {canFullAccess && (
                    <div className="flex items-center gap-0.5 bg-slate-100/90 rounded-md p-0.5 shadow-2xs border border-slate-200">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditKavling(kav);
                        }}
                        title="Edit Unit Kavling Ini"
                        className="p-1 text-slate-500 hover:text-blue-600 hover:bg-white rounded transition cursor-pointer"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteKavlingTarget(kav);
                        }}
                        title="Hapus Unit Kavling Ini"
                        className="p-1 text-slate-500 hover:text-rose-600 hover:bg-white rounded transition cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-600 mb-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Luas:</span>
                  <span className="font-semibold">{kav.luas} m² ({kav.dimensi})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tipe:</span>
                  <span className="font-semibold">{kav.tipe}</span>
                </div>
                {kav.customerNama ? (
                  <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[10px]">Pembeli:</span>
                    <span className="font-bold text-slate-900 truncate max-w-[140px] flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{kav.customerNama}</span>
                    </span>
                  </div>
                ) : (
                  <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 text-[10px]">Pembeli:</span>
                    <span className="text-emerald-700 font-semibold text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Tersedia
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                <span className="text-sm font-black text-emerald-700 font-mono">
                  Rp {kav.harga.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                  <Maximize2 className="w-3 h-3" /> Detail
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredKavlings.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">Tidak Ada Kavling Ditemukan</h3>
          <p className="text-xs text-slate-500 mb-4">Coba sesuaikan kata kunci pencarian atau buat kavling baru.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
          >
            + Tambah Kavling Baru
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL DETAIL KAVLING & STATUS PEMBELI */}
      {/* ======================================================== */}
      {selectedKavling && (() => {
        const buyer = customers.find(c => 
          c.id === selectedKavling.customerId || 
          (c.kavlingId && c.kavlingId === selectedKavling.id) ||
          (selectedKavling.nomor && c.kavlingKode?.toLowerCase().includes(selectedKavling.nomor.toLowerCase())) || 
          (selectedKavling.customerNama && c.nama.toLowerCase() === selectedKavling.customerNama.toLowerCase())
        );

        const unitPayments = payments.filter(p => 
          (buyer && p.customerId === buyer.id) || 
          (p.kavlingKode && (p.kavlingKode === selectedKavling.nomor || p.kavlingKode.includes(selectedKavling.nomor)))
        );

        return (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{selectedKavling.blok}</span>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-black text-slate-900 font-mono">{selectedKavling.nomor}</h3>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      selectedKavling.status === 'terbuka'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedKavling.status === 'booking'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {selectedKavling.status}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedKavling(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Spesifikasi Teknis Kavling */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Harga Brosur</span>
                    <span className="font-bold font-mono text-emerald-700 text-xs">
                      Rp {selectedKavling.harga.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Luas Tanah</span>
                    <span className="font-bold text-slate-800 text-xs">{selectedKavling.luas} m²</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Dimensi</span>
                    <span className="font-bold text-slate-800 text-xs">{selectedKavling.dimensi}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Peruntukan</span>
                    <span className="font-bold text-slate-800 text-xs">{selectedKavling.tipe}</span>
                  </div>
                </div>
                {selectedKavling.keterangan && (
                  <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-700">Catatan:</span> {selectedKavling.keterangan}
                  </div>
                )}
              </div>

              {/* Buyer & Payment Section */}
              {buyer ? (
                <div className="space-y-3">
                  {/* Buyer Profile Card */}
                  <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200/80 space-y-2 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-blue-200/60">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-blue-600" />
                        <div>
                          <span className="text-[10px] font-bold text-blue-600 uppercase block">Data Konsumen Pembeli</span>
                          <span className="text-sm font-bold text-slate-900">{buyer.nama}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        buyer.statusBayar === 'lunas' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {buyer.statusBayar === 'lunas' ? 'Lunas' : 'Belum Lunas'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-500 block">NIK:</span>
                        <span className="font-mono font-bold text-slate-800">{buyer.nik}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">WhatsApp / Telepon:</span>
                        <a 
                          href={`https://wa.me/${buyer.telepon.replace(/\D/g, '')}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="font-mono font-bold text-emerald-700 hover:underline"
                        >
                          {buyer.telepon}
                        </a>
                      </div>
                      {buyer.alamat && (
                        <div className="col-span-2">
                          <span className="text-slate-500 block">Alamat:</span>
                          <span className="text-slate-700">{buyer.alamat}</span>
                        </div>
                      )}
                    </div>

                    {/* Financial Summary */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-blue-200/60 text-center">
                      <div className="bg-white p-2 rounded-lg border border-blue-100">
                        <span className="text-[9px] text-slate-500 block">Nilai Kontrak</span>
                        <span className="font-bold font-mono text-slate-900 text-xs">
                          Rp {buyer.totalHarga.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                        <span className="text-[9px] text-emerald-800 block">Total Masuk</span>
                        <span className="font-bold font-mono text-emerald-700 text-xs">
                          Rp {buyer.totalMasuk.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">
                        <span className="text-[9px] text-amber-800 block">Sisa Piutang</span>
                        <span className="font-bold font-mono text-amber-700 text-xs">
                          Rp {buyer.sisaPiutang.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    {/* Multi-Kavling Badge: Jika pembeli memiliki lebih dari 1 kavling */}
                    {(() => {
                      const buyerAllLots = kavlings.filter(k => k.customerId === buyer.id || (buyer.kavlingId === k.id));
                      if (buyerAllLots.length <= 1) return null;

                      return (
                        <div className="p-2.5 bg-blue-100/60 rounded-xl border border-blue-200 text-xs space-y-1.5">
                          <span className="font-bold text-blue-900 block text-[11px]">
                            📦 Konsumen ini memiliki total {buyerAllLots.length} unit kavling:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {buyerAllLots.map(lot => {
                              const isCurrent = lot.id === selectedKavling.id;
                              return (
                                <button
                                  key={lot.id}
                                  type="button"
                                  onClick={() => {
                                    if (!isCurrent) setSelectedKavling(lot);
                                  }}
                                  className={`px-2 py-1 rounded text-xs font-mono font-bold transition ${
                                    isCurrent
                                      ? 'bg-blue-600 text-white shadow-xs cursor-default'
                                      : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-300 cursor-pointer'
                                  }`}
                                >
                                  {lot.nomor} ({lot.luas} m²) {isCurrent ? '• Unit Ini' : '→ Buka'}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}

                    {!isReadOnly && (
                      <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setAssignKavlingTarget(selectedKavling);
                            setAssignCustId(buyer.id);
                            setAssignPrice(buyer.totalHarga || selectedKavling.harga);
                          }}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold inline-flex items-center gap-1 transition cursor-pointer"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>Ubah Harga / Ganti Pembeli</span>
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (confirm(`Putuskan hubungan kavling ${selectedKavling.nomor} dari ${buyer.nama}? Status kavling akan dikembalikan ke Terbuka.`)) {
                              await unlinkCustomerFromKavling(buyer.id);
                              setSelectedKavling({ ...selectedKavling, customerId: null, customerNama: null, status: 'terbuka' });
                            }
                          }}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 transition cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Putuskan Sambungan</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Payment Records for this unit */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Receipt className="w-4 h-4 text-emerald-600" />
                        <span>Rincian Pembayaran Masuk ({unitPayments.length}):</span>
                      </span>
                    </div>

                    {unitPayments.length > 0 ? (
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {unitPayments.map(p => (
                          <div key={p.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                            <div className="min-w-0 pr-2">
                              <span className="font-bold text-slate-900 block truncate">{p.tujuan}</span>
                              <span className="text-[10px] text-slate-500">
                                {p.tanggal} &bull; <span className="uppercase font-semibold">{p.metodeBayar}</span>
                                {p.keterangan ? ` &bull; ${p.keterangan}` : ''}
                              </span>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-bold font-mono text-emerald-700 block">
                                Rp {p.nominal.toLocaleString('id-ID')}
                              </span>
                              {p.kwitansiImage && (
                                <button
                                  type="button"
                                  onClick={() => setPreviewDocImage({ title: `Bukti Bayar: ${p.tujuan} (${buyer.nama})`, src: p.kwitansiImage! })}
                                  className="text-[10px] text-blue-600 hover:underline font-bold inline-flex items-center gap-0.5 mt-0.5"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>Lihat Bukti</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-400 text-[11px] italic text-center">
                        Belum ada catatan transaksi pembayaran untuk unit ini.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 text-xs space-y-2.5">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold block">Unit Siap Ditawarkan (Tersedia)</span>
                      <span className="text-[11px] text-slate-600">Unit kavling ini belum dihubungkan ke customer manapun.</span>
                    </div>
                  </div>
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => {
                        setAssignKavlingTarget(selectedKavling);
                        setAssignCustId(customers[0]?.id || '');
                        setAssignPrice(selectedKavling.harga);
                      }}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                    >
                      <Link2 className="w-4 h-4" />
                      <span>+ Hubungkan Customer Pembeli / Catat Penjualan</span>
                    </button>
                  )}
                </div>
              )}

              {/* Quick Status Change */}
              <div className="pt-2 border-t border-slate-100">
                <label className="text-[11px] font-bold text-slate-500 block mb-1.5">Ubah Status Kavling Cepat:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      updateKavlingStatus(selectedKavling.id, 'terbuka');
                      setSelectedKavling({ ...selectedKavling, status: 'terbuka' });
                    }}
                    className={`py-1.5 rounded-lg text-[11px] font-bold transition border cursor-pointer ${
                      selectedKavling.status === 'terbuka' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    Terbuka
                  </button>
                  <button
                    onClick={() => {
                      updateKavlingStatus(selectedKavling.id, 'booking');
                      setSelectedKavling({ ...selectedKavling, status: 'booking' });
                    }}
                    className={`py-1.5 rounded-lg text-[11px] font-bold transition border cursor-pointer ${
                      selectedKavling.status === 'booking' ? 'bg-amber-600 text-white border-amber-600' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    Booking
                  </button>
                  <button
                    onClick={() => {
                      updateKavlingStatus(selectedKavling.id, 'terjual');
                      setSelectedKavling({ ...selectedKavling, status: 'terjual' });
                    }}
                    className={`py-1.5 rounded-lg text-[11px] font-bold transition border cursor-pointer ${
                      selectedKavling.status === 'terjual' ? 'bg-rose-600 text-white border-rose-600' : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    Terjual
                  </button>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                {canFullAccess && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const target = selectedKavling;
                        setSelectedKavling(null);
                        handleOpenEditKavling(target);
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit Unit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const target = selectedKavling;
                        setSelectedKavling(null);
                        setDeleteKavlingTarget(target);
                      }}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setSelectedKavling(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl ml-auto cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* MODAL HUBUNGKAN KAVLING KE CUSTOMER PEMBELI */}
      {/* ======================================================== */}
      {assignKavlingTarget && (() => {
        const selectedCust = customers.find(c => c.id === assignCustId);
        const existingLots = selectedCust ? kavlings.filter(k => (k.customerId === selectedCust.id || selectedCust.kavlingId === k.id) && k.id !== assignKavlingTarget.id) : [];
        const isMultiLot = selectedCust && existingLots.length > 0;

        const totalMasuk = selectedCust ? selectedCust.totalMasuk : 0;
        const newSisa = Math.max(0, assignPrice - totalMasuk);
        const isLunas = totalMasuk >= assignPrice && assignPrice > 0;

        const filteredCustomers = customers.filter(c =>
          `${c.nama} ${c.nik} ${c.telepon}`.toLowerCase().includes(assignCustSearch.toLowerCase())
        );

        return (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                    Penjualan Unit Kavling
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 font-mono">
                    {assignKavlingTarget.blok} - {assignKavlingTarget.nomor}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Luas: {assignKavlingTarget.luas} m² ({assignKavlingTarget.dimensi}) &bull; Brosur: Rp {assignKavlingTarget.harga.toLocaleString('id-ID')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAssignKavlingTarget(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Select Customer dengan Search Rapi */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-700">
                    Pilih Konsumen / Pembeli:
                  </label>
                  <span className="text-[10px] text-slate-400">Total {customers.length} Konsumen</span>
                </div>
                
                {customers.length > 5 && (
                  <div className="relative mb-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={assignCustSearch}
                      onChange={(e) => setAssignCustSearch(e.target.value)}
                      placeholder="Cari nama / NIK konsumen..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                    />
                  </div>
                )}

                <select
                  value={assignCustId}
                  onChange={(e) => {
                    const newId = e.target.value;
                    setAssignCustId(newId);
                    const cust = customers.find(c => c.id === newId);
                    if (cust) {
                      const custExisting = kavlings.filter(k => (k.customerId === cust.id || cust.kavlingId === k.id) && k.id !== assignKavlingTarget.id);
                      if (custExisting.length > 0 && assignMode === 'add') {
                        setAssignPrice(cust.totalHarga + assignKavlingTarget.harga);
                      } else {
                        setAssignPrice(assignKavlingTarget.harga);
                      }
                    }
                  }}
                  className="w-full border-2 border-emerald-200 focus:border-emerald-500 rounded-xl px-3 py-2.5 bg-white text-slate-800 font-semibold text-xs focus:outline-none"
                >
                  <option value="">-- Pilih Customer Terdaftar --</option>
                  {filteredCustomers.map(c => {
                    const lots = kavlings.filter(k => k.customerId === c.id || c.kavlingId === k.id);
                    return (
                      <option key={c.id} value={c.id}>
                        {c.nama} (NIK: {c.nik}) &bull; {lots.length > 0 ? `Memiliki: ${lots.map(l => l.nomor).join(', ')}` : 'Belum ada unit'}
                      </option>
                    );
                  })}
                </select>
                {customers.length === 0 && (
                  <p className="text-amber-700 text-[11px]">
                    Belum ada customer terdaftar. Silakan tambahkan customer di Menu Customer terlebih dahulu.
                  </p>
                )}
              </div>

              {/* Opsi Multi-Kavling Jika Customer Sudah Memiliki Unit Lain */}
              {isMultiLot && (
                <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-xs space-y-2">
                  <div className="font-bold text-blue-900 flex items-center gap-1.5 text-[11px]">
                    <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span><b>{selectedCust?.nama}</b> sudah memiliki unit: <b>{existingLots.map(l => l.nomor).join(', ')}</b></span>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-slate-700 bg-white p-2.5 rounded-lg border border-blue-100">
                    <label className="flex items-start gap-2 cursor-pointer font-medium">
                      <input
                        type="radio"
                        name="assignMode"
                        checked={assignMode === 'add'}
                        onChange={() => {
                          setAssignMode('add');
                          setAssignPrice((selectedCust?.totalHarga || 0) + assignKavlingTarget.harga);
                        }}
                        className="mt-0.5 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="font-bold text-blue-900 block">
                          Tambahkan Sebagai Unit Tambahan (Multi-Kavling)
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {selectedCust?.nama} akan memiliki {existingLots.length + 1} unit kavling: <b>{[...existingLots.map(l => l.nomor), assignKavlingTarget.nomor].join(', ')}</b>
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-2 cursor-pointer font-medium pt-1 border-t border-slate-100">
                      <input
                        type="radio"
                        name="assignMode"
                        checked={assignMode === 'replace'}
                        onChange={() => {
                          setAssignMode('replace');
                          setAssignPrice(assignKavlingTarget.harga);
                        }}
                        className="mt-0.5 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">
                          Pindahkan Unit (Ganti ke kavling ini saja)
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Unit lama akan dilepaskan dan kembali berstatus Terbuka.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Kesepakatan Harga Kontrak */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-700">
                    Harga Kesepakatan Kontrak (Rp):
                  </label>
                  <span className="text-[10px] text-slate-400">Total nilai transaksi kontrak</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="500000"
                  value={assignPrice || ''}
                  onChange={(e) => setAssignPrice(Number(e.target.value) || 0)}
                  className="w-full border-2 border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-900 focus:outline-none"
                  placeholder="120000000"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (isMultiLot && assignMode === 'add') {
                        setAssignPrice((selectedCust?.totalHarga || 0) + assignKavlingTarget.harga);
                      } else {
                        setAssignPrice(assignKavlingTarget.harga);
                      }
                    }}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-semibold transition cursor-pointer"
                  >
                    Brosur Standar: Rp {(isMultiLot && assignMode === 'add' ? ((selectedCust?.totalHarga || 0) + assignKavlingTarget.harga) : assignKavlingTarget.harga).toLocaleString('id-ID')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssignPrice(Math.max(0, assignPrice - 5000000))}
                    className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded text-[10px] font-semibold transition cursor-pointer"
                  >
                    Diskon Promo 5 Jt
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssignPrice(Math.max(0, assignPrice - 10000000))}
                    className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded text-[10px] font-semibold transition cursor-pointer"
                  >
                    Diskon 10 Jt
                  </button>
                </div>
              </div>

              {/* Simulation Preview */}
              {selectedCust && (
                <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-2 text-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Simulasi Saldo &amp; Status Otomatis
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Pembeli:</span>
                      <span className="font-bold text-white">{selectedCust.nama}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Total Unit:</span>
                      <span className="font-bold text-blue-300">
                        {isMultiLot && assignMode === 'add' ? `${existingLots.length + 1} Unit (${[...existingLots.map(l => l.nomor), assignKavlingTarget.nomor].join(', ')})` : `1 Unit (${assignKavlingTarget.nomor})`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Nilai Kontrak Total:</span>
                      <span className="font-mono font-bold text-white">Rp {assignPrice.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Uang Masuk Sebelumnya:</span>
                      <span className="font-mono font-bold text-emerald-400">Rp {totalMasuk.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-800">
                      <span className="text-slate-300 font-bold">Sisa Piutang Berjalan:</span>
                      <span className="font-mono font-bold text-amber-300">
                        Rp {newSisa.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-800">
                      <span className="text-slate-300 font-bold">Status Setelah Disimpan:</span>
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                        isLunas ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {isLunas ? 'LUNAS (Kavling: Terjual)' : 'BELUM LUNAS (Kavling: Booking)'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAssignKavlingTarget(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!assignCustId) {
                      alert('Pilih customer pembeli terlebih dahulu!');
                      return;
                    }
                    if (assignPrice <= 0) {
                      alert('Nilai kontrak kesepakatan harus lebih dari Rp 0!');
                      return;
                    }

                    if (isMultiLot && assignMode === 'add') {
                      const allTargetIds = Array.from(new Set([...existingLots.map(l => l.id), assignKavlingTarget.id]));
                      await assignCustomerToMultipleKavlings(assignCustId, allTargetIds, assignPrice);
                    } else {
                      await assignCustomerToMultipleKavlings(assignCustId, [assignKavlingTarget.id], assignPrice);
                    }

                    setAssignKavlingTarget(null);
                    if (selectedKavling && selectedKavling.id === assignKavlingTarget.id) {
                      const cust = customers.find(c => c.id === assignCustId);
                      setSelectedKavling({
                        ...selectedKavling,
                        customerId: assignCustId,
                        customerNama: cust?.nama || null,
                        status: isLunas ? 'terjual' : 'booking'
                      });
                    }
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan &amp; Hubungkan</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal Add Single Kavling */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-2 mb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                + Tambah Unit Kavling Baru
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Induk Kavling / Proyek *</label>
                <div className="flex gap-2">
                  <select
                    value={formProjectId}
                    onChange={(e) => setFormProjectId(e.target.value)}
                    className="flex-1 border border-slate-300 rounded-xl px-3 py-2 bg-white font-semibold text-slate-800"
                    required
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.nama} ({p.lokasi})</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowProjectModal(true)}
                    className="px-2.5 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition whitespace-nowrap"
                  >
                    + Induk Baru
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Blok Kavling *</label>
                  <input
                    type="text"
                    required
                    value={formBlok}
                    onChange={(e) => setFormBlok(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nomor Kavling *</label>
                  <input
                    type="text"
                    required
                    value={formNomor}
                    onChange={(e) => setFormNomor(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-bold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Luas Tanah (m²) *</label>
                  <input
                    type="number"
                    required
                    value={formLuas}
                    onChange={(e) => setFormLuas(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dimensi (m) *</label>
                  <input
                    type="text"
                    required
                    value={formDimensi}
                    onChange={(e) => setFormDimensi(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Harga Standar (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={formHarga}
                    onChange={(e) => setFormHarga(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-emerald-700"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipe Unit</label>
                  <select
                    value={formTipe}
                    onChange={(e) => setFormTipe(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-white"
                  >
                    <option value="Hunian Standar">Hunian Standar</option>
                    <option value="Hunian Premium">Hunian Premium</option>
                    <option value="Hunian Ekonomis">Hunian Ekonomis</option>
                    <option value="Ruko Komersil">Ruko Komersil</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Keterangan / Posisi</label>
                <input
                  type="text"
                  value={formKeterangan}
                  onChange={(e) => setFormKeterangan(e.target.value)}
                  placeholder="Hadap timur, dekat taman..."
                  className="w-full border border-slate-300 rounded-xl px-3 py-2"
                />
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
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Simpan Kavling
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Batch Kavling */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                ⚡ Buat Blok Kavling Sekaligus (Batch)
              </h3>
              <button
                type="button"
                onClick={() => setShowBatchModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Otomatis membuat nomor urut kavling massal dalam 1 blok.
            </p>

            <form onSubmit={handleBatchSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Induk Kavling / Proyek *</label>
                <div className="flex gap-2">
                  <select
                    value={batchProjectId}
                    onChange={(e) => setBatchProjectId(e.target.value)}
                    className="flex-1 border border-slate-300 rounded-xl px-3 py-2 bg-white font-semibold text-slate-800"
                    required
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.nama} ({p.lokasi})</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowProjectModal(true)}
                    className="px-2.5 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition whitespace-nowrap"
                  >
                    + Induk Baru
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Blok</label>
                  <input
                    type="text"
                    required
                    value={batchBlok}
                    onChange={(e) => setBatchBlok(e.target.value)}
                    placeholder="Contoh: Blok B"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Prefix Kode</label>
                  <input
                    type="text"
                    required
                    value={batchPrefix}
                    onChange={(e) => setBatchPrefix(e.target.value)}
                    placeholder="Contoh: B"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nomor Mulai</label>
                  <input
                    type="number"
                    required
                    value={batchStart}
                    onChange={(e) => setBatchStart(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jumlah Kavling</label>
                  <input
                    type="number"
                    required
                    value={batchCount}
                    onChange={(e) => setBatchCount(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Luas Tiap Unit (m²)</label>
                  <input
                    type="number"
                    required
                    value={batchLuas}
                    onChange={(e) => setBatchLuas(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dimensi</label>
                  <input
                    type="text"
                    required
                    value={batchDimensi}
                    onChange={(e) => setBatchDimensi(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Harga Per Unit (Rp)</label>
                <input
                  type="number"
                  required
                  value={batchHarga}
                  onChange={(e) => setBatchHarga(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-emerald-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold shadow-xs"
                >
                  Generate {batchCount} Kavling
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Induk Kavling / Master Proyek Baru */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl shadow-2xs">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Tambah Induk Kavling & Pembelian Lahan Mentah
                  </h3>
                  <p className="text-xs text-slate-500">
                    Daftarkan kawasan proyek baru, legalitas tanah induk, dan catat kewajiban hutang secara otomatis.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowProjectModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProjectSubmit} className="space-y-4 text-xs overflow-y-auto pr-1 custom-scrollbar flex-1">
              {/* BAGIAN 1: IDENTITAS KAWASAN PROYEK */}
              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>1. Identitas Kawasan Proyek Induk</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Nama Induk Proyek / Kawasan *
                    </label>
                    <input
                      type="text"
                      required
                      value={projNama}
                      onChange={(e) => setProjNama(e.target.value)}
                      placeholder="Contoh: Baitul Makmur Regency 2"
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Lokasi / Alamat Lahan *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={projLokasi}
                        onChange={(e) => setProjLokasi(e.target.value)}
                        placeholder="Contoh: Jl. Sukodono No. 12, Kaliwungu Selatan"
                        className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 bg-white pl-8 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Deskripsi / Rencana Pengembangan (Opsional)
                  </label>
                  <input
                    type="text"
                    value={projDeskripsi}
                    onChange={(e) => setProjDeskripsi(e.target.value)}
                    placeholder="Contoh: Kawasan seluas 6.000 m², rencana 45 unit kavling siap bangun SHM Split..."
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* BAGIAN 2: TRANSAKSI FINANSIAL PEMBELIAN LAHAN PETANI */}
              <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-1 border-b border-amber-200/60">
                  <span className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
                    <Tractor className="w-4 h-4 text-amber-700" />
                    <span>2. Transaksi Finansial Pembelian Tanah ke Petani / Pemilik</span>
                  </span>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-amber-900">
                    <input
                      type="checkbox"
                      checked={projHasLandDebt}
                      onChange={(e) => setProjHasLandDebt(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
                    />
                    <span>Catat Hutang & Sinkronisasi Keuangan</span>
                  </label>
                </div>

                {projHasLandDebt && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Nama Petani / Pemilik Lahan Asal *
                        </label>
                        <input
                          type="text"
                          required={projHasLandDebt}
                          value={projNamaPetani}
                          onChange={(e) => setProjNamaPetani(e.target.value)}
                          placeholder="Contoh: Bpk. H. Sugeng Mulyono"
                          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          No. WhatsApp Pemilik
                        </label>
                        <input
                          type="text"
                          value={projTeleponPetani}
                          onChange={(e) => setProjTeleponPetani(e.target.value)}
                          placeholder="08123456789"
                          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-white font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Luas Tanah Mentah *
                        </label>
                        <input
                          type="text"
                          required={projHasLandDebt}
                          value={projLuasTanah}
                          onChange={(e) => setProjLuasTanah(e.target.value)}
                          placeholder="Contoh: 6.000 m² (428 Ru)"
                          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Alas Hak / Surat Tanah Asal *
                        </label>
                        <input
                          type="text"
                          required={projHasLandDebt}
                          value={projAlasHak}
                          onChange={(e) => setProjAlasHak(e.target.value)}
                          placeholder="Contoh: Letter C No. 45 / SHM No. 12"
                          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Nominal Keuangan */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Harga Kesepakatan (Rp) *
                        </label>
                        <input
                          type="number"
                          required={projHasLandDebt}
                          value={projHargaKesepakatan}
                          onChange={(e) => setProjHargaKesepakatan(Number(e.target.value))}
                          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Uang Muka / DP Dibayar (Rp)
                        </label>
                        <input
                          type="number"
                          value={projDpDibayar}
                          onChange={(e) => setProjDpDibayar(Number(e.target.value))}
                          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-rose-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Sisa Hutang Berjalan (Auto)
                        </label>
                        <div className="border border-rose-200 bg-rose-50 rounded-xl px-3 py-2 text-xs font-mono font-bold text-rose-700 flex items-center justify-between">
                          <span>Rp</span>
                          <span>{Math.max(0, projHargaKesepakatan - projDpDibayar).toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Metode Pembayaran DP
                        </label>
                        <select
                          value={projMetodeBayarDp}
                          onChange={(e) => setProjMetodeBayarDp(e.target.value)}
                          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="Transfer Bank Mandiri">Transfer Bank Mandiri</option>
                          <option value="Transfer Bank BCA">Transfer Bank BCA</option>
                          <option value="Transfer Bank BRI / BNI">Transfer Bank BRI / BNI</option>
                          <option value="Tunai Kasir Kantor">Tunai Kasir Kantor</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Catatan Notaris / Skema Tempo
                        </label>
                        <input
                          type="text"
                          value={projCatatanHutang}
                          onChange={(e) => setProjCatatanHutang(e.target.value)}
                          placeholder="Akta PPJB No. 12/2026, tenor cicilan 6 bulan"
                          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* BAGIAN 3: BERKAS DOKUMEN LEGALITAS LAHAN INDUK */}
              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  <span>3. Berkas Dokumen Legalitas Lahan Induk</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Dokumen 1: Sertifikat Induk */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 text-[11px]">
                        Sertifikat Induk / Alas Hak
                      </span>
                      {projSertifikatImage && (
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                          Terunggah
                        </span>
                      )}
                    </div>

                    {projSertifikatImage ? (
                      <div className="space-y-1.5">
                        <div className="relative h-24 w-full rounded-lg overflow-hidden border border-emerald-300 bg-slate-100 group">
                          <img
                            src={projSertifikatImage}
                            alt="Sertifikat Induk"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setPreviewDocImage({ title: `Sertifikat Induk: ${projNama || 'Proyek'}`, src: projSertifikatImage })}
                              className="px-2 py-1 bg-white text-slate-900 rounded font-bold text-[10px] flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" /> Lihat
                            </button>
                            <button
                              type="button"
                              onClick={() => setProjSertifikatImage(null)}
                              className="px-2 py-1 bg-rose-600 text-white rounded font-bold text-[10px] flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> Hapus
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <button
                            type="button"
                            onClick={() => setPreviewDocImage({ title: `Sertifikat Induk: ${projNama || 'Proyek'}`, src: projSertifikatImage })}
                            className="text-emerald-700 hover:underline font-bold flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" /> Lihat Berkas
                          </button>
                          <label className="text-slate-500 hover:text-slate-800 cursor-pointer underline font-medium">
                            <span>Ganti File</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, setProjSertifikatImage)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-3 flex flex-col items-center justify-center gap-1 text-center cursor-pointer transition bg-slate-50/50 hover:bg-emerald-50/30">
                          <UploadCloud className="w-5 h-5 text-slate-400" />
                          <span className="font-semibold text-slate-700 text-[11px]">
                            Upload Foto Sertifikat / Alas Hak
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Format JPG, PNG (Maks 8MB)
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, setProjSertifikatImage)}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const sample = generateSampleDoc(
                              'SERTIFIKAT INDUK LAHAN',
                              `${projAlasHak || 'SHM / Letter C'} • Luas ${projLuasTanah || 'Tanah Mentah'} • ${projNama || 'Proyek'}`,
                              '#065f46'
                            );
                            setProjSertifikatImage(sample);
                          }}
                          className="w-full py-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
                        >
                          + Gunakan Sampel SHM Induk
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Dokumen 2: Akta Notaris / PPJB */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 text-[11px]">
                        Surat Perjanjian PPJB / Akta Notaris
                      </span>
                      {projPerjanjianImage && (
                        <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full font-bold">
                          Terunggah
                        </span>
                      )}
                    </div>

                    {projPerjanjianImage ? (
                      <div className="space-y-1.5">
                        <div className="relative h-24 w-full rounded-lg overflow-hidden border border-blue-300 bg-slate-100 group">
                          <img
                            src={projPerjanjianImage}
                            alt="Akta Notaris PPJB"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setPreviewDocImage({ title: `Akta PPJB: ${projNama || 'Proyek'}`, src: projPerjanjianImage })}
                              className="px-2 py-1 bg-white text-slate-900 rounded font-bold text-[10px] flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" /> Lihat
                            </button>
                            <button
                              type="button"
                              onClick={() => setProjPerjanjianImage(null)}
                              className="px-2 py-1 bg-rose-600 text-white rounded font-bold text-[10px] flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> Hapus
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <button
                            type="button"
                            onClick={() => setPreviewDocImage({ title: `Akta PPJB: ${projNama || 'Proyek'}`, src: projPerjanjianImage })}
                            className="text-blue-700 hover:underline font-bold flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" /> Lihat Berkas
                          </button>
                          <label className="text-slate-500 hover:text-slate-800 cursor-pointer underline font-medium">
                            <span>Ganti File</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, setProjPerjanjianImage)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-3 flex flex-col items-center justify-center gap-1 text-center cursor-pointer transition bg-slate-50/50 hover:bg-blue-50/30">
                          <UploadCloud className="w-5 h-5 text-slate-400" />
                          <span className="font-semibold text-slate-700 text-[11px]">
                            Upload Foto Akta PPJB / SPK
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Format JPG, PNG (Maks 8MB)
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, setProjPerjanjianImage)}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const sample = generateSampleDoc(
                              'AKTA NOTARIS & PPJB LAHAN',
                              `Perjanjian Pengikatan Jual Beli • Bpk/Ibu ${projNamaPetani || 'Pemilik Lahan'} • ${projNama || 'Proyek'}`,
                              '#1e40af'
                            );
                            setProjPerjanjianImage(sample);
                          }}
                          className="w-full py-1 text-[10px] font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition"
                        >
                          + Gunakan Sampel Akta PPJB
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* INTEGRATION BANNER */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 space-y-1">
                <span className="font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Koneksi Otomatis ke Keuangan & Site Plan:
                </span>
                <p className="text-[11px] text-slate-600">
                  {projHasLandDebt ? (
                    <>
                      Kewajiban hutang lahan sebesar <b>Rp {Math.max(0, projHargaKesepakatan - projDpDibayar).toLocaleString('id-ID')}</b> otomatis tercatat di <b>Menu 4 (Hutang Lahan Petani)</b>. Uang muka <b>Rp {Number(projDpDibayar).toLocaleString('id-ID')}</b> otomatis tercatat sebagai mutasi keluar di <b>Buku Kas Besar (Menu 5)</b>.
                    </>
                  ) : (
                    'Kawasan proyek akan terdaftar dan siap untuk penambahan kavling tanpa catatan kewajiban hutang lahan.'
                  )}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition active:scale-95 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Induk Proyek & Sinkronkan Keuangan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Preview Modal Berkas Dokumen */}
      {previewDocImage && (
        <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4">
          <div className="w-full flex justify-between items-center text-white max-w-4xl pb-2 border-b border-white/20">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-sm">{previewDocImage.title}</span>
            </div>
            <button
              onClick={() => setPreviewDocImage(null)}
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition cursor-pointer"
            >
              ✕ Tutup [ESC]
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-4 max-w-4xl max-h-[82vh] overflow-hidden">
            <img
              src={previewDocImage.src}
              alt="Preview Berkas"
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/10"
            />
          </div>

          <div className="text-white/60 text-xs text-center pb-2">
            Klik Tutup untuk kembali ke aplikasi
          </div>
        </div>
      )}

      {/* Modal Edit Kavling */}
      {showEditKavlingModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Edit Unit Kavling
                  </h3>
                  <p className="text-xs text-slate-500">Perbarui informasi unit kavling yang dipilih</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEditKavlingModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditKavlingSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Induk Kavling / Proyek *</label>
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
                  <label className="font-bold text-slate-700 block mb-1">Nama Blok *</label>
                  <input
                    type="text"
                    value={editBlok}
                    onChange={(e) => setEditBlok(e.target.value)}
                    placeholder="Contoh: Blok A"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nomor Kavling *</label>
                  <input
                    type="text"
                    value={editNomor}
                    onChange={(e) => setEditNomor(e.target.value)}
                    placeholder="Contoh: A-01"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Luas Tanah (m²) *</label>
                  <input
                    type="number"
                    min="1"
                    value={editLuas}
                    onChange={(e) => setEditLuas(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dimensi Lahan</label>
                  <input
                    type="text"
                    value={editDimensi}
                    onChange={(e) => setEditDimensi(e.target.value)}
                    placeholder="Contoh: 6 x 14 meter"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Harga Jual (Rp) *</label>
                  <input
                    type="number"
                    min="0"
                    step="1000000"
                    value={editHarga}
                    onChange={(e) => setEditHarga(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Rp {Number(editHarga).toLocaleString('id-ID')}
                  </span>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipe Unit</label>
                  <select
                    value={editTipe}
                    onChange={(e) => setEditTipe(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Hunian Standar">Hunian Standar</option>
                    <option value="Komersial / Ruko">Komersial / Ruko</option>
                    <option value="Sudut / Hook">Sudut / Hook</option>
                    <option value="Villa / Khusus">Villa / Khusus</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Status Unit Kavling</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="terbuka">🟢 Terbuka (Siap Jual)</option>
                  <option value="booking">🟡 Booking (Terbayar DP)</option>
                  <option value="terjual">🔴 Terjual (Lunas)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan / Posisi Kavling</label>
                <textarea
                  rows={2}
                  value={editKeterangan}
                  onChange={(e) => setEditKeterangan(e.target.value)}
                  placeholder="Misal: Hadap timur, dekat taman utama..."
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditKavlingModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs transition active:scale-95 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Kavling */}
      {deleteKavlingTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Hapus Unit Kavling?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tindakan ini akan menghapus unit kavling dari database site plan.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Unit Kavling:</span>
                <span className="font-bold text-slate-900 font-mono">{deleteKavlingTarget.blok} - {deleteKavlingTarget.nomor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Luas:</span>
                <span className="font-semibold text-slate-700">{deleteKavlingTarget.luas} m² ({deleteKavlingTarget.dimensi})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Harga Standar:</span>
                <span className="font-bold text-emerald-700 font-mono">Rp {deleteKavlingTarget.harga.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold uppercase text-slate-800">{deleteKavlingTarget.status}</span>
              </div>
              {deleteKavlingTarget.customerNama && (
                <div className="flex justify-between pt-1 border-t border-slate-200 text-rose-700">
                  <span className="font-semibold">Customer Pembeli:</span>
                  <span className="font-bold">{deleteKavlingTarget.customerNama}</span>
                </div>
              )}
            </div>

            {deleteKavlingTarget.customerNama && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 space-y-1">
                <span className="font-bold flex items-center gap-1 text-amber-800">
                  <AlertCircle className="w-4 h-4" /> Perhatian:
                </span>
                <p className="text-[11px] text-amber-800">
                  Unit kavling ini saat ini telah dipesan oleh konsumen. Jika dihapus, catatan unit pada data customer akan menjadi kosong.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteKavlingTarget(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteKavling}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Unit Ini</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Proyek / Lahan Induk */}
      {showEditProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Edit Kawasan Lahan Proyek
                  </h3>
                  <p className="text-xs text-slate-500">Ubah nama atau lokasi kawasan proyek induk</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEditProjectModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditProjectSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Kawasan / Proyek Lahan *</label>
                <input
                  type="text"
                  value={editProjNama}
                  onChange={(e) => setEditProjNama(e.target.value)}
                  placeholder="Contoh: Baitul Makmur"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Lokasi Kawasan Lahan *</label>
                <input
                  type="text"
                  value={editProjLokasi}
                  onChange={(e) => setEditProjLokasi(e.target.value)}
                  placeholder="Contoh: Kromengan, Malang"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Deskripsi / Spesifikasi Lahan</label>
                <textarea
                  rows={2}
                  value={editProjDeskripsi}
                  onChange={(e) => setEditProjDeskripsi(e.target.value)}
                  placeholder="Contoh: Cluster tanah kavling matang siap bangun..."
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditProjectModal(false)}
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

      {/* Modal Konfirmasi Hapus Proyek / Lahan Induk */}
      {deleteProjectTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Hapus Kawasan Lahan Proyek?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tindakan ini akan menghapus proyek induk dari seluruh sistem.
                </p>
              </div>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900 space-y-1">
              <span className="font-bold flex items-center gap-1 text-rose-800">
                <AlertTriangle className="w-4 h-4" /> PERINGATAN KRUSIAL:
              </span>
              <p className="text-[11px] text-rose-700">
                Menghapus proyek <b>{deleteProjectTarget.nama}</b> juga akan menghapus seluruh unit kavling dan catatan hutang tanah yang terdaftar pada proyek ini!
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteProjectTarget(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteProject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Kawasan Ini</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
