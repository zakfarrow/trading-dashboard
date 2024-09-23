import express from 'express';
import { fetchHistoricalCandles } from '../services/binanceApiService';
import { AxiosError } from 'axios';

const router = express.Router();

// Endpoint to fetch historical candlestick data
router.get('/', async (req, res) => {
	const { symbol = 'SOLUSDT', interval = '1m', limit = 1000 } = req.query;
	try {
		const candles = await fetchHistoricalCandles(
			symbol as string,
			interval as string,
			Number(limit)
		);
		res.json(candles);
	} catch (error) {
		if (error instanceof AxiosError) {
			res.status(500).json({ error: error.message });
		} else {
			res.status(500).json({ error: 'Unknown error occured.' });
		}
	}
});

export default router;
