type Order = [string, string];

interface OrderBookData {
  bids: Order[];
  asks: Order[];
}

interface OrderBookProps {
  symbol: string;
}

export type { Order, OrderBookData, OrderBookProps };
