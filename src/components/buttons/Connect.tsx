"use client";
import React, { useCallback } from "react";
import { useAccount } from "wagmi";
import { useConnect } from "wagmi";

export default function Connect() {
  const { connectors, connect, data } = useConnect();
  const { address, isConnected } = useAccount();

  const createWallet = useCallback(() => {
    const coinbaseWalletConnector = connectors.find(
      (connector) => connector.id === "coinbaseWalletSDK"
    );
    if (coinbaseWalletConnector) {
      connect({ connector: coinbaseWalletConnector });
    }
  }, [connectors, connect]);
  return (
    <button
      className="bg-[#080065] flex items-center gap-1 rounded-[56px] text-white font-medium text-sm py-[10px] px-6"
      onClick={createWallet}
    >
      {isConnected ? address : "Connect"}
    </button>
  );
}
