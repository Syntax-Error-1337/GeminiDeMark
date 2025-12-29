import { useI18n } from '@/components/providers/i18n-provider';
import { Card } from '@/components/ui/card';

export function FeaturesSection() {
    const { t } = useI18n();

    const features = [
        {
            id: 'speed',
            icon: 'bolt',
            title: t('feature.speed.title') || 'Lightning Fast',
            desc: t('feature.speed.desc') || 'Instant processing with our advanced client-side engine. No uploading, no waiting - results in seconds.',
        },
        {
            id: 'quality',
            icon: 'high_quality',
            title: t('feature.quality.title') || 'Lossless Quality',
            desc: t('feature.quality.desc') || 'Pixel-perfect restoration without any quality degradation. Your images remain in their original resolution.',
        },
        {
            id: 'history',
            icon: 'history',
            title: t('feature.history.title') || 'Secure Cloud History',
            desc: t('feature.history.desc') || 'All processed images are securely stored in your history for easy access and download.',
        },
        {
            id: 'smart',
            icon: 'auto_awesome',
            title: t('feature.smart.title') || 'Smart Detection',
            desc: t('feature.smart.desc') || 'Automatically detects watermark size and position. No manual configuration needed - just upload and go.',
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

                {/* Features Grid - Now 4 cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature) => (
                        <Card key={feature.id} variant="glass" className="p-6 hover:-translate-y-1">
                            {/* Icon Container */}
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                                <span className="material-icons-round text-2xl text-primary">
                                    {feature.icon}
                                </span>
                            </div>

                            {/* Content */}
                            <h3 className="text-lg font-bold mb-2 tracking-tight text-foreground">
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
