
"use client";

import { createContext, useState, useEffect, useCallback, type ReactNode, useMemo } from "react";
import type { Locale, I18nContextType, Translations } from "@/lib/types";
import { usePathname, useRouter } from 'next/navigation';

export const I18nContext = createContext<I18nContextType | null>(null);

function getNestedValue(obj: any, path: string): string | undefined {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export function I18nProvider({ children, locale: initialLocale }: { children: ReactNode, locale: Locale }) {
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [currentLocale, setCurrentLocale] = useState(initialLocale);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const loadTranslations = async (loc: Locale) => {
      if (!loc) return;
      try {
        const response = await fetch(`/locales/${loc}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load translations for ${loc}`);
        }
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error(error);
        setTranslations({}); // Fallback to empty object
      }
    };
    
    loadTranslations(currentLocale);
  }, [currentLocale]);

  const setLocale = useCallback((newLocale: Locale) => {
    const date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${date.toUTCString()};path=/`;
    
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    setCurrentLocale(newLocale);
    router.replace(newPath);
  }, [pathname, router, currentLocale]);

  const t = useCallback((key: string, replacements?: Record<string, string | number>) => {
    if (!translations) {
      return key; // Return key while loading
    }
    
    let translation = getNestedValue(translations, key);
    
    if (translation === undefined) {
      console.warn(`Translation not found for key: ${key} in locale: ${currentLocale}`);
      return key; // Fallback to key if not found
    }
    
    if (replacements) {
        return Object.entries(replacements).reduce((acc, [k, v]) => {
            return acc.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
        }, translation);
    }

    return translation;
  }, [translations, currentLocale]);

  const contextValue = useMemo(() => ({
    locale: currentLocale,
    setLocale,
    t,
  }), [currentLocale, setLocale, t]);

  // Render children only when translations have been loaded
  return (
    <I18nContext.Provider value={contextValue}>
      {translations ? children : null}
    </I18nContext.Provider>
  );
}
