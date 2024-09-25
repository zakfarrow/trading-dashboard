// backend/src/services/candlestickService.ts
import axios from 'axios';

// Fetch historical candlestick data from Binance API
export const fetchHistoricalCandles = async (
	symbol: string,
	interval: string,
	limit: number
) => {
	const response = await axios.get(`https://api.binance.com/api/v3/klines`, {
		params: {
			symbol,
			interval,
			limit,
		},
	});
	return response.data.map((candle: any) => ({
		openTime: candle[0],
		open: candle[1],
		high: candle[2],
		low: candle[3],
		close: candle[4],
		volume: candle[5],
		closeTime: candle[6],
	}));
};

export const fetchHistoricalOrders = async (symbol: string, limit: number) => {
	const response = await axios.get(`https://api.binance.com/api/v3/depth`, {
		params: {
			symbol,
			limit,
		},
	});
	return response.data;
};
