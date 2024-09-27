import { IPriceLine, ISeriesApi } from 'lightweight-charts';

const removePriceAlert = (
  candlestickSeries: ISeriesApi<'Candlestick'> | null,
  priceLine: IPriceLine | null,
  setAlertPrice: React.Dispatch<React.SetStateAction<number | null>>
) => {
  if (candlestickSeries && priceLine) {
    candlestickSeries.removePriceLine(priceLine);
    setAlertPrice(null);
  }
};

export default removePriceAlert;
