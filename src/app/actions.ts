"use server";

import { analyzeCryptoData } from "@/ai/flows/analyze-crypto-data";
import { generateTradeSignals, type GenerateTradeSignalsInput, type GenerateTradeSignalsOutput } from "@/ai/flows/generate-trade-signals";

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

export async function getBinanceConnectionStatus(): Promise<{ connected: boolean }> {
    const apiKey = process.env.BINANCE_API_KEY;
    const apiSecret = process.env.BINANCE_API_SECRET;
    
    // In a real app, you might want to make a test call to Binance to verify the keys.
    // For this simulation, we'll just check for their existence.
    const connected = !!(apiKey && apiSecret);
    
    return { connected };
}
