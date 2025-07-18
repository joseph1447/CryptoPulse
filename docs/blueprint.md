# **App Name**: CryptoPulse

## Core Features:

- Binance API Key Integration: Securely collect and store user's Binance API key for fetching data; store locally. Provide clear warnings about key security.
- Real-Time Crypto Data Analysis: Analyze real-time crypto data including current price, volume, market cap, and calculate Relative Strength Index (RSI). Display data points clearly to the user. Use this tool for the other features.
- Buy/Sell Signal Logic: Generate short-term buy/sell signals based on RSI thresholds and volume; long-term strategy signals based on market cap growth and sustained volume. Adjust buy/sell signal logic dynamically.
- Landing Page - Top 10 Short-Term Opportunities: Display a table/list of the 'Top 10 Cryptos on Binance to Buy' based on RSI and volume. Show Crypto Name, Current Price, 24h Change, 24h Volume, and RSI value. Rank by lowest RSI.
- Virtual Wallet: Enable a virtual wallet with a set amount of 'GUSD'. Track and display total holdings in the virtual wallet. Color-code to differentiate between profit/loss for each held asset and the overall portfolio.
- Buy/Sell Interface: Allow users to execute simulated trades (buy/sell) via modal or dedicated section. Support real-time price updates and a confirmation before trade execution.
- Price Chart and RSI Indicator: Display a line chart showing price movement and/or a visual indicator for current RSI for the selected crypto. Use this feature to simplify reading charts without overwhelming a user

## Style Guidelines:

- Primary color: Electric blue (#7DF9FF) to evoke energy and innovation within the crypto space.
- Background color: Deep charcoal (#222E31) for a modern and sleek foundation, providing high contrast for content.
- Accent color: Subtle purple (#BE95C4) to highlight interactive elements, creating a dynamic visual experience.
- Body and headline font: 'Inter', a grotesque-style sans-serif font for a modern, neutral look suitable for both headlines and body text.
- Utilize Lucide React for user-friendly icons for settings, wallet, navigation, and interactive elements.
- Employ clean lines and negative space; round the corners on all the UI elements to achieve a modern & sleek look
- Incorporate smooth transitions on data updates and hover states to improve UX