import { CryptoProvider } from "@/context/crypto-provider";
import { I18nProvider } from "@/context/i18n-provider";
import { ThemeProvider } from "@/context/theme-provider";
import { type Locale } from "@/lib/types";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  return (
    <I18nProvider locale={params.locale}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <CryptoProvider>
          <div lang={params.locale} className="font-body antialiased min-h-screen bg-background flex flex-col">
            <div className="flex flex-col flex-1">
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">
                {children}
              </main>
              <Footer />
              <Toaster />
            </div>
          </div>
        </CryptoProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
