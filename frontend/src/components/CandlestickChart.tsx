import { useEffect, useRef } from 'react';
import { createChart, CrosshairMode, ISeriesApi } from 'lightweight-charts';
import {
  fetchHistoricalData,
  setupWebSocket,
} from '../services/chartDataService'; // Import the functions

const CandlestickChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const chartRef = useRef<any>(null); // Store chart instance

  // Initialize chart only once
  useEffect(() => {
    if (chartContainerRef.current && !chartRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        layout: {
          background: { color: '#253248' },
          textColor: 'rgba(255, 255, 255, 0.9)',
        },
        grid: {
          vertLines: {
            color: '#334158',
          },
          horzLines: {
            color: '#334158',
          },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
        },
        timeScale: {
          timeVisible: true, // Ensure time is visible
          secondsVisible: false, // Hide seconds if you don't want that level of granularity
        },
      });
      const newSeries = chartRef.current.addCandlestickSeries({
        upColor: '#4bffb5',
        downColor: '#ff4976',
        borderDownColor: '#ff4976',
        borderUpColor: '#4bffb5',
        wickDownColor: '#838ca1',
        wickUpColor: '#838ca1',
      });
      candlestickSeriesRef.current = newSeries;

      // Fetch historical data from the external service
      fetchHistoricalData(candlestickSeriesRef.current);
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, []);

  // Handle WebSocket updates for live data
  useEffect(() => {
    // Set up WebSocket connection and handle updates
    const cleanupWebSocket = setupWebSocket(candlestickSeriesRef.current);

    // Cleanup WebSocket on component unmount
    return () => {
      if (cleanupWebSocket) cleanupWebSocket();
    };
  }, []);

  return <div ref={chartContainerRef} className="h-screen w-full" />;
};

export default CandlestickChart;
