'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/auth-provider';
import { useI18n } from '@/components/providers/i18n-provider';
import { useTheme } from 'next-themes';
import { type Locale } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { DashboardService, type DashboardStats } from '@/lib/dashboard-service';

export function Header() {
    const { isLoggedIn, logout } = useAuth();
    const { locale, switchLocale, t } = useI18n();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const [stats, setStats] = useState<DashboardStats | null>(null);

    const languages: { code: Locale; label: string; flag: string }[] = [
        { code: 'en-US', label: 'English', flag: '🇺🇸' },
        { code: 'zh-CN', label: '中文', flag: '🇨🇳' },
        { code: 'ru-RU', label: 'Русский', flag: '🇷🇺' },
        { code: 'ar-SA', label: 'العربية', flag: '🇸🇦' },
        { code: 'hi-IN', label: 'हिन्दी', flag: '🇮🇳' },
    ];

    const currentLang = languages.find(l => l.code === locale) || languages[0];
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => setMounted(true), []);

    // Fetch usage stats when logged in
    useEffect(() => {
        if (isLoggedIn) {
            DashboardService.fetchStats().then(setStats).catch(console.error);
        }
    }, [isLoggedIn]);

    const usagePercentage = stats ? Math.min(100, Math.round((stats.monthlyUsage / stats.monthlyLimit) * 100)) : 0;

    return (
        <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="group flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                                <span className="text-primary-foreground text-lg font-bold">G</span>
                            </div>
                            <span className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                                GeminiDeMark
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-4">
                        {isLoggedIn ? (
                            <>
                                {/* Monthly Usage Stats */}
                                {stats && (
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium bg-secondary/50 hover:bg-secondary border border-border rounded-lg transition-all group"
                                    >
                                        <span className="material-icons-round text-sm text-primary">pie_chart</span>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                                                {t('dashboard.usage.title') || 'Usage'}
                                            </span>
                                            <span className="text-xs font-bold text-foreground">
                                                {stats.monthlyUsage}/{stats.monthlyLimit}
                                            </span>
                                        </div>
                                        <div className="w-12 h-1.5 bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all ${usagePercentage >= 100 ? 'bg-destructive' :
                                                        usagePercentage > 75 ? 'bg-warning' :
                                                            'bg-primary'
                                                    }`}
                                                style={{ width: `${usagePercentage}%` }}
                                            />
                                        </div>
                                    </Link>
                                )}

                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all"
                                >
                                    <span className="material-icons-round text-lg">dashboard</span>
                                    {t('header.dashboard') || 'Dashboard'}
                                </Link>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all"
                                >
                                    <span className="material-icons-round text-lg">logout</span>
                                    {t('btn.signout') || 'Sign Out'}
                                </button>
                            </>
                        ) : (
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => { /* Should trigger login modal */ }}
                            >
                                <span className="material-icons-round text-sm mr-1">login</span>
                                {t('btn.signin') || 'Sign In'}
                            </Button>
                        )}

                        <div className="h-6 w-px bg-border mx-1"></div>

                        {/* Theme Toggle */}
                        {mounted && (
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                                aria-label={t('header.theme') || 'Toggle theme'}
                            >
                                <span className="material-icons-round text-xl">
                                    {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                                </span>
                            </button>
                        )}

                        {/* Language Selector with Flags */}
                        <div className="relative">
                            <button
                                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                                onBlur={() => setTimeout(() => setIsLangMenuOpen(false), 200)}
                                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-muted-foreground bg-secondary hover:bg-secondary/80 border border-border rounded-lg transition-all"
                                aria-label={t('header.language') || 'Select language'}
                                aria-expanded={isLangMenuOpen}
                            >
                                <span className="text-base">{currentLang.flag}</span>
                                <span>{currentLang.label}</span>
                                <span className="material-icons-round text-sm">expand_more</span>
                            </button>

                            {/* Dropdown */}
                            {isLangMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 w-40 bg-popover border border-border rounded-lg shadow-xl overflow-hidden z-50">
                                    {languages.map(lang => (
                                        <button
                                            key={lang.code}
                                            onClick={() => switchLocale(lang.code)}
                                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-popover-foreground hover:bg-secondary transition-colors flex items-center gap-2"
                                        >
                                            <span className="text-base">{lang.flag}</span>
                                            <span>{lang.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        {/* Theme Toggle Mobile */}
                        {mounted && (
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                aria-label={t('header.theme') || 'Toggle theme'}
                            >
                                <span className="material-icons-round text-xl">
                                    {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                                </span>
                            </button>
                        )}

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                            aria-label={t('header.menu') || 'Toggle menu'}
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span className="material-icons-round text-2xl">menu</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={cn(
                    "md:hidden bg-background/95 backdrop-blur-xl border-t border-border overflow-hidden transition-all duration-300",
                    isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                )}
            >
                <div className="px-4 pt-2 pb-6 space-y-1">
                    {/* Monthly Usage Stats Mobile */}
                    {isLoggedIn && stats && (
                        <Link
                            href="/dashboard"
                            className="flex items-center justify-between px-3 py-3 rounded-lg bg-secondary/50 border border-border mb-3"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-icons-round text-primary">pie_chart</span>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                                        {t('dashboard.usage.title') || 'Monthly Usage'}
                                    </p>
                                    <p className="text-sm font-bold text-foreground">
                                        {stats.monthlyUsage}/{stats.monthlyLimit}
                                    </p>
                                </div>
                            </div>
                            <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all ${usagePercentage >= 100 ? 'bg-destructive' :
                                            usagePercentage > 75 ? 'bg-warning' :
                                                'bg-primary'
                                        }`}
                                    style={{ width: `${usagePercentage}%` }}
                                />
                            </div>
                        </Link>
                    )}

                    {isLoggedIn ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="flex items-center px-3 py-3 rounded-lg text-base font-medium text-foreground hover:bg-secondary"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className="material-icons-round mr-3">dashboard</span>
                                {t('header.dashboard') || 'Dashboard'}
                            </Link>
                            <button
                                onClick={() => {
                                    logout();
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full flex items-center px-3 py-3 rounded-lg text-base font-medium text-foreground hover:bg-secondary"
                            >
                                <span className="material-icons-round mr-3">logout</span>
                                {t('btn.signout') || 'Sign Out'}
                            </button>
                        </>
                    ) : (
                        <Button
                            className="w-full justify-start"
                            variant="ghost"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="material-icons-round mr-3">login</span>
                            {t('btn.signin') || 'Sign In'}
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}

function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}
