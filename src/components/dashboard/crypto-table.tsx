"use client";

import { useState } from "react";
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ChevronDown, ChevronsUpDown } from "lucide-react";
import { CryptoDetailView } from "./crypto-detail-view";

export function CryptoTable({ cryptos }: { cryptos: Crypto[] }) {
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const [openCollapsible, setOpenCollapsible] = useState<string | null>(null);

  const handleBuyClick = (crypto: Crypto) => {
    setSelectedCrypto(crypto);
  };

  const handleTradeDialogClose = () => {
    setSelectedCrypto(null);
  };

  const toggleCollapsible = (cryptoId: string) => {
    setOpenCollapsible(openCollapsible === cryptoId ? null : cryptoId);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">24h %</TableHead>
              <TableHead className="hidden md:table-cell text-right">Volume (24h)</TableHead>
              <TableHead className="hidden lg:table-cell text-right">Market Cap</TableHead>
              <TableHead className="w-[120px] text-center">RSI</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cryptos.map((crypto) => (
              <Collapsible asChild key={crypto.id} open={openCollapsible === crypto.id} onOpenChange={() => toggleCollapsible(crypto.id)}>
                <>
                  <TableRow className="cursor-pointer">
                    <TableCell>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-9 p-0">
                           <ChevronDown className={cn("h-4 w-4 transition-transform", openCollapsible === crypto.id && "rotate-180")} />
                        </Button>
                      </CollapsibleTrigger>
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
                    <TableCell className="text-right font-mono">${crypto.currentPrice.toLocaleString()}</TableCell>
                    <TableCell
                      className={cn("text-right font-mono", crypto.priceChange24h >= 0 ? "text-green-400" : "text-red-400")}
                    >
                      {crypto.priceChange24h.toFixed(2)}%
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-right font-mono">${(crypto.volume24h / 1e9).toFixed(2)}B</TableCell>
                    <TableCell className="hidden lg:table-cell text-right font-mono">${(crypto.marketCap / 1e9).toFixed(2)}B</TableCell>
                    <TableCell>
                      <RSIIndicator value={crypto.rsi} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => handleBuyClick(crypto)}>
                        Buy
                      </Button>
                    </TableCell>
                  </TableRow>
                  <CollapsibleContent asChild>
                     <TableRow>
                        <TableCell colSpan={8}>
                           <CryptoDetailView crypto={crypto} />
                        </TableCell>
                     </TableRow>
                  </CollapsibleContent>
                </>
              </Collapsible>
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
