interface Order {
  price: number;
  quantity: number;
}

interface OrderBookData {
  bids: Order[];
  asks: Order[];
}

interface OrderBookProps {
  symbol: string;
}

export type { Order, OrderBookData, OrderBookProps };
