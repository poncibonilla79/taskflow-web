import type { ReactNode } from 'react';
import { useState } from 'react';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AppLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Header
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
      />

      <div className="flex flex-1">
        <Sidebar open={sidebarOpen} collapsed={sidebarCollapsed} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 overflow-auto p-6 lg:p-8">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}
