
"use server";

import { analyzeCryptoData } from "@/ai/flows/analyze-crypto-data";
import { generateTradeSignals, type GenerateTradeSignalsInput, type GenerateTradeSignalsOutput } from "@/ai/flows/generate-trade-signals";
import type { Crypto } from "@/lib/types";
import { cryptoNames, calculateRSI } from "@/lib/crypto-data";

const CUSTOM_API_URL = "https://docmanagerapi-1.onrender.com/api/top20-volatile";

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

        const fetchedCryptos = result.data.map((item: any): Crypto => {
            const cryptoInfo = cryptoNames.find(c => c.symbol === item.symbol) || {
                id: item.symbol.toLowerCase().replace(/[^a-z0-9]/g, ''),
                name: item.symbol,
                symbol: item.symbol,
            };
            
            const priceHistory = Array.from({ length: 30 }, (_, i) => {
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
              marketCap: 0, 
              priceChange24h: parseFloat(item.volatility),
              rsi: calculateRSI(priceHistory),
            };
        });

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
