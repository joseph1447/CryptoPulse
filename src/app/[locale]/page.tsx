"use client";

import { useMemo } from "react";
import { useCrypto } from "@/hooks/use-crypto";
import { CryptoTable } from "@/components/dashboard/crypto-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/hooks/use-i18n";

export default function DashboardPage() {
  const { cryptos, initialized } = useCrypto();
  const { t } = useI18n();

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
