"use client";
import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react";

export default function ConnectButton() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();

  function truncateAddress(address: any) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  return (
    <button
      className="text-center text-xs border"
      onClick={() => {
        isConnected ? open({ view: "Account" }) : open({ view: "Connect" });
      }}
    >
      {isConnected ? <>{truncateAddress(address)}</> : "Connect wallet"}
    </button>
  );
}
