'use client';

import React from 'react';
import { useI18n } from '@/components/providers/i18n-provider';
import { UploadArea } from '@/components/upload-area';
import { Card } from '@/components/ui/card';

interface StartHeroProps {
    onFilesSelected: (files: File[]) => void;
}

export function StartHero({ onFilesSelected }: StartHeroProps) {
    const { t } = useI18n();

    const steps = [
        {
            id: 1,
            icon: 'upload_file',
            title: t('step.1') || 'Smart Upload',
            description: t('step.1.desc') || 'Drag & drop or paste your images',
        },
        {
            id: 2,
            icon: 'auto_awesome',
            title: t('step.2') || 'AI Processing',
            description: t('step.2.desc') || 'Automatic watermark detection',
        },
        {
            id: 3,
            icon: 'download_done',
            title: t('step.3') || 'Instant Download',
            description: t('step.3.desc') || 'Save in original quality',
        }
    ];

    return (
        <section className="relative pt-16 pb-12 lg:pt-24 lg:pb-20 text-center px-4 overflow-hidden">
            {/* Hero Title */}
            <div className="max-w-4xl mx-auto mb-12 space-y-4 animate-fade-in">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
                    {t('main.title') || 'Gemini AI Watermark Removal'}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-normal">
                    {t('main.subtitle') || 'Fast, private, and lossless. All processing happens in your browser.'}
                </p>
            </div>

            {/* Upload Area */}
            <div className="animate-slide-up">
                <UploadArea onFilesSelected={onFilesSelected} />
            </div>

            {/* Steps Section */}
            <div className="max-w-6xl mx-auto px-4 mt-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {steps.map((step) => (
                        <Card key={step.id} variant="glass" className="p-6 hover:-translate-y-1">
                            {/* Icon */}
                            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                                <span className="material-icons-round text-2xl text-primary">
                                    {step.icon}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-xs font-bold text-primary bg-primary/10 w-6 h-6 rounded-full flex items-center justify-center">
                                        {step.id}
                                    </span>
                                    <h3 className="text-lg font-bold text-foreground">
                                        {step.title}
                                    </h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {step.description}
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
