
import type { Metadata } from "next";
import "./globals.css";
import { CryptoProvider } from "@/context/crypto-provider";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/header";
import { I18nProvider } from "@/context/i18n-provider";
import { ThemeProvider } from "@/context/theme-provider";
import { type Locale } from "@/lib/types";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "CryptoPulse",
  description: "Real-Time Trading Simulator & Analyzer",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: Locale };
}>) {
  return (
    <I18nProvider locale={params.locale}>
      <html lang={params.locale || 'en'} suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="font-body antialiased min-h-screen bg-background flex flex-col">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <CryptoProvider>
              <div className="flex flex-col flex-1">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                  {children}
                </main>
                <Footer />
                <Toaster />
              </div>
            </CryptoProvider>
          </ThemeProvider>
        </body>
      </html>
    </I18nProvider>
  );
}
