/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CBPayInstanceType, initOnRamp } from "@coinbase/cbpay-js";
import { useEffect, useState } from "react";

export const PayWithCoinbaseButton = ({ destinationWalletAddress }: {destinationWalletAddress: `0x${string}` | undefined}) => {
  const [onrampInstance, setOnrampInstance] =
    useState<CBPayInstanceType | null>();

  useEffect(() => {
    initOnRamp(
      {
        appId: "eb21c0ee-2f6b-4607-9f85-5aebbf39b4d8",
        widgetParameters: {
          destinationWallets: [
            {
              address: destinationWalletAddress!,
              blockchains: ["base"],
            },
          ],
          assets: ["ETH", "USDC"],
        },
        onSuccess: () => {
          console.log("success");
        },
        onExit: () => {
          console.log("exit");
        },
        onEvent: (event) => {
          console.log("event", event);
        },
        experienceLoggedIn: "popup",
        experienceLoggedOut: "popup",
        closeOnExit: true,
        closeOnSuccess: true,
      },
      (_, instance) => {
        setOnrampInstance(instance);
      }
    );

    return () => {
      onrampInstance?.destroy();
    };
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onrampInstance?.open();
  };
  return (
    <button
      onClick={handleClick}
      disabled={!onrampInstance}
      className="bg-[#080065] dark:bg-[#04308E] rounded-[10px] text-white font-medium text-xs py-2 px-4"
    >
      Buy with Coinbase
    </button>
  );
};
