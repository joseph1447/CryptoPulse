
export interface Crypto {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  priceHistory: number[];
  volume24h: number;
  marketCap: number;
  priceChange24h: number;
  rsi: number;
}

export interface Holding {
  cryptoId: string;
  quantity: number;
  avgBuyPrice: number; // Always in USD
}

export type Currency = 'USD' | 'CRC';

export interface CryptoContextType {
  cryptos: Crypto[];
  gusdBalance: number;
  holdings: Holding[];
  buyCrypto: (cryptoId: string, amount: number, amountIn: 'stablecoin' | 'crypto') => boolean;
  sellCrypto: (cryptoId: string, quantity: number) => boolean;
  portfolioValue: number;
  initialized: boolean;
  loading: boolean;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  exchangeRate: number; // USD to CRC
  binanceConnected: boolean;
  binanceConnectionError: string | null;
  fetchBinanceData: () => Promise<void>;
}

// i18n Types
export type Locale = 'en' | 'es';

export type Translations = {
  [key: string]: string | Translations;
};

export interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}
