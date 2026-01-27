"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { locales, defaultLocale, type Locale } from "@/i18n/config";

// Import translations
import en from "@/i18n/messages/en.json";
import ar from "@/i18n/messages/ar.json";
import sv from "@/i18n/messages/sv.json";

const messages: Record<Locale, typeof en> = { en, ar, sv };

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let result: unknown = obj;

  for (const key of keys) {
    if (result && typeof result === "object" && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return path; // Return the key if not found
    }
  }

  return typeof result === "string" ? result : path;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Get locale from cookie on mount
    const savedLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("NEXT_LOCALE="))
      ?.split("=")[1] as Locale | undefined;

    if (savedLocale && locales.includes(savedLocale)) {
      setLocaleState(savedLocale);
    }
    setIsHydrated(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    // Save to cookie
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;
    // Optionally reload to apply changes globally
    window.location.reload();
  };

  const t = (key: string): string => {
    return getNestedValue(messages[locale] as Record<string, unknown>, key);
  };

  const dir = locale === "ar" ? "rtl" : "ltr";

  // Prevent hydration mismatch by rendering with default locale on server
  if (!isHydrated) {
    return (
      <LocaleContext.Provider
        value={{
          locale: defaultLocale,
          setLocale,
          t: (key: string) => getNestedValue(messages[defaultLocale] as Record<string, unknown>, key),
          dir: "ltr",
        }}
      >
        {children}
      </LocaleContext.Provider>
    );
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
