'use client';

import React, { useState } from 'react';
import { PropertyProvider, useProperty } from '@/context/PropertyContext';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import DashboardView from '@/components/dashboard/DashboardView';
import KavlingView from '@/components/kavling/KavlingView';
import CustomerView from '@/components/customer/CustomerView';
import LandDebtView from '@/components/land-debt/LandDebtView';
import CashbookView from '@/components/cashbook/CashbookView';
import PettyCashView from '@/components/petty-cash/PettyCashView';
import InventoryView from '@/components/inventory/InventoryView';
import EmployeeView from '@/components/employee/EmployeeView';
import { ShieldCheck, Database } from 'lucide-react';

function MainApp() {
  const { activeTab } = useProperty();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'kavling':
        return <KavlingView />;
      case 'customer':
        return <CustomerView />;
      case 'landDebt':
        return <LandDebtView />;
      case 'cashbook':
        return <CashbookView />;
      case 'pettyCash':
        return <PettyCashView />;
      case 'inventory':
        return <InventoryView />;
      case 'employee':
        return <EmployeeView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row antialiased">
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <TopBar 
          onToggleSidebar={() => setSidebarOpen(true)} 
        />

        {/* Dynamic Module View */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 w-full max-w-[1600px] mx-auto">
          {renderActiveView()}
        </main>

        {/* Corporate Footer */}
        <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-2">
            <div className="flex items-center gap-2">
              <img src="/assets/logo-icon.svg" alt="Logo" className="w-5 h-5 object-contain" />
              <p>
                &copy; 2026 <strong>PT Adam Property Indonesia</strong> &bull; Developer Utama. Next.js Enterprise Frontend.
              </p>
            </div>
            <p className="flex items-center gap-1.5 font-medium text-emerald-700">
              <Database className="w-4 h-4 text-emerald-600" />
              Siap Terkoneksi ke Backend Supabase (PostgreSQL, Auth & Storage)
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <PropertyProvider>
      <MainApp />
    </PropertyProvider>
  );
}
