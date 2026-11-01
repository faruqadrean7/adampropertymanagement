'use client';

import React, { useState } from 'react';
import { useProperty } from '@/context/PropertyContext';
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
  MapPin
} from 'lucide-react';
import { Kavling } from '@/types';

export default function KavlingView() {
  const { 
    projects, 
    selectedProjectId, 
    setSelectedProjectId, 
    kavlings, 
    addProject,
    addKavling, 
    addBatchKavling,
    updateKavlingStatus 
  } = useProperty();

  const [statusFilter, setStatusFilter] = useState<'all' | 'terbuka' | 'booking' | 'terjual'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [selectedKavling, setSelectedKavling] = useState<Kavling | null>(null);

  // Form states for Add Induk Kavling / Project
  const [projNama, setProjNama] = useState('');
  const [projLokasi, setProjLokasi] = useState('');
  const [projDeskripsi, setProjDeskripsi] = useState('');

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

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projNama.trim() || !projLokasi.trim()) {
      alert('Nama dan lokasi proyek wajib diisi!');
      return;
    }
    const newProj = addProject({
      nama: projNama.trim(),
      lokasi: projLokasi.trim(),
      deskripsi: projDeskripsi.trim() || undefined
    });
    setSelectedProjectId(newProj.id);
    setShowProjectModal(false);
    setProjNama('');
    setProjLokasi('');
    setProjDeskripsi('');
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

  return (
    <div className="space-y-6">
      {/* Top Bar Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Induk Kavling:
            </span>
            <select
              value={selectedProjectId}
              onChange={(e) => {
                if (e.target.value === '__NEW_PROJECT__') {
                  setShowProjectModal(true);
                } else {
                  setSelectedProjectId(e.target.value);
                }
              }}
              className="px-3.5 py-2 border-2 border-emerald-600/30 rounded-xl text-sm font-bold text-slate-800 bg-emerald-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">Semua Lahan Proyek</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.nama}</option>
              ))}
              <option value="__NEW_PROJECT__" className="text-emerald-700 font-bold bg-emerald-50">
                + Tambah Induk Proyek Baru...
              </option>
            </select>

            {/* Quick Add Induk Proyek Button */}
            <button
              type="button"
              onClick={() => setShowProjectModal(true)}
              className="px-3 py-2 bg-emerald-100 hover:bg-emerald-200 active:scale-95 text-emerald-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs border border-emerald-300"
              title="Tambah Kawasan / Induk Kavling Baru"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-700" />
              <span>+ Induk Baru</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowProjectModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition flex items-center gap-1.5 active:scale-95 shadow-2xs"
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>+ Induk Proyek Baru</span>
          </button>
          <button
            onClick={handleOpenBatchModal}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5 active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>+ Buat Blok Sekaligus</span>
          </button>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Kavling Baru</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-lg shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Kavling</p>
            <h3 className="text-xl font-bold text-slate-800 font-mono">{totalLots}</h3>
            <p className="text-[11px] text-slate-400">{activeProject?.nama || 'Semua Lahan'}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
            <DoorOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Kavling Terbuka</p>
            <h3 className="text-xl font-bold text-emerald-600 font-mono">{openLots}</h3>
            <p className="text-[11px] text-emerald-600 font-medium">Siap Ditawarkan</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-lg shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Kavling Booking</p>
            <h3 className="text-xl font-bold text-amber-600 font-mono">{bookingLots}</h3>
            <p className="text-[11px] text-amber-600 font-medium">Terbayar DP</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-lg shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Kavling Terjual</p>
            <h3 className="text-xl font-bold text-rose-600 font-mono">{soldLots}</h3>
            <p className="text-[11px] text-rose-600 font-medium">Pelunasan Sah</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 justify-between items-center">
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
                {kav.customerNama && (
                  <div className="flex justify-between text-slate-900 font-bold truncate pt-1 border-t border-slate-100">
                    <span className="text-slate-500 font-normal">Customer:</span>
                    <span className="truncate ml-1">{kav.customerNama}</span>
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

      {/* Modal Detail Kavling */}
      {selectedKavling && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">{selectedKavling.blok}</span>
                <h3 className="text-2xl font-black text-slate-900 font-mono">{selectedKavling.nomor}</h3>
              </div>
              <button 
                onClick={() => setSelectedKavling(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Harga Standar:</span>
                <span className="font-bold text-emerald-700 font-mono">Rp {selectedKavling.harga.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Luas Tanah:</span>
                <span className="font-semibold">{selectedKavling.luas} m² ({selectedKavling.dimensi})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Tipe Peruntukan:</span>
                <span className="font-semibold">{selectedKavling.tipe}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Status Kavling:</span>
                <span className="font-bold uppercase text-slate-900">{selectedKavling.status}</span>
              </div>
              {selectedKavling.customerNama && (
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Pemilik / Pembeli:</span>
                  <span className="font-bold text-slate-900">{selectedKavling.customerNama}</span>
                </div>
              )}
              {selectedKavling.keterangan && (
                <div className="py-1">
                  <span className="text-slate-500 block mb-0.5">Catatan:</span>
                  <p className="p-2 bg-slate-50 rounded-lg text-slate-700 text-[11px]">{selectedKavling.keterangan}</p>
                </div>
              )}
            </div>

            {/* Quick Status Change */}
            <div className="pt-2 border-t border-slate-100">
              <label className="text-[11px] font-bold text-slate-500 block mb-1.5">Ubah Status Kavling Langsung:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    updateKavlingStatus(selectedKavling.id, 'terbuka');
                    setSelectedKavling({ ...selectedKavling, status: 'terbuka' });
                  }}
                  className="py-1.5 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                >
                  Terbuka
                </button>
                <button
                  onClick={() => {
                    updateKavlingStatus(selectedKavling.id, 'booking');
                    setSelectedKavling({ ...selectedKavling, status: 'booking' });
                  }}
                  className="py-1.5 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                >
                  Booking
                </button>
                <button
                  onClick={() => {
                    updateKavlingStatus(selectedKavling.id, 'terjual');
                    setSelectedKavling({ ...selectedKavling, status: 'terjual' });
                  }}
                  className="py-1.5 rounded-lg text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                >
                  Terjual
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedKavling(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Single Kavling */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
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
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Tambah Induk Kavling / Master Proyek
                  </h3>
                  <p className="text-xs text-slate-500">
                    Daftarkan kawasan proyek perumahan / kavling tanah baru
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

            <form onSubmit={handleProjectSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nama Induk Proyek / Kawasan *
                </label>
                <input
                  type="text"
                  required
                  value={projNama}
                  onChange={(e) => setProjNama(e.target.value)}
                  placeholder="Contoh: Baitul Makmur Regency 2 / Griya Sakinah"
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Lokasi / Alamat Proyek *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={projLokasi}
                    onChange={(e) => setProjLokasi(e.target.value)}
                    placeholder="Contoh: Jl. Sukodono No. 12, Kaliwungu Selatan, Kendal"
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 pl-9 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Deskripsi / Catatan Proyek (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={projDeskripsi}
                  onChange={(e) => setProjDeskripsi(e.target.value)}
                  placeholder="Contoh: Pengembangan kawasan seluas 1.5 Ha, rencana 45 unit kavling siap bangun SHM Split."
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-start gap-2">
                <span className="font-bold text-emerald-700">✓ Auto-Pilih:</span>
                <span>Setelah disimpan, sistem akan langsung beralih ke proyek baru ini agar Anda bisa langsung menambahkan unit kavling.</span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition active:scale-95"
                >
                  Simpan Induk Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
