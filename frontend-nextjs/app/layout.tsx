import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter to match original
import "./globals.css";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuroraBackground } from "@/components/ui/aurora-background";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GeminiDeMark - Free Gemini AI Watermark Remover", // Updated title
  description: "Automatically removes watermarks from Gemini AI generated images. Free, private, and 100% browser-based.", // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />
      </head>
      <body
        className={`${inter.className} text-foreground antialiased selection:bg-primary selection:text-primary-foreground flex flex-col min-h-screen transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <I18nProvider>
            <AuthProvider>
              <AuroraBackground />
              <Header />
              <main className="flex-grow pt-20">
                {children}
              </main>
              <Footer />
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
