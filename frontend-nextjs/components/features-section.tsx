import { useI18n } from '@/components/providers/i18n-provider';
import { Card } from '@/components/ui/card';

export function FeaturesSection() {
    const { t } = useI18n();

    const features = [
        {
            id: 'speed',
            icon: 'bolt',
            title: t('feature.speed.title') || 'Lightning Fast',
            desc: t('feature.speed.desc') || 'Proprietary optimizations ensure 10x faster processing than server-side alternatives.',
        },
        {
            id: 'privacy',
            icon: 'security',
            title: t('feature.privacy.title') || 'Privacy First',
            desc: t('feature.privacy.desc') || 'Your photos never leave your device. All AI processing happens locally in your browser.',
        },
        {
            id: 'free',
            icon: 'savings',
            title: t('feature.free.title') || 'Completely Free',
            desc: t('feature.free.desc') || 'No subscriptions, no hidden fees, and no blurred results. Open source and free forever.',
        }
    ];

    return (
        <section className="relative py-20 lg:py-28 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight text-foreground">
                        {t('feature.title') || 'Why Choose Us'}
                    </h2>
                    <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                        {t('feature.subtitle') || 'Everything you need to process images perfectly'}
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <Card key={feature.id} variant="glass" className="p-8 hover:-translate-y-1">
                            {/* Icon Container */}
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                                <span className="material-icons-round text-3xl text-primary">
                                    {feature.icon}
                                </span>
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold mb-3 tracking-tight text-foreground">
                                {feature.title}
                            </h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {feature.desc}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
