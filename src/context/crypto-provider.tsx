
"use client";

import { createContext, useState, useEffect, useMemo, useCallback } from "react";
import type { ReactNode } from "react";
import { cryptoNames, calculateRSI } from "@/lib/crypto-data";
import type { Crypto, Holding, CryptoContextType, Currency } from "@/lib/types";
import { getExchangeRate } from "@/services/exchange-rate-service";

export const CryptoContext = createContext<CryptoContextType | null>(null);

const INITIAL_GUSD_BALANCE = 10000;
const CUSTOM_API_URL = "https://docmanagerapi-1.onrender.com/api/top20-volatile";

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

    try {
      const response = await fetch(CUSTOM_API_URL, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Failed to fetch from custom API. Status: ${response.status}`);
      }
      
      const result = await response.json();
      setApiConnected(true);

      const fetchedCryptos = result.data.map((item: any): Crypto => {
        const cryptoInfo = cryptoNames.find(c => c.symbol === item.symbol) || {
            id: item.symbol.toLowerCase(),
            name: item.symbol,
            symbol: item.symbol,
        };
        
        // Generate mock price history for RSI calculation
        const priceHistory = Array.from({ length: 30 }, (_, i) => {
             // Simulate some variance, not just a flat line
            const variance = (Math.random() - 0.5) * (item.currentPrice * 0.1); 
            return item.currentPrice + variance;
        });

        return {
          id: cryptoInfo.id,
          name: cryptoInfo.name,
          symbol: cryptoInfo.symbol,
          currentPrice: parseFloat(item.currentPrice),
          priceHistory: priceHistory,
          volume24h: parseFloat(item.volume),
          marketCap: 0, // Not provided by the new API
          priceChange24h: parseFloat(item.volatility), // Using volatility as 24h change
          rsi: calculateRSI(priceHistory),
        };
      });

      setCryptos(fetchedCryptos);

    } catch (error) {
      console.error("Failed to fetch crypto data:", error);
      if (error instanceof Error) {
        setApiConnectionError(`Failed to fetch live data: ${error.message}. Please check your connection and the API status.`);
      }
      setApiConnected(false);
      setCryptos([]);
    } finally {
      if (!initialized) {
        setInitialized(true);
      }
      setLoading(false);
    }
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
