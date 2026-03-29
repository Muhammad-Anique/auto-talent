"use client";

import Sidebar from '@/components/sidebar';
import { ReactNode } from 'react';
import { useSidebarContext } from '@/context/SidebarContext';
import { useLocale } from '@/components/providers/locale-provider';

export default function DashboardClientLayout({ children }: { children: ReactNode }) {
  const { expanded } = useSidebarContext();
  const { dir } = useLocale();
  const isRTL = dir === 'rtl';

  return (
    <div className="flex flex-row min-h-screen overflow-hidden" dir="ltr">
      <div className={`fixed top-0 h-screen ${isRTL ? 'right-0' : 'left-0'}`}>
        <Sidebar />
      </div>
      <main
        className={`flex-1 bg-gray-50 overflow-y-auto transition-all duration-200 ${
          expanded
            ? (isRTL ? 'mr-72' : 'ml-72')
            : (isRTL ? 'mr-20' : 'ml-20')
        }`}
        dir={dir}
      >
        {children}
      </main>
    </div>
  );
}
