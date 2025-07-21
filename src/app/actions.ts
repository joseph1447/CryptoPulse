
"use server";

import { generateTradeSignals, type GenerateTradeSignalsInput, type GenerateTradeSignalsOutput } from "@/ai/flows/generate-trade-signals";
import type { Crypto } from "@/lib/types";

const CUSTOM_API_URL = "https://docmanagerapi-1.onrender.com/api/list-reliable-coins";

function getCryptoNameFromSymbol(symbol: string): string {
    const names: { [key: string]: string } = {
        BTC: "Bitcoin",
        ETH: "Ethereum",
        BNB: "BNB",
        ADA: "Cardano",
        SOL: "Solana",
        XRP: "XRP",
        DOGE: "Dogecoin",
        DOT: "Polkadot",
        LINK: "Chainlink",
        LTC: "Litecoin",
        MATIC: "Polygon",
        AVAX: "Avalanche",
        UNI: "Uniswap",
        XLM: "Stellar",
        ATOM: "Cosmos",
        FDUSD: "First Digital USD",
        USDC: "USD Coin",
        DAI: "Dai",
        BUSD: "Binance USD",
        CFX: "Conflux",
        PEPE: "Pepe",
        ENA: "Ethena",
        SUI: "Sui",
        // Add other mappings as needed
    };
    return names[symbol] || symbol;
}


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
            const name = getCryptoNameFromSymbol(item.symbol);
            if (!name) return null; // Skip if we don't have a known name for it
            
            // Generate some plausible historical data for the chart, ending with the current price
            const priceHistory = Array.from({ length: 29 }, (_, i) => {
                const variance = (Math.random() - 0.5) * (item.currentPrice * 0.1); 
                return item.currentPrice + variance;
            });
            priceHistory.push(item.currentPrice);


            return {
              id: item.symbol.toLowerCase(),
              name: name,
              symbol: item.symbol,
              currentPrice: parseFloat(item.currentPrice),
              priceHistory: priceHistory,
              volume24h: parseFloat(item.tradeVolumeUSDT),
              priceChange24h: 0, // This data is not in the new API
              rsi: parseFloat(item.rsi),
              imageUrl: `https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`,
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
