'use client';

import React, { useState } from 'react';
import { useProperty } from '@/context/PropertyContext';
import ExportButtons from '@/components/common/ExportButtons';
import { 
  UserCheck, 
  Plus, 
  Zap, 
  Receipt, 
  Search, 
  Phone, 
  CreditCard, 
  Coins, 
  Printer, 
  CheckCircle2, 
  Clock,
  Trash2 
} from 'lucide-react';
import { Employee, SalaryPayment } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function EmployeeView() {
  const { user, isReadOnly, canManagePayments, canFullAccess } = useAuth();
  const { 
    employees, 
    salaryPayments, 
    pettyCashBalance, 
    addEmployee, 
    deleteEmployee,
    payEmployeeSalary, 
    payAllActiveSalaries 
  } = useProperty();

  const [filterDept, setFilterDept] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMonth, setCurrentMonth] = useState('2026-11');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSlipHistoryModal, setShowSlipHistoryModal] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState<SalaryPayment | null>(null);

  // Form states
  const [nama, setNama] = useState('');
  const [nik, setNik] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [departemen, setDepartemen] = useState<Employee['departemen']>('marketing');
  const [tipe, setTipe] = useState<Employee['tipe']>('tetap');
  const [noHp, setNoHp] = useState('');
  const [email, setEmail] = useState('');
  const [noRek, setNoRek] = useState('');
  const [bank, setBank] = useState('Bank BCA');
  const [gajiPokok, setGajiPokok] = useState(3500000);
  const [tunjanganJabatan, setTunjanganJabatan] = useState(500000);
  const [tunjanganMakan, setTunjanganMakan] = useState(500000);
  const [komisiPenjualan, setKomisiPenjualan] = useState(1000000);
  const [potongan, setPotongan] = useState(0);

  const filteredEmployees = employees.filter(e => {
    const matchDept = filterDept === 'all' || e.departemen === filterDept;
    const matchStatus = filterStatus === 'all' || e.status === filterStatus;
    const matchSearch = `${e.nama} ${e.nik} ${e.jabatan} ${e.noHp}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDept && matchStatus && matchSearch;
  });

  const totalMonthlyBudget = employees
    .filter(e => e.status === 'aktif')
    .reduce((sum, e) => sum + (e.gajiPokok + e.tunjanganJabatan + e.tunjanganMakan + e.komisiPenjualan - e.potongan), 0);

  const totalPaidThisMonth = salaryPayments
    .filter(s => s.bulan === currentMonth)
    .reduce((sum, s) => sum + s.thp, 0);

  const getExportData = () => ({
    filename: `Laporan-Karyawan-Payroll-${new Date().toISOString().split('T')[0]}`,
    title: 'Laporan Data Karyawan & Payroll Gaji',
    subtitle: 'PT Adam Property Indonesia',
    category: 'DATA KARYAWAN & STRUKTUR GAJI',
    headers: ['Nama Karyawan', 'NIK', 'Jabatan', 'Departemen', 'Status', 'Gaji Pokok (Rp)', 'Tunjangan (Rp)', 'Komisi (Rp)', 'Potongan (Rp)', 'Total THP (Rp)'],
    rows: filteredEmployees.map(e => {
      const thp = e.gajiPokok + e.tunjanganJabatan + e.tunjanganMakan + e.komisiPenjualan - e.potongan;
      return [
        e.nama,
        e.nik,
        e.jabatan,
        e.departemen.toUpperCase(),
        e.status.toUpperCase(),
        `Rp ${e.gajiPokok.toLocaleString('id-ID')}`,
        `Rp ${(e.tunjanganJabatan + e.tunjanganMakan).toLocaleString('id-ID')}`,
        `Rp ${e.komisiPenjualan.toLocaleString('id-ID')}`,
        `Rp ${e.potongan.toLocaleString('id-ID')}`,
        `Rp ${thp.toLocaleString('id-ID')}`
      ];
    }),
    summary: [
      { label: 'Total Karyawan', value: `${employees.length} Orang` },
      { label: 'Karyawan Aktif', value: `${employees.filter(e => e.status === 'aktif').length} Orang` },
      { label: 'Estimasi Anggaran Gaji/Bln', value: `Rp ${totalMonthlyBudget.toLocaleString('id-ID')}` },
      { label: 'Realisasi Bayar Bulan Ini', value: `Rp ${totalPaidThisMonth.toLocaleString('id-ID')}` }
    ]
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEmployee({
      nama,
      nik,
      jabatan,
      departemen,
      tipe,
      noHp,
      email,
      noRek,
      bank,
      gajiPokok: Number(gajiPokok),
      tunjanganJabatan: Number(tunjanganJabatan),
      tunjanganMakan: Number(tunjanganMakan),
      komisiPenjualan: Number(komisiPenjualan),
      potongan: Number(potongan),
      status: 'aktif',
      tanggalBergabung: new Date().toISOString().split('T')[0]
    });
    setShowAddModal(false);
    alert(`Data karyawan ${nama} berhasil ditambahkan dan tersimpan permanen ke Cloud Database!`);
    // Reset
    setNama('');
    setNik('');
    setJabatan('');
    setNoHp('');
  };

  const handleSinglePay = (emp: Employee) => {
    const thp = emp.gajiPokok + emp.tunjanganJabatan + emp.tunjanganMakan + emp.komisiPenjualan - emp.potongan;
    if (confirm(`Bayarkan gaji untuk ${emp.nama} sebesar Rp ${thp.toLocaleString('id-ID')} dan potong langsung dari Kas Kecil?`)) {
      const res = payEmployeeSalary(emp.id, currentMonth, `Gaji Rutin Bulan ${currentMonth}`);
      alert(res.message);
    }
  };

  const handleBatchPay = () => {
    if (confirm(`Bayarkan gaji semua staf aktif untuk periode ${currentMonth} menggunakan saldo Kas Kecil?`)) {
      const res = payAllActiveSalaries(currentMonth);
      alert(res.message);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full min-w-0">
      {/* Management Read-Only Banner */}
      {isReadOnly && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-3.5 text-xs text-amber-900 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <b>Mode Management (Read-Only):</b> Anda memiliki akses memantau data karyawan, struktur gaji, dan riwayat payroll. Penambahan staf dan penggajian dikunci.
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 border border-amber-300 rounded-md shrink-0">
            Hanya Lihat
          </span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center text-sm font-bold shrink-0">
              <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Karyawan, Marketing & Payroll Gaji
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-1 hidden sm:block">
            Pencatatan profil staf, komisi penjualan kavling, dan pembayaran gaji 1-klik otomatis memotong saldo Kas Kecil kantor.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full md:w-auto justify-between md:justify-end">
          {canFullAccess && (
            <>
              <button
                onClick={handleBatchPay}
                className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg sm:rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm cursor-pointer shrink-0"
                title="Bayar Gaji Semua Karyawan yang Belum Digaji Bulan Ini"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">⚡ Gaji Massal Bulan Ini</span>
                <span className="sm:hidden">⚡ Gaji Massal</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg sm:rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">+ Tambah Karyawan</span>
                <span className="sm:hidden">+ Karyawan</span>
              </button>
            </>
          )}
          <button
            onClick={() => setShowSlipHistoryModal(true)}
            className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg sm:rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm cursor-pointer shrink-0"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Riwayat Slip</span>
          </button>
          <ExportButtons getData={getExportData} />
        </div>
      </div>

      {/* 4 Financial & Payroll Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-800 text-white shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-medium text-amber-400 text-[10px] sm:text-xs">Total Tim Karyawan</span>
              <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />
            </div>
            <h3 className="text-base sm:text-2xl font-black text-amber-300 font-mono truncate">
              {employees.length} <span className="text-xs font-normal text-slate-400">Orang</span>
            </h3>
          </div>
          <div className="mt-2 sm:mt-3 pt-1.5 sm:pt-2.5 border-t border-white/10 flex items-center justify-between text-[9px] sm:text-[11px] text-slate-300 truncate">
            <span>{employees.filter(e => e.status === 'aktif').length} Aktif &bull; {employees.filter(e => e.status !== 'aktif').length} Nonaktif</span>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span className="font-semibold text-[10px] sm:text-xs truncate">Beban Gaji Rutin</span>
              <CreditCard className="w-4 h-4 text-indigo-600 shrink-0" />
            </div>
            <h3 className="text-base sm:text-2xl font-black text-slate-900 font-mono truncate">
              Rp {totalMonthlyBudget.toLocaleString('id-ID')}
            </h3>
          </div>
          <div className="mt-2 sm:mt-3 pt-1.5 sm:pt-2.5 border-t border-slate-100 text-[9px] sm:text-[11px] text-slate-500 truncate">
            Gaji pokok & tunjangan
          </div>
        </div>

        <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span className="font-semibold text-emerald-700 text-[10px] sm:text-xs truncate">Gaji Terbayar</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>
            <h3 className="text-base sm:text-2xl font-black text-emerald-600 font-mono truncate">
              Rp {totalPaidThisMonth.toLocaleString('id-ID')}
            </h3>
          </div>
          <div className="mt-2 sm:mt-3 pt-1.5 sm:pt-2.5 border-t border-slate-100 text-[9px] sm:text-[11px] text-emerald-600 font-semibold truncate">
            Bulan {currentMonth}
          </div>
        </div>

        <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-violet-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span className="font-semibold text-violet-700 text-[10px] sm:text-xs truncate">Kas Kecil Sedia</span>
              <Coins className="w-4 h-4 text-violet-600 shrink-0" />
            </div>
            <h3 className="text-base sm:text-2xl font-black text-violet-700 font-mono truncate">
              Rp {pettyCashBalance.toLocaleString('id-ID')}
            </h3>
          </div>
          <div className="mt-2 sm:mt-3 pt-1.5 sm:pt-2.5 border-t border-slate-100 text-[9px] sm:text-[11px] text-violet-600 font-semibold truncate">
            Dana kasir kantor
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
            placeholder="Cari nama, NIK, jabatan..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg sm:rounded-xl px-2.5 py-1.5 sm:py-2 bg-slate-50 font-semibold"
          >
            <option value="all">Semua Departemen</option>
            <option value="marketing">Sales & Marketing</option>
            <option value="keuangan">Keuangan & Kasir</option>
            <option value="operasional">Operasional</option>
            <option value="teknik">Teknik & Survey</option>
            <option value="direksi">Direksi</option>
          </select>

          <input
            type="month"
            value={currentMonth}
            onChange={(e) => setCurrentMonth(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg sm:rounded-xl px-2.5 py-1.5 sm:py-2 bg-slate-50 font-bold font-mono"
          />
        </div>
      </div>

      {/* Employee & Payroll Table */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs overflow-hidden w-full min-w-0">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Karyawan / Marketing</th>
                <th className="py-3 px-4">Jabatan & Departemen</th>
                <th className="py-3 px-4">Rekening Bank</th>
                <th className="py-3 px-4 text-right">Rincian Komponen Gaji</th>
                <th className="py-3 px-4 text-right">Gaji Bersih (THP)</th>
                <th className="py-3 px-4 text-center">Status Gaji Bulan Ini</th>
                <th className="py-3 px-4 text-center w-40">Aksi Penggajian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredEmployees.map((emp) => {
                const thp = emp.gajiPokok + emp.tunjanganJabatan + emp.tunjanganMakan + emp.komisiPenjualan - emp.potongan;
                const paidSlip = salaryPayments.find(s => s.employeeId === emp.id && s.bulan === currentMonth);
                const isPaid = !!paidSlip;

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 text-sm">{emp.nama}</div>
                      <div className="text-[11px] text-slate-500 font-mono">NIK: {emp.nik}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" /> {emp.noHp}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800 block">{emp.jabatan}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-slate-100 text-slate-700 mt-1 inline-block">
                        {emp.departemen} &bull; {emp.tipe}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className="font-semibold text-slate-800 block">{emp.bank}</span>
                      <span className="text-[11px] text-slate-500">{emp.noRek || '-'}</span>
                    </td>
                    <td className="py-3 px-4 text-right space-y-0.5 text-[11px]">
                      <div>Pokok: Rp {emp.gajiPokok.toLocaleString('id-ID')}</div>
                      <div className="text-slate-500">Tunj: Rp {(emp.tunjanganJabatan + emp.tunjanganMakan).toLocaleString('id-ID')}</div>
                      {emp.komisiPenjualan > 0 && (
                        <div className="text-emerald-600 font-semibold">+ Komisi: Rp {emp.komisiPenjualan.toLocaleString('id-ID')}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700 text-sm">
                      Rp {thp.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isPaid ? 'Terbayar' : 'Belum Digaji'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {!isPaid ? (
                          <button
                            onClick={() => handleSinglePay(emp)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition inline-flex items-center gap-1 shadow-2xs"
                          >
                            <Coins className="w-3.5 h-3.5" />
                            <span>Gaji 1-Klik</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedSlip(paidSlip)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>Lihat Slip</span>
                          </button>
                        )}
                        {canFullAccess && (
                          <button
                            onClick={async () => {
                              if (confirm(`Hapus data karyawan ${emp.nama}? Tindakan ini akan menghapus data permanen dari database.`)) {
                                await deleteEmployee(emp.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Hapus Karyawan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Slip Gaji */}
      {selectedSlip && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto custom-scrollbar">
            <div className="text-center border-b border-slate-200 pb-3">
              <img src="/assets/logo-icon.svg" alt="Logo" className="w-8 h-8 mx-auto mb-1 object-contain" />
              <h3 className="font-black text-sm text-slate-900">PT ADAM PROPERTY INDONESIA</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">SLIP GAJI RESMI KARYAWAN &bull; PERIODE {selectedSlip.bulan}</p>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Nama:</span>
                <span className="font-bold text-slate-900">{selectedSlip.employeeNama}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Jabatan:</span>
                <span className="font-semibold text-slate-800">{selectedSlip.jabatan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tanggal Bayar:</span>
                <span className="font-mono text-slate-700">{selectedSlip.tanggalBayar}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Gaji Pokok:</span>
                <span className="font-mono">Rp {selectedSlip.gajiPokok.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tunjangan Jabatan:</span>
                <span className="font-mono">Rp {selectedSlip.tunjanganJabatan.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tunjangan Makan:</span>
                <span className="font-mono">Rp {selectedSlip.tunjanganMakan.toLocaleString('id-ID')}</span>
              </div>
              {selectedSlip.komisi > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Komisi Closing Kavling:</span>
                  <span className="font-mono">Rp {selectedSlip.komisi.toLocaleString('id-ID')}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t-2 border-slate-900 flex justify-between items-center text-sm font-black">
              <span>Total Gaji Bersih (THP):</span>
              <span className="font-mono text-emerald-700 text-base">
                Rp {selectedSlip.thp.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="p-2.5 bg-emerald-50 rounded-xl text-center text-[10px] text-emerald-800 font-medium">
              ✓ Otomatis dibukukan dan dipotong dari Kas Kecil Kantor.
            </div>

            <div className="flex justify-between gap-2 pt-2">
              <button
                onClick={() => setSelectedSlip(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Karyawan */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-600" />
              <span>+ Registrasi Karyawan / Marketing Baru</span>
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Budi Santoso"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">NIK (KTP) *</label>
                  <input
                    type="text"
                    required
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    placeholder="332408xxxxxxx"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jabatan *</label>
                  <input
                    type="text"
                    required
                    value={jabatan}
                    onChange={(e) => setJabatan(e.target.value)}
                    placeholder="Marketing Executive"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Departemen *</label>
                  <select
                    value={departemen}
                    onChange={(e) => setDepartemen(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-white"
                  >
                    <option value="marketing">Sales & Marketing</option>
                    <option value="keuangan">Keuangan & Kasir</option>
                    <option value="operasional">Operasional</option>
                    <option value="teknik">Teknik & Survey</option>
                    <option value="direksi">Direksi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">No. WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={noHp}
                    onChange={(e) => setNoHp(e.target.value)}
                    placeholder="081234xxxx"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rekening Bank</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={bank}
                      onChange={(e) => setBank(e.target.value)}
                      placeholder="BCA"
                      className="w-24 border border-slate-300 rounded-xl px-3 py-2 font-semibold"
                    />
                    <input
                      type="text"
                      value={noRek}
                      onChange={(e) => setNoRek(e.target.value)}
                      placeholder="No. Rekening"
                      className="flex-1 border border-slate-300 rounded-xl px-3 py-2 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                  Komponen Penggajian:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-600 block">Gaji Pokok (Rp)</label>
                    <input
                      type="number"
                      value={gajiPokok}
                      onChange={(e) => setGajiPokok(Number(e.target.value))}
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block">Tunj. Jabatan (Rp)</label>
                    <input
                      type="number"
                      value={tunjanganJabatan}
                      onChange={(e) => setTunjanganJabatan(Number(e.target.value))}
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block">Uang Makan (Rp)</label>
                    <input
                      type="number"
                      value={tunjanganMakan}
                      onChange={(e) => setTunjanganMakan(Number(e.target.value))}
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block">Komisi Closing (Rp)</label>
                    <input
                      type="number"
                      value={komisiPenjualan}
                      onChange={(e) => setKomisiPenjualan(Number(e.target.value))}
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono"
                    />
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
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold shadow-xs"
                >
                  Simpan Karyawan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
