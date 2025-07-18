
"use client";

import { createContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Locale, I18nContextType, Translations } from "@/lib/types";
import { usePathname, useRouter } from 'next/navigation';

export const I18nContext = createContext<I18nContextType | null>(null);

function getNestedValue(obj: any, path: string): string | undefined {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export function I18nProvider({ children, params }: { children: ReactNode, params: { locale: Locale } }) {
  const [locale, setLocaleState] = useState<Locale>(params.locale);
  const [translations, setTranslations] = useState<Translations | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const setLocale = useCallback((newLocale: Locale) => {
    const date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${date.toUTCString()};path=/`;

    const newPath = pathname.replace(/^\/(en|es)/, `/${newLocale}`);
    router.replace(newPath);
  }, [pathname, router]);

  useEffect(() => {
    const loadTranslations = async (loc: Locale) => {
      try {
        const response = await fetch(`/locales/${loc}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load translations for ${loc}`);
        }
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error(error);
        if (loc !== 'en') {
          // If the desired locale fails, switch to English
          setLocale('en');
        } else {
          // If even English fails, set empty translations to avoid loops.
          setTranslations({});
        }
      }
    };
    
    // Only load translations if locale is defined
    if (params.locale) {
        loadTranslations(params.locale);
        setLocaleState(params.locale);
    }

  }, [params.locale, setLocale]);

  const t = useCallback((key: string, replacements?: Record<string, string | number>) => {
    if (!translations) {
      return ""; // Return empty string or a loading indicator
    }
    
    const translation = getNestedValue(translations, key);
    
    if (translation === undefined) {
      console.warn(`Translation not found for key: ${key} in locale: ${locale}`);
      return key; // Fallback to key if not found
    }
    
    if (replacements) {
        return Object.entries(replacements).reduce((acc, [k, v]) => {
            return acc.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
        }, translation);
    }

    return translation;
  }, [translations, locale]);

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
