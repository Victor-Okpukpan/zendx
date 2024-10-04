'use client';
import WalletWrapper from './WalletWrapper';

export default function SignupButton() {
  return (
    <WalletWrapper
      className="bg-[#080065] flex items-center gap-1 rounded-[56px] text-white font-medium text-sm py-[10px] px-6"
      text="Sign up"
    />
  );
}