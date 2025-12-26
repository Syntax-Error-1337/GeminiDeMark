'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/auth-provider';
import { useI18n } from '@/components/providers/i18n-provider';
import { useTheme } from 'next-themes';
import { type Locale } from '@/lib/i18n';
import { Button } from '@/components/ui/button';

export function Header() {
    const { isLoggedIn, logout } = useAuth();
    const { locale, switchLocale } = useI18n();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

    const languages: { code: Locale; label: string }[] = [
        { code: 'en-US', label: 'English' },
        { code: 'zh-CN', label: '中文' },
        { code: 'ru-RU', label: 'Русский' },
        { code: 'ar-SA', label: 'العربية' },
        { code: 'hi-IN', label: 'हिन्दी' },
    ];

    const currentLangLabel = languages.find(l => l.code === locale)?.label || 'English';
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => setMounted(true), []);

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
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all"
                                >
                                    <span className="material-icons-round text-lg">dashboard</span>
                                    Dashboard
                                </Link>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all"
                                >
                                    <span className="material-icons-round text-lg">logout</span>
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => { /* Should trigger login modal */ }}
                            >
                                <span className="material-icons-round text-sm mr-1">login</span>
                                Sign In
                            </Button>
                        )}

                        <div className="h-6 w-px bg-border mx-1"></div>

                        {/* Theme Toggle */}
                        {mounted && (
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                                aria-label="Toggle theme"
                            >
                                <span className="material-icons-round text-xl">
                                    {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                                </span>
                            </button>
                        )}

                        {/* Language Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                                onBlur={() => setTimeout(() => setIsLangMenuOpen(false), 200)}
                                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-muted-foreground bg-secondary hover:bg-secondary/80 border border-border rounded-lg transition-all"
                                aria-label="Select language"
                                aria-expanded={isLangMenuOpen}
                            >
                                <span className="material-icons-round text-sm">translate</span>
                                <span>{currentLangLabel}</span>
                                <span className="material-icons-round text-sm">expand_more</span>
                            </button>

                            {/* Dropdown */}
                            {isLangMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 w-36 bg-popover border border-border rounded-lg shadow-xl overflow-hidden z-50">
                                    {languages.map(lang => (
                                        <button
                                            key={lang.code}
                                            onClick={() => switchLocale(lang.code)}
                                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-popover-foreground hover:bg-secondary transition-colors"
                                        >
                                            {lang.label}
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
                                aria-label="Toggle theme"
                            >
                                <span className="material-icons-round text-xl">
                                    {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                                </span>
                            </button>
                        )}

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                            aria-label="Toggle menu"
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
                    {isLoggedIn ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="flex items-center px-3 py-3 rounded-lg text-base font-medium text-foreground hover:bg-secondary"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className="material-icons-round mr-3">dashboard</span>
                                Dashboard
                            </Link>
                            <button
                                onClick={() => {
                                    logout();
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full flex items-center px-3 py-3 rounded-lg text-base font-medium text-foreground hover:bg-secondary"
                            >
                                <span className="material-icons-round mr-3">logout</span>
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <Button
                            className="w-full justify-start"
                            variant="ghost"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="material-icons-round mr-3">login</span>
                            Sign In
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
