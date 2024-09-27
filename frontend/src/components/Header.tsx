import solLogo from '@/assets/solana-sol-logo.svg';

const Header = () => {
  return (
    <div className="mx-2 mt-2 flex items-center divide-x-2 rounded bg-navy-light p-4">
      <h1 className="mx-6 text-clip text-2xl font-semibold text-[#8bd2d7]">
        Trading Dashboard Demo
      </h1>
      <div className="flex items-center gap-x-2">
        <h1 className="ml-6 text-clip text-2xl text-white">SOL/USDT</h1>
        <img src={solLogo} alt="SOL/USDT" className="h-6 w-6" />
      </div>
    </div>
  );
};

export default Header;
