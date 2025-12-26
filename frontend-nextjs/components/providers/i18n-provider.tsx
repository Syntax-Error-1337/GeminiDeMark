'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { I18nService, type Locale } from '@/lib/i18n';

interface I18nContextType {
    locale: Locale;
    t: (key: string, params?: Record<string, string | number>) => string;
    switchLocale: (locale: Locale) => Promise<void>;
    isLoading: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocale] = useState<Locale>('en-US');
    const [translations, setTranslations] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const initialLocale = I18nService.getInitialLocale();
            await load(initialLocale);
            setIsLoading(false);
        };
        init();
    }, []);

    const load = async (newLocale: Locale) => {
        const trans = await I18nService.loadTranslations(newLocale);
        setTranslations(trans);
        setLocale(newLocale);
        localStorage.setItem('locale', newLocale);
        document.documentElement.lang = newLocale;
        document.documentElement.dir = ['ar-SA', 'he', 'fa'].includes(newLocale) ? 'rtl' : 'ltr';
    };

    const switchLocale = async (newLocale: Locale) => {
        setIsLoading(true);
        await load(newLocale);
        setIsLoading(false);
    };

    const t = (key: string, params?: Record<string, string | number>) => {
        let text = translations[key] || key;
        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                text = text.replace(new RegExp(`{${k}}`, 'g'), String(v));
            });
        }
        return text;
    };

    return (
        <I18nContext.Provider value={{ locale, t, switchLocale, isLoading }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
}
