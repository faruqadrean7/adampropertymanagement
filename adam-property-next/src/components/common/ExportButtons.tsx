'use client';

import React from 'react';
import { FileSpreadsheet, FileText } from 'lucide-react';
import { exportToExcel, exportToPdf, ExportDataConfig } from '@/lib/exportUtils';
import { useAuth } from '@/context/AuthContext';

interface ExportButtonsProps {
  getData: () => Omit<ExportDataConfig, 'printedBy'>;
  className?: string;
  variant?: 'solid' | 'outline' | 'compact';
}

export default function ExportButtons({ getData, className = '', variant = 'outline' }: ExportButtonsProps) {
  const { user } = useAuth();

  const handleExcel = () => {
    const config = getData();
    exportToExcel({
      ...config,
      printedBy: user?.nama || 'Administrator'
    });
  };

  const handlePdf = () => {
    const config = getData();
    exportToPdf({
      ...config,
      printedBy: user?.nama || 'Administrator'
    });
  };

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <button
          onClick={handleExcel}
          className="px-2.5 py-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95"
          title="Download Format Excel (.xlsx)"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
          <span>Excel</span>
        </button>
        <button
          onClick={handlePdf}
          className="px-2.5 py-1.5 text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded-lg transition flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95"
          title="Cetak Dokumen Resmi / Simpan PDF"
        >
          <FileText className="w-3.5 h-3.5 text-rose-600" />
          <span>PDF</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handleExcel}
        className="px-3 py-2 text-xs font-bold text-emerald-700 hover:text-white bg-white hover:bg-emerald-600 border border-emerald-300 hover:border-emerald-600 rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
        title="Download Format Excel (.xlsx)"
      >
        <FileSpreadsheet className="w-4 h-4 text-emerald-600 group-hover:text-white" />
        <span>Export Excel</span>
      </button>

      <button
        onClick={handlePdf}
        className="px-3 py-2 text-xs font-bold text-rose-700 hover:text-white bg-white hover:bg-rose-600 border border-rose-300 hover:border-rose-600 rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
        title="Cetak Dokumen Resmi / Simpan PDF (Kop Surat PT Adam Property)"
      >
        <FileText className="w-4 h-4 text-rose-600 group-hover:text-white" />
        <span>Export PDF</span>
      </button>
    </div>
  );
}
