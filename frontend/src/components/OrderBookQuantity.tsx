import React, { useEffect, useState } from 'react';
import {
  fetchHistoricOrderData,
  setUpOrdersWebSocket,
} from '../services/orderBookService'; // assuming the function is in api.ts
import { Order, OrderBookData, OrderBookProps } from '../types/OrderBookData';

const OrderBook: React.FC<OrderBookProps> = ({ symbol }) => {
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);

  useEffect(() => {
    // Fetch initial order book data using REST API
    const fetchData = async () => {
      const data: OrderBookData = await fetchHistoricOrderData(symbol);

      // Process initial data
      setBids(
        data.bids.map(([price, quantity]) => ({
          price: parseFloat(price),
          quantity: parseFloat(quantity),
        }))
      );
      setAsks(
        data.asks.map(([price, quantity]) => ({
          price: parseFloat(price),
          quantity: parseFloat(quantity),
        }))
      );
    };

    fetchData();

    // Set up WebSocket for live updates
    const cleanUpWebSocket = setUpOrdersWebSocket(symbol, setBids, setAsks);

    // Clean up WebSocket when component unmounts
    return () => {
      cleanUpWebSocket();
    };
  }, [symbol]);

  return (
    <div className="mx-auto w-full max-w-md rounded-lg bg-gray-900 p-4 text-white">
      <h2 className="mb-4 text-center text-xl font-bold">
        Order Book ({symbol})
      </h2>

      <div className="mb-2 flex justify-between font-semibold">
        <div>Price (USDT)</div>
        <div>Quantity</div>
      </div>

      {/* Asks Section */}
      <div className="divide-y divide-gray-700">
        {asks.map((ask, index) => (
          <div key={index} className="flex justify-between text-red-500">
            <div>{ask.price.toFixed(2)}</div>
            <div>{ask.quantity.toFixed(3)}</div>
          </div>
        ))}
      </div>

      <div className="mb-2 mt-4 flex justify-between font-semibold">
        <div>Price (USDT)</div>
        <div>Quantity</div>
      </div>

      {/* Bids Section */}
      <div className="divide-y divide-gray-700">
        {bids.map((bid, index) => (
          <div key={index} className="flex justify-between text-green-500">
            <div>{bid.price.toFixed(2)}</div>
            <div>{bid.quantity.toFixed(3)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderBook;
