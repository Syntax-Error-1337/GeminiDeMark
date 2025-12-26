'use client';

import React from 'react';
import { useI18n } from '@/components/providers/i18n-provider';

export function FeaturesSection() {
    const { t } = useI18n();

    const features = [
        {
            id: 'speed',
            icon: 'bolt',
            title: t('feature.speed.title') || 'Lightning Fast',
            desc: t('feature.speed.desc') || 'Proprietary optimizations ensure 10x faster processing than server-side alternatives.',
            color: 'indigo',
        },
        {
            id: 'privacy',
            icon: 'security',
            title: t('feature.privacy.title') || 'Privacy First',
            desc: t('feature.privacy.desc') || 'Your photos never leave your device. All AI processing happens locally in your browser.',
            color: 'pink',
        },
        {
            id: 'free',
            icon: 'savings',
            title: t('feature.free.title') || 'Completely Free',
            desc: t('feature.free.desc') || 'No subscriptions, no hidden fees, and no blurred results. Open source and free forever.',
            color: 'emerald',
        }
    ];

    return (
        <section className="relative py-24 border-t border-border bg-background/50 overflow-hidden">
            {/* Decorative Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-primary/5 blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <h3 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-primary to-emerald-500 mb-6 tracking-tight">
                        {t('feature.title') || 'Features'}
                    </h3>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                        {t('feature.subtitle') || 'Everything you need to process images perfectly'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <div
                            key={feature.id}
                            className="feature-card h-full group relative p-8 rounded-[2rem] bg-card border border-border backdrop-blur-md hover:bg-secondary/50 transition-colors duration-300 hover:-translate-y-2 hover:shadow-2xl"
                        >
                            <div className={`absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-border to-transparent group-hover:via-${feature.color}-500/50 transition-colors duration-500`}></div>

                            <div className={`w-18 h-18 rounded-2xl bg-gradient-to-br from-${feature.color}-500/10 to-purple-500/10 border border-${feature.color}-500/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:border-${feature.color}-500/20 transition-all duration-500 shadow-inner`}>
                                <span className={`material-icons-round text-4xl text-${feature.color}-500 group-hover:text-${feature.color}-400 transition-colors`}>{feature.icon}</span>
                            </div>

                            <h4 className={`text-2xl font-bold text-foreground mb-4 group-hover:text-${feature.color}-600 dark:group-hover:text-${feature.color}-200 transition-colors`}>
                                {feature.title}
                            </h4>
                            <p className="text-muted-foreground leading-relaxed font-light">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
