import solLogo from '../assets/solana-sol-logo.svg';

const Header = () => {
  return (
    <div className="bg-navy-light mx-2 mt-2 flex items-center gap-x-2 rounded p-6">
      <img src={solLogo} alt="SOL/USDT" className="h-6 w-6" />
      <h1 className="flex h-full flex-col text-clip text-2xl font-semibold text-white">
        SOL/USDT
      </h1>
    </div>
  );
};

export default Header;
