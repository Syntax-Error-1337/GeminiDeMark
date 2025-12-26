'use client';

import React, { useEffect, useRef } from 'react';
import mediumZoom from 'medium-zoom';
import { cn } from '@/lib/utils';
import { useI18n } from '@/components/providers/i18n-provider';
import { Button } from './ui/button';
import { WatermarkInfo } from '@/lib/watermark-engine';
import { Card } from './ui/card';

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

    const isError = originalStatus?.includes('Not an original');

    return (
        <section className="relative bg-background/50 backdrop-blur-sm border-t border-border py-12 min-h-screen">
            <div className="max-w-[90rem] mx-auto px-4">
                <div className="flex flex-col xl:flex-row gap-8 items-start">
                    {/* Images Grid */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Original Image */}
                        <Card variant="glass" className="flex flex-col overflow-hidden">
                            {/* Header */}
                            <div className="bg-secondary/50 px-5 py-3 border-b border-border">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                        Original Image
                                    </h3>
                                    {watermarkInfo && (
                                        <span className="text-xs text-muted-foreground font-mono bg-secondary px-2 py-1 rounded border border-border">
                                            {width}×{height} • WM: {watermarkInfo.size}px
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Image Container */}
                            <div className="relative w-full aspect-[4/3] bg-secondary/30 flex items-center justify-center p-4">
                                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={originalUrl}
                                    alt="Original"
                                    className="relative z-10 max-w-full max-h-full object-contain rounded-lg shadow-lg hover:scale-[1.02] transition-transform cursor-zoom-in"
                                    data-zoomable
                                />
                                {isError && (
                                    <div className="absolute inset-0 z-20 bg-background/90 backdrop-blur-sm flex items-center justify-center">
                                        <div className="bg-destructive/10 border border-destructive/20 px-6 py-4 rounded-xl flex flex-col items-center gap-2">
                                            <span className="material-icons-round text-destructive text-3xl">error_outline</span>
                                            <p className="text-destructive font-medium text-sm">Not a Gemini image</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Processed Image */}
                        <Card
                            variant="glass"
                            className={cn(
                                "flex flex-col overflow-hidden transition-all",
                                processedUrl ? "border-success/30" : "opacity-60"
                            )}
                        >
                            {/* Header */}
                            <div className={cn(
                                "px-5 py-3 border-b",
                                processedUrl
                                    ? "bg-success/10 border-success/20"
                                    : "bg-secondary/50 border-border"
                            )}>
                                <div className="flex items-center justify-between">
                                    <h3 className={cn(
                                        "font-semibold text-sm flex items-center gap-2",
                                        processedUrl ? "text-success" : "text-muted-foreground"
                                    )}>
                                        <span className={cn(
                                            "w-2 h-2 rounded-full",
                                            processedUrl ? "bg-success" : "bg-muted-foreground"
                                        )}></span>
                                        Restored Image
                                    </h3>
                                    {processedUrl && (
                                        <span className="text-xs text-success font-mono bg-success/10 px-2 py-1 rounded border border-success/20">
                                            ✓ Watermark Removed
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Image Container */}
                            <div className="relative w-full aspect-[4/3] bg-secondary/30 flex items-center justify-center p-4">
                                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                                {processedUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={processedUrl}
                                        alt="Processed"
                                        className="relative z-10 max-w-full max-h-full object-contain rounded-lg shadow-lg hover:scale-[1.02] transition-transform cursor-zoom-in"
                                        data-zoomable
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                                            <span className="material-icons-round text-xl text-primary">auto_awesome</span>
                                        </div>
                                        <p className="text-sm font-medium">Processing...</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Control Panel */}
                    <div className="w-full xl:w-80 flex-shrink-0">
                        <Card variant="glass" className="p-6 sticky top-24">
                            <h4 className="text-sm font-bold text-foreground mb-6 flex items-center gap-2 uppercase tracking-wider">
                                <span className="material-icons-round text-primary text-lg">tune</span>
                                Actions
                            </h4>

                            <div className="space-y-3">
                                <Button
                                    variant="default"
                                    size="lg"
                                    className="w-full"
                                    onClick={onDownload}
                                    disabled={!processedUrl || isError}
                                >
                                    <span className="material-icons-round mr-2 text-lg">download</span>
                                    {t('btn.download') || 'Download'}
                                </Button>

                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full"
                                    onClick={onReset}
                                >
                                    <span className="material-icons-round mr-2 text-lg">refresh</span>
                                    {t('btn.reset') || 'Process Another'}
                                </Button>
                            </div>

                            {/* Status */}
                            <div className="mt-6 pt-6 border-t border-border">
                                {isError ? (
                                    <div className="text-xs font-medium text-destructive bg-destructive/5 py-2 px-3 rounded-lg border border-destructive/10 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse"></span>
                                        Not a Gemini Image
                                    </div>
                                ) : processedUrl ? (
                                    <div className="text-xs font-medium text-success bg-success/5 py-2 px-3 rounded-lg border border-success/10 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                                        Processing Complete
                                    </div>
                                ) : (
                                    <div className="text-xs font-medium text-primary bg-primary/5 py-2 px-3 rounded-lg border border-primary/10 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                        {originalStatus || 'Processing...'}
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}
