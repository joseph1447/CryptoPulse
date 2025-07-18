"use client";

import { createContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Locale, I18nContextType, Translations } from "@/lib/types";

export const I18nContext = createContext<I18nContextType | null>(null);

function getNestedValue(obj: any, path: string): string | undefined {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [translations, setTranslations] = useState<Translations>({});

  useEffect(() => {
    const storedLocale = localStorage.getItem("locale") as Locale | null;
    if (storedLocale && ['en', 'es'].includes(storedLocale)) {
      setLocaleState(storedLocale);
    }
  }, []);

  useEffect(() => {
    async function loadTranslations() {
      try {
        const response = await fetch(`/locales/${locale}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load ${locale}.json`);
        }
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error("Failed to load translations:", error);
        // Fallback to English if translations fail to load
        if(locale !== 'en') {
            setLocale('en');
        }
      }
    }
    loadTranslations();
  }, [locale]);
  
  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
    // Force a re-render by updating the document's lang attribute
    document.documentElement.lang = newLocale;
  }, []);

  const t = useCallback((key: string, replacements?: Record<string, string | number>) => {
    const translation = getNestedValue(translations, key);
    
    if (!translation) {
      console.warn(`Translation not found for key: ${key}`);
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
