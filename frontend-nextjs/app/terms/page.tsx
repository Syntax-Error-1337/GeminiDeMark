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

                        <h2 className="text-2xl font-bold text-foreground">2. Service Description</h2>
                        <p>
                            GeminiDeMark is a tool designed to identify AI-generated content and verify provenance. It uses a **Reverse Alpha Blending algorithm** to restore pixels with zero quality loss where possible.
                        </p>
                        <p>
                            <strong>Important Note:</strong> This tool removes visible watermarks only. It does not affect any invisible or steganographic watermarks (such as Google's SynthID) that may be embedded in the image data. To learn more about SynthID, please visit the official Google DeepMind resources.
                        </p>

                        <h2 className="text-2xl font-bold text-foreground">3. Usage Restrictions</h2>
                        <p>
                            You agree not to use the service:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>In any way that violates any applicable national or international law or regulation.</li>
                            <li>To infringe upon the intellectual property rights of others.</li>
                            <li>To process images that contain illegal content.</li>
                            <li>To start a competing service.</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-foreground">4. Important Disclaimer</h2>
                        <div className="bg-destructive/10 border-l-4 border-destructive p-4 my-4 rounded-r">
                            <p className="font-bold text-destructive mb-2">Please read carefully:</p>
                            <ul className="list-disc pl-4 space-y-2 text-sm">
                                <li>This tool is provided for **personal and educational use only**.</li>
                                <li>**Respect content policies:** The removal of watermarks may have legal or ethical implications depending on how you use the resulting images.</li>
                                <li>You are solely responsible for any content you process using this tool.</li>
                            </ul>
                        </div>

                        <h2 className="text-2xl font-bold text-foreground">5. Privacy Policy Summary</h2>
                        <p>
                            This service provides browser-based image processing. All processing is done **locally on your device**. We do not upload your original images to any remote servers for processing.
                        </p>
                        <p>
                            For full details, please refer to our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
                        </p>

                        <h2 className="text-2xl font-bold text-foreground">6. Limitation of Liability</h2>
                        <p>
                            The tool is provided "as is". The developer shall not be liable for any data loss, image corruption, or legal disputes arising from the use of this tool. In no event shall GeminiDeMark be liable for any indirect, incidental, special, consequential or punitive damages.
                        </p>

                        <h2 className="text-2xl font-bold text-foreground">7. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify or replace these Terms at any time. We will try to provide at least 30 days notice prior to any new terms taking effect.
                        </p>
                    </section>
                </article>
            </div>
        </div>
    );
}
