'use client';
import WalletWrapper from './WalletWrapper';

export default function LoginButton() {
  return (
    <WalletWrapper
      className="ockConnectWallet_Container bg-[#080065] dark:bg-[#014EF2] min-w-[150px] min-h-10 hover:bg-[#080065] hover:dark:bg-[#014EF2] flex items-center gap-1 rounded-[56px] text-white font-medium !text-xs md:!text-sm py-[10px] px-6"
      text="Connect"
      withWalletAggregator={true}
    />
  );
}