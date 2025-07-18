"use client";

import { createContext, useState, useEffect, useMemo, useCallback } from "react";
import type { ReactNode } from "react";
import { mockCryptos, simulatePriceUpdate } from "@/lib/crypto-data";
import type { Crypto, Holding, CryptoContextType } from "@/lib/types";

export const CryptoContext = createContext<CryptoContextType | null>(null);

const INITIAL_GUSD_BALANCE = 10000;

export function CryptoProvider({ children }: { children: ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const [cryptos, setCryptos] = useState<Crypto[]>(mockCryptos);
  const [gusdBalance, setGusdBalance] = useState<number>(INITIAL_GUSD_BALANCE);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [apiKeys, setApiKeysState] = useState({ key: "", secret: "" });

  useEffect(() => {
    try {
      const storedBalance = localStorage.getItem("gusdBalance");
      const storedHoldings = localStorage.getItem("holdings");
      const storedApiKeys = localStorage.getItem("apiKeys");

      if (storedBalance) setGusdBalance(JSON.parse(storedBalance));
      if (storedHoldings) setHoldings(JSON.parse(storedHoldings));
      if (storedApiKeys) setApiKeysState(JSON.parse(storedApiKeys));
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
      setGusdBalance(INITIAL_GUSD_BALANCE);
      setHoldings([]);
      setApiKeysState({ key: "", secret: "" });
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem("gusdBalance", JSON.stringify(gusdBalance));
    }
  }, [gusdBalance, initialized]);
  
  useEffect(() => {
    if (initialized) {
      localStorage.setItem("holdings", JSON.stringify(holdings));
    }
  }, [holdings, initialized]);
  
  useEffect(() => {
    if (initialized) {
      localStorage.setItem("apiKeys", JSON.stringify(apiKeys));
    }
  }, [apiKeys, initialized]);


  useEffect(() => {
    const interval = setInterval(() => {
      setCryptos((prevCryptos) =>
        prevCryptos.map((crypto) => simulatePriceUpdate(crypto))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const portfolioValue = useMemo(() => {
    return holdings.reduce((total, holding) => {
      const crypto = cryptos.find((c) => c.id === holding.cryptoId);
      return total + (crypto ? holding.quantity * crypto.currentPrice : 0);
    }, 0);
  }, [holdings, cryptos]);

  const buyCrypto = useCallback((cryptoId: string, gusdAmount: number): boolean => {
    const crypto = cryptos.find((c) => c.id === cryptoId);
    if (!crypto || gusdAmount > gusdBalance || gusdAmount <= 0) {
      return false;
    }

    const quantity = gusdAmount / crypto.currentPrice;
    setGusdBalance((prev) => prev - gusdAmount);

    setHoldings((prev) => {
      const existingHoldingIndex = prev.findIndex((h) => h.cryptoId === cryptoId);
      if (existingHoldingIndex !== -1) {
        const existingHolding = prev[existingHoldingIndex];
        const newQuantity = existingHolding.quantity + quantity;
        const newAvgBuyPrice =
          (existingHolding.avgBuyPrice * existingHolding.quantity + gusdAmount) / newQuantity;
        
        const newHoldings = [...prev];
        newHoldings[existingHoldingIndex] = {
          cryptoId,
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
  }, [cryptos, gusdBalance]);

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

  const setApiKeys = useCallback((keys: { key: string; secret: string }) => {
    setApiKeysState(keys);
  }, []);

  const contextValue = {
    cryptos,
    gusdBalance,
    holdings,
    buyCrypto,
    sellCrypto,
    portfolioValue,
    initialized,
    apiKeys,
    setApiKeys,
  };

  return (
    <CryptoContext.Provider value={contextValue}>
      {children}
    </CryptoContext.Provider>
  );
}
