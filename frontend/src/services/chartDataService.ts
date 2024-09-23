import { ISeriesApi, UTCTimestamp } from 'lightweight-charts';
import ICandlestickData from '../types/ICandlestickData';

// Function to fetch historical data
const fetchHistoricalData = async (
  candlestickSeries: ISeriesApi<'Candlestick'> | null
) => {
  try {
    const response = await fetch('http://localhost:5000/api/binance/');
    const data = await response.json();

    // Format historical data
    const formattedData: ICandlestickData[] = data.map((item: any) => ({
      time: (item.openTime / 1000) as UTCTimestamp, // Cast to UTCTimestamp (seconds since epoch)
      open: parseFloat(item.open),
      high: parseFloat(item.high),
      low: parseFloat(item.low),
      close: parseFloat(item.close),
    }));

    // Set historical data to the chart
    if (candlestickSeries) {
      candlestickSeries.setData(formattedData);
    }
  } catch (error) {
    console.error('Error fetching historical data:', error);
  }
};

// Function to handle WebSocket and real-time updates
const setupWebSocket = (
  candlestickSeries: ISeriesApi<'Candlestick'> | null
) => {
  if (!candlestickSeries) return;

  const socket = new WebSocket(
    'wss://stream.binance.com:9443/ws/solusdt@kline_1m'
  );

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    const candlestick = message.k;

    // Format WebSocket candlestick data
    const candlestickData: ICandlestickData = {
      time: (candlestick.t / 1000) as UTCTimestamp, // Convert from ms to seconds
      open: parseFloat(candlestick.o),
      high: parseFloat(candlestick.h),
      low: parseFloat(candlestick.l),
      close: parseFloat(candlestick.c),
    };

    // Update chart with live data
    candlestickSeries.update(candlestickData);
  };

  // Cleanup WebSocket connection
  return () => {
    socket.close();
  };
};

export { fetchHistoricalData, setupWebSocket };
