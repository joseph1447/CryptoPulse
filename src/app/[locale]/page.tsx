
"use client";

import { useMemo, useState } from "react";
import { useCrypto } from "@/hooks/use-crypto";
import { CryptoTable } from "@/components/dashboard/crypto-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/hooks/use-i18n";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, X, RefreshCw, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type ViewMode = "buy" | "sell";
const ITEMS_PER_PAGE = 15;

export default function DashboardPage() {
  const { 
    cryptos, 
    initialized, 
    loading,
    apiConnectionError,
    fetchCryptoData 
  } = useCrypto();
  const { t } = useI18n();
  const [showWarning, setShowWarning] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("buy");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setCurrentPage(1);
    await fetchCryptoData();
    setIsRefreshing(false);
  };

  const top50Cryptos = useMemo(() => {
    if (!cryptos || cryptos.length === 0) return [];
    
    const sorted = [...cryptos].sort((a, b) => {
        if (viewMode === 'buy') {
            return a.rsi - b.rsi; // Lowest RSI first for buy opportunities
        } else {
            return b.rsi - a.rsi; // Highest RSI first for sell opportunities
        }
    });

    return sorted.slice(0, 50);
  }, [cryptos, viewMode]);

  const paginatedCryptos = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return top50Cryptos.slice(startIndex, endIndex);
  }, [top50Cryptos, currentPage]);

  const totalPages = Math.ceil(top50Cryptos.length / ITEMS_PER_PAGE);

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
      {showWarning && apiConnectionError && (
         <Alert variant="destructive" className="relative">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('dashboard.error.title')}</AlertTitle>
            <AlertDescription>
                <div className="break-all">{t('dashboard.error.description')}</div>
                <pre className="mt-2 text-xs bg-black/20 p-2 rounded-md whitespace-pre-wrap break-words">{apiConnectionError}</pre>
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
        <h1 className="text-3xl font-bold font-headline">
          {viewMode === 'buy' ? t('dashboard.top50ShortTermBuy') : t('dashboard.top50ShortTermSell')}
        </h1>
        <div className="flex items-center space-x-4">
          <Button onClick={handleRefresh} disabled={isRefreshing || loading} variant="outline" size="sm">
            {isRefreshing || loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            {t('dashboard.refreshButton')}
          </Button>
          <div className="flex items-center space-x-2">
            <Label htmlFor="view-mode" className={viewMode === 'buy' ? 'text-green-500' : ''}>{t('dashboard.top50BuyLabel')}</Label>
            <Switch
                id="view-mode"
                checked={viewMode === 'sell'}
                onCheckedChange={(checked) => {
                  setViewMode(checked ? 'sell' : 'buy');
                  setCurrentPage(1);
                }}
            />
            <Label htmlFor="view-mode" className={viewMode === 'sell' ? 'text-destructive' : ''}>{t('dashboard.top50SellLabel')}</Label>
          </div>
        </div>
      </div>

      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10 rounded-lg">
            <div className="flex items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">{t('cryptoTable.loading')}</p>
            </div>
          </div>
        )}
        <CryptoTable cryptos={paginatedCryptos} viewMode={viewMode} />
      </div>


      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-4">
            <span className="text-sm text-muted-foreground">
                {t('dashboard.pagination.page')} {currentPage} {t('dashboard.pagination.of')} {totalPages}
            </span>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="h-4 w-4 mr-1" />
                {t('dashboard.pagination.previous')}
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
            >
                {t('dashboard.pagination.next')}
                <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
        </div>
      )}
    </div>
  );
}
