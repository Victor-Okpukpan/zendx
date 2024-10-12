"use client";
import { useEffect, useState } from "react";
import peanut from "@squirrel-labs/peanut-sdk";
import { useRouter } from "next/navigation";
import { NEXT_PUBLIC_PEANUT_API_KEY } from "@/config";
import axios from "axios";
import Spinner from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";

export default function ClaimPage() {
  const router = useRouter();
  const [isUnclaimed, setIsUnclaimed] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [link, setLink] = useState("");
  const [linkState, setLinkState] = useState<any>([]);
  console.log("link state:", linkState.data);
  const [walletAddress, setWalletAddress] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLink(window.location.href);
      console.log(window.location.href);
    }
  }, []);

  useEffect(() => {
    if (link) {
      checkIfLinkHasBeenClaimed(link);
    }
  }, [link]);

  async function checkIfLinkHasBeenClaimed(link: string) {
    try {
      const response = await axios.put(
        "https://zend.swap2naira.com/api/v1/transaction-request",
        { link }
      );

      const responseData = response.data;

      setLinkState(responseData);

      if (responseData.data.transactions) {
        if (responseData.data.transactions.status === "pending") {
          setIsUnclaimed(true);
        } else {
          setIsUnclaimed(false);
        }
      }
    } catch (error: any) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function claimLink(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const claimedLinkResponse = await peanut.claimLinkGasless({
        APIKey: NEXT_PUBLIC_PEANUT_API_KEY!,
        link,
        recipientAddress: walletAddress,
      });

      const response = await axios.get(
        `https://zend.swap2naira.com/api/v1/transaction-action/${linkState.data.transactions.uuid}`
      );

      setIsModalOpen(true);
      setIsLoading(false);

      return claimedLinkResponse.txHash;
    } catch (error: any) {
      console.error("An error occurred while claiming the link:", error);
      setIsLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen md:min-h-[90vh] w-full flex items-center justify-center">
        <div className=" z-50">
          <p className="text-[#667085] dark:text-white text-lg text-center mt-5 mb-8">
            Please wait while we verify the status of the link...
          </p>
        </div>
      </main>
    );
  }

  if (!isUnclaimed) {
    return (
      <main className="min-h-screen w-full flex items-start md:items-center justify-center  px-4 md:px-0">
        <div className="mt-36 md:mt-0 z-50">
          <h1 className="text-[#0C0D0E] z-50 dark:text-[#DEDEDE] font-semibold text-2xl md:text-5xl text-center">
            This link has already
            <br />
            been claimed.
          </h1>

          <p className="text-[#667085] dark:text-[#DEDEDE] text-xs md:text-lg text-center mt-5 mb-8">
            If you believe this is an error or need assistance,
            <br />
            please contact our support team.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full flex items-start md:items-center justify-center px-4 md:px-0">
      {currentStep === 1 ? (
        <div className="mt-36 md:mt-0 z-50">
          <h1 className="text-[#0C0D0E] z-50 dark:text-[#DEDEDE] font-semibold text-2xl md:text-5xl text-center">
            This link hasn't been claimed yet. You can{" "}
            <br className="hidden md:block"/>
            proceed to claim your{" "}
            <span className="text-[#080065] dark:text-[#014EF2] font-extrabold">Base USDC.</span>
          </h1>
          <div className="flex items-center justify-center w-full">
            <button
              onClick={() => setCurrentStep(2)}
              className="bg-[#080065] dark:bg-[#014EF2] text-xs py-4 px-6 md:py-5 md:px-14 font-semibold md:text-base rounded-[20px] text-white mt-8"
            >
              Claim now
            </button>
          </div>
        </div>
      ) : (
        <form className="border z-50 w-full mt-36 md:mt-0 max-w-[550px] border-[#DFE1E6] dark:border-[#04308E] rounded-[10px] bg-white dark:bg-[#0B0B2F] pt-[22px] pb-[55px] px-10">
          <div className="mb-5">
            <label htmlFor="" className="text-[#667085] dark:text-[#EBF1FE] text-xs md:text-sm">
              Please provide your wallet address.
            </label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="bg-transparent w-full text-xs md:text-lg text-[#667085] dark:text-[#EBF1FE] py-[14px] px-4 border border-[#DFE1E6] rounded-[10px] outline-none"
            />
          </div>

          <button
            onClick={claimLink}
            disabled={!walletAddress}
            className={`disabled:bg-[#DFE1E6] bg-[#080065] text-white rounded-[16px] py-4 w-full font-bold disabled:text-[#667085]  mt-5`}
          >
            {isLoading ? <Spinner /> : "Claim"}
          </button>
        </form>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <p className="text-sm mb-4">
          You have claimed this link.
          <br />
          Please check your balance.
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
