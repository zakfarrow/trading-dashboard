import { useEffect, useRef } from 'react';
import {
  createChart,
  CrosshairMode,
  ISeriesApi,
  IChartApi,
} from 'lightweight-charts';
import {
  fetchHistoricalData,
  setupWebSocket,
} from '../services/chartDataService'; // Import the functions

const CandlestickChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const chartRef = useRef<IChartApi | null>(null); // Store chart instance

  // Function to resize the chart
  const resizeChart = () => {
    if (chartRef.current && chartContainerRef.current) {
      chartRef.current.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });
    }
  };

  // Initialize chart only once
  useEffect(() => {
    if (chartContainerRef.current && !chartRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight, // Dynamically set height
        layout: {
          background: { color: '#253248' },
          textColor: 'rgba(255, 255, 255, 0.9)',
        },
        grid: {
          vertLines: {
            color: '#334158',
            style: 1,
          },
          horzLines: {
            color: '#334158',
            style: 1,
          },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: {
            color: '#758696',
            width: 1,
            style: 2,
            visible: true,
            labelVisible: true,
          },
          horzLine: {
            color: '#758696',
            width: 1,
            style: 2,
            visible: true,
            labelVisible: true,
          },
        },
        rightPriceScale: {
          borderVisible: true,
          borderColor: '#fff', // Color of the border around the price scale
          mode: 1, // Set to PriceScaleMode.Normal, you can experiment with log scale if needed
          autoScale: true, // Automatically scale the price chart
        },
        timeScale: {
          borderVisible: true,
          borderColor: '#fff',
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
        // scaleMargins: {
        //   top: 0.1, // 10% margin at the top
        //   bottom: 0.1, // 10% margin at the bottom
        // },
      });

      candlestickSeriesRef.current = newSeries;

      // Fetch historical data from the external service
      fetchHistoricalData(candlestickSeriesRef.current);

      // Resize chart on window resize
      window.addEventListener('resize', resizeChart);
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
      window.removeEventListener('resize', resizeChart);
    };
  }, []);

  // Handle WebSocket updates for live data
  useEffect(() => {
    const cleanupWebSocket = setupWebSocket(candlestickSeriesRef.current);
    return () => {
      if (cleanupWebSocket) cleanupWebSocket();
    };
  }, []);

  return <div ref={chartContainerRef} className="m-2 h-[80vh] w-4/5" />;
};

export default CandlestickChart;
