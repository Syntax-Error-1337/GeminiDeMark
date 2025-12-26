'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface AuroraBackgroundProps {
    className?: string;
}

export function AuroraBackground({ className }: AuroraBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        let animationFrameId: number;

        // Configuration depends on theme
        const isDark = theme === 'dark';

        const config = {
            orbCount: 5,
            minRadius: 300,
            maxRadius: 600,
            speed: 0.5,
            colors: isDark ? [
                [15, 23, 42],    // Slate 900
                [17, 94, 89],    // Teal 800
                [159, 18, 57],   // Rose 800
                [49, 46, 129],   // Indigo 900
                [6, 78, 59]      // Emerald 900
            ] : [
                [248, 250, 252], // Slate 50
                [204, 251, 241], // Teal 100
                [254, 226, 226], // Red 100
                [224, 231, 255], // Indigo 100
                [209, 250, 229]  // Emerald 100
            ],
            background: isDark ? '#0f172a' : '#f8fafc' // Slate 900 vs Slate 50
        };

        let orbs: any[] = [];

        const init = () => {
            orbs = [];
            for (let i = 0; i < config.orbCount; i++) {
                orbs.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: config.minRadius + Math.random() * (config.maxRadius - config.minRadius),
                    vx: (Math.random() - 0.5) * config.speed,
                    vy: (Math.random() - 0.5) * config.speed,
                    color: config.colors[i % config.colors.length]
                });
            }
        };

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        const animate = () => {
            ctx.fillStyle = config.background;
            ctx.fillRect(0, 0, width, height);

            orbs.forEach(orb => {
                orb.x += orb.vx;
                orb.y += orb.vy;

                if (orb.x < -orb.radius || orb.x > width + orb.radius) orb.vx *= -1;
                if (orb.y < -orb.radius || orb.y > height + orb.radius) orb.vy *= -1;

                const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
                const [r, g, b] = orb.color;
                gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.5)`);
                gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

                ctx.globalCompositeOperation = 'screen'; // 'screen' works well for dark mode. For light, maybe 'multiply' or 'overlay'?
                // For simplicity, let's keep 'screen' for dark, and maybe 'multiply' for light?
                // Actually 'screen' lightens. 'multiply' darkens.
                if (!isDark) {
                    ctx.globalCompositeOperation = 'multiply';
                }

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.globalCompositeOperation = 'source-over';
            animationFrameId = requestAnimationFrame(animate);
        };

        resize();
        init();
        animate();

        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme]); // Re-run effect when theme changes

    return (
        <canvas
            ref={canvasRef}
            className={cn("fixed inset-0 w-full h-full -z-20 pointer-events-none", className)}
        />
    );
}
