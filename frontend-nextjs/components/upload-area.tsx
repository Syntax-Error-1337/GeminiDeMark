'use client';

import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/components/providers/i18n-provider';

interface UploadAreaProps {
    onFilesSelected: (files: File[]) => void;
}

export function UploadArea({ onFilesSelected }: UploadAreaProps) {
    const { t } = useI18n();
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(Array.from(e.target.files));
        }
    };

    const handleFiles = (files: File[]) => {
        const validFiles = files.filter(file => {
            if (!file.type.match('image/(jpeg|png|webp)')) return false;
            // 20MB limit
            if (file.size > 20 * 1024 * 1024) return false;
            return true;
        });

        if (validFiles.length > 0) {
            onFilesSelected(validFiles);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 via-purple-500 to-rose-500 rounded-3xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>

                <div className="relative bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 p-2 md:p-4 shadow-2xl overflow-hidden">
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                    <div
                        onClick={handleClick}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={cn(
                            "relative flex flex-col items-center justify-center w-full h-[300px] md:h-[400px] border-2 border-dashed rounded-xl transition-all cursor-pointer group-hover:shadow-[inset_0_0_60px_rgba(255,255,255,0.05)]",
                            isDragOver ? "border-white bg-white/10 scale-[1.02]" : "border-white/30 hover:border-white/60 hover:bg-white/5"
                        )}
                    >
                        <div className="flex flex-col items-center justify-center space-y-6 pointer-events-none z-10">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center shadow-lg border border-white/10 backdrop-blur-sm group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500 animate-float">
                                <span className="material-icons-round text-6xl text-white drop-shadow-lg">cloud_upload</span>
                            </div>
                            <div className="space-y-3 text-center">
                                <p className="text-2xl md:text-3xl font-bold text-white tracking-wide drop-shadow-md">
                                    {t('upload.text') || 'Drag & Drop Image Here'}
                                </p>
                                <div className="flex items-center justify-center gap-2">
                                    {['JPG', 'PNG', 'WebP'].map(ext => (
                                        <span key={ext} className="px-2 py-1 bg-white/10 rounded text-xs text-slate-200 border border-white/10">
                                            {ext}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            className="hidden"
                            onChange={handleFileInput}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
