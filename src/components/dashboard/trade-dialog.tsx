
"use client";

import type { Crypto } from "@/lib/types";
import { useCrypto } from "@/hooks/use-crypto";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/hooks/use-i18n";
import Image from "next/image";

interface TradeDialogProps {
  crypto: Crypto;
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "buy" | "sell";
}

export function TradeDialog({ crypto, isOpen, onClose, defaultTab = 'buy' }: TradeDialogProps) {
  const { cryptos, gusdBalance, holdings, buyCrypto, sellCrypto, currency, exchangeRate } = useCrypto();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const { t } = useI18n();
  
  const liveCryptoData = cryptos.find(c => c.id === crypto.id) || crypto;
  const holding = holdings.find((h) => h.cryptoId === crypto.id);
  const stablecoinName = currency === 'CRC' ? 'GCNS' : 'GUSD';
  const stablecoinBalance = currency === 'CRC' ? gusdBalance * exchangeRate : gusdBalance;
  const livePriceInSelectedCurrency = currency === 'CRC' ? liveCryptoData.currentPrice * exchangeRate : liveCryptoData.currentPrice;

  const buySchema = z.object({
    stablecoinAmount: z.coerce
      .number()
      .min(0.01, t('tradeDialog.validation.positive'))
      .max(stablecoinBalance, t('tradeDialog.validation.insufficientGUSD', { stablecoin: stablecoinName })),
    cryptoAmount: z.coerce.number(),
  });

  const sellSchema = z.object({
    stablecoinAmount: z.coerce.number(),
    cryptoAmount: z.coerce
      .number()
      .min(1e-6, t('tradeDialog.validation.positive'))
      .max(holding?.quantity || 0, t('tradeDialog.validation.insufficientCrypto')),
  });
  
  const formSchema = activeTab === 'buy' ? buySchema : sellSchema;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stablecoinAmount: 0,
      cryptoAmount: 0,
    },
  });

  useEffect(() => {
    form.reset({ stablecoinAmount: 0, cryptoAmount: 0 });
    form.clearErrors();
  }, [activeTab, crypto, form, currency]);
  
  useEffect(() => {
    form.reset({ stablecoinAmount: 0, cryptoAmount: 0 });
  }, [isOpen, form]);

  const handleStablecoinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const stablecoinVal = parseFloat(e.target.value) || 0;
    form.setValue("stablecoinAmount", stablecoinVal);
    if (livePriceInSelectedCurrency > 0) {
      form.setValue("cryptoAmount", stablecoinVal / livePriceInSelectedCurrency);
    }
  };

  const handleCryptoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cryptoVal = parseFloat(e.target.value) || 0;
    form.setValue("cryptoAmount", cryptoVal);
    form.setValue("stablecoinAmount", cryptoVal * livePriceInSelectedCurrency);
  };

  const onSubmit = (values: any) => {
    let success = false;
    if (activeTab === "buy") {
      success = buyCrypto(crypto.id, values.stablecoinAmount, 'stablecoin');
      if (success) {
        toast({ title: t('tradeDialog.purchaseSuccessTitle'), description: t('tradeDialog.purchaseSuccessDescription', { amount: values.cryptoAmount.toFixed(6), symbol: crypto.symbol }) });
      } else {
        toast({ variant: "destructive", title: t('tradeDialog.purchaseFailTitle'), description: t('tradeDialog.purchaseFailDescription') });
      }
    } else {
      success = sellCrypto(crypto.id, values.cryptoAmount);
      if (success) {
        toast({ title: t('tradeDialog.saleSuccessTitle'), description: t('tradeDialog.saleSuccessDescription', { amount: values.cryptoAmount.toFixed(6), symbol: crypto.symbol }) });
      } else {
        toast({ variant: "destructive", title: t('tradeDialog.saleFailTitle'), description: t('tradeDialog.saleFailDescription') });
      }
    }
    if (success) onClose();
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'symbol'
    }).format(value);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image src={crypto.imageUrl} alt={`${crypto.name} logo`} width={24} height={24} className="h-6 w-6 rounded-full" />
            {t('tradeDialog.title', { name: crypto.name, symbol: crypto.symbol })}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
            {t('tradeDialog.currentPrice')}: <span className="font-mono text-primary">{formatCurrency(livePriceInSelectedCurrency)}</span>
        </p>

        <Tabs value={activeTab} onValueChange={(tab) => setActiveTab(tab as 'buy' | 'sell')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">{t('tradeDialog.buy')}</TabsTrigger>
            <TabsTrigger value="sell">{t('tradeDialog.sell')}</TabsTrigger>
          </TabsList>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <TabsContent value="buy">
                <div className="space-y-4 py-4">
                  <div className="text-sm text-right">{t('tradeDialog.balance')}: <span className="font-mono text-primary">{stablecoinBalance.toFixed(2)} {stablecoinName}</span></div>
                   <FormField
                      control={form.control}
                      name="stablecoinAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('tradeDialog.amountToSpend', { stablecoin: stablecoinName })}</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.01" onChange={handleStablecoinChange} placeholder={`0.00 ${stablecoinName}`} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="cryptoAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('tradeDialog.amountToReceive')}</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="any" onChange={handleCryptoChange} placeholder={`0.00 ${crypto.symbol}`} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                 <DialogFooter>
                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>{t('tradeDialog.buy')} {crypto.symbol}</Button>
                </DialogFooter>
              </TabsContent>
              <TabsContent value="sell">
                <div className="space-y-4 py-4">
                    <div className="text-sm text-right">{t('tradeDialog.balance')}: <span className="font-mono text-primary">{(holding?.quantity || 0).toFixed(6)} {crypto.symbol}</span></div>
                    <FormField
                      control={form.control}
                      name="cryptoAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('tradeDialog.amountToSell')}</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="any" onChange={handleCryptoChange} placeholder={`0.00 ${crypto.symbol}`} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="stablecoinAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('tradeDialog.amountToReceiveIn', { stablecoin: stablecoinName })}</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.01" onChange={handleStablecoinChange} placeholder={`0.00 ${stablecoinName}`} readOnly />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                 <DialogFooter>
                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>{t('tradeDialog.sell')} {crypto.symbol}</Button>
                </DialogFooter>
              </TabsContent>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
