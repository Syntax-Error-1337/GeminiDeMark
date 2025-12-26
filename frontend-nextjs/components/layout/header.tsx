'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/auth-provider';
import { useI18n } from '@/components/providers/i18n-provider';
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

    return (
        <header className="fixed top-0 inset-x-0 z-50 bg-[#050914]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <Link href="/" className="group flex items-center gap-3">
                            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-white tracking-tight group-hover:text-indigo-200 transition-colors">GeminiDeMark</span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        {isLoggedIn ? (
                            <>
                                <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all">
                                    <span className="material-icons-round text-lg">dashboard</span>
                                    Dashboard
                                </Link>
                                <button onClick={logout} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all">
                                    <span className="material-icons-round text-lg">logout</span>
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <Button
                                variant="gradient"
                                className="shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 rounded-full"
                                onClick={() => { /* Should trigger login modal */ }}
                            >
                                <span className="material-icons-round text-lg mr-2">login</span>
                                Sign In
                            </Button>
                        )}

                        <div className="h-6 w-px bg-white/10 mx-1"></div>

                        <div className="relative">
                            <button
                                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                                onBlur={() => setTimeout(() => setIsLangMenuOpen(false), 200)}
                                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white border border-white/5 rounded-full transition-all"
                            >
                                <span className="material-icons-round text-sm opacity-70">translate</span>
                                <span>{currentLangLabel}</span>
                                <span className="material-icons-round text-sm opacity-50 ml-0.5">expand_more</span>
                            </button>

                            {/* Dropdown */}
                            {isLangMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 w-32 bg-[#0b1120] border border-white/10 rounded-xl shadow-xl overflow-hidden transition-all origin-top-right z-50">
                                    {languages.map(lang => (
                                        <button
                                            key={lang.code}
                                            onClick={() => switchLocale(lang.code)}
                                            className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                                        >
                                            {lang.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 focus:outline-none transition-colors"
                        >
                            <span className="material-icons-round text-2xl">menu</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden bg-[#050914]/95 backdrop-blur-xl border-t border-white/5 overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-4 pt-2 pb-6 space-y-1 shadow-lg">
                    {isLoggedIn ? (
                        <>
                            <Link href="/" className="flex items-center px-3 py-3 rounded-lg text-base font-medium text-white bg-white/5">
                                <span className="material-icons-round mr-3">home</span>
                                Home
                            </Link>
                            <button onClick={logout} className="w-full flex items-center px-3 py-3 rounded-lg text-base font-medium text-red-400 hover:bg-white/5 hover:text-red-300">
                                <span className="material-icons-round mr-3">logout</span>
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <Button className="w-full flex items-center px-3 py-3 rounded-lg text-base font-medium text-white hover:bg-white/5 justify-start" variant="ghost">
                            <span className="material-icons-round mr-3">login</span>
                            Sign In
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
