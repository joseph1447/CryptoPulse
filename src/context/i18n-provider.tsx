
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
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const loadTranslations = useCallback(async (loc: Locale) => {
    if (!loc) return;
    try {
      // Use a unique query parameter to prevent caching issues
      const response = await fetch(`/locales/${loc}.json?v=${new Date().getTime()}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${loc}.json`);
      }
      const data = await response.json();
      setTranslations(data);
      setIsLoaded(true);
    } catch (error) {
      console.error("Failed to load translations:", error);
      if(loc !== 'en') {
          // Fallback to English if the desired locale fails
          setLocale('en'); 
      }
    }
  }, []);

  useEffect(() => {
    loadTranslations(locale);
  }, [locale, loadTranslations]);
  
  const setLocale = useCallback((newLocale: Locale) => {
    // Set cookie for persistence
    const date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${date.toUTCString()};path=/`;
    
    // update the URL
    const newPath = pathname.replace(/^\/(en|es)/, `/${newLocale}`);
    router.replace(newPath);
    
    // We don't call loadTranslations here because the useEffect above will handle it when the page reloads/remounts due to the URL change.
    // However, we do update the state to reflect the change immediately.
    setLocaleState(newLocale);
    setIsLoaded(false);

  }, [pathname, router]);

  const t = useCallback((key: string, replacements?: Record<string, string | number>) => {
    if (!isLoaded) {
      return ""; // Return empty string or a loading indicator while translations are loading
    }
    
    const translation = getNestedValue(translations, key);
    
    if (!translation) {
      console.warn(`Translation not found for key: ${key}`);
      return key; // Fallback to key if not found
    }
    
    if (replacements) {
        return Object.entries(replacements).reduce((acc, [k, v]) => {
            return acc.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
        }, translation);
    }

    return translation;
  }, [translations, isLoaded]);

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
