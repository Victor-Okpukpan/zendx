// "use client";

// import { OnchainKitProvider } from "@coinbase/onchainkit";
// import { base } from "wagmi/chains";
// import { type ReactNode, useState } from "react";
// import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";

// const projectId = "253c06a78bb467d81764735c969d28c3";

// const baseMainnet = {
//   chainId: 8453,
//   name: "Base",
//   currency: "ETH",
//   explorerUrl: "https://basescan.org",
//   rpcUrl: "https://mainnet.base.org",
// };

// const baseSepolia = {
//   chainId: 84532,
//   name: "Base Sepolia",
//   currency: "ETH",
//   explorerUrl: "https://sepolia.basescan.org",
//   rpcUrl: "https://sepolia.base.org",
// };

// const metadata = {
//   name: "Zend",
//   description:
//     "Zend is a decentralized platform for africans to make crypto transactions on Base through links.",
//   url: "https://zend.xyz",
//   icons: ["https://avatars.mywebsite.com/"],
// };

// const ethersConfig = defaultConfig({
//   metadata,
//   auth: {
//     email: true,
//     socials: ["google", "x", "github", "discord", "farcaster"],
//     showWallets: true,
//     walletFeatures: true,
//   },
//   enableEIP6963: true,
//   enableInjected: true,
//   enableCoinbase: true,
//   rpcUrl: "...",
//   defaultChainId: 1,
//   coinbasePreference: "smartWalletOnly",
// });

// createWeb3Modal({
//   ethersConfig,
//   chains: [baseMainnet, baseSepolia],
//   projectId,
//   enableSwaps: true,
//   enableOnramp: true,
//   enableAnalytics: true,
// });

// export function Providers(props: {
//   children: ReactNode;
// }) {

//   return (
//     <OnchainKitProvider
//       apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
//       chain={base}
//     >
//       {props.children}
//     </OnchainKitProvider>
//   );
// }


// 'use client'

// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { type ReactNode, useState } from 'react'
// import { type State, WagmiProvider } from 'wagmi'

// import { getConfig } from '@/wagmi'

// export function Providers(props: {
//   children: ReactNode
//   initialState?: State
// }) {
//   const [config] = useState(() => getConfig())
//   const [queryClient] = useState(() => new QueryClient())

//   return (
//     <WagmiProvider config={config} initialState={props.initialState}>
//       <QueryClientProvider client={queryClient}>
//         {props.children}
//       </QueryClientProvider>
//     </WagmiProvider>
//   )
// }
