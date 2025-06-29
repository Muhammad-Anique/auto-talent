"use client";

import Sidebar from '@/components/sidebar';
import { ReactNode } from 'react';
import { useSidebarContext } from '@/context/SidebarContext';

export default function DashboardClientLayout({ children }: { children: ReactNode }) {
  const { expanded } = useSidebarContext();
  return (
    <div className="flex flex-row min-h-screen overflow-hidden">
      <div className='overflow-hidden fixed'>
        <Sidebar />
      </div>
      <main className={`flex-1 bg-gray-50  overflow-y-auto transition-all duration-200 ${expanded ? 'ml-72' : 'ml-20'}`}>{children}</main>
    </div>
  );
} 