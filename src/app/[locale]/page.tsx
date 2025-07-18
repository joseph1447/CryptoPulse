"use client";

import { useMemo, useState } from "react";
import { useCrypto } from "@/hooks/use-crypto";
import { CryptoTable } from "@/components/dashboard/crypto-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/hooks/use-i18n";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { cryptos, initialized, binanceConnected } = useCrypto();
  const { t } = useI18n();
  const [showWarning, setShowWarning] = useState(true);

  const top10Cryptos = useMemo(() => {
    if (!cryptos) return [];
    return [...cryptos]
      .sort((a, b) => a.rsi - b.rsi)
      .slice(0, 10);
  }, [cryptos]);

  if (!initialized) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold font-headline">{t('dashboard.title')}</h1>
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.top10ShortTerm')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {!binanceConnected && showWarning && (
         <Alert variant="destructive" className="relative">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('dashboard.warning.title')}</AlertTitle>
            <AlertDescription>
                {t('dashboard.warning.description')}
            </AlertDescription>
             <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => setShowWarning(false)}
             >
                <X className="h-4 w-4" />
                <span className="sr-only">{t('dashboard.warning.dismiss')}</span>
             </Button>
         </Alert>
      )}

      <h1 className="text-3xl font-bold font-headline">{t('dashboard.title')}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.top10ShortTerm')}</CardTitle>
        </CardHeader>
        <CardContent>
          <CryptoTable cryptos={top10Cryptos} />
        </CardContent>
      </Card>
    </div>
  );
}
