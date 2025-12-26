'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { useI18n } from '@/components/providers/i18n-provider';
import { UploadArea } from '@/components/upload-area';
import { cn } from '@/lib/utils';

interface StartHeroProps {
    onFilesSelected: (files: File[]) => void;
}

export function StartHero({ onFilesSelected }: StartHeroProps) {
    const { t } = useI18n();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Steps Data
    const steps = [
        {
            id: 1,
            icon: 'upload_file',
            title: t('step.1') || 'Smart Upload',
            description: 'Drag & drop or paste',
            color: 'slate',
            className: isDark
                ? 'bg-gradient-to-br from-[#0f3443] to-[#345765] border-[#1f4b5d] shadow-lg shadow-[#0f3443]/20'
                : 'bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/50 border-indigo-100/80 shadow-lg shadow-indigo-100/50 hover:shadow-indigo-200/60 hover:border-indigo-200'
        },
        {
            id: 2,
            icon: 'auto_awesome',
            title: t('step.2') || 'AI Processing',
            description: 'Automatic detection',
            color: 'rose',
            className: isDark
                ? 'bg-gradient-to-br from-[#F6416C] to-[#ff5e83] border-[#ff7b9a] shadow-lg shadow-[#F6416C]/30'
                : 'bg-gradient-to-br from-rose-50/50 via-white to-pink-50/50 border-rose-100/80 shadow-lg shadow-rose-100/50 hover:shadow-rose-200/60 hover:border-rose-200'
        },
        {
            id: 3,
            icon: 'download_done',
            title: t('step.3') || 'Instant Download',
            description: 'Save original quality',
            color: 'emerald',
            className: isDark
                ? 'bg-gradient-to-br from-[#00b09b] to-[#96c93d] border-[#48c990] shadow-lg shadow-[#00b09b]/30'
                : 'bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50 border-emerald-100/80 shadow-lg shadow-emerald-100/50 hover:shadow-emerald-200/60 hover:border-emerald-200'
        }
    ];

    return (
        <section className="relative pt-16 pb-12 lg:pt-24 lg:pb-20 text-center px-4 overflow-hidden">
            <h2 className={cn(
                "hero-title font-extrabold mb-6 md:text-6xl text-4xl tracking-tight drop-shadow-2xl transition-colors duration-300",
                isDark ? "text-white" : "text-slate-900"
            )}>
                {t('main.title') || 'Gemini AI Watermark Removal'}
            </h2>
            <p className={cn(
                "hero-subtitle text-base md:text-lg max-w-2xl mx-auto mb-12 font-medium tracking-wide transition-colors duration-300",
                isDark ? "text-slate-400" : "text-slate-600"
            )}>
                {t('main.subtitle') || 'Based on reverse alpha blending algorithm, pure browser-side processing, Free, Fast, and Lossless'}
            </p>

            {/* Upload Area */}
            <UploadArea onFilesSelected={onFilesSelected} />

            {/* Steps Section */}
            <div className="max-w-6xl mx-auto px-4 mt-24 mb-16 md:mb-24 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    {/* Connector Line (Desktop) */}
                    <div className={cn(
                        "hidden md:block absolute top-1/2 left-0 w-full h-px -translate-y-1/2 -z-10",
                        isDark
                            ? "bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"
                            : "bg-gradient-to-r from-transparent via-slate-200/50 to-transparent"
                    )}></div>

                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className={cn(
                                "group relative p-8 rounded-[2rem] transition-all duration-500 hover:-translate-y-2",
                                isDark
                                    ? "bg-slate-900/40 border border-white/5 shadow-2xl shadow-black/40 hover:bg-slate-800/60 hover:border-white/10 hover:shadow-indigo-500/10 backdrop-blur-xl"
                                    : "bg-white/60 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:bg-white/80 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] backdrop-blur-xl"
                            )}
                        >
                            {/* Specular Highlight */}
                            <div className={cn(
                                "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700",
                                !isDark && "via-black/5"
                            )}></div>

                            <div className={cn(
                                "w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl mb-6 transition-all duration-500 group-hover:scale-110",
                                isDark
                                    ? `bg-gradient-to-br from-${step.color}-500/10 to-${step.color}-600/5 border border-${step.color}-500/10 shadow-[inner_0_0_15px_rgba(0,0,0,0.2)]`
                                    : `bg-gradient-to-br from-white to-${step.color}-50 border border-white shadow-[0_4px_20px_rgb(0,0,0,0.03)]`
                            )}>
                                <span className={cn(
                                    "text-lg",
                                    isDark ? `text-${step.color}-400` : `text-${step.color}-600`
                                )}>{step.id}</span>
                            </div>

                            <div className="flex flex-col text-left relative z-10">
                                <span className={cn(
                                    "material-icons-round text-3xl mb-3 transition-colors duration-300",
                                    isDark ? `text-${step.color}-400` : `text-${step.color}-600`
                                )}>
                                    {step.icon}
                                </span>
                                <span className={cn(
                                    "font-bold text-xl mb-2 tracking-tight",
                                    isDark ? "text-white" : "text-slate-900"
                                )}>{step.title}</span>
                                <span className={cn(
                                    "text-sm font-medium",
                                    isDark ? "text-slate-400" : "text-slate-500"
                                )}>{step.description}</span>
                            </div>

                            {/* Bottom Glow */}
                            <div className={cn(
                                "absolute bottom-0 right-0 w-24 h-24 rounded-full blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none",
                                `bg-${step.color}-500`
                            )}></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
