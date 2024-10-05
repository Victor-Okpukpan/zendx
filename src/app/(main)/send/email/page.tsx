"use client";
import { useState } from "react";
import usdc from "../../../../assets/USDC.svg";
import Image from "next/image";
import { PayWithCoinbaseButton } from "@/components/buttons/PayWithCoinbaseButtob";
import { TiArrowLeft } from "react-icons/ti";
import peanut from "@squirrel-labs/peanut-sdk";
import axios from "axios";
import { BigNumber, ethers } from "ethers";
import {
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useAccount } from "wagmi";
import { useSendTransaction } from "wagmi";
import { useEthersSigner } from "@/ethers";

export default function SendToEmail() {
  // const { address } = useWeb3ModalAccount();
  const { address } = useAccount();
  const signer = useEthersSigner();
  // const { walletProvider } = useWeb3ModalProvider();
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState<any>(2);
  const [isLoading, setIsLoading] = useState(false);
  const [link, setLink] = useState("");
  const { sendTransaction } = useSendTransaction();

  function increaseStep(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setCurrentStep(2);
  }

  function decreaseStep(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setCurrentStep(1);
  }

  async function createLink(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Ensure signer is initialized
      if (!signer) {
        throw new Error("Signer not found!");
      }

      console.log("Signer Address:", signer._address);

      const addressConnected = signer._address;
      // const tokenAmount = ethers.; // USDC typically has 6 decimals, adjust if needed

      const linkDetails = {
        chainId: "8453",
        tokenAmount: amount,
        tokenType: 0,
        tokenDecimals: 18,
        // tokenAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        baseUrl: "http://localhost:3000/claim",
      };

      const password = await peanut.getRandomString(16);

      const preparedTransactions = await peanut.prepareDepositTxs({
        address: addressConnected,
        linkDetails,
        passwords: [password],
      });

      const transactionHashes: string[] = [];
      console.log("Prepared Transactions:", preparedTransactions);

      for (const unsignedTx of preparedTransactions.unsignedTxs) {
        const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);
        const preparedTx = peanut.peanutToEthersV5Tx(unsignedTx);
        preparedTx.from = addressConnected;
        preparedTx.value = amountInWei;

        console.log("Ready to send transaction:", preparedTx);

        // Send the transaction
        const txResponse = await signer.sendTransaction(preparedTx as any);
        transactionHashes.push(txResponse.hash);

        console.log("Transaction Hash:", txResponse.hash);
      }

      // After all transactions are successful, get the link
      const { links } = await peanut.getLinksFromTx({
        linkDetails,
        passwords: [password],
        txHash: transactionHashes[transactionHashes.length - 1], // Use the last transaction hash
      });

      setLink(links[0]);
      console.log("Generated Link:", links[0]);
    } catch (error) {
      console.error("Transaction failed", error);
    } finally {
      setIsLoading(false);
    }
  }

  // try {
  //   const response = await axios.post(
  //     `https://zend.swap2naira.com/api/v1/transaction/${address}`,
  //     {
  //       link,
  //       amount,
  //       token: "USDC (base)",
  //       method: "email",
  //       recipient: email,
  //     }
  //   );
  //   console.log("API response2:", response.data);
  // } catch (error) {
  //   console.error("Error sending address to API:", error);
  //   setIsLoading(false);
  // }

  return (
    <main className="min-h-[90vh] w-full flex items-center justify-center  px-4 md:px-0">
      <form className="border w-full max-w-[550px] border-[#DFE1E6] rounded-[10px] bg-white pt-[22px] pb-[55px] px-10">
        {currentStep === 1 ? (
          <>
            <div className="text-right">
              <PayWithCoinbaseButton />
            </div>
            <div className="mb-5">
              <label
                htmlFor=""
                className="text-[#667085] text-[8px] md:text-sm"
              >
                Recipient's email address.
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent w-full text-xs md:text-lg text-[#667085] py-[14px] px-4 border border-[#DFE1E6] rounded-[10px] outline-none"
              />
            </div>

            <div className="mb-5">
              <label htmlFor="" className="text-[#667085] text-[8px] text-sm">
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

            <button
              onClick={increaseStep}
              disabled={!email || amount === 0}
              className={`disabled:bg-[#DFE1E6] bg-[#080065] text-white rounded-[16px] py-4 w-full font-bold disabled:text-[#667085]  mt-8`}
            >
              Send
            </button>
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
              <label htmlFor="" className="text-[#667085] text-sm">
                Recipient's email address.
              </label>
              <p className="text-lg text-[#0C0D0E] font-semibold py-1">
                {email}
              </p>
            </div>

            <div className="mb-5">
              <label htmlFor="" className="text-[#667085] text-sm">
                You Sent
              </label>
              <div className="flex items-center gap-2">
                <span className="text-lg text-[#0C0D0E] font-semibold py-1">
                  {amount}
                </span>
                <Image src={usdc} width={26} height={26} alt="USDC" />
              </div>
            </div>

            <p>
              Estimated output: You will receive {amount} Base USDC, or the
              transaction will revert.
            </p>

            <button
              onClick={createLink}
              className={`bg-[#080065] text-white rounded-[16px] py-4 w-full font-bold mt-8`}
            >
              Confirm
            </button>
          </>
        )}
      </form>
    </main>
  );
}
