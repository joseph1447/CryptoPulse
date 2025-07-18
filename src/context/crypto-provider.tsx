
"use client";

import { createContext, useState, useEffect, useMemo, useCallback } from "react";
import type { ReactNode } from "react";
import { cryptoNames, calculateRSI } from "@/lib/crypto-data";
import type { Crypto, Holding, CryptoContextType, Currency } from "@/lib/types";
import { getExchangeRate } from "@/services/exchange-rate-service";
import { getBinanceConnectionStatus } from "@/app/actions";
import { getKlines, getTickers, getAllTickers } from "@/services/binance-service";

export const CryptoContext = createContext<CryptoContextType | null>(null);

const INITIAL_GUSD_BALANCE = 10000;
const TOP_N_BY_VOLUME = 50; // Analyze the top 50 cryptos by volume

export function CryptoProvider({ children }: { children: ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [gusdBalance, setGusdBalance] = useState<number>(INITIAL_GUSD_BALANCE);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [currency, setCurrencyState] = useState<Currency>('USD');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [binanceConnected, setBinanceConnected] = useState(false);
  const [binanceConnectionError, setBinanceConnectionError] = useState<string | null>(null);
  
  const [dynamicCryptoList, setDynamicCryptoList] = useState<string[]>([]);

  const fetchBinanceData = useCallback(async () => {
    setLoading(true);
    if (!binanceConnected) {
        setInitialized(true);
        setLoading(false);
        return;
    }

    try {
        let symbolsToFetch = dynamicCryptoList;
        // Step 1: Fetch all USDT tickers to identify top symbols by volume on first load
        if (symbolsToFetch.length === 0) {
            const allTickers = await getAllTickers();
            const usdtTickers = allTickers
                .filter((t: any) => t.symbol.endsWith('USDT') && !t.symbol.includes('UP') && !t.symbol.includes('DOWN'))
                .sort((a: any, b: any) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
                .slice(0, TOP_N_BY_VOLUME);
            const topSymbols = usdtTickers.map((t:any) => t.symbol);
            setDynamicCryptoList(topSymbols);
            symbolsToFetch = topSymbols;
        }

        // Step 2: Fetch detailed ticker and k-line data for these symbols
        const tickers = await getTickers(symbolsToFetch);

        const fetchedCryptos = await Promise.all(tickers.map(async (ticker: any) => {
            const cryptoInfo = cryptoNames.find(c => `${c.symbol}USDT` === ticker.symbol) || {
                id: ticker.symbol.replace('USDT', '').toLowerCase(),
                name: ticker.symbol.replace('USDT', ''),
                symbol: ticker.symbol.replace('USDT', ''),
            };

            const klines = await getKlines(ticker.symbol, '1d', 30);
            const priceHistory = klines.map((k: any) => parseFloat(k[4]));

            return {
                id: cryptoInfo.id,
                name: cryptoInfo.name,
                symbol: cryptoInfo.symbol,
                currentPrice: parseFloat(ticker.lastPrice),
                priceHistory: priceHistory,
                volume24h: parseFloat(ticker.quoteVolume),
                marketCap: parseFloat(ticker.lastPrice) * parseFloat(ticker.totalTradedBaseAssetVolume),
                priceChange24h: parseFloat(ticker.priceChangePercent),
                rsi: calculateRSI(priceHistory),
            };
        }));
        
        setCryptos(fetchedCryptos.filter(Boolean) as Crypto[]);

    } catch (error) {
        console.error("Failed to fetch Binance data:", error);
        if (error instanceof Error) {
            setBinanceConnectionError(`Failed to fetch live data: ${error.message}.`);
        }
        setCryptos([]); // Clear data on error
    } finally {
        if (!initialized) {
            setInitialized(true);
        }
        setLoading(false);
    }
  }, [binanceConnected, dynamicCryptoList, initialized]);

  useEffect(() => {
    async function checkConnection() {
      const { connected, error } = await getBinanceConnectionStatus();
      setBinanceConnected(connected);
      if (error) {
        setBinanceConnectionError(error);
        setInitialized(true); // If connection fails, we are "initialized" to an error state
        setLoading(false);
      }
    }
    checkConnection();
  }, []);

  useEffect(() => {
    if (binanceConnected) {
      fetchBinanceData(); // Initial fetch
    }
  }, [binanceConnected, fetchBinanceData]);


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
    binanceConnected,
    binanceConnectionError,
    fetchBinanceData
  };

  return (
    <CryptoContext.Provider value={contextValue}>
      {children}
    </CryptoContext.Provider>
  );
}
