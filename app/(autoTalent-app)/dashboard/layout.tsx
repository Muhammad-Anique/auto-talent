import { ReactNode } from "react";
import { SidebarProvider } from "@/context/SidebarContext";
import DashboardClientLayout from "./DashboardClientLayout";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardClientLayout>{children}</DashboardClientLayout>
    </SidebarProvider>
  );
}
