import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useI18n } from '@/components/providers/i18n-provider';

export function FeaturesSection() {
    const { t } = useI18n();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

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
        <section className="relative py-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <h3 className={cn(
                        "text-4xl md:text-5xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r",
                        isDark
                            ? "from-white via-slate-200 to-slate-400"
                            : "from-slate-900 via-slate-700 to-slate-800"
                    )}>
                        {t('feature.title') || 'Features'}
                    </h3>
                    <p className={cn(
                        "max-w-2xl mx-auto text-lg leading-relaxed font-medium transition-colors duration-300",
                        isDark ? "text-slate-400" : "text-slate-600"
                    )}>
                        {t('feature.subtitle') || 'Everything you need to process images perfectly'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <div
                            key={feature.id}
                            className={cn(
                                "group relative p-8 rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2",
                                isDark
                                    ? "bg-slate-900/40 border border-white/5 shadow-2xl shadow-black/40 hover:bg-slate-800/60 hover:border-white/10 hover:shadow-indigo-500/10 backdrop-blur-xl"
                                    : "bg-white/60 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:bg-white/80 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] backdrop-blur-xl"
                            )}
                        >
                            {/* Specular Highlight (Top) */}
                            <div className={cn(
                                "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700",
                                !isDark && "via-black/5"
                            )}></div>

                            {/* Icon Container */}
                            <div className={cn(
                                "w-20 h-20 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110",
                                isDark
                                    ? `bg-gradient-to-br from-${feature.color}-500/10 to-${feature.color}-600/5 border border-${feature.color}-500/10 shadow-[inner_0_0_20px_rgba(0,0,0,0.2)]`
                                    : `bg-gradient-to-br from-white to-${feature.color}-50 border border-white shadow-[0_4px_20px_rgb(0,0,0,0.03)]`
                            )}>
                                <span className={cn(
                                    "material-icons-round text-4xl transition-colors duration-300",
                                    isDark ? `text-${feature.color}-400` : `text-${feature.color}-600`
                                )}>{feature.icon}</span>
                            </div>

                            <h4 className={cn(
                                "text-2xl font-bold mb-4 tracking-tight transition-colors",
                                isDark ? "text-white" : "text-slate-900"
                            )}>
                                {feature.title}
                            </h4>
                            <p className={cn(
                                "leading-relaxed transition-colors",
                                isDark ? "text-slate-400 font-light" : "text-slate-600 font-normal"
                            )}>
                                {feature.desc}
                            </p>

                            {/* Bottom Glow */}
                            <div className={cn(
                                "absolute bottom-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none",
                                `bg-${feature.color}-500`
                            )}></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
