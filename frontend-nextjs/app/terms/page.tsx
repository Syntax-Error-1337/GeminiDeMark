'use client';

import React from 'react';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background pt-20 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <article className="prose prose-slate dark:prose-invert max-w-none">
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-8">Terms of Service</h1>
                    <p className="text-muted-foreground mb-8">Last updated: December 29, 2025</p>

                    <section className="space-y-6 text-foreground/90">
                        <h2 className="text-2xl font-bold text-foreground">1. Agreement to Terms</h2>
                        <p>
                            By accessing or using GeminiDeMark, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
                        </p>

                        <h2 className="text-2xl font-bold text-foreground">2. Usage Restrictions</h2>
                        <p>
                            You agree not to use the service:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>In any way that violates any applicable national or international law or regulation.</li>
                            <li>To infringe upon the intellectual property rights of others.</li>
                            <li>To process images that contain illegal content.</li>
                            <li>To start a competing service.</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-foreground">3. Intellectual Property</h2>
                        <p>
                            The service and its original content, features, and functionality are and will remain the exclusive property of GeminiDeMark and its licensors.
                        </p>

                        <h2 className="text-2xl font-bold text-foreground">4. Disclaimer</h2>
                        <p>
                            The service is provided on an "AS IS" and "AS AVAILABLE" basis. GeminiDeMark makes no warranties, whether express or implied, regarding the reliability or availability of the service.
                        </p>
                        <p className="italic border-l-4 border-primary/50 pl-4 py-2 my-4 bg-primary/5 rounded-r">
                            <strong>Note:</strong> This tool is intended for educational and research purposes. You are solely responsible for ensuring you have the right to modify any images you process.
                        </p>

                        <h2 className="text-2xl font-bold text-foreground">5. Limitation of Liability</h2>
                        <p>
                            In no event shall GeminiDeMark, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                        </p>

                        <h2 className="text-2xl font-bold text-foreground">6. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify or replace these Terms at any time. We will try to provide at least 30 days notice prior to any new terms taking effect.
                        </p>
                    </section>
                </article>
            </div>
        </div>
    );
}
