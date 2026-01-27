"use client";

import { useLocale } from "./locale-provider";
import { useEffect } from "react";

export function HtmlWrapper({ children }: { children: React.ReactNode }) {
  const { locale, dir } = useLocale();

  useEffect(() => {
    // Update html attributes when locale changes
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  return <>{children}</>;
}
