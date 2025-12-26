'use client';

import React, { useEffect, useRef } from 'react';
import mediumZoom from 'medium-zoom';
import { useI18n } from '@/components/providers/i18n-provider';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface ImageCardProps {
    id: number;
    name: string;
    imageUrl: string;
    status: 'pending' | 'processing' | 'completed' | 'error';
    statusMessage?: string;
    onDownload: () => void;
}

export function ImageCard({ id, name, imageUrl, status, statusMessage, onDownload }: ImageCardProps) {
    const { t } = useI18n();
    const zoomRef = useRef<any>(null);

    useEffect(() => {
        zoomRef.current = mediumZoom(`#result-${id}`, {
            margin: 24,
            scrollOffset: 0,
            background: 'rgba(15, 23, 42, 0.95)',
        });
        return () => {
            zoomRef.current?.detach();
        };
    }, [id]);

    return (
        <div id={`card-${id}`} className="bg-white md:h-[140px] rounded-xl shadow-card border border-gray-100 overflow-hidden">
            <div className="flex flex-wrap h-full">
                <div className="w-full md:w-auto h-full flex border-b border-gray-100">
                    <div className="w-24 md:w-48 flex-shrink-0 bg-gray-50 p-2 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            id={`result-${id}`}
                            src={imageUrl}
                            alt={name}
                            className="max-w-full max-h-24 md:max-h-full rounded"
                            data-zoomable
                        />
                    </div>
                    <div className="flex-1 p-4 flex flex-col min-w-0">
                        <h4 className="font-semibold text-sm text-gray-900 mb-2 truncate">{name}</h4>
                        <div className="text-xs text-gray-500" dangerouslySetInnerHTML={{ __html: statusMessage || t(`status.${status}`) || status }} />
                    </div>
                </div>
                <div className="w-full md:w-auto ml-auto flex-shrink-0 p-2 md:p-4 flex items-center justify-center">
                    {status === 'completed' && (
                        <Button
                            className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs md:text-sm"
                            onClick={onDownload}
                        >
                            {t('btn.download') || 'Download'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
