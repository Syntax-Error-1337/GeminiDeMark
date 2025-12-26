'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface AuroraBackgroundProps {
    className?: string;
}

export function AuroraBackground({ className }: AuroraBackgroundProps) {
    return (
        <>
            {/* Static background color */}
            <div className="fixed inset-0 w-full h-full -z-30 bg-background pointer-events-none transition-colors duration-300"></div>

            {/* Subtle gradient mesh overlay */}
            <div className="fixed inset-0 w-full h-full -z-20 bg-gradient-mesh pointer-events-none opacity-60"></div>

            {/* Optional: Very subtle grid pattern */}
            <div className="fixed inset-0 w-full h-full -z-10 bg-grid-pattern pointer-events-none opacity-30 dark:opacity-20"></div>
        </>
    );
}
