'use client';

import React, { useEffect, useRef } from 'react';
import mediumZoom from 'medium-zoom';
import { cn } from '@/lib/utils';
import { useI18n } from '@/components/providers/i18n-provider';
import { Button } from './ui/button';
import { WatermarkInfo } from '@/lib/watermark-engine';

interface ImageComparisonProps {
    originalUrl: string;
    processedUrl: string | null;
    width: number;
    height: number;
    watermarkInfo: WatermarkInfo | null;
    originalStatus: string;
    onDownload: () => void;
    onReset: () => void;
}

export function ImageComparison({
    originalUrl,
    processedUrl,
    width,
    height,
    watermarkInfo,
    originalStatus,
    onDownload,
    onReset
}: ImageComparisonProps) {
    const { t } = useI18n();
    const zoomRef = useRef<any>(null);

    useEffect(() => {
        zoomRef.current = mediumZoom('[data-zoomable]', {
            margin: 24,
            scrollOffset: 0,
            background: 'rgba(15, 23, 42, 0.95)',
        });

        return () => {
            zoomRef.current?.detach();
        };
    }, [originalUrl, processedUrl]);

    return (
        <section id="singlePreview" className="relative bg-slate-900 border-t border-white/10 py-12">
            <div className="max-w-[90rem] mx-auto px-4">
                <div className="flex flex-col xl:flex-row gap-8">
                    {/* Images Grid */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-500">
                        {/* Original Image */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gray-900/50 rounded-2xl border border-white/10 backdrop-blur-sm shadow-2xl transition-all group-hover:border-white/20"></div>
                            <div className="relative rounded-2xl overflow-hidden">
                                <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex justify-between items-center">
                                    <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></span>
                                        <span>{t('preview.original') || 'Original'}</span>
                                    </h3>
                                    {watermarkInfo && (
                                        <span className="text-xs text-slate-400 font-mono bg-black/20 px-2 py-1 rounded">
                                            {t('info.size')}: {width}×{height} | WM: {watermarkInfo.size}px
                                        </span>
                                    )}
                                </div>
                                <div className="w-full aspect-[4/3] p-4 bg-[#0f172a] relative flex items-center justify-center">
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2Y5ZmRmZCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-30"></div>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={originalUrl}
                                        alt="Original"
                                        className="relative z-10 max-w-full max-h-full object-contain mx-auto rounded-lg shadow-lg block hover:scale-[1.02] transition-transform duration-300"
                                        data-zoomable
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Processed Results */}
                        {processedUrl && (
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gray-900/50 rounded-2xl border border-emerald-500/30 backdrop-blur-sm shadow-2xl transition-all group-hover:border-emerald-500/50 ring-1 ring-emerald-500/20"></div>
                                <div className="relative rounded-2xl overflow-hidden">
                                    <div className="bg-emerald-500/10 px-6 py-4 border-b border-emerald-500/20 flex justify-between items-center">
                                        <h3 className="font-semibold text-emerald-400 flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></span>
                                            <span>{t('preview.result') || 'Result'}</span>
                                        </h3>
                                        <span className="text-xs text-emerald-400 font-mono bg-emerald-900/20 px-2 py-1 rounded">
                                            {t('info.status')}: {t('info.removed') || 'Watermark Removed'}
                                        </span>
                                    </div>
                                    <div className="w-full aspect-[4/3] p-4 bg-[#0f172a] relative flex items-center justify-center">
                                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2Y5ZmRmZCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-30"></div>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={processedUrl}
                                            alt="Processed"
                                            className="relative z-10 max-w-full max-h-full object-contain mx-auto rounded-lg shadow-lg block hover:scale-[1.02] transition-transform duration-300"
                                            data-zoomable
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Control Panel */}
                    <div className="w-full xl:w-96 flex-shrink-0">
                        <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-6 sticky top-24">
                            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <span className="material-icons-round text-indigo-400">tune</span>
                                <span>{t('panel.title') || 'Control Panel'}</span>
                            </h4>

                            <div className="space-y-4">
                                {processedUrl && (
                                    <Button
                                        variant="gradient"
                                        size="lg"
                                        className="w-full group hover:-translate-y-1"
                                        onClick={onDownload}
                                    >
                                        <span className="material-icons-round mr-2 group-hover:animate-bounce">download</span>
                                        {t('btn.download') || 'Download Result'}
                                    </Button>
                                )}

                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full"
                                    onClick={onReset}
                                >
                                    <span className="material-icons-round mr-2">restart_alt</span>
                                    {t('btn.reset') || 'Reset / New Image'}
                                </Button>
                            </div>

                            <div className="mt-6 text-sm text-slate-400 min-h-[1.25rem] text-center font-medium">
                                {originalStatus && <p className="text-warn">{originalStatus}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
