"use client";

import { useEffect, useState } from "react";
import { PaywallModal } from "@/components/ui/paywall-modal";

interface PaywallGuardProps {
  children: React.ReactNode;
  allCreditsExhausted: boolean;
}

export function PaywallGuard({ children, allCreditsExhausted }: PaywallGuardProps) {
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    if (allCreditsExhausted) {
      setShowPaywall(true);
    }
  }, [allCreditsExhausted]);

  return (
    <>
      {children}
      <PaywallModal
        open={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature="all platform features"
        limitMessage="You've used all your free credits. Upgrade your plan to continue using AutoTalent."
      />
    </>
  );
}
