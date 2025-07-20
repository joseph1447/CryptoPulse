
// src/ai/flows/generate-trade-signals.ts
'use server';

/**
 * @fileOverview Generates trading signals based on crypto data analysis.
 *
 * - generateTradeSignals - A function that generates short-term and long-term buy/sell signals for cryptocurrencies.
 * - GenerateTradeSignalsInput - The input type for the generateTradeSignals function.
 * - GenerateTradeSignalsOutput - The return type for the generateTradeSignals function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTradeSignalsInputSchema = z.object({
  cryptoName: z.string().describe('The name of the cryptocurrency (e.g., BTC/USDT).'),
  currentPrice: z.number().describe('The current price of the cryptocurrency.'),
  volume24h: z.number().describe('The 24-hour trading volume of the cryptocurrency.'),
  rsi: z.number().describe('The Relative Strength Index (RSI) of the cryptocurrency.'),
});
export type GenerateTradeSignalsInput = z.infer<typeof GenerateTradeSignalsInputSchema>;

const GenerateTradeSignalsOutputSchema = z.object({
  shortTermSignal: z
    .enum(['BUY', 'SELL', 'HOLD'])
    .describe('Short-term trading signal based on RSI and volume.'),
  longTermSignal: z
    .enum(['BUY', 'SELL', 'HOLD'])
    .describe('Long-term trading signal based on general market sentiment and volume.'),
  explanation: z.string().describe('Explanation of the generated trading signals.'),
});
export type GenerateTradeSignalsOutput = z.infer<typeof GenerateTradeSignalsOutputSchema>;

export async function generateTradeSignals(input: GenerateTradeSignalsInput): Promise<GenerateTradeSignalsOutput> {
  return generateTradeSignalsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTradeSignalsPrompt',
  input: {schema: GenerateTradeSignalsInputSchema},
  output: {schema: GenerateTradeSignalsOutputSchema},
  prompt: `You are a financial analyst specializing in cryptocurrency trading signals.

  Based on the provided cryptocurrency data, generate short-term and long-term trading signals.

  Consider the following factors:
  - Short-term BUY: RSI is significantly low (below 30) and volume is decent.
  - Short-term SELL: RSI is significantly high (above 70).
  - Long-term BUY: Sustained high volume suggests strong interest.
  - Long-term SELL: Declining volume may suggest waning interest.

  Provide a brief explanation for each signal.

  Cryptocurrency: {{cryptoName}}
  Current Price: {{currentPrice}}
  24h Volume: {{volume24h}}
  RSI: {{rsi}}
  
  Output in JSON format.
`,
});

const generateTradeSignalsFlow = ai.defineFlow(
  {
    name: 'generateTradeSignalsFlow',
    inputSchema: GenerateTradeSignalsInputSchema,
    outputSchema: GenerateTradeSignalsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
