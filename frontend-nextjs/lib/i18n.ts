
export type Locale = 'en-US' | 'zh-CN' | 'ru-RU' | 'ar-SA' | 'hi-IN';

export const I18nService = {
    async loadTranslations(locale: Locale): Promise<Record<string, string>> {
        try {
            const res = await fetch(`/i18n/${locale}.json?_=${Date.now()}`);
            if (!res.ok) throw new Error('Failed to load translations');
            return await res.json();
        } catch (e) {
            console.error(e);
            return {};
        }
    },

    getInitialLocale(): Locale {
        if (typeof window === 'undefined') return 'en-US';
        const saved = localStorage.getItem('locale') as Locale;
        if (saved) return saved;
        return navigator.language.startsWith('zh') ? 'zh-CN' : 'en-US';
    }
};
