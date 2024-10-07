"use client";
import { useEffect, useState } from "react";
import peanut from "@squirrel-labs/peanut-sdk";
import { useRouter } from "next/navigation";
import { NEXT_PUBLIC_PEANUT_API_KEY } from "@/config";

export default function ClaimPage() {
  const router = useRouter();
  const [isUnclaimed, setIsUnclaimed] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [link, setLink] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLink(window.location.href);
      console.log(window.location.href);
    }
  }, [router]);

  async function claimLink(
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<string> {
    event.preventDefault();
    // const link = 'https://peanut.to/claim?c=137&v=v4.3&i=2160&t=ui#p=0JObAtHfeDX7HI7K'

    const claimedLinkResponse = await peanut.claimLinkGasless({
      APIKey: NEXT_PUBLIC_PEANUT_API_KEY!,
      link,
      recipientAddress: walletAddress,
    });

    console.log("claimed", claimedLinkResponse.txHash);

    return claimedLinkResponse.txHash;
  }

  if (isUnclaimed) {
    return (
      <main className="min-h-[90vh] w-full flex items-center justify-center  px-4 md:px-0">
        <div className="">
        <h1 className="text-[#0C0D0E] font-semibold text-5xl text-center">
          This link has already
          <br />
          been claimed.
        </h1>

        <p className="text-[#667085] text-lg text-center mt-5 mb-8">
          If you believe this is an error or need assistance,
          <br />
          please contact our support team.
        </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen md:min-h-[90vh] w-full flex items-center justify-center px-4 md:px-0">
      {currentStep === 1 ? (
        <div>
          <h1 className="text-[#0C0D0E] font-semibold text-5xl text-center">
            This link hasn't been claimed yet. You can
            <br />
            proceed to claim your{" "}
            <span className="text-[#080065] font-extrabold">Base USDC</span>
          </h1>
          <div className="flex items-center justify-center w-full">
            <button
              onClick={() => setCurrentStep(2)}
              className="bg-[#080065] py-5 px-14 mt-5 font-bold text-base rounded-[20px] text-white"
            >
              Claim now
            </button>
          </div>
        </div>
      ) : (
        <form className="border w-full max-w-[550px] border-[#DFE1E6] rounded-[10px] bg-white pt-[22px] pb-[55px] px-10">
          <div className="mb-5">
            <label htmlFor="" className="text-[#667085] text-sm">
              Please provide your wallet address.
            </label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="bg-transparent w-full text-lg text-[#667085] py-[14px] px-4 border border-[#DFE1E6] rounded-[10px] outline-none"
            />
          </div>

          <button
            onClick={claimLink}
            disabled={!walletAddress}
            className={`disabled:bg-[#DFE1E6] bg-[#080065] text-white rounded-[16px] py-4 w-full font-bold disabled:text-[#667085]  mt-5`}
          >
            Claim
          </button>
        </form>
      )}
    </main>
  );
}
