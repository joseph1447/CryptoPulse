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
import { CryptoLogo } from "../icons/crypto-logos";
import { useI18n } from "@/hooks/use-i18n";

interface TradeDialogProps {
  crypto: Crypto;
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "buy" | "sell";
}

export function TradeDialog({ crypto, isOpen, onClose, defaultTab = 'buy' }: TradeDialogProps) {
  const { cryptos, gusdBalance, holdings, buyCrypto, sellCrypto } = useCrypto();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const { t } = useI18n();
  
  const liveCryptoData = cryptos.find(c => c.id === crypto.id) || crypto;
  const holding = holdings.find((h) => h.cryptoId === crypto.id);

  const buySchema = z.object({
    gusdAmount: z.coerce
      .number()
      .min(0.01, t('tradeDialog.validation.positive'))
      .max(gusdBalance, t('tradeDialog.validation.insufficientGUSD')),
    cryptoAmount: z.coerce.number(),
  });

  const sellSchema = z.object({
    gusdAmount: z.coerce.number(),
    cryptoAmount: z.coerce
      .number()
      .min(1e-6, t('tradeDialog.validation.positive'))
      .max(holding?.quantity || 0, t('tradeDialog.validation.insufficientCrypto')),
  });
  
  const formSchema = activeTab === 'buy' ? buySchema : sellSchema;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gusdAmount: 0,
      cryptoAmount: 0,
    },
  });

  useEffect(() => {
    form.reset({ gusdAmount: 0, cryptoAmount: 0 });
    form.clearErrors();
  }, [activeTab, crypto, form]);
  
  useEffect(() => {
    form.reset({ gusdAmount: 0, cryptoAmount: 0 });
  }, [isOpen, form]);

  const handleGusdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const gusdVal = parseFloat(e.target.value);
    form.setValue("gusdAmount", gusdVal);
    if (liveCryptoData.currentPrice > 0) {
      form.setValue("cryptoAmount", gusdVal / liveCryptoData.currentPrice);
    }
  };

  const handleCryptoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cryptoVal = parseFloat(e.target.value);
    form.setValue("cryptoAmount", cryptoVal);
    form.setValue("gusdAmount", cryptoVal * liveCryptoData.currentPrice);
  };

  const onSubmit = (values: any) => {
    let success = false;
    if (activeTab === "buy") {
      success = buyCrypto(crypto.id, values.gusdAmount);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CryptoLogo symbol={crypto.symbol} className="h-6 w-6" />
            {t('tradeDialog.title', { name: crypto.name, symbol: crypto.symbol })}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
            {t('tradeDialog.currentPrice')}: <span className="font-mono text-primary">${liveCryptoData.currentPrice.toLocaleString()}</span>
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">{t('tradeDialog.buy')}</TabsTrigger>
            <TabsTrigger value="sell">{t('tradeDialog.sell')}</TabsTrigger>
          </TabsList>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <TabsContent value="buy">
                <div className="space-y-4 py-4">
                  <div className="text-sm text-right">{t('tradeDialog.balance')}: <span className="font-mono text-primary">{gusdBalance.toFixed(2)} GUSD</span></div>
                   <FormField
                      control={form.control}
                      name="gusdAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('tradeDialog.amountToSpend')}</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.01" onChange={handleGusdChange} placeholder="0.00 GUSD" />
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
                      name="gusdAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('tradeDialog.amountToReceive')}</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.01" onChange={handleGusdChange} placeholder="0.00 GUSD" readOnly />
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
