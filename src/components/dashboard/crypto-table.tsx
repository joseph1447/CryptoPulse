
"use client";

import { useState, Fragment } from "react";
import type { Crypto } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RSIIndicator } from "./rsi-indicator";
import { CryptoLogo } from "../icons/crypto-logos";
import { TradeDialog } from "./trade-dialog";
import { ChevronDown } from "lucide-react";
import { CryptoDetailView } from "./crypto-detail-view";
import { useI18n } from "@/hooks/use-i18n";
import { useCrypto } from "@/hooks/use-crypto";

export function CryptoTable({ cryptos: initialCryptos }: { cryptos: Crypto[] }) {
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const [openCollapsible, setOpenCollapsible] = useState<string | null>(null);
  const { t, locale } = useI18n();
  const { currency, exchangeRate, cryptos } = useCrypto();

  const handleBuyClick = (crypto: Crypto) => {
    setSelectedCrypto(crypto);
  };

  const handleTradeDialogClose = () => {
    setSelectedCrypto(null);
  };

  const toggleCollapsible = (cryptoId: string) => {
    setOpenCollapsible(openCollapsible === cryptoId ? null : cryptoId);
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        currencyDisplay: 'symbol',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
  }

  const formatBigNumber = (value: number) => {
    const val = currency === 'CRC' ? value * exchangeRate : value;
    if (val > 1_000_000_000) {
      return `${formatCurrency(val / 1_000_000_000)}B`;
    }
    if (val > 1_000_000) {
      return `${formatCurrency(val / 1_000_000)}M`;
    }
    return formatCurrency(val);
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>{t('cryptoTable.name')}</TableHead>
              <TableHead className="text-right">{t('cryptoTable.price')}</TableHead>
              <TableHead className="text-right">{t('cryptoTable.change24h')}</TableHead>
              <TableHead className="hidden md:table-cell text-right">{t('cryptoTable.volume24h')}</TableHead>
              <TableHead className="hidden lg:table-cell text-right">{t('cryptoTable.marketCap')}</TableHead>
              <TableHead className="w-[120px] text-center">{t('cryptoTable.rsi')}</TableHead>
              <TableHead className="text-right">{t('cryptoTable.action')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cryptos.map((crypto) => (
              <Fragment key={crypto.id}>
                  <TableRow className="cursor-pointer" onClick={() => toggleCollapsible(crypto.id)}>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="w-9 p-0" aria-label={t('cryptoTable.expandRow')}>
                         <ChevronDown className={cn("h-4 w-4 transition-transform", openCollapsible === crypto.id && "rotate-180")} />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <CryptoLogo symbol={crypto.symbol} className="h-8 w-8" />
                        <div>
                          <div className="font-medium">{crypto.name}</div>
                          <div className="text-muted-foreground text-xs">{crypto.symbol}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(crypto.currentPrice * (currency === 'CRC' ? exchangeRate : 1))}</TableCell>
                    <TableCell
                      className={cn("text-right font-mono", crypto.priceChange24h >= 0 ? "text-green-400" : "text-red-400")}
                    >
                      {crypto.priceChange24h.toFixed(2)}%
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-right font-mono">{formatBigNumber(crypto.volume24h)}</TableCell>
                    <TableCell className="hidden lg:table-cell text-right font-mono">{formatBigNumber(crypto.marketCap)}</TableCell>
                    <TableCell>
                      <RSIIndicator value={crypto.rsi} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={(e) => { e.stopPropagation(); handleBuyClick(crypto); }}>
                        {t('tradeDialog.buy')}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {openCollapsible === crypto.id && (
                     <TableRow>
                        <TableCell colSpan={8} className="p-0">
                           <CryptoDetailView crypto={crypto} />
                        </TableCell>
                     </TableRow>
                  )}
                </Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
      {selectedCrypto && (
        <TradeDialog
          crypto={selectedCrypto}
          isOpen={!!selectedCrypto}
          onClose={handleTradeDialogClose}
        />
      )}
    </>
  );
}
