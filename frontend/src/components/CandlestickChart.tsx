import { useEffect, useRef, useState } from 'react';
import {
  createChart,
  CrosshairMode,
  ISeriesApi,
  IChartApi,
  LineStyle,
  IPriceLine,
} from 'lightweight-charts';
import { fetchHistoricCandles, setupWebSocket } from '@/services/chartService'; // Import the functions
import removePriceAlert from '@/utils/priceAlertUtility';
import AlertButton from '@components/Button/AlertButton';

const CandlestickChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [priceLine, setPriceLine] = useState<IPriceLine | null>(null);
  const [crosshairPrice, setCrosshairPrice] = useState<number | null>(null);
  const [alertPrice, setAlertPrice] = useState<number | null>(null);

  // Function to resize the chart
  const resizeChart = () => {
    if (chartRef.current && chartContainerRef.current) {
      chartRef.current.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });
    }
  };

  const createPriceAlert = (price: number) => {
    if (candlestickSeriesRef.current) {
      setPriceLine(
        candlestickSeriesRef.current.createPriceLine({
          price: price,
          color: '#EFFF4B',
          lineWidth: 1,
          lineStyle: LineStyle.Solid,
          axisLabelVisible: true,
          title: `Alert`,
        })
      );
    }
  };

  // Initialize chart
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
      });

      candlestickSeriesRef.current = newSeries;

      // Fetch historical data from the external service
      fetchHistoricCandles(candlestickSeriesRef.current);

      // Resize chart on window resize
      window.addEventListener('resize', resizeChart);

      // Add listener for crosshair movement
      chartRef.current.subscribeCrosshairMove((param) => {
        if (candlestickSeriesRef.current && param.point) {
          setCrosshairPrice(
            Number(
              candlestickSeriesRef.current
                .coordinateToPrice(param.point.y)
                ?.toFixed(2)
            )
          );
        }
      });
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
      window.removeEventListener('resize', resizeChart);
    };
  }, []);

  const handleChartDblClick = () => {
    // Remove current price alert if set
    if (priceLine) {
      removePriceAlert(candlestickSeriesRef.current, priceLine, setAlertPrice);
    }
    // Add new price alert
    if (crosshairPrice) {
      if (crosshairPrice === alertPrice) {
        removePriceAlert(
          candlestickSeriesRef.current,
          priceLine,
          setAlertPrice
        );
      } else {
        createPriceAlert(crosshairPrice);
        setAlertPrice(crosshairPrice);
      }
    }
  };

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.subscribeDblClick(handleChartDblClick);
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.unsubscribeDblClick(handleChartDblClick);
      }
    };
  });

  // Handle WebSocket updates for live data
  useEffect(() => {
    const cleanupWebSocket = setupWebSocket(
      candlestickSeriesRef.current,
      alertPrice,
      setAlertPrice,
      priceLine
    );
    return () => {
      if (cleanupWebSocket) cleanupWebSocket();
    };
  }, [alertPrice, priceLine]);

  return (
    <>
      <div className="flex h-full w-full flex-col">
        <div className="mx-2 mt-2 flex flex-row-reverse rounded bg-navy-light">
          <AlertButton />
        </div>
        <div ref={chartContainerRef} className="m-2 h-[80vh] w-full" />
      </div>
    </>
  );
};

export default CandlestickChart;
