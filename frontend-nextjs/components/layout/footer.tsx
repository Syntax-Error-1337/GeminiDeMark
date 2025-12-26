'use client';

import React from 'react';
import { useI18n } from '@/components/providers/i18n-provider';
import Link from 'next/link';

export function Footer() {
    const { t } = useI18n();

    return (
        <footer className="bg-[#050914] border-t border-white/5 pt-16 pb-8 text-slate-400 font-light relative overflow-hidden">
            {/* Glow Effect */}
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-indigo-900/10 to-transparent pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center gap-3 group w-fit">
                            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight group-hover:text-indigo-200 transition-colors">GeminiDeMark</span>
                        </Link>
                        <p className="text-sm leading-relaxed max-w-sm text-slate-500">
                            {t('footer.desc') || 'GeminiDeMark. Engineered for precision and privacy.'}
                        </p>
                    </div>

                    {/* Social Links Column */}
                    <div className="col-span-1 md:col-span-2 flex flex-col md:items-end">
                        <div>
                            <h6 className="font-bold mb-6 text-white text-xs tracking-[0.2em] uppercase opacity-80">
                                {t('footer.social') || 'SOCIAL LINKS'}
                            </h6>
                            <ul className="space-y-4 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors duration-300 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:scale-150 transition-transform"></span>Twitter / X</a></li>
                                <li><a href="#" className="hover:text-white transition-colors duration-300 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:scale-150 transition-transform"></span>LinkedIn</a></li>
                                <li><a href="#" className="hover:text-white transition-colors duration-300 flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:scale-150 transition-transform"></span>GitHub</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-8 text-xs font-medium tracking-wide text-slate-500">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-4">
                        <div className="flex items-center gap-1.5">
                            <span>{t('footer.madeby') || 'Made with love by'}</span>
                            <span className="text-white font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-emerald-400">Himanshu Tiwari</span>
                        </div>

                        <div className="flex items-center gap-8">
                            <Link href="/privacy.html" className="hover:text-white transition-colors">{t('footer.privacy') || 'Privacy'}</Link>
                            <Link href="/terms.html" className="hover:text-white transition-colors">{t('footer.terms') || 'Terms'}</Link>
                        </div>
                    </div>

                    <p className="w-full opacity-60 leading-relaxed text-[10px] uppercase tracking-wider text-center md:text-left align-center">
                        {t('footer.disclaimer') || 'Disclaimer: This tool is for educational purposes only. The author is not responsible for any illegal use or misuse of this software. Users are solely responsible for their actions.'}
                    </p>
                </div>
            </div>
        </footer>
    );
}
