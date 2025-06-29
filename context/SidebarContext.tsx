"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SidebarContextType {
  expanded: boolean;
  pinned: boolean;
  setPinned: (pinned: boolean) => void;
  setHovered: (hovered: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [pinned, setPinnedState] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Persist pinned state in localStorage
  useEffect(() => {
    const stored = localStorage.getItem('sidebar-pinned');
    if (stored) setPinnedState(stored === 'true');
  }, []);
  useEffect(() => {
    localStorage.setItem('sidebar-pinned', String(pinned));
  }, [pinned]);

  const setPinned = (val: boolean) => setPinnedState(val);
  const expanded = pinned || hovered;

  return (
    <SidebarContext.Provider value={{ expanded, pinned, setPinned, setHovered }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarContext = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebarContext must be used within SidebarProvider');
  return ctx;
}; 