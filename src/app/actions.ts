
"use server";

import { generateTradeSignals, type GenerateTradeSignalsInput, type GenerateTradeSignalsOutput } from "@/ai/flows/generate-trade-signals";
import type { Crypto } from "@/lib/types";
import { cryptoNames } from "@/lib/crypto-data";

const CUSTOM_API_URL = "https://docmanagerapi-1.onrender.com/api/list-reliable-coins";

export async function getCryptoDataAction(): Promise<{
    success: boolean;
    data?: Crypto[];
    error?: string;
}> {
    try {
        const response = await fetch(CUSTOM_API_URL, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Failed to fetch from custom API. Status: ${response.status}`);
        }
        
        const result = await response.json();

        const fetchedCryptos = result.data.map((item: any): Crypto | null => {
            const cryptoInfo = cryptoNames.find(c => c.symbol === item.symbol);
            if (!cryptoInfo) return null; // Skip if we don't have a known name for it
            
            // Generate some plausible historical data for the chart, ending with the current price
            const priceHistory = Array.from({ length: 29 }, (_, i) => {
                const variance = (Math.random() - 0.5) * (item.currentPrice * 0.1); 
                return item.currentPrice + variance;
            });
            priceHistory.push(item.currentPrice);


            return {
              id: cryptoInfo.id,
              name: cryptoInfo.name,
              symbol: cryptoInfo.symbol,
              currentPrice: parseFloat(item.currentPrice),
              priceHistory: priceHistory,
              volume24h: parseFloat(item.tradeVolumeUSDT),
              priceChange24h: 0, // This data is not in the new API
              rsi: parseFloat(item.rsi),
              imageUrl: item.imageUrl,
            };
        }).filter((c: Crypto | null): c is Crypto => c !== null); // Filter out nulls

        return { success: true, data: fetchedCryptos };

    } catch (error) {
        console.error("Failed to fetch crypto data in server action:", error);
        if (error instanceof Error) {
            return { success: false, error: `Failed to fetch live data: ${error.message}. Please check your connection and the API status.` };
        }
        return { success: false, error: "An unknown error occurred while fetching crypto data." };
    }
}


export async function getTradeSignalsAction(input: GenerateTradeSignalsInput): Promise<{
    success: boolean;
    data?: GenerateTradeSignalsOutput;
    error?: string;
}> {
    try {
        const result = await generateTradeSignals(input);
        return { success: true, data: result };
    } catch (error) {
        console.error("Error generating trade signals:", error);
        return { success: false, error: "Failed to generate trade signals from AI." };
    }
}
