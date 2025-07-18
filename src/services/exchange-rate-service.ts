
'use server';

/**
 * @fileOverview A mock service to get exchange rates.
 * In a real application, this would fetch data from a financial API.
 */

// Using a fixed rate for simulation purposes.
// As of late 2023, the rate is around 520-530.
const MOCK_USD_TO_CRC_RATE = 521.50;

const exchangeRates: Record<string, Record<string, number>> = {
  USD: {
    CRC: MOCK_USD_TO_CRC_RATE,
    USD: 1,
  },
  CRC: {
    USD: 1 / MOCK_USD_TO_CRC_RATE,
    CRC: 1,
  },
};

/**
 * Gets the exchange rate between two currencies.
 * @param {string} from - The currency to convert from (e.g., 'USD').
 * @param {string} to - The currency to convert to (e.g., 'CRC').
 * @returns {Promise<number>} The exchange rate.
 */
export async function getExchangeRate(from: string, to: string): Promise<number> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));

  if (exchangeRates[from] && exchangeRates[from][to]) {
    return exchangeRates[from][to];
  }

  console.error(`Exchange rate not found for ${from} to ${to}`);
  return 1; // Fallback to 1 if rate is not found
}
