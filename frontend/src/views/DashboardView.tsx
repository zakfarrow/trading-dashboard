import CandlestickChart from '../components/CandlestickChart';
import OrderBook from '../components/OrderBook';
import OrderBookQuantity from '../components/OrderBookQuantity';

const DashboardView = () => {
  return (
    <div className="flex">
      <CandlestickChart />
      <OrderBookQuantity symbol="SOLUSDT" />
    </div>
  );
};

export default DashboardView;
