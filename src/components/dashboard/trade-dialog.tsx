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
  
  const liveCryptoData = cryptos.find(c => c.id === crypto.id) || crypto;
  const holding = holdings.find((h) => h.cryptoId === crypto.id);

  const buySchema = z.object({
    gusdAmount: z.coerce
      .number()
      .min(0.01, "Amount must be positive")
      .max(gusdBalance, "Insufficient GUSD balance"),
    cryptoAmount: z.coerce.number(),
  });

  const sellSchema = z.object({
    gusdAmount: z.coerce.number(),
    cryptoAmount: z.coerce
      .number()
      .min(1e-6, "Amount must be positive")
      .max(holding?.quantity || 0, "Insufficient crypto balance"),
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
  }, [activeTab, crypto, form]);

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
        toast({ title: "Purchase Successful", description: `You bought ${values.cryptoAmount.toFixed(6)} ${crypto.symbol}` });
      } else {
        toast({ variant: "destructive", title: "Purchase Failed", description: `Could not complete the transaction.` });
      }
    } else {
      success = sellCrypto(crypto.id, values.cryptoAmount);
      if (success) {
        toast({ title: "Sale Successful", description: `You sold ${values.cryptoAmount.toFixed(6)} ${crypto.symbol}` });
      } else {
        toast({ variant: "destructive", title: "Sale Failed", description: `Could not complete the transaction.` });
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
            Trade {crypto.name} ({crypto.symbol})
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
            Current Price: <span className="font-mono text-primary">${liveCryptoData.currentPrice.toLocaleString()}</span>
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <TabsContent value="buy">
                <div className="space-y-4 py-4">
                  <div className="text-sm text-right">Balance: <span className="font-mono text-primary">{gusdBalance.toFixed(2)} GUSD</span></div>
                   <FormField
                      control={form.control}
                      name="gusdAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount to Spend</FormLabel>
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
                          <FormLabel>Amount to Receive</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="any" onChange={handleCryptoChange} placeholder={`0.00 ${crypto.symbol}`} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                 <DialogFooter>
                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>Buy {crypto.symbol}</Button>
                </DialogFooter>
              </TabsContent>
              <TabsContent value="sell">
                <div className="space-y-4 py-4">
                    <div className="text-sm text-right">Balance: <span className="font-mono text-primary">{(holding?.quantity || 0).toFixed(6)} {crypto.symbol}</span></div>
                    <FormField
                      control={form.control}
                      name="cryptoAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount to Sell</FormLabel>
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
                          <FormLabel>Amount to Receive</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.01" onChange={handleGusdChange} placeholder="0.00 GUSD" readOnly />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                 <DialogFooter>
                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>Sell {crypto.symbol}</Button>
                </DialogFooter>
              </TabsContent>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
