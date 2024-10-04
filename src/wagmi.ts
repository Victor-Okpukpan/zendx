// import { http, cookieStorage, createConfig, createStorage } from 'wagmi'
// import { baseSepolia } from 'wagmi/chains';
// import { coinbaseWallet } from 'wagmi/connectors';


// export function getConfig() {
//   return createConfig({
//     chains: [baseSepolia],
//     connectors: [
//       coinbaseWallet({ appName: 'Create Wagmi', preference: 'smartWalletOnly' }),
//     ],
//     storage: createStorage({
//       storage: cookieStorage,
//     }),
//     ssr: true,
//     transports: {
//       [baseSepolia.id]: http(),
//     },
//   })
// }
 
// declare module 'wagmi' {
//   interface Register {
//     config: ReturnType<typeof getConfig>
//   }
// }

'use client';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  coinbaseWallet,
  metaMaskWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { useMemo } from 'react';
import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { NEXT_PUBLIC_WC_PROJECT_ID } from './config';

export function useWagmiConfig() {
  const projectId = NEXT_PUBLIC_WC_PROJECT_ID ?? '';
  if (!projectId) {
    const providerErrMessage =
      'To connect to all Wallets you need to provide a NEXT_PUBLIC_WC_PROJECT_ID env variable';
    throw new Error(providerErrMessage);
  }

  return useMemo(() => {
    const connectors = connectorsForWallets(
      [
        {
          groupName: 'Recommended Wallet',
          wallets: [coinbaseWallet],
        },
        {
          groupName: 'Other Wallets',
          wallets: [rainbowWallet, metaMaskWallet],
        },
      ],
      {
        appName: 'onchainkit',
        projectId,
      },
    );

    const wagmiConfig = createConfig({
      chains: [base, baseSepolia],
      // turn off injected provider discovery
      multiInjectedProviderDiscovery: false,
      connectors,
      ssr: true,
      transports: {
        [base.id]: http(),
        [baseSepolia.id]: http(),
      },
    });

    return wagmiConfig;
  }, [projectId]);
}