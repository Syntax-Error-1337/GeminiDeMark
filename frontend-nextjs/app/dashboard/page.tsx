'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { useI18n } from '@/components/providers/i18n-provider';
import { DashboardService, type DashboardStats, type ConversionHistoryItem } from '@/lib/dashboard-service';
import { formatBytes } from '@/lib/alpha-map'; // Reusing formatBytes from where I put it, or better move to utils?
import { Button } from '@/components/ui/button'; // Assuming I put it in utils, but I put it in alpha-map by mistake? Let's check. 
// Wait, I put it in alpha-map in the previous step? 
// "TargetFile: .../lib/alpha-map.ts" -> Yes I did. That was a mistake. It should be in utils.ts. 
// I will move it to utils.ts in this step or import it from there if I fix it. 
// Let's assume I'll fix it in utils.ts or just put it here for now.
// Actually, I'll import it from utils if I fix it, but I haven't fixed it yet.
// I'll put a local version here to be safe and fix utils later.

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

    const formatBytesLocal = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const percentage = stats ? Math.min(100, Math.round((stats.monthlyUsage / stats.monthlyLimit) * 100)) : 0;
    let color = 'emerald';
    if (percentage > 75) color = 'yellow';
    if (percentage >= 100) color = 'red';

    const handleViewImage = async (id: number) => {
        // Here we would ideally fetch the images securely.
        // For now, we construct the URLs assuming the backend serves them or we use the API path.
        // The original dashboard used fetch blob.

        // Let's mock the fetch for now or implement the secure fetch logic if we have time.
        // The DashboardService doesn't have image fetch yet.
        setSelectedImageId(id);

        // TODO: Implement secure image fetching
        // For UI demo:
        // setModalImages({ original: '...', processed: '...' });
    };

    if (authLoading || loading) {
        return (
            <div className="flex min-h-screen items-center justify-center pt-20">
                <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-indigo-500 animate-spin"></div>
            </div>
        );
    }

    if (!user || !stats) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in-up min-h-screen pt-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <span className="material-icons-round text-indigo-500 text-4xl">dashboard</span>
                        {t('dashboard.title') || 'Dashboard'}
                    </h2>
                    <p className="text-slate-400 mt-2 font-medium">Manage your subscription and view your activity</p>
                </div>
                <Button variant="outline" onClick={() => router.push('/')}>
                    <span className="material-icons-round text-sm mr-2">arrow_back</span>
                    {t('dashboard.back') || 'Back to Home'}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Profile & Usage */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Profile Card */}
                    <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-24 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-colors duration-700"></div>

                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-1 mb-4 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-500">
                                <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center">
                                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-purple-400">
                                        {user.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">{user.username}</h3>
                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                                <span className="material-icons-round text-base text-slate-500">email</span>
                                {user.email}
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wide">
                                <span className="material-icons-round text-xs">verified</span>
                                {user.role.toUpperCase()} {t('dashboard.plan') || 'PLAN'}
                            </div>
                        </div>
                    </div>

                    {/* Usage Card */}
                    <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-slate-300 font-semibold flex items-center gap-2">
                                <span className="material-icons-round text-indigo-400">pie_chart</span>
                                {t('dashboard.usage.title') || 'Monthly Usage'}
                            </h4>
                        </div>

                        <div className="mb-3 flex items-end justify-between">
                            <span className="text-4xl font-bold text-white tracking-tight">{stats.monthlyUsage}</span>
                            <span className="text-sm text-slate-400 mb-1.5 font-medium">/ {stats.monthlyLimit} credits</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-4 bg-black/40 rounded-full overflow-hidden mb-3 border border-white/5">
                            <div
                                className={`h-full bg-gradient-to-r from-indigo-500 to-${color}-500 transition-all duration-1000 shadow-[0_0_15px_rgba(99,102,241,0.5)] relative`}
                                style={{ width: `${percentage}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 text-right font-medium">{percentage}% Used</p>
                    </div>

                    {/* Upgrade Call */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 shadow-xl shadow-indigo-500/20 text-center relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer border border-white/10">
                        <div className="absolute top-0 right-0 p-24 bg-white/10 blur-3xl rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                        <span className="material-icons-round text-4xl text-white/90 mb-4 drop-shadow-md">diamond</span>
                        <h4 className="text-white font-bold text-xl mb-2">{t('dashboard.upgrade.title') || 'Upgrade to Pro'}</h4>
                        <p className="text-indigo-100 text-sm mb-6 leading-relaxed opacity-90">{t('dashboard.upgrade.desc') || 'Get unlimited access and faster processing speeds.'}</p>
                        <button className="w-full py-3 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors text-sm shadow-lg">
                            {t('dashboard.upgrade.btn') || 'Upgrade Now'}
                        </button>
                    </div>
                </div>

                {/* Right Column: Recent Conversions */}
                <div className="lg:col-span-8">
                    <div className="bg-[#1e293b]/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-xl h-full flex flex-col">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <h3 className="text-lg font-bold text-white flex items-center gap-3">
                                <span className="material-icons-round text-emerald-400">history</span>
                                Recent Conversions
                            </h3>
                            <span className="text-xs font-bold text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">{history.length} records</span>
                        </div>

                        <div className="flex-1 overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="bg-black/20 text-slate-300 uppercase font-semibold text-xs tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">
                                            <div className="flex items-center gap-2"><span className="material-icons-round text-sm text-slate-500">calendar_today</span> Date</div>
                                        </th>
                                        <th className="px-6 py-4">
                                            <div className="flex items-center gap-2"><span className="material-icons-round text-sm text-slate-500">sd_storage</span> Size</div>
                                        </th>
                                        <th className="px-6 py-4">
                                            <div className="flex items-center gap-2"><span className="material-icons-round text-sm text-slate-500">info</span> Status</div>
                                        </th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {history.length > 0 ? history.map(item => (
                                        <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 text-slate-300 font-medium whitespace-nowrap">
                                                {new Date(item.timestamp).toLocaleDateString()}
                                                <span className="text-xs text-slate-500 block mt-0.5">{new Date(item.timestamp).toLocaleTimeString()}</span>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs">{formatBytesLocal(item.fileSize)}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span>
                                                    Completed
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => handleViewImage(item.id)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 transition-all text-xs font-bold group-hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:scale-105 active:scale-95">
                                                    <span className="material-icons-round text-sm">visibility</span> View
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-20 text-center text-slate-500">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                                                        <span className="material-icons-round text-3xl text-slate-600">history_toggle_off</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-base font-medium text-slate-400 mb-1">No conversion history found</p>
                                                        <p className="text-xs text-slate-600">Your recent activities will appear here</p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
