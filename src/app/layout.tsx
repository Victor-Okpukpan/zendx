import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import "@coinbase/onchainkit/styles.css";
import "@rainbow-me/rainbowkit/styles.css";
import OnchainProviders from "@/components/wallet/OnchainProviders";
import { Providers } from "./providers";

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zend",
  description: "Generated by create-wagmi",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bricolage.className} bg-gradient-to-b from-[#FAFAFA] to-[#E0E3F9] bg-no-repeat  dark:bg-gradient-to-tl dark:from-[#12056A] dark:via-[#09092E] dark:to-[#000617] relative overflow-hidden`}
      >
        <Providers>
          <div className="dark:bg-grid-white/[0.2] h-full relative">
            <div className="absolute pointer-events-none inset-0 hidden dark:flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_40%,black)]"></div>
            <OnchainProviders>{props.children}</OnchainProviders>
          </div>
        </Providers>
      </body>
    </html>
  );
}
