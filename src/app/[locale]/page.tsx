
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type ViewMode = "buy" | "sell";

export default function DashboardPage() {
  const { cryptos, initialized, binanceConnectionError } = useCrypto();
  const { t } = useI18n();
  const [showWarning, setShowWarning] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("buy");

  const rankedCryptos = useMemo(() => {
    if (!cryptos || cryptos.length === 0) return [];
    
    const sorted = [...cryptos].sort((a, b) => {
        if (viewMode === 'buy') {
            return a.rsi - b.rsi; // Lowest RSI first for buy opportunities
        } else {
            return b.rsi - a.rsi; // Highest RSI first for sell opportunities
        }
    });

    return sorted.slice(0, 10);
  }, [cryptos, viewMode]);

  if (!initialized) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold font-headline">{t('dashboard.title')}</h1>
            <Skeleton className="h-8 w-48" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
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
      {showWarning && binanceConnectionError && (
         <Alert variant="destructive" className="relative">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('dashboard.error.title')}</AlertTitle>
            <AlertDescription>
                {t('dashboard.error.description')}
                <pre className="mt-2 text-xs bg-black/20 p-2 rounded-md font-mono whitespace-pre-wrap break-words">{binanceConnectionError}</pre>
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold font-headline">{t('dashboard.title')}</h1>
        <div className="flex items-center space-x-2">
            <Label htmlFor="view-mode" className={viewMode === 'buy' ? 'text-primary' : ''}>{t('dashboard.top10BuyLabel')}</Label>
            <Switch
                id="view-mode"
                checked={viewMode === 'sell'}
                onCheckedChange={(checked) => setViewMode(checked ? 'sell' : 'buy')}
            />
            <Label htmlFor="view-mode" className={viewMode === 'sell' ? 'text-primary' : ''}>{t('dashboard.top10SellLabel')}</Label>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
             {viewMode === 'buy' ? t('dashboard.top10ShortTermBuy') : t('dashboard.top10ShortTermSell')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CryptoTable cryptos={rankedCryptos} />
        </CardContent>
      </Card>
    </div>
  );
}
