# Trading Dashboard

This project is my submission for Trireme Trading Technical Assessment Phase 1.
The repo consists of two folders; frontend, and backend.

I built the frontend app with React, Tailwind, and TypeScript. I used Vite for my local development environment.

The backend is a Node express API, written in TypeScript.

I used Binance's API and websocket for data ingestion, and I used TradingView's lightweight-charts library for displaying the candlestick data.

## Run Locally

**The latest version of Node and npm are the only requirements to run this project locally.**

The following steps assume that you've cloned the repo to your local machine.
\
\
\
Open a terminal, and run the following command in the root, the frontend folder, and the backend folder.

```bash
  npm install
```

I used the 'concurrently' package to run the vite and node servers simultaneously from the same terminal. If this doesn't work, you can run the two servers from different terminals. Below are instructions for both.

- Run from one terminal with concurrently
  Navigate to the root folder and run the following.

```bash
  npm run dev
```

- Run from two terminals
  Open two terminals, one in 'backend', and one in 'frontend'. Run the following in both terminals.

```bash
  npm run dev
```

## Features

- Live candlestick chart for SOLUSDT
- Live order book for SOLUSDT
- Api endpoints for initial data fetch
- WebScoket connections for live data stream
- Set custom price alert on chart via doubleclick (doubleclick at the same price level to remove).

## Note

I initially planned to include several features listed below, but due to limited time, I could only implement the core functionality.

- Additional options for candle time interval
- Cumulative total for order quantities
- Bars under order prices to visualise their quantity relative to each other
