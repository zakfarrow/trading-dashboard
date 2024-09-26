import React, { useEffect, useState } from 'react';
import { fetchHistoricOrderData } from '../services/orderBookService'; // assuming the function is in api.ts
import { Order, OrderBookData, OrderBookProps } from '../types/OrderBookData';

interface IOrders {
  price: string;
  quantity: string;
}

const OrderBook: React.FC<OrderBookProps> = ({ symbol }) => {
  const [bids, setBids] = useState<IOrders[]>([]);
  const [asks, setAsks] = useState<IOrders[]>([]);

  useEffect(() => {
    // Fetch initial order book data using REST API
    const fetchData = async () => {
      const data: OrderBookData = await fetchHistoricOrderData(symbol);

      // Process initial data
      const rawBids: Order[] = data.bids;
      const rawAsks: Order[] = data.asks;

      const bidsByPriceQuantity: IOrders[] = [];
      rawBids.forEach((rawBid) => {
        bidsByPriceQuantity.push({ price: rawBid[0], quantity: rawBid[1] });
      });

      const asksByPriceQuantity: IOrders[] = [];
      rawAsks.forEach((rawAsk) => {
        asksByPriceQuantity.push({ price: rawAsk[0], quantity: rawAsk[1] });
      });

      // Sort both bids and asks based on price and update state
      setBids(sortAndLimit(bidsByPriceQuantity, 'bids'));
      setAsks(sortAndLimit(asksByPriceQuantity, 'asks'));
    };

    fetchData();
  }, [symbol]);

  // Handle WebSocket updates for live data
  useEffect(() => {
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth`
    );

    ws.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      const newBids = messageData.b;
      const newAsks = messageData.a;

      setBids((prevBids) => {
        const updatedBids = [...prevBids];

        newBids.forEach(([price, quantity]: [string, string]) => {
          const index = updatedBids.findIndex((bid) => bid.price === price);
          if (index > -1) {
            if (parseFloat(quantity) === 0) {
              updatedBids.splice(index, 1);
            } else {
              updatedBids[index].quantity = quantity;
            }
          } else if (parseFloat(quantity) > 0) {
            updatedBids.push({ price, quantity });
          }
        });

        return sortAndLimit(updatedBids, 'bids');
      });

      setAsks((prevAsks) => {
        const updatedAsks = [...prevAsks];

        newAsks.forEach(([price, quantity]: [string, string]) => {
          const index = updatedAsks.findIndex((ask) => ask.price === price);
          if (index > -1) {
            if (parseFloat(quantity) === 0) {
              updatedAsks.splice(index, 1);
            } else {
              updatedAsks[index].quantity = quantity;
            }
          } else if (parseFloat(quantity) > 0) {
            updatedAsks.push({ price, quantity });
          }
        });

        return sortAndLimit(updatedAsks, 'asks');
      });
    };

    return () => ws.close();
  }, [symbol]);

  const sortAndLimit = (orders: IOrders[], type: 'bids' | 'asks') => {
    // Sort orders by price
    const sortedOrders = orders.sort(
      (a, b) =>
        type === 'bids'
          ? parseFloat(b.price) - parseFloat(a.price) // Descending for bids
          : parseFloat(a.price) - parseFloat(b.price) // Ascending for asks
    );

    // Return only the top 10 entries after sorting
    return sortedOrders.slice(0, 10);
  };

  return (
    <div className="my-2 mr-2 w-full rounded bg-navy-light p-4 text-white">
      <h2 className="mb-4 text-center text-xl font-bold">
        Order Book ({symbol})
      </h2>

      <div className="mb-2 flex justify-between font-semibold">
        <div>Price (USDT)</div>
        <div>Quantity</div>
      </div>

      {/* Asks Section */}
      <div className="divide-y divide-gray-700">
        {asks.reverse().map((ask, index) => (
          <div key={index} className="flex justify-between text-red-500">
            <div>{parseFloat(ask.price).toFixed(2)}</div>
            <div>{parseFloat(ask.quantity).toFixed(3)}</div>
          </div>
        ))}
      </div>

      {/* Bids Section */}
      <div className="divide-y divide-gray-700">
        {bids.map((bid, index) => (
          <div key={index} className="flex justify-between text-green-500">
            <div>{parseFloat(bid.price).toFixed(2)}</div>
            <div>{parseFloat(bid.quantity).toFixed(3)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderBook;
