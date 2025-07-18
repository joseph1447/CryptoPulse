"use client";

import { useCrypto } from "@/hooks/use-crypto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Briefcase, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/hooks/use-i18n";

const INITIAL_GUSD_BALANCE = 10000;

export function WalletSummary() {
  const { gusdBalance, portfolioValue, holdings } = useCrypto();
  const { t } = useI18n();

  const totalValue = gusdBalance + portfolioValue;
  
  const totalInvested = holdings.reduce((acc, h) => acc + (h.avgBuyPrice * h.quantity), 0);
  const totalSoldValue = INITIAL_GUSD_BALANCE - gusdBalance + portfolioValue - totalInvested;
  
  const totalPNL = totalValue - INITIAL_GUSD_BALANCE;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('walletSummary.title')}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title={t('walletSummary.cashBalance')}
          value={gusdBalance}
          icon={DollarSign}
          isCurrency
        />
        <StatCard
          title={t('walletSummary.cryptoHoldings')}
          value={portfolioValue}
          icon={Briefcase}
          isCurrency
        />
        <StatCard
          title={t('walletSummary.totalPL')}
          value={totalPNL}
          icon={TrendingUp}
          isCurrency
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
  isCurrency = false,
  isPnl = false,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  isCurrency?: boolean;
  isPnl?: boolean;
}) {
  const formattedValue = isCurrency
    ? value.toLocaleString("en-US", { style: "currency", currency: "USD" })
    : value.toLocaleString();
    
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
