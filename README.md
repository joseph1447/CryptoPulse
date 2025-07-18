# CryptoPulse: Real-Time Trading Simulator & Analyzer

CryptoPulse is a powerful and intuitive web application designed for cryptocurrency enthusiasts and traders. It leverages real-time data from the Binance API to provide users with up-to-the-minute market insights, AI-powered trading signals, and a feature-rich virtual trading simulator.

## Core Features

- **Real-Time Crypto Dashboard**: View a dynamic list of the top 50 cryptocurrencies on Binance, sorted by 24-hour volume. Toggle between the top 10 best opportunities to **Buy** (lowest RSI) and **Sell** (highest RSI).
- **Detailed Crypto View**: Expand any cryptocurrency in the list to see a historical price chart and access AI-powered analysis.
- **AI-Powered Trade Signals**: For any crypto, generate custom short-term and long-term trading signals (Buy/Sell/Hold) based on a combination of RSI, volume, and market cap data.
- **Virtual Wallet Simulator**: Start with a virtual balance of 10,000 GUSD (virtual US dollars) and trade any listed cryptocurrency. Your portfolio value and cash balance are tracked in real-time.
- **Profit & Loss Tracking**: The simulator automatically calculates and displays your profit and loss for each individual holding and for your overall portfolio.
- **Multi-Language & Multi-Currency**: The entire interface can be switched between English and Spanish. Display all monetary values in either USD or Costa Rican Colón (CRC) with real-time exchange rate conversion.
- **Secure API Key Handling**: Your Binance API keys are stored exclusively in your local environment and are never sent to a server, ensuring they remain secure.

## Getting Started

Follow these instructions to get the CryptoPulse application running on your local machine.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A Binance account with API keys (read-only permissions are sufficient)

### 1. Installation

Clone the repository and install the required dependencies:

```bash
git clone <repository-url>
cd cryptopulse
npm install
```

### 2. Environment Configuration

You need to provide your Binance API keys for the application to fetch live data.

1.  Create a new file named `.env.local` in the root of the project directory.
2.  Add your Binance API Key and Secret to this file:

    ```
    BINANCE_API_KEY=your_binance_api_key_here
    BINANCE_API_SECRET=your_binance_api_secret_here
    ```

    **Note**: It is highly recommended to use API keys with **read-only** access for security. The application does not perform any real trades.

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
