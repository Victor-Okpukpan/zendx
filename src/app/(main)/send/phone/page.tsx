"use client";
import { useEffect, useState } from "react";
import usdc from "../../../../assets/USDC.svg";
import Image from "next/image";
import { PayWithCoinbaseButton } from "@/components/buttons/PayWithCoinbaseButtob";
import { TiArrowLeft } from "react-icons/ti";
import peanut from "@squirrel-labs/peanut-sdk";
import axios from "axios";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";
import Modal from "@/components/ui/Modal";
import { useRouter } from "next/navigation";
import Connect from "@/components/buttons/Connect";
import Spinner from "@/components/ui/Spinner";

export default function SendToPhone() {
  const router = useRouter();
  const { address } = useAccount();
  const [currentStep, setCurrentStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [link, setLink] = useState("");
  const [sdk, setSdk] = useState<CoinbaseWalletSDK>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  function increaseStep(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setCurrentStep(2);
  }

  function decreaseStep(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setCurrentStep(1);
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Client-side only code
      const sdk = new CoinbaseWalletSDK({
        appName: "Zend",
      });

      setSdk(sdk);
    }
  }, []);

  async function createLink(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setIsLoading(true);
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    const provider = sdk!.makeWeb3Provider();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();

    const signerAddress = await signer.getAddress();
    console.log("Signer Address:", await signer.getAddress());

    const linkDetails = {
      chainId: "8453",
      tokenAmount: amount,
      tokenType: 1,
      tokenAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      tokenDecimals: 6,
      baseUrl: "http://localhost:3000/claim",
    };

    const password = await peanut.getRandomString(16);

    const preparedTransactions = await peanut.prepareDepositTxs({
      address: signerAddress,
      linkDetails,
      passwords: [password],
    });

    const transactionHashes: string[] = [];
    console.log("txHas:", transactionHashes);

    for (const unsignedTx of preparedTransactions.unsignedTxs) {
      const preparedTx = peanut.peanutToEthersV5Tx(unsignedTx);
      preparedTx.from = signerAddress;

      console.log("ready", preparedTx);

      if (preparedTx.value) {
        preparedTx.value = preparedTx.value.toString();
      }

      try {
        // Send transaction with the signer
        const txResponse = await signer.sendTransaction(preparedTx as any);

        transactionHashes.push(txResponse.hash);
      } catch (error) {
        console.error("Transaction failed", error);
        setIsLoading(false);
        return null;
      }
    }

    const { links } = await peanut.getLinksFromTx({
      linkDetails,
      passwords: [password],
      txHash: transactionHashes[transactionHashes.length - 1],
    });

    setLink(links[0]);

    try {
      const response = await axios.post(
        `https://zend.swap2naira.com/api/v1/transaction/${address}`,
        {
          link,
          amount,
          token: "USDC (base)",
          method: "phone",
          recipient: phone,
        }
      );
      console.log("API response2:", response.data);
      setIsModalOpen(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error sending address to API:", error);
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen md:min-h-[90vh] w-full flex items-center justify-center  px-4 md:px-0">
      <form className="border w-full max-w-[550px] border-[#DFE1E6] rounded-[10px] bg-white pt-[22px] pb-[55px] px-10">
        {currentStep === 1 ? (
          <>
            <div className="text-right mb-4">
              <PayWithCoinbaseButton destinationWalletAddress={address} />
            </div>
            <div className="mb-5">
              <label htmlFor="" className="text-[#667085] text-xs md:text-sm">
                Recipient's phone number.
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-transparent w-full text-xs md:text-lg text-[#667085] py-[14px] px-4 border border-[#DFE1E6] rounded-[10px] outline-none"
              />
            </div>

            <div className="mb-5">
              <label htmlFor="" className="text-[#667085] text-xs md:text-sm">
                Enter the amount of Base USDC you wish to send.
              </label>
              <div className="border border-[#DFE1E6] rounded-[10px] py-[14px] px-4 flex items-center">
                <div className="flex gap-2 items-center flex-1">
                  <Image
                    src={usdc}
                    width={26}
                    height={26}
                    alt="USDC"
                    className="hidden"
                  />
                  <Image
                    src={usdc}
                    width={18}
                    height={18}
                    alt="USDC"
                    className="md:hidden"
                  />
                  <p className="text-[#080065] text-xs md:text-sm font-medium">
                    Base USDC
                  </p>
                </div>
                <input
                  type="number"
                  value={amount}
                  min={0}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-transparent flex-1 text-right w-full text-xs md:text-lg font-bold text-[#667085] outline-none"
                  style={{ MozAppearance: "textfield" }}
                />
              </div>
            </div>

            {!address ? (
              <div className="mt-8 flex items-center w-full">
                <Connect customStyle="rounded-[16px] py-4" />
              </div>
            ) : (
              <button
                onClick={increaseStep}
                disabled={!phone || amount === 0}
                className={`disabled:bg-[#DFE1E6] bg-[#080065] text-white rounded-[16px] py-4 w-full font-bold disabled:text-[#667085]  mt-8`}
              >
                Send
              </button>
            )}
          </>
        ) : (
          <>
            <div className="text-[#0C0D0E] space-x-1 mb-6 flex items-center">
              <button onClick={decreaseStep} className="-ml-1">
                <TiArrowLeft className="w-6 h-6" />
              </button>
              <p className="font-semibold text-lg">Select Amount</p>
            </div>

            <div className="mb-4">
              <label htmlFor="" className="text-[#667085] text-xs md:text-sm">
                Recipient's phone number.
              </label>
              <p className="md:text-lg text-[#0C0D0E] font-semibold py-1">
                {phone}
              </p>
            </div>

            <div className="mb-5">
              <label htmlFor="" className="text-[#667085] text-xs md:text-sm">
                You Sent
              </label>
              <div className="flex items-center gap-2">
                <span className="md:text-lg text-[#0C0D0E] font-semibold py-1">
                  {amount}
                </span>
                <Image src={usdc} width={26} height={26} alt="USDC" />
              </div>
            </div>

            <p className="text-[#667085] text-xs md:text-sm">
              Estimated output: You will receive {amount} Base USDC, or the
              transaction will revert.
            </p>

            <button
              onClick={createLink}
              className={`bg-[#080065] text-white rounded-[16px] py-4 w-full font-bold mt-8`}
            >
              {isLoading ? <Spinner />: "Confirm"}
            </button>
          </>
        )}
      </form>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <p className="text-sm mb-4">
          Sending {amount} Base USDC to
          <br />
          <span className="font-medium">{phone}</span>
        </p>

        <button
          onClick={() => {
            setIsModalOpen(false);
            router.push("/");
          }}
          className="mt-6 bg-[#080065] text-white rounded-[16px] py-4 px-4 w-full font-bold"
        >
          Back to Home Page
        </button>
      </Modal>
    </main>
  );
}
