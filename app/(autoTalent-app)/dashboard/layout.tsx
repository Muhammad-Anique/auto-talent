import { ReactNode } from "react";
import { SidebarProvider } from "@/context/SidebarContext";
import DashboardClientLayout from "./DashboardClientLayout";
import { checkAllCreditsExhausted } from "@/utils/actions/subscriptions/usage";
import { PaywallGuard } from "@/components/dashboard/paywall-guard";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const allExhausted = await checkAllCreditsExhausted();

  return (
    <SidebarProvider>
      <PaywallGuard allCreditsExhausted={allExhausted}>
        <DashboardClientLayout>{children}</DashboardClientLayout>
      </PaywallGuard>
    </SidebarProvider>
  );
}
