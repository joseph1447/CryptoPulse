
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
