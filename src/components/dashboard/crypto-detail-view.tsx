
"use client";

import { useState, useTransition } from "react";
import type { Crypto } from "@/lib/types";
import { getTradeSignalsAction } from "@/app/actions";
import { Button } from "../ui/button";
import { Loader2, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { useToast } from "@/hooks/use-toast";
import { PriceChart } from "./price-chart";
import type { GenerateTradeSignalsOutput } from "@/ai/flows/generate-trade-signals";
import { useI18n } from "@/hooks/use-i18n";

export function CryptoDetailView({ crypto }: { crypto: Crypto }) {
  const [isPending, startTransition] = useTransition();
  const [analysis, setAnalysis] = useState<GenerateTradeSignalsOutput | null>(null);
  const { toast } = useToast();
  const { t } = useI18n();

  const handleAnalysis = () => {
    startTransition(async () => {
      const result = await getTradeSignalsAction({
        cryptoName: `${crypto.symbol}/USDT`,
        currentPrice: crypto.currentPrice,
        volume24h: crypto.volume24h,
        rsi: crypto.rsi,
      });

      if (result.success && result.data) {
        setAnalysis(result.data);
      } else {
        toast({
          variant: "destructive",
          title: t('cryptoDetail.analysisFailed'),
          description: result.error || t('cryptoDetail.analysisError'),
        });
      }
    });
  };

  const getBadgeVariant = (signal: 'BUY' | 'SELL' | 'HOLD'): 'default' | 'destructive' | 'secondary' => {
    switch (signal) {
      case 'BUY': return 'default';
      case 'SELL': return 'destructive';
      case 'HOLD': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="bg-card/50 p-4 rounded-md grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <h3 className="text-lg font-semibold mb-2">{t('cryptoDetail.priceChartTitle', { name: crypto.name })}</h3>
        <div className="h-[250px]">
          <PriceChart data={crypto.priceHistory} />
        </div>
      </div>
      <div>
        <Card className="bg-background/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="text-primary h-5 w-5" />
              {t('cryptoDetail.aiAnalysis')}
            </CardTitle>
            <CardDescription>{t('cryptoDetail.aiAnalysisDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : analysis ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-1">{t('cryptoDetail.shortTermSignal')}</h4>
                  <Badge variant={getBadgeVariant(analysis.shortTermSignal)}>{analysis.shortTermSignal}</Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">{t('cryptoDetail.longTermSignal')}</h4>
                  <Badge variant={getBadgeVariant(analysis.longTermSignal)}>{analysis.longTermSignal}</Badge>
                </div>
                 <div>
                  <h4 className="font-semibold text-sm mb-1">{t('cryptoDetail.explanation')}</h4>
                  <p className="text-xs text-muted-foreground">{analysis.explanation}</p>
                </div>
              </div>
            ) : (
                <div className="flex items-center justify-center h-40">
                    <Button onClick={handleAnalysis} disabled={isPending}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                        {t('cryptoDetail.analyzeButton')}
                    </Button>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
