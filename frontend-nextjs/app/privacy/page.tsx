'use client';

import React from 'react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background pt-20 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <article className="prose prose-slate dark:prose-invert max-w-none">
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-8">Privacy Policy</h1>
                    <p className="text-muted-foreground mb-8">Last updated: December 29, 2025</p>

                    <section className="space-y-6 text-foreground/90">
                        <h2 className="text-2xl font-bold text-foreground">1. Introduction</h2>
                        <p>
                            Welcome to GeminiDeMark ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data using the highest standards of security. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.
                        </p>

                        <h2 className="text-2xl font-bold text-foreground">2. Data Processing</h2>
                        <p>
                            <strong>Local Processing:</strong> Our service is designed with privacy as a core principle. All image processing for watermark removal is performed locally within your browser.
                            <span className="text-primary font-semibold"> We do not upload your original images to our servers for processing.</span>
                        </p>

                        <h2 className="text-2xl font-bold text-foreground">3. Data Collection</h2>
                        <p>
                            While we do not store your original images, we may collect the following types of information:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Account Data:</strong> If you register, we store your username, email address, and encrypted credentials.</li>
                            <li><strong>History Data:</strong> We store processed (result) images in your secure cloud history to allow you to access them later. You can delete these records at any time.</li>
                            <li><strong>Usage Data:</strong> We may collect anonymous usage statistics to improve our service performance.</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-foreground">4. Data Security</h2>
                        <p>
                            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. Your history data is stored using industry-standard encryption.
                        </p>

                        <h2 className="text-2xl font-bold text-foreground">5. Your Rights</h2>
                        <p>
                            Under applicable data protection laws, you have the right to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Access your personal data.</li>
                            <li>Request correction of your personal data.</li>
                            <li>Request deletion of your personal data ("Right to be forgotten").</li>
                            <li>Object to processing of your personal data.</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-foreground">6. Contact Us</h2>
                        <p>
                            If you have any questions about this privacy policy or our privacy practices, please contact us.
                        </p>
                    </section>
                </article>
            </div>
        </div>
    );
}
