# CryptoPulse: Real-Time Trading Simulator & Analyzer

Welcome to **CryptoPulse**, a sophisticated and intuitive web application meticulously crafted for both aspiring and seasoned cryptocurrency traders. CryptoPulse harnesses the power of real-time market data and cutting-edge AI to provide a comprehensive suite of tools, including a dynamic market dashboard, AI-driven trading analysis, and a fully-featured virtual trading simulator.

Our mission is to empower users with the insights and tools needed to navigate the volatile world of cryptocurrency trading with confidence and strategic precision.

## Core Features

CryptoPulse is packed with features designed to provide a seamless and insightful trading experience.

### 1. Real-Time Crypto Dashboard

Stay ahead of the market with a dashboard that tracks the most dynamic cryptocurrencies.

-   **Top 50 Opportunities**: View a curated list of the top 50 cryptocurrencies, automatically sorted by their potential as short-term trading opportunities.
-   **Dual View Modes**:
    -   **Buy View**: Identifies the top 50 assets with the lowest Relative Strength Index (RSI), signaling potential "oversold" conditions ripe for buying.
    -   **Sell View**: Highlights the top 50 assets with the highest RSI, indicating potential "overbought" conditions.
-   **Pagination**: The dashboard is paginated to show 15 assets at a time, ensuring a clean and manageable interface while providing access to a broad range of opportunities.

### 2. Detailed Crypto View & AI-Powered Analysis

Dive deeper into any cryptocurrency to make informed decisions.

-   **Historical Price Chart**: Expand any crypto asset to view its 30-day price history, helping you visualize trends and volatility.
-   **AI Trade Signals**: With a single click, leverage Google's Gemini AI to generate custom short-term and long-term trading signals (Buy/Sell/Hold). The AI analyzes a combination of RSI, 24-hour volume, and market sentiment to provide a detailed explanation for its recommendation.

### 3. Virtual Trading Simulator

Practice your strategies without risking real capital.

-   **Virtual Balance**: Start with a virtual portfolio of **10,000 GUSD** (a virtual US dollar stablecoin).
-   **Live Trading**: Execute buy and sell orders on any listed cryptocurrency using real-time price data.
-   **Real-Time P&L**: Your portfolio value, cash balance, and profit & loss (P&L) for each holding are tracked in real-time, giving you immediate feedback on your trading performance.
-   **Wallet Reset**: Want to start fresh? Securely reset your wallet back to the initial 10,000 GUSD balance with a simple confirmation step.

### 4. Personalization & Accessibility

Tailor the CryptoPulse experience to your preferences.

-   **Multi-Language**: The entire interface can be instantly switched between English and Spanish.
-   **Multi-Currency**: Display all monetary values in either US Dollars (USD) or Costa Rican Colón (CRC), with exchange rates updated in real-time.
-   **Secure API Key Handling**: Your Google AI API key is stored exclusively in your local environment and is never transmitted to a server, ensuring your credentials remain private and secure.

## Getting Started

Follow these instructions to get the CryptoPulse application running on your local machine.

### Prerequisites

-   Node.js (v18 or later)
-   npm or yarn
-   A Google AI API Key

### 1. Installation

Clone the repository and install the required dependencies:

```bash
git clone <repository-url>
cd cryptopulse
npm install
```

### 2. Environment Configuration

You need to provide your Google AI API key for the AI features to function correctly.

1.  Create a new file named `.env.local` in the root of the project directory.
2.  Add your API key to this file.

    #### Google AI (Gemini) API Key (for AI trade signals)
    -   Go to [Google AI Studio](https://aistudio.google.com/app/apikey) to create an API key.

    Your `.env.local` file should look like this:

    ```
    GOOGLE_API_KEY=your_google_ai_api_key_here
    ```

### 3. Running the Development Server

Once the dependencies are installed and your environment variables are set, you can run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

### 4. Building for Production

To create a production-ready build of the application, run the following command:

```bash
npm run build
```

This will generate an optimized version of the app in the `.next` directory. You can then start the production server with:

```bash
npm run start
```
