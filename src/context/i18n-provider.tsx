
"use client";

import { createContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Locale, I18nContextType, Translations } from "@/lib/types";
import { usePathname, useRouter } from 'next/navigation';

export const I18nContext = createContext<I18nContextType | null>(null);

function getNestedValue(obj: any, path: string): string | undefined {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export function I18nProvider({ children, params }: { children: ReactNode, params: { locale: Locale } }) {
  const { locale: initialLocale } = params;
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [translations, setTranslations] = useState<Translations>({});
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function loadTranslations(loc: Locale) {
      if (!loc) return;
      try {
        const response = await fetch(`/locales/${loc}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load ${loc}.json`);
        }
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error("Failed to load translations:", error);
        if(loc !== 'en') {
            setLocale('en'); // Fallback to english
        }
      }
    }
    loadTranslations(initialLocale);
  }, [initialLocale]);
  
  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    
    // Set cookie for persistence
    const date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${date.toUTCString()};path=/`;
    
    // update the URL
    const newPath = pathname.replace(/^\/(en|es)/, `/${newLocale}`);
    router.replace(newPath);

  }, [pathname, router]);

  const t = useCallback((key: string, replacements?: Record<string, string | number>) => {
    const translation = getNestedValue(translations, key);
    
    if (!translation) {
      // Don't warn on first render when translations might not be loaded yet
      if (Object.keys(translations).length > 0) {
        console.warn(`Translation not found for key: ${key}`);
      }
      return key;
    }
    
    if (replacements) {
        return Object.entries(replacements).reduce((acc, [k, v]) => {
            return acc.replace(`{{${k}}}`, String(v));
        }, translation);
    }

    return translation;
  }, [translations]);

  const contextValue = {
    locale,
    setLocale,
    t,
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
}
