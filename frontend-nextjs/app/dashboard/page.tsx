'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { useI18n } from '@/components/providers/i18n-provider';
import { DashboardService, type DashboardStats, type ConversionHistoryItem } from '@/lib/dashboard-service';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
    const { user, isLoggedIn, isLoading: authLoading } = useAuth();
    const { t } = useI18n();
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [history, setHistory] = useState<ConversionHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
    const [modalImages, setModalImages] = useState<{ original: string, processed: string } | null>(null);

    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            router.push('/');
        }
    }, [authLoading, isLoggedIn, router]);

    useEffect(() => {
        if (isLoggedIn) {
            Promise.all([
                DashboardService.fetchStats(),
                DashboardService.fetchHistory()
            ]).then(([statsData, historyData]) => {
                setStats(statsData);
                setHistory(historyData);
                setLoading(false);
            }).catch(err => {
                console.error(err);
                setLoading(false);
            });
        }
    }, [isLoggedIn]);

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const percentage = stats ? Math.min(100, Math.round((stats.monthlyUsage / stats.monthlyLimit) * 100)) : 0;

    const handleViewImage = async (id: number) => {
        setSelectedImageId(id);

        try {
            const [originalBlob, processedBlob] = await Promise.all([
                DashboardService.fetchImageBlob(id, 'original'),
                DashboardService.fetchImageBlob(id, 'processed')
            ]);

            setModalImages({
                original: originalBlob ? URL.createObjectURL(originalBlob) : '',
                processed: processedBlob ? URL.createObjectURL(processedBlob) : ''
            });
        } catch (error) {
            console.error("Failed to load images", error);
            setSelectedImageId(null);
        }
    };

    const closeModal = () => {
        setSelectedImageId(null);
        setModalImages(null);
    };

    if (authLoading || loading) {
        return (
            <div className="flex min-h-screen items-center justify-center pt-20">
                <div className="w-12 h-12 rounded-full border-4 border-border border-t-primary animate-spin"></div>
            </div>
        );
    }

    if (!user || !stats) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in min-h-screen pt-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
                        <span className="material-icons-round text-primary text-4xl">dashboard</span>
                        {t('dashboard.title') || 'Dashboard'}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {t('dashboard.subtitle') || 'Manage your subscription and view your activity'}
                    </p>
                </div>
                <Button variant="outline" onClick={() => router.push('/')}>
                    <span className="material-icons-round text-sm mr-2">arrow_back</span>
                    {t('dashboard.back') || 'Back to Home'}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Profile & Usage */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Profile Card */}
                    <Card variant="glass" className="p-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-4 shadow-lg">
                                <span className="text-3xl font-bold text-primary-foreground">
                                    {user.username.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-1">{user.username}</h3>
                            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                                <span className="material-icons-round text-base">email</span>
                                {user.email}
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wide">
                                <span className="material-icons-round text-xs">verified</span>
                                {user.role.toUpperCase()} {t('dashboard.plan') || 'PLAN'}
                            </div>
                        </div>
                    </Card>

                    {/* Usage Card */}
                    <Card variant="glass" className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-foreground font-semibold flex items-center gap-2">
                                <span className="material-icons-round text-primary">pie_chart</span>
                                {t('dashboard.usage.title') || 'Monthly Usage'}
                            </h4>
                        </div>

                        <div className="mb-3 flex items-end justify-between">
                            <span className="text-4xl font-bold text-foreground tracking-tight">{stats.monthlyUsage}</span>
                            <span className="text-sm text-muted-foreground mb-1.5">
                                / {stats.monthlyLimit} {t('dashboard.usage.unit') || 'credits'}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-3 bg-secondary rounded-full overflow-hidden mb-3 border border-border">
                            <div
                                className={cn(
                                    "h-full transition-all duration-500",
                                    percentage >= 100 ? "bg-destructive" :
                                        percentage > 75 ? "bg-warning" :
                                            "bg-primary"
                                )}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground text-right">
                            {percentage}% {t('dashboard.usage.used') || 'Used'}
                        </p>
                    </Card>

                    {/* Upgrade Call */}
                    <Card variant="glass" className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 text-center hover:scale-[1.02] transition-transform cursor-pointer">
                        <span className="material-icons-round text-4xl text-primary mb-4 block">diamond</span>
                        <h4 className="text-foreground font-bold text-lg mb-2">
                            {t('dashboard.upgrade.title') || 'Upgrade to Pro'}
                        </h4>
                        <p className="text-muted-foreground text-sm mb-6">
                            {t('dashboard.upgrade.desc') || 'Get unlimited access and faster processing speeds.'}
                        </p>
                        <Button className="w-full" variant="default">
                            {t('dashboard.upgrade.btn') || 'Upgrade Now'}
                        </Button>
                    </Card>
                </div>

                {/* Right Column: Recent Conversions */}
                <div className="lg:col-span-8">
                    <Card variant="glass" className="overflow-hidden h-full flex flex-col">
                        <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/30">
                            <h3 className="text-lg font-bold text-foreground flex items-center gap-3">
                                <span className="material-icons-round text-success">history</span>
                                {t('dashboard.history.title') || 'Recent Conversions'}
                            </h3>
                            <span className="text-xs font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full border border-border">
                                {history.length} {t('dashboard.history.records') || 'records'}
                            </span>
                        </div>

                        <div className="flex-1 overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-secondary/50 text-foreground font-semibold text-xs tracking-wider uppercase">
                                    <tr>
                                        <th className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="material-icons-round text-sm text-muted-foreground">calendar_today</span>
                                                {t('dashboard.table.date') || 'Date'}
                                            </div>
                                        </th>
                                        <th className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="material-icons-round text-sm text-muted-foreground">sd_storage</span>
                                                {t('dashboard.table.size') || 'Size'}
                                            </div>
                                        </th>
                                        <th className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="material-icons-round text-sm text-muted-foreground">info</span>
                                                {t('dashboard.table.status') || 'Status'}
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-right">
                                            {t('dashboard.table.action') || 'Action'}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {history.length > 0 ? history.map(item => (
                                        <tr key={item.id} className="hover:bg-secondary/30 transition-colors group">
                                            <td className="px-6 py-4 text-foreground font-medium whitespace-nowrap">
                                                {new Date(item.timestamp).toLocaleDateString()}
                                                <span className="text-xs text-muted-foreground block mt-0.5">
                                                    {new Date(item.timestamp).toLocaleTimeString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                                                {formatBytes(item.fileSize)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-success/10 text-success border border-success/20">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                                                    {t('dashboard.status.completed') || 'Completed'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleViewImage(item.id)}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all text-xs font-medium hover:scale-105 active:scale-95"
                                                >
                                                    <span className="material-icons-round text-sm">visibility</span>
                                                    {t('dashboard.btn.view') || 'View'}
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center border border-border">
                                                        <span className="material-icons-round text-3xl text-muted-foreground">history_toggle_off</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-base font-medium text-foreground mb-1">
                                                            {t('dashboard.empty.title') || 'No conversion history found'}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {t('dashboard.empty.subtitle') || 'Your recent activities will appear here'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Image Viewer Modal */}
            {selectedImageId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm animate-fade-in">
                    <Card variant="glass" className="w-full max-w-5xl overflow-hidden animate-slide-up">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-secondary/30">
                            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <span className="material-icons-round text-primary">image</span>
                                {t('dashboard.modal.title') || 'Image Details'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="w-8 h-8 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
                                aria-label="Close modal"
                            >
                                <span className="material-icons-round text-lg">close</span>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            {!modalImages ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <div className="w-10 h-10 border-2 border-border border-t-primary rounded-full animate-spin"></div>
                                    <p className="text-muted-foreground text-sm">
                                        {t('dashboard.modal.loading') || 'Loading images...'}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Original Image */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-foreground">
                                                {t('preview.original') || 'Original Source'}
                                            </span>
                                            <span className="text-xs px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
                                                {t('dashboard.modal.before') || 'Before'}
                                            </span>
                                        </div>
                                        <div className="aspect-[4/3] bg-secondary rounded-xl overflow-hidden border border-border relative flex items-center justify-center">
                                            {modalImages.original ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={modalImages.original} alt="Original" className="max-w-full max-h-full object-contain" />
                                            ) : (
                                                <p className="text-muted-foreground text-sm">
                                                    {t('dashboard.modal.notavailable') || 'Not available'}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Processed Image */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-success">
                                                {t('preview.result') || 'Restored Result'}
                                            </span>
                                            <span className="text-xs px-2 py-0.5 rounded bg-success/10 text-success border border-success/20">
                                                {t('dashboard.modal.after') || 'After'}
                                            </span>
                                        </div>
                                        <div className="aspect-[4/3] bg-secondary rounded-xl overflow-hidden border border-success/20 relative flex items-center justify-center">
                                            {modalImages.processed ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={modalImages.processed} alt="Processed" className="max-w-full max-h-full object-contain" />
                                            ) : (
                                                <p className="text-muted-foreground text-sm">
                                                    {t('dashboard.modal.notavailable') || 'Not available'}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-secondary/30 px-6 py-4 border-t border-border flex justify-end gap-3">
                            {modalImages?.processed && (
                                <Button
                                    onClick={() => window.open(modalImages.processed, '_blank')}
                                    variant="default"
                                >
                                    <span className="material-icons-round mr-2 text-sm">download</span>
                                    {t('btn.download') || 'Download'}
                                </Button>
                            )}
                            <Button onClick={closeModal} variant="outline">
                                {t('dashboard.btn.close') || 'Close'}
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
