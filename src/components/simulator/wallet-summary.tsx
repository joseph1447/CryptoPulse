
"use client";

import { useCrypto } from "@/hooks/use-crypto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Briefcase, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/hooks/use-i18n";

const INITIAL_GUSD_BALANCE = 10000;

export function WalletSummary() {
  const { gusdBalance, portfolioValue, holdings, currency, exchangeRate } = useCrypto();
  const { t, locale } = useI18n();

  const totalValue = gusdBalance + portfolioValue;
  
  const totalInvested = holdings.reduce((acc, h) => acc + (h.avgBuyPrice * h.quantity), 0);
  const totalSoldValue = INITIAL_GUSD_BALANCE - gusdBalance + portfolioValue - totalInvested;
  
  const totalPNL = totalValue - INITIAL_GUSD_BALANCE;

  const rate = currency === 'CRC' ? exchangeRate : 1;
  const cashBalanceDisplay = gusdBalance * rate;
  const portfolioValueDisplay = portfolioValue * rate;
  const totalPnlDisplay = totalPNL * rate;
  const stablecoinName = currency === 'CRC' ? 'GCNS' : 'GUSD';


  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('walletSummary.title')}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title={t('walletSummary.cashBalance', { stablecoin: stablecoinName })}
          value={cashBalanceDisplay}
          icon={DollarSign}
          currency={currency}
          locale={locale}
        />
        <StatCard
          title={t('walletSummary.cryptoHoldings')}
          value={portfolioValueDisplay}
          icon={Briefcase}
          currency={currency}
          locale={locale}
        />
        <StatCard
          title={t('walletSummary.totalPL')}
          value={totalPnlDisplay}
          icon={TrendingUp}
          currency={currency}
          locale={locale}
          isPnl
        />
      </CardContent>
    </Card>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  currency,
  locale,
  isPnl = false,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  currency: string;
  locale: string;
  isPnl?: boolean;
}) {
  const formattedValue = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
    
  const pnlColor = value > 0 ? "text-green-400" : value < 0 ? "text-red-400" : "text-foreground";

  return (
    <div className="p-4 bg-background rounded-lg border flex items-start gap-4">
      <div className="p-2 bg-muted rounded-md">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className={cn("text-2xl font-bold font-mono", isPnl && pnlColor)}>
          {isPnl && value > 0 ? "+" : ""}
          {formattedValue}
        </p>
      </div>
    </div>
  );
}
