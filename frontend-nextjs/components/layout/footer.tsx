'use client';

import React from 'react';
import { useI18n } from '@/components/providers/i18n-provider';
import Link from 'next/link';

export function Footer() {
    const { t } = useI18n();

    return (
        <footer className="bg-card border-t border-border pt-12 pb-8 text-muted-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <Link href="/" className="flex items-center gap-3 group w-fit">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                                <span className="text-primary-foreground text-lg font-bold">G</span>
                            </div>
                            <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                GeminiDeMark
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed max-w-md text-muted-foreground">
                            {t('footer.desc') || 'Fast, private, and lossless watermark removal for Gemini AI images. All processing happens locally in your browser.'}
                        </p>
                    </div>

                    {/* Links Column */}
                    <div>
                        <h6 className="font-bold mb-4 text-foreground text-sm uppercase tracking-wider">
                            {t('footer.links') || 'Links'}
                        </h6>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/" className="hover:text-foreground transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources Column */}
                    <div>
                        <h6 className="font-bold mb-4 text-foreground text-sm uppercase tracking-wider">
                            {t('footer.resources') || 'Resources'}
                        </h6>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a href="#" className="hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
                                    GitHub
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
                                    Documentation
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border pt-8 text-xs">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                        <div className="flex items-center gap-1.5">
                            <span>{t('footer.madeby') || 'Made with'}</span>
                            <span className="text-red-500">♥</span>
                            <span>by</span>
                            <span className="text-foreground font-semibold">Himanshu Tiwari</span>
                            <a
                                href="https://himanshu.pro"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-4 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-1"
                            >
                                <span>Portfolio</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
                            </a>
                        </div>

                        <div className="flex items-center gap-6">
                            <Link href="/privacy" className="hover:text-foreground transition-colors">
                                {t('footer.privacy') || 'Privacy'}
                            </Link>
                            <Link href="/terms" className="hover:text-foreground transition-colors">
                                {t('footer.terms') || 'Terms'}
                            </Link>
                        </div>
                    </div>

                    <p className="text-center md:text-left leading-relaxed opacity-60 text-[10px] uppercase tracking-wide">
                        {t('footer.disclaimer') || 'Disclaimer: This tool is for educational purposes only. The author is not responsible for any illegal use or misuse of this software. Users are solely responsible for their actions.'}
                    </p>
                </div>
            </div>
        </footer>
    );
}
