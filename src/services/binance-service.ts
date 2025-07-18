'use server';

import crypto from 'crypto';

const BINANCE_API_URL = 'https://api.binance.com';

/**
 * Creates a signed request to the Binance API.
 * @param {string} apiKey - The API key.
 * @param {string} apiSecret - The API secret.
 * @param {string} path - The API endpoint path.
 * @param {Record<string, string>} params - The request parameters.
 * @returns {Promise<any>} The JSON response from the API.
 */
async function signedRequest(apiKey: string, apiSecret: string, path: string, params: Record<string, string> = {}) {
    const timestamp = Date.now();
    const queryString = new URLSearchParams({ ...params, timestamp: String(timestamp) }).toString();
    
    const signature = crypto
        .createHmac('sha256', apiSecret)
        .update(queryString)
        .digest('hex');

    const url = `${BINANCE_API_URL}${path}?${queryString}&signature=${signature}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-MBX-APIKEY': apiKey,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Binance API error: ${data.msg || 'Unknown error'}`);
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to connect to Binance API: ${error.message}`);
        }
        throw new Error('An unknown error occurred while connecting to Binance.');
    }
}

/**
 * Creates a public request to the Binance API.
 * @param {string} path - The API endpoint path.
 * @param {Record<string, any>} params - The request parameters.
 * @returns {Promise<any>} The JSON response from the API.
 */
async function publicRequest(path: string, params: Record<string, any> = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${BINANCE_API_URL}${path}?${queryString}`;

    try {
        const response = await fetch(url, { next: { revalidate: 10 } }); // Revalidate cache every 10s
        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Binance API error: ${data.msg || 'Unknown error'}`);
        }
        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch from Binance API: ${error.message}`);
        }
        throw new Error('An unknown error occurred while fetching from Binance.');
    }
}


/**
 * Tests the connection to the Binance API by fetching account info.
 * @param {string} apiKey - The Binance API key.
 * @param {string} apiSecret - The Binance API secret.
 * @returns {Promise<{ connected: boolean, error?: string }>} The connection status.
 */
export async function testBinanceConnection(apiKey: string, apiSecret: string): Promise<{ connected: boolean, error?: string }> {
    try {
        await signedRequest(apiKey, apiSecret, '/api/v3/account');
        return { connected: true };
    } catch (error) {
        if (error instanceof Error) {
            return { connected: false, error: error.message };
        }
        return { connected: false, error: 'An unknown error occurred.' };
    }
}

/**
 * Fetches 24-hour ticker information for all symbols.
 * @returns {Promise<any>} The ticker data.
 */
export async function getAllTickers(): Promise<any> {
    return publicRequest('/api/v3/ticker/24hr');
}

/**
 * Fetches 24-hour ticker information for specific symbols.
 * @param {string[]} symbols - An array of symbols to fetch (e.g., ['BTCUSDT', 'ETHUSDT']).
 * @returns {Promise<any>} The ticker data.
 */
export async function getTickers(symbols: string[]): Promise<any> {
    const symbolsParam = JSON.stringify(symbols);
    return publicRequest('/api/v3/ticker/24hr', { symbols: symbolsParam });
}

/**
 * Fetches kline/candlestick data for a symbol.
 * @param {string} symbol - The symbol to fetch klines for (e.g., 'BTCUSDT').
 * @param {string} interval - The kline interval (e.g., '1h', '4h', '1d').
 * @param {number} limit - The number of klines to retrieve.
 * @returns {Promise<any>} The kline data.
 */
export async function getKlines(symbol: string, interval: string = '1d', limit: number = 30): Promise<any> {
    return publicRequest('/api/v3/klines', {
        symbol,
        interval,
        limit: String(limit),
    });
}
