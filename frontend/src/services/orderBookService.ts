import axios from 'axios';
import { Order, OrderBookData } from '../types/OrderBookData';

const fetchHistoricOrderData = async (
  symbol: string
): Promise<OrderBookData> => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/binance/historicOrders?symbol=${symbol}&limit=100`
    );
    return { bids: response.data.bids, asks: response.data.asks };
  } catch (error) {
    return { bids: [], asks: [] };
  }
};

// The WebSocket setup function
const setUpOrdersWebSocket = (
  symbol: string,
  setBids: React.Dispatch<React.SetStateAction<Order[]>>,
  setAsks: React.Dispatch<React.SetStateAction<Order[]>>
) => {
  const TICK_SIZE = 0.1;
  const DEPTH_LIMIT = 100;

  // Process orders to aggregate them by price
  const processOrders = (orders: [string, string][]) => {
    const aggregatedOrders: Record<number, number> = {};

    orders.forEach(([price, quantity]) => {
      const roundedPrice =
        Math.floor(parseFloat(price) / TICK_SIZE) * TICK_SIZE;
      const quantityFloat = parseFloat(quantity);

      if (aggregatedOrders[roundedPrice]) {
        aggregatedOrders[roundedPrice] += quantityFloat;
      } else {
        aggregatedOrders[roundedPrice] = quantityFloat;
      }
    });

    return Object.entries(aggregatedOrders)
      .map(([price, quantity]) => ({
        price: parseFloat(price),
        quantity: quantity,
      }))
      .sort((a, b) => b.price - a.price)
      .slice(0, DEPTH_LIMIT);
  };

  // Update existing orders with new data
  const updateOrders = (
    updates: [string, string][],
    setOrders: React.Dispatch<React.SetStateAction<Order[]>>
  ) => {
    setOrders((prevOrders) => {
      const updatedOrders = { ...prevOrders };

      updates.forEach(([price, quantity]) => {
        const roundedPrice =
          Math.floor(parseFloat(price) / TICK_SIZE) * TICK_SIZE;
        const quantityFloat = parseFloat(quantity);

        if (quantityFloat === 0) {
          delete updatedOrders[roundedPrice];
        } else {
          updatedOrders[roundedPrice] = quantityFloat;
        }
      });

      return Object.entries(updatedOrders)
        .map(([price, quantity]) => ({
          price: parseFloat(price),
          quantity: quantity,
        }))
        .sort((a, b) => b.price - a.price)
        .slice(0, DEPTH_LIMIT);
    });
  };

  // Create a WebSocket connection
  const ws = new WebSocket(
    `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth`
  );

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.b) {
      updateOrders(message.b, setBids); // Update bids
    }
    if (message.a) {
      updateOrders(message.a, setAsks); // Update asks
    }
  };

  // Return cleanup function to close WebSocket when unmounted
  return () => {
    ws.close();
  };
};

export { fetchHistoricOrderData, setUpOrdersWebSocket };
