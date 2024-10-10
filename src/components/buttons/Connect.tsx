"use client";
import React, { useCallback } from "react";
import { useAccount } from "wagmi";
import { useConnect } from "wagmi";
import Spinner from "../ui/Spinner";

export default function Connect({ customStyle }: { customStyle: string }) {
  const { connectors, connect, data } = useConnect();
  const { isConnecting } = useAccount();

  const createWallet = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      const coinbaseWalletConnector = connectors.find(
        (connector) => connector.id === "coinbaseWalletSDK"
      );
      if (coinbaseWalletConnector) {
        connect({ connector: coinbaseWalletConnector });
      }
    },
    [connectors, connect]
  );
  return (
    <button
      className={`bg-[#080065] dark:bg-[#014EF2] ${customStyle} text-white py-4 px-6 min-w-[150px] font-bold disabled:text-[#667085]`}
      onClick={createWallet}
    >
      {isConnecting ? <Spinner /> : "Connect"}
    </button>
  );
}
