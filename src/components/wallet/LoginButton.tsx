'use client';
import WalletWrapper from './WalletWrapper';

export default function LoginButton() {
  return (
    <WalletWrapper
      className="bg-[#080065] hover:bg-[#080065] flex items-center gap-1 rounded-[56px] text-white font-medium text-sm py-[10px] px-6"
      text="Log in"
      withWalletAggregator={true}
    />
  );
}