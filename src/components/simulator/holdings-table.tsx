
"use client";

import { useState, useMemo } from "react";
import { useCrypto } from "@/hooks/use-crypto";
import type { Holding, Crypto } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CryptoLogo } from "../icons/crypto-logos";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TradeDialog } from "../dashboard/trade-dialog";
import { useI18n } from "@/hooks/use-i18n";

export function HoldingsTable() {
  const { holdings, cryptos, currency, exchangeRate } = useCrypto();
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const { t, locale } = useI18n();

  const handleSellClick = (crypto: Crypto) => {
    setSelectedCrypto(crypto);
  };

  const handleTradeDialogClose = () => {
    setSelectedCrypto(null);
  };
  
  const formatCurrency = (value: number, decimals: number = 2) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  }

  const holdingsWithData = useMemo(() => {
    const rate = currency === 'CRC' ? exchangeRate : 1;
    return holdings.map(holding => {
      const crypto = cryptos.find(c => c.id === holding.cryptoId);
      if (!crypto) return null;

      const currentValue = holding.quantity * crypto.currentPrice;
      const pnl = currentValue - (holding.quantity * holding.avgBuyPrice);
      const pnlPercent = (holding.quantity * holding.avgBuyPrice) === 0 ? 0 : (pnl / (holding.quantity * holding.avgBuyPrice)) * 100;

      return {
        ...holding,
        crypto,
        currentValue: currentValue * rate,
        avgBuyPrice: holding.avgBuyPrice * rate,
        pnl: pnl * rate,
        pnlPercent
      }
    }).filter(Boolean);
  }, [holdings, cryptos, currency, exchangeRate]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t('holdingsTable.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('holdingsTable.asset')}</TableHead>
                  <TableHead className="text-right">{t('holdingsTable.quantity')}</TableHead>
                  <TableHead className="hidden md:table-cell text-right">{t('holdingsTable.avgBuyPrice')}</TableHead>
                  <TableHead className="text-right">{t('holdingsTable.currentValue')}</TableHead>
                  <TableHead className="text-right">{t('holdingsTable.pl')}</TableHead>
                  <TableHead className="text-right">{t('holdingsTable.action')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holdingsWithData.length > 0 ? (
                  holdingsWithData.map((holding) => (
                    holding && (
                        <TableRow key={holding.cryptoId}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <CryptoLogo symbol={holding.crypto.symbol} className="h-8 w-8" />
                            <div>
                              <div className="font-medium">{holding.crypto.name}</div>
                              <div className="text-muted-foreground text-xs">{holding.crypto.symbol}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono">{holding.quantity.toFixed(6)}</TableCell>
                        <TableCell className="hidden md:table-cell text-right font-mono">{formatCurrency(holding.avgBuyPrice, 2)}</TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(holding.currentValue, 2)}</TableCell>
                        <TableCell className={cn("text-right font-mono", holding.pnl >= 0 ? "text-green-400" : "text-red-400")}>
                          {holding.pnl >= 0 ? '+' : ''}{formatCurrency(holding.pnl, 2)} ({holding.pnlPercent.toFixed(2)}%)
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" onClick={() => handleSellClick(holding.crypto)}>
                            {t('tradeDialog.sell')}
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                      {t('holdingsTable.noHoldings')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {selectedCrypto && (
        <TradeDialog
          crypto={selectedCrypto}
          isOpen={!!selectedCrypto}
          onClose={handleTradeDialogClose}
          defaultTab="sell"
        />
      )}
    </>
  );
}
