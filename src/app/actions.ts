
"use server";

import { analyzeCryptoData } from "@/ai/flows/analyze-crypto-data";
import { generateTradeSignals, type GenerateTradeSignalsInput, type GenerateTradeSignalsOutput } from "@/ai/flows/generate-trade-signals";
import { testBinanceConnection } from "@/services/binance-service";

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

export async function getBinanceConnectionStatus(): Promise<{ connected: boolean, error?: string }> {
    const apiKey = process.env.BINANCE_API_KEY;
    const apiSecret = process.env.BINANCE_API_SECRET;
    
    if (!apiKey || !apiSecret) {
        return { connected: false };
    }

    return await testBinanceConnection(apiKey, apiSecret);
}
