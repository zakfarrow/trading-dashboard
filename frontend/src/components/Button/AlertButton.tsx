import { BellAlertIcon } from '@heroicons/react/24/outline';

const AlertButton = () => {
  return (
    <button className="m-2 flex items-center rounded border-[1px] border-[#EFFF4B] p-1">
      <span className="text-[#EFFF4B]">Clear Price Alert</span>
      <BellAlertIcon className="h-4" stroke="#EFFF4B" />
    </button>
  );
};

export default AlertButton;
