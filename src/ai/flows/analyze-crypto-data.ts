'use server';

/**
 * @fileOverview Analyzes real-time crypto data to calculate RSI and display key data points.
 *
 * - analyzeCryptoData - A function that handles the crypto data analysis process.
 * - AnalyzeCryptoDataInput - The input type for the analyzeCryptoData function.
 * - AnalyzeCryptoDataOutput - The return type for the analyzeCryptoData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCryptoDataInputSchema = z.object({
  currentPrice: z.number().describe('The current price of the cryptocurrency.'),
  volume24h: z.number().describe('The 24-hour trading volume of the cryptocurrency.'),
  marketCap: z.number().describe('The market capitalization of the cryptocurrency.'),
  priceHistory: z.array(z.number()).describe('An array of historical prices for calculating RSI.'),
});
export type AnalyzeCryptoDataInput = z.infer<typeof AnalyzeCryptoDataInputSchema>;

const AnalyzeCryptoDataOutputSchema = z.object({
  currentPrice: z.number().describe('The current price of the cryptocurrency.'),
  volume24h: z.number().describe('The 24-hour trading volume of the cryptocurrency.'),
  marketCap: z.number().describe('The market capitalization of the cryptocurrency.'),
  rsi: z.number().describe('The Relative Strength Index (RSI) of the cryptocurrency.'),
});
export type AnalyzeCryptoDataOutput = z.infer<typeof AnalyzeCryptoDataOutputSchema>;

export async function analyzeCryptoData(input: AnalyzeCryptoDataInput): Promise<AnalyzeCryptoDataOutput> {
  return analyzeCryptoDataFlow(input);
}

/**
 * Calculates the Relative Strength Index (RSI).
 * @param {number[]} prices - An array of historical prices.
 * @param {number} period - The period for calculating RSI (default is 14).
 * @returns {number} The RSI value.
 */
function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period) {
    return 50; // Return neutral RSI if not enough data points are available
  }

  let gains = 0;
  let losses = 0;

  for (let i = 1; i < period + 1; i++) {
    const change = prices[prices.length - i] - prices[prices.length - i - 1];
    if (change > 0) {
      gains += change;
    } else {
      losses -= change;
    }
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  let rs = 0
  if (avgLoss !== 0) {
    rs = avgGain / avgLoss;
  }

  const rsi = 100 - (100 / (1 + rs));
  return rsi;
}

const analyzeCryptoDataPrompt = ai.definePrompt({
  name: 'analyzeCryptoDataPrompt',
  input: {schema: AnalyzeCryptoDataInputSchema},
  output: {schema: AnalyzeCryptoDataOutputSchema},
  prompt: `You are a crypto data analysis expert.

  Given the following data, calculate the RSI and return the data points:

  Current Price: {{currentPrice}}
  24h Volume: {{volume24h}}
  Market Cap: {{marketCap}}
  Price History: {{priceHistory}}

  RSI: {{calculateRSI priceHistory}}
  `,
});

const analyzeCryptoDataFlow = ai.defineFlow(
  {
    name: 'analyzeCryptoDataFlow',
    inputSchema: AnalyzeCryptoDataInputSchema,
    outputSchema: AnalyzeCryptoDataOutputSchema,
  },
  async input => {
    const rsi = calculateRSI(input.priceHistory);

    // Directly return the processed data without calling the LLM
    return {
      currentPrice: input.currentPrice,
      volume24h: input.volume24h,
      marketCap: input.marketCap,
      rsi: rsi,
    };
  }
);
