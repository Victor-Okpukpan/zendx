"use client";
import { useEffect, useState } from "react";
import usdc from "../../assets/USDC.svg";
import Image from "next/image";
import { PayWithCoinbaseButton } from "@/components/buttons/PayWithCoinbaseButtob";
import { TiArrowLeft } from "react-icons/ti";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";
import Modal from "@/components/ui/Modal";
import { useRouter } from "next/navigation";
import Connect from "@/components/buttons/Connect";
import Spinner from "@/components/ui/Spinner";
import { FundButton, getOnrampBuyUrl } from '@coinbase/onchainkit/fund';
import { NEXT_PUBLIC_CDP_PROJECT_ID } from "@/config";

export default function SendToBaseName({view, setView}: any) {
  const router = useRouter();
  const { address } = useAccount();
  const [currentStep, setCurrentStep] = useState(1);
  const [baseName, setBaseName] = useState("");
  const [amount, setAmount] = useState<any>("");
  const [isLoading, setIsLoading] = useState(false);
  const [sdk, setSdk] = useState<CoinbaseWalletSDK>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [debouncedBaseName, setDebouncedBaseName] = useState(baseName);
  const [isCheckingBaseName, setIsCheckingBaseName] = useState(false);
  const [isBaseNameChecked, setIsBaseNameChecked] = useState(false);

  const onrampBuyUrl = getOnrampBuyUrl({
    projectId: NEXT_PUBLIC_CDP_PROJECT_ID!,
    addresses: { address: ['base'] },
    assets: ['USDC'],
    presetFiatAmount: 3,
    fiatCurrency: 'NGN'
  });


  useEffect(() => {
    if (typeof window !== "undefined") {
      // Client-side only code
      const sdk = new CoinbaseWalletSDK({
        appName: "Zend",
      });

      setSdk(sdk);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedBaseName(baseName);
    }, 2000);

    return () => {
      clearTimeout(handler);
    };
  }, [baseName]);

  useEffect(() => {
    const fetchWalletAddress = async () => {
      if (debouncedBaseName.trim()) {
        setIsCheckingBaseName(true);
        setIsBaseNameChecked(false); // Reset the flag before checking
        try {
          const address = await getWalletAddressFromBasename(debouncedBaseName);
          if (address === "0x0000000000000000000000000000000000000000") {
            setWalletAddress(null);
          } else {
            setWalletAddress(address);
          }
        } catch (error) {
          console.error("Error resolving Basename:", error);
          setWalletAddress(null);
        } finally {
          setIsCheckingBaseName(false);
          setIsBaseNameChecked(true); // Set flag after checking is done
        }
      } else {
        setWalletAddress(null);
        setIsBaseNameChecked(false); // Reset flag when no input
      }
    };

    fetchWalletAddress();
  }, [debouncedBaseName]);

  async function sendUSDC(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setIsLoading(true);

    const provider = sdk!.makeWeb3Provider();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();

    const signerAddress = await signer.getAddress();

    const usdcABI = [
      "function transfer(address to, uint256 amount) external returns (bool)",
    ];

    const usdcAddress = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; // Replace with actual address
    const usdcContract = new ethers.Contract(usdcAddress, usdcABI, signer);

    const amountInWei = ethers.utils.parseUnits(amount.toString(), 6);

    try {
      const txCount = await web3Provider.getTransactionCount(signerAddress);

      const tx = await usdcContract.transfer(walletAddress, amountInWei, {
        nonce: txCount,
      });

      console.log("Transaction sent:", tx.hash);

      const receipt = await tx.wait();
      console.log("Transaction mined:", receipt.transactionHash);
      setIsModalOpen(true);
      setIsLoading(false);
      return receipt;
    } catch (error) {
      console.error("Error sending USDC:", error);
      setIsLoading(false);
      throw error;
    }
  }

  async function getWalletAddressFromBasename(basename: string) {
    // Set up a provider connected to the Base network
    const provider = new ethers.providers.JsonRpcProvider(
      "https://mainnet.base.org"
    );

    // ENS-compatible Basename Resolver (replace with the actual Base resolver address if different)
    const ensResolverAddress = "0xC6d566A56A1aFf6508b41f6c90ff131615583BCD"; // Example ENS contract

    // Create a contract instance for the Basename resolver
    const resolver = new ethers.Contract(
      ensResolverAddress,
      ["function addr(bytes32 node) view returns (address)"],
      provider
    );

    // Hash the Basename (e.g., "defigrandson.base.eth")
    const namehash = ethers.utils.namehash(basename);

    // Retrieve the associated address
    const walletAddress = await resolver.addr(namehash);

    return walletAddress;
  }

  function increaseStep(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setCurrentStep(2);
  }

  function decreaseStep(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setCurrentStep(1);
  }

  return (
    <>
      <form className="border mt-36 z-50 w-full md:my-36 max-w-[550px] md:min-w-[550px] border-[#DFE1E6] dark:border-[#04308E] rounded-[10px] bg-white dark:bg-[#0B0B2F] pt-[22px] pb-[55px] px-10">
        <div className="flex items-center justify-center gap-4 mb-5 w-full">
          <button
            onClick={() => setView("email")}
            className={`${view === "email" ? "bg-[#080065] dark:bg-[#014EF2] text-white": "bg-white dark:bg-[#DEDEDE] text-[#4D4B4B] dark:text-[#000617]"} text-xs py-4 md:py-5 font-semibold md:text-base rounded-[20px]  w-full border dark:border-0`}
          >
            Email Address
          </button>

          <button
          disabled={view === "basename"}
            onClick={() => setView("basename")}
            className={`${view === "basename" ? "bg-[#080065] dark:bg-[#014EF2] text-white": "bg-white dark:bg-[#DEDEDE] text-[#4D4B4B] dark:text-[#000617]"} text-xs py-4 md:py-5 font-semibold md:text-base rounded-[20px]  w-full border dark:border-0`}
          >
            Base Name
          </button>
        </div>
        {currentStep === 1 ? (
          <>
            <div className="text-right mb-4">
              <FundButton text="Buy with Coinbase" fundingUrl={onrampBuyUrl} className="bg-[#080065] dark:bg-[#04308E] rounded-[10px] text-white font-medium text-xs py-2 px-4" />
            </div>
            <div className="mb-5">
              <label
                htmlFor=""
                className="text-[#667085] dark:text-[#EBF1FE] text-xs md:text-sm"
              >
                Recipient's Base Name.
              </label>
              <input
                type="text"
                placeholder="e.g defigrandson.base.eth"
                value={baseName}
                onChange={(e) => setBaseName(e.target.value)}
                className="bg-transparent w-full text-xs md:text-lg text-[#667085] dark:text-[#EBF1FE] py-[14px] px-4 border border-[#DFE1E6] rounded-[10px] outline-none"
              />
              {isCheckingBaseName ? (
                <p className="loading-text text-xs md:text-sm mt-1 flex items-center">
                  <Spinner /> <span className="ml-1">Checking Basename...</span>
                </p>
              ) : walletAddress ? (
                <p className="text-green-500 text-xs md:text-sm mt-1">
                  Basename found with address:
                  <br />
                  {walletAddress}
                </p>
              ) : baseName.trim() &&
                !isCheckingBaseName &&
                isBaseNameChecked ? (
                <p className="text-red-500 text-xs md:text-sm mt-1">
                  This Basename does not exist. <a href="https://www.base.org/names" target="_blank" rel="noopener noreferrer" className="underline">Claim here</a>
                </p>
              ) : null}
            </div>

            <div className="mb-5">
              <label
                htmlFor=""
                className="text-[#667085] dark:text-[#EBF1FE] text-xs md:text-sm"
              >
                Enter the amount of Base USDC you wish to send.
              </label>
              <div className="border border-[#DFE1E6] rounded-[10px] py-[14px] px-4 flex items-center">
                <div className="flex gap-2 items-center flex-1">
                  <Image
                    src={usdc}
                    width={26}
                    height={26}
                    alt="USDC"
                    className="hidden md:block"
                  />
                  <Image
                    src={usdc}
                    width={18}
                    height={18}
                    alt="USDC"
                    className="md:hidden"
                  />
                  <p className="text-[#080065] dark:text-white text-xs md:text-sm font-medium">
                    Base USDC
                  </p>
                </div>
                <input
                  type="number"
                  value={amount}
                  min={0}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-transparent flex-1 text-right w-full text-xs md:text-lg font-bold text-[#667085] dark:text-[#EBF1FE] outline-none"
                  style={{ MozAppearance: "textfield" }}
                />
              </div>
            </div>

            {!address ? (
              <div className="mt-8 flex items-center w-full">
                <Connect customStyle="rounded-[16px] py-4 w-full" />
              </div>
            ) : (
              <button
                onClick={increaseStep}
                disabled={
                  !baseName.trim() ||
                  Number(amount) <= 0 ||
                  !amount ||
                  !walletAddress
                }
                className={`disabled:bg-[#DFE1E6] disabled:dark:bg-[#c2c5cd] bg-[#080065] dark:bg-[#04308E] text-white rounded-[16px] py-4 w-full font-bold disabled:text-[#667085]  mt-8`}
              >
                Send
              </button>
            )}
          </>
        ) : (
          <>
            <div className="text-[#0C0D0E] dark:text-[#9C9D9E] space-x-1 mb-6 flex items-center">
              <button onClick={decreaseStep} className="-ml-1">
                <TiArrowLeft className="w-6 h-6" />
              </button>
              <p className="font-semibold text-lg">Select Amount</p>
            </div>

            <div className="mb-4">
              <label
                htmlFor=""
                className="text-[#667085] dark:text-[#9C9D9E] text-xs md:text-sm"
              >
                Recipient's BaseName
              </label>
              <p className="md:text-lg text-[#0C0D0E] dark:text-white font-semibold py-1">
                {baseName}
              </p>
            </div>

            <div className="mb-5">
              <label
                htmlFor=""
                className="text-[#667085] dark:text-[#9C9D9E] text-xs md:text-sm"
              >
                You Sent
              </label>
              <div className="flex items-center gap-2">
                <span className="md:text-lg text-[#0C0D0E] dark:text-white font-semibold py-1">
                  {amount}
                </span>
                <Image src={usdc} width={26} height={26} alt="USDC" />
              </div>
            </div>

            <p className="text-[#667085] dark:text-[#9C9D9E] text-xs md:text-sm">
              Estimated output: You will receive {amount} Base USDC, or the
              transaction will revert.
            </p>

            <button
              onClick={sendUSDC}
              className={`bg-[#080065] dark:bg-[#04308E] text-white rounded-[16px] py-4 w-full font-bold mt-8`}
            >
              {isLoading ? <Spinner /> : "Confirm"}
            </button>
          </>
        )}
      </form>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <p className="text-sm text-[#0C0D0E] dark:text-[#9C9D9E] mb-4">
          Sending {amount} Base USDC to
          <br />
          <span className="font-medium">{baseName}</span>
        </p>

        <button
          onClick={() => {
            setIsModalOpen(false);
            router.push("/");
          }}
          className="mt-6 bg-[#080065] dark:bg-[#04308E] text-white rounded-[16px] py-4 px-4 w-full font-bold"
        >
          Back to Home Page
        </button>
      </Modal>
    </>
  );
}
