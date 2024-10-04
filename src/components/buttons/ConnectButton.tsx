"use client";
import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react";

export default function ConnectButton() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();

  function truncateAddress(address: any) {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }

  return (
    <button
      className="bg-[#080065] flex items-center gap-1 rounded-[56px] text-white font-medium text-sm py-[10px] px-6"
      onClick={() => {
        isConnected ? open({ view: "Account" }) : open({ view: "Connect" });
      }}
    >
      {isConnected ? <>{truncateAddress(address)}</> : "Connect"}
    </button>
  );
}
