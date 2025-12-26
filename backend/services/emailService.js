const nodemailer = require('nodemailer');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const sgMail = require('@sendgrid/mail');

class EmailService {
    constructor() {
        this.transporter = null;
        this.provider = process.env.EMAIL_PROVIDER || 'smtp'; // Default to smtp if not set
        this.init();
    }

    init() {
        console.log(`Initializing Email Service with provider: ${this.provider}`);

        if (this.provider === 'ses') {
            // AWS SES Configuration
            this.sesClient = new SESClient({
                region: process.env.AWS_REGION,
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                },
            });
            // We'll use the SES client directly or via nodemailer generic transport if we wanted, 
            // but direct SES SDK is often cleaner for simple sends or using nodemailer's SES transport.
            // For simplicity and consistency, let's use nodemailer with SES if possible, OR just handle the send logic differently.
            // Actually, using nodemailer's built-in SES support (via aws-sdk) is good, but let's just use a switch in send for maximum control if needed.
            // But to keep it uniform, let's try to wrap everything in a "send" method.
        } else if (this.provider === 'sendgrid') {
            // Keep existing SendGrid logic or use nodemailer-sendgrid?
            // The existing project used @sendgrid/mail. Let's stick to that for 'sendgrid' mode to minimize breakage if they prefer it.
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        } else {
            // Default: SMTP (works for Gmail, Outlook, generic SMTP)
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
        }
    }

    async sendVerificationEmail(to, token) {
        const verificationUrl = `${process.env.APP_BASE_URL}/verify-email?token=${token}`;
        const fromEmail = process.env.FROM_EMAIL || process.env.SENDGRID_FROM_EMAIL || 'noreply@example.com';
        const subject = 'Verify your email';
        const text = `Please click on the following link to verify your email: ${verificationUrl}`;
        const html = `<p>Please click on the following link to verify your email:</p><a href="${verificationUrl}">${verificationUrl}</a>`;

        try {
            if (this.provider === 'ses') {
                const command = new SendEmailCommand({
                    Destination: { ToAddresses: [to] },
                    Message: {
                        Body: {
                            Html: { Charset: "UTF-8", Data: html },
                            Text: { Charset: "UTF-8", Data: text },
                        },
                        Subject: { Charset: "UTF-8", Data: subject },
                    },
                    Source: fromEmail,
                });
                await this.sesClient.send(command);
            } else if (this.provider === 'sendgrid') {
                const msg = {
                    to,
                    from: fromEmail,
                    subject,
                    text,
                    html,
                };
                await sgMail.send(msg);
            } else {
                // SMTP
                await this.transporter.sendMail({
                    from: fromEmail,
                    to,
                    subject,
                    text,
                    html,
                });
            }
            console.log(`Verification email sent to ${to} via ${this.provider}`);
        } catch (error) {
            console.error(`Error sending email via ${this.provider}:`, error);
            throw error; // Rethrow so controller knows it failed
        }
    }
}

module.exports = new EmailService();
