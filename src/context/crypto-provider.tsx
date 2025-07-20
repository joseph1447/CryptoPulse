
"use client";

import { createContext, useState, useEffect, useMemo, useCallback } from "react";
import type { ReactNode } from "react";
import type { Crypto, Holding, CryptoContextType, Currency } from "@/lib/types";
import { getExchangeRate } from "@/services/exchange-rate-service";
import { getCryptoDataAction } from "@/app/actions";

export const CryptoContext = createContext<CryptoContextType | null>(null);

const INITIAL_GUSD_BALANCE = 10000;

export function CryptoProvider({ children }: { children: ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [gusdBalance, setGusdBalance] = useState<number>(INITIAL_GUSD_BALANCE);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [currency, setCurrencyState] = useState<Currency>('USD');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [apiConnected, setApiConnected] = useState(false);
  const [apiConnectionError, setApiConnectionError] = useState<string | null>(null);

  const fetchCryptoData = useCallback(async () => {
    setLoading(true);
    setApiConnectionError(null);

    const result = await getCryptoDataAction();

    if (result.success && result.data) {
        setApiConnected(true);
        setCryptos(result.data);
    } else {
        console.error("Failed to fetch crypto data:", result.error);
        setApiConnected(false);
        setApiConnectionError(result.error || "An unknown error occurred.");
        setCryptos([]);
    }

    if (!initialized) {
        setInitialized(true);
    }
    setLoading(false);
  }, [initialized]);

  useEffect(() => {
    fetchCryptoData();
  }, [fetchCryptoData]);


  useEffect(() => {
    async function fetchRate() {
      const rate = await getExchangeRate('USD', 'CRC');
      setExchangeRate(rate);
    }
    fetchRate();
  }, []);

  useEffect(() => {
    try {
      const storedBalance = localStorage.getItem("gusdBalance");
      const storedHoldings = localStorage.getItem("holdings");
      const storedCurrency = localStorage.getItem("currency");

      if (storedBalance) setGusdBalance(JSON.parse(storedBalance));
      if (storedHoldings) setHoldings(JSON.parse(storedHoldings));
      if (storedCurrency && (storedCurrency === 'USD' || storedCurrency === 'CRC')) {
        setCurrencyState(storedCurrency as Currency);
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
      setGusdBalance(INITIAL_GUSD_BALANCE);
      setHoldings([]);
      setCurrencyState('USD');
    }
  }, []);
  
  useEffect(() => {
    if (initialized) {
      localStorage.setItem("gusdBalance", JSON.stringify(gusdBalance));
      localStorage.setItem("holdings", JSON.stringify(holdings));
      localStorage.setItem("currency", currency);
    }
  }, [gusdBalance, holdings, currency, initialized]);

  const portfolioValue = useMemo(() => {
    return holdings.reduce((total, holding) => {
      const crypto = cryptos.find((c) => c.id === holding.cryptoId);
      return total + (crypto ? holding.quantity * crypto.currentPrice : 0);
    }, 0);
  }, [holdings, cryptos]);

  const buyCrypto = useCallback((cryptoId: string, amount: number, amountIn: 'stablecoin' | 'crypto' = 'stablecoin'): boolean => {
    const crypto = cryptos.find((c) => c.id === cryptoId);
    if (!crypto) return false;

    const amountInUsd = amountIn === 'stablecoin' 
      ? (currency === 'CRC' ? amount / exchangeRate : amount) 
      : amount * crypto.currentPrice;
      
    if (amountInUsd > gusdBalance || amountInUsd <= 0) return false;

    const quantity = amountInUsd / crypto.currentPrice;
    setGusdBalance((prev) => prev - amountInUsd);

    setHoldings((prev) => {
      const existingHoldingIndex = prev.findIndex((h) => h.cryptoId === cryptoId);
      if (existingHoldingIndex !== -1) {
        const existingHolding = prev[existingHoldingIndex];
        const newQuantity = existingHolding.quantity + quantity;
        const newAvgBuyPrice =
          (existingHolding.avgBuyPrice * existingHolding.quantity + amountInUsd) / newQuantity;
        
        const newHoldings = [...prev];
        newHoldings[existingHoldingIndex] = {
          ...existingHolding,
          quantity: newQuantity,
          avgBuyPrice: newAvgBuyPrice,
        };
        return newHoldings;
      } else {
        return [
          ...prev,
          { cryptoId, quantity, avgBuyPrice: crypto.currentPrice },
        ];
      }
    });
    return true;
  }, [cryptos, gusdBalance, currency, exchangeRate]);

  const sellCrypto = useCallback((cryptoId: string, quantityToSell: number): boolean => {
    const crypto = cryptos.find((c) => c.id === cryptoId);
    const holding = holdings.find((h) => h.cryptoId === cryptoId);

    if (!crypto || !holding || quantityToSell > holding.quantity || quantityToSell <= 0) {
      return false;
    }

    const gusdAmount = quantityToSell * crypto.currentPrice;
    setGusdBalance((prev) => prev + gusdAmount);

    setHoldings((prev) => {
      const newQuantity = holding.quantity - quantityToSell;
      if (newQuantity < 1e-6) { // floating point precision
        return prev.filter((h) => h.cryptoId !== cryptoId);
      } else {
        return prev.map((h) =>
          h.cryptoId === cryptoId ? { ...h, quantity: newQuantity } : h
        );
      }
    });
    return true;
  }, [cryptos, holdings]);

  const setCurrency = useCallback((newCurrency: Currency) => {
    setCurrencyState(newCurrency);
  }, []);

  const contextValue = {
    cryptos,
    gusdBalance,
    holdings,
    buyCrypto,
    sellCrypto,
    portfolioValue,
    initialized,
    loading,
    currency,
    setCurrency,
    exchangeRate,
    apiConnected: apiConnected,
    apiConnectionError: apiConnectionError,
    fetchCryptoData: fetchCryptoData
  };

  return (
    <CryptoContext.Provider value={contextValue}>
      {children}
    </CryptoContext.Provider>
  );
}
