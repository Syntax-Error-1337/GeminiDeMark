'use client';

import React from 'react';
import { useI18n } from '@/components/providers/i18n-provider';
import { UploadArea } from '@/components/upload-area';
import { cn } from '@/lib/utils';

interface StartHeroProps {
    onFilesSelected: (files: File[]) => void;
}

export function StartHero({ onFilesSelected }: StartHeroProps) {
    const { t } = useI18n();

    // Steps Data
    const steps = [
        {
            id: 1,
            icon: 'upload_file',
            title: t('step.1') || 'Smart Upload',
            description: 'Drag & drop or paste',
            color: 'slate',
            className: 'bg-gradient-to-br from-[#0f3443] to-[#345765] border-[#1f4b5d] shadow-lg shadow-[#0f3443]/20'
        },
        {
            id: 2,
            icon: 'auto_awesome',
            title: t('step.2') || 'AI Processing',
            description: 'Automatic detection',
            color: 'rose',
            className: 'bg-gradient-to-br from-[#F6416C] to-[#ff5e83] border-[#ff7b9a] shadow-lg shadow-[#F6416C]/30'
        },
        {
            id: 3,
            icon: 'download_done',
            title: t('step.3') || 'Instant Download',
            description: 'Save original quality',
            color: 'emerald',
            className: 'bg-gradient-to-br from-[#00b09b] to-[#96c93d] border-[#48c990] shadow-lg shadow-[#00b09b]/30'
        }
    ];

    return (
        <section className="relative pt-16 pb-12 lg:pt-24 lg:pb-20 text-center px-4 overflow-hidden">
            <h2 className="hero-title font-extrabold text-foreground mb-6 md:text-6xl text-4xl tracking-tight drop-shadow-2xl">
                {t('main.title') || 'Gemini AI Watermark Removal'}
            </h2>
            <p className="hero-subtitle text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-12 font-medium tracking-wide">
                {t('main.subtitle') || 'Based on reverse alpha blending algorithm, pure browser-side processing, Free, Fast, and Lossless'}
            </p>

            {/* Upload Area */}
            <UploadArea onFilesSelected={onFilesSelected} />

            {/* Steps Section */}
            <div className="max-w-6xl mx-auto px-4 mt-24 mb-16 md:mb-24 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-border -translate-y-1/2 -z-10 rounded-full"></div>

                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className={cn(
                                "group relative p-6 rounded-2xl border bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-300 flex items-center gap-5 z-10 hover:-translate-y-1",
                                step.className,
                                step.id === 2 ? "md:scale-110 md:shadow-2xl" : ""
                            )}
                        >
                            <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center font-bold text-lg text-foreground border border-border shadow-inner">
                                {step.id}
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="material-icons-round text-2xl text-foreground/90 mb-1 group-hover:scale-110 transition-transform origin-left">
                                    {step.icon}
                                </span>
                                <span className="font-bold text-foreground text-lg tracking-wide leading-tight">{step.title}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
