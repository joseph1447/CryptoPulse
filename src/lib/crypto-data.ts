import type { Crypto } from "./types";

export const cryptoNames = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "binancecoin", name: "BNB", symbol: "BNB" },
  { id: "cardano", name: "Cardano", symbol: "ADA" },
  { id: "solana", name: "Solana", symbol: "SOL" },
  { id: "ripple", name: "XRP", symbol: "XRP" },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE" },
  { id: "polkadot", name: "Polkadot", symbol: "DOT" },
  { id: "chainlink", name: "Chainlink", symbol: "LINK" },
  { id: "litecoin", name: "Litecoin", symbol: "LTC" },
  { id: "matic-network", name: "Polygon", symbol: "MATIC" },
  { id: "avalanche-2", name: "Avalanche", symbol: "AVAX" },
  { id: "uniswap", name: "Uniswap", symbol: "UNI" },
  { id: "stellar", name: "Stellar", symbol: "XLM" },
  { id: "cosmos", name: "Cosmos", symbol: "ATOM" },
];

const generatePriceHistory = (basePrice: number, length = 30): number[] => {
  const history = [basePrice];
  for (let i = 1; i < length; i++) {
    const change = (Math.random() - 0.5) * basePrice * 0.1;
    const newPrice = Math.max(0.01, history[i - 1] + change);
    history.push(newPrice);
  }
  return history.reverse();
};

export const calculateRSI = (prices: number[], period = 14): number => {
    if (prices.length < period + 1) {
      return 50;
    }
  
    let gains = 0;
    let losses = 0;
    const relevantPrices = prices.slice(prices.length - (period + 1));
  
    for (let i = 1; i < relevantPrices.length; i++) {
      const change = relevantPrices[i] - relevantPrices[i - 1];
      if (change > 0) {
        gains += change;
      } else {
        losses -= change;
      }
    }
  
    const avgGain = gains / period;
    const avgLoss = losses / period;
  
    if (avgLoss === 0) {
      return 100;
    }
  
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  };

export const mockCryptos: Crypto[] = cryptoNames.map((crypto) => {
  const basePrice = Math.random() * 80000 + 100;
  const priceHistory = generatePriceHistory(basePrice);
  const currentPrice = priceHistory[priceHistory.length - 1];
  const priceChange24h = ((currentPrice - priceHistory[priceHistory.length - 2]) / priceHistory[priceHistory.length - 2]) * 100;
  
  return {
    ...crypto,
    currentPrice: parseFloat(currentPrice.toFixed(2)),
    priceHistory,
    volume24h: Math.random() * 1e9 + 1e8,
    marketCap: Math.random() * 5e11 + 1e10,
    priceChange24h: parseFloat(priceChange24h.toFixed(2)),
    rsi: calculateRSI(priceHistory),
  };
});
