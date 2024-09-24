import DashboardView from './views/DashboardView';
import OrderBook from './components/OrderBook';

const App = () => {
  return (
    <>
      <h1 className="flex h-full flex-col text-clip p-8 text-2xl font-semibold text-[#8bd2d7]">
        Hello World
      </h1>
      <DashboardView />
      <OrderBook symbol="SOLUSDT" />
    </>
  );
};

export default App;
