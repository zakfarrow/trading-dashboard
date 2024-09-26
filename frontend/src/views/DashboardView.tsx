import CandlestickChart from '../components/CandlestickChart';
import OrderBook from '../components/OrderBook';

const DashboardView = () => {
  return (
    <div className="flex">
      <CandlestickChart />
      <OrderBook symbol="SOLUSDT" />
    </div>
  );
};

export default DashboardView;
