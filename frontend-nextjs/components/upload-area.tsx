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
        <div className="max-w-4xl mx-auto">
            <div
                className={cn(
                    "relative group rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden",
                    "bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl",
                    isDragOver
                        ? "border-primary bg-primary/5 scale-[1.02]"
                        : "border-border hover:border-primary/50"
                )}
            >
                <div
                    onClick={handleClick}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className="flex flex-col items-center justify-center w-full h-[320px] md:h-[400px] cursor-pointer p-8"
                >
                    {/* Upload Icon */}
                    <div className={cn(
                        "w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-300",
                        "bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110",
                        isDragOver && "scale-110 bg-primary/20"
                    )}>
                        <span className="material-icons-round text-5xl text-primary">
                            cloud_upload
                        </span>
                    </div>

                    {/* Text Content */}
                    <div className="space-y-4 text-center">
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                            {t('upload.text') || 'Drop your images here'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            or click to browse from your device
                        </p>

                        {/* Supported Formats */}
                        <div className="flex items-center justify-center gap-2 pt-2">
                            {['JPG', 'PNG', 'WebP'].map(ext => (
                                <span
                                    key={ext}
                                    className="px-3 py-1 bg-secondary/80 rounded-md text-xs font-medium text-muted-foreground border border-border"
                                >
                                    {ext}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Hidden File Input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        className="hidden"
                        onChange={handleFileInput}
                        aria-label="Upload images"
                    />
                </div>
            </div>

            {/* Upload Info */}
            <p className="text-xs text-muted-foreground text-center mt-4">
                Maximum file size: 20MB • All processing happens locally in your browser
            </p>
        </div>
    );
}
