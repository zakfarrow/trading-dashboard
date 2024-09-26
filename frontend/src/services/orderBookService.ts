import axios from 'axios';
import { OrderBookData } from '../types/OrderBookData';

const fetchHistoricOrderData = async (
  symbol: string
): Promise<OrderBookData> => {
  const response = await axios.get(
    `http://localhost:5000/api/binance/historicOrders?symbol=${symbol}&limit=10`
  );
  return { bids: response.data.bids, asks: response.data.asks };
};

export { fetchHistoricOrderData };
