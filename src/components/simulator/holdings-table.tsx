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

export function HoldingsTable() {
  const { holdings, cryptos } = useCrypto();
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);

  const handleSellClick = (crypto: Crypto) => {
    setSelectedCrypto(crypto);
  };

  const handleTradeDialogClose = () => {
    setSelectedCrypto(null);
  };

  const holdingsWithData = useMemo(() => {
    return holdings.map(holding => {
      const crypto = cryptos.find(c => c.id === holding.cryptoId);
      if (!crypto) return null;

      const currentValue = holding.quantity * crypto.currentPrice;
      const pnl = currentValue - (holding.quantity * holding.avgBuyPrice);
      const pnlPercent = (pnl / (holding.quantity * holding.avgBuyPrice)) * 100;

      return {
        ...holding,
        crypto,
        currentValue,
        pnl,
        pnlPercent
      }
    }).filter(Boolean);
  }, [holdings, cryptos]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="hidden md:table-cell text-right">Avg. Buy Price</TableHead>
                  <TableHead className="text-right">Current Value</TableHead>
                  <TableHead className="text-right">P/L</TableHead>
                  <TableHead className="text-right">Action</TableHead>
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
                        <TableCell className="hidden md:table-cell text-right font-mono">${holding.avgBuyPrice.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono">${holding.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                        <TableCell className={cn("text-right font-mono", holding.pnl >= 0 ? "text-green-400" : "text-red-400")}>
                          {holding.pnl >= 0 ? '+' : ''}${holding.pnl.toFixed(2)} ({holding.pnlPercent.toFixed(2)}%)
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" onClick={() => handleSellClick(holding.crypto)}>
                            Sell
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                      You have no crypto holdings. Start by buying from the dashboard.
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
