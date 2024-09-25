import React, { useEffect, useState, useRef } from 'react';

type Order = [string, string]; // [price, quantity]

interface OrderBookProps {
  symbol: string; // Trading pair (e.g., SOLUSDT)
}

const OrderBook: React.FC<OrderBookProps> = ({ symbol }) => {
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  // Function to update the order book with new data from WebSocket
  const updateOrderBook = (
    orders: Order[],
    updates: Order[],
    isBid: boolean
  ) => {
    const updatedOrders = [...orders];
    updates.forEach(([price, quantity]) => {
      const index = updatedOrders.findIndex((order) => order[0] === price);
      if (index !== -1) {
        if (Number(quantity) === 0) {
          // Remove the order if quantity is 0 (order canceled)
          updatedOrders.splice(index, 1);
        } else {
          // Update the existing order with new quantity
          updatedOrders[index] = [price, quantity];
        }
      } else if (Number(quantity) > 0) {
        // Add the new order if not found and quantity is greater than 0
        updatedOrders.push([price, quantity]);
      }
    });

    // Sort the orders properly (bids: descending, asks: ascending)
    return isBid
      ? updatedOrders.sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
      : updatedOrders.sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
  };

  // Open WebSocket connection to Binance
  useEffect(() => {
    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth`;
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newBids: Order[] = data.b; // Bid updates
      const newAsks: Order[] = data.a; // Ask updates

      // Update bids and asks in state
      setBids((prevBids) => updateOrderBook(prevBids, newBids, true));
      setAsks((prevAsks) => updateOrderBook(prevAsks, newAsks, false));
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      wsRef.current?.close();
    };
  }, [symbol]);

  return (
    <div className="bg-navy-light mr-2 mt-2 flex w-1/5 flex-col gap-4 rounded p-4 text-white">
      <div className="flex justify-between">
        <h2 className="mb-2 text-lg">Price&#40;USDT&#41;</h2>
        <h2 className="mb-2 text-lg">Quantity&#40;SOL&#41;</h2>
        <h2 className="mb-2 text-lg">Total</h2>
      </div>
      <ul>
        {bids.slice(0, 10).map(([price, quantity]) => (
          <li key={price} className="flex justify-between">
            <span className="my-[0.15rem] rounded bg-[#2f6563] p-[0.1rem] text-[#4bffb5]">
              {price}
            </span>
            <span className="my-[0.15rem] rounded p-[0.1rem]">{quantity}</span>
            <span className="my-[0.15rem] rounded p-[0.1rem]">{quantity}</span>
          </li>
        ))}
      </ul>
      <ul>
        {asks.slice(0, 10).map(([price, quantity]) => (
          <li key={price} className="flex justify-between">
            <span className="my-[0.15rem] rounded bg-[#5c3854] p-[0.1rem] text-[#ff4976]">
              {price}
            </span>
            <span className="my-[0.15rem] rounded p-[0.1rem]">{quantity}</span>
            <span className="my-[0.15rem] rounded p-[0.1rem]">{quantity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderBook;
