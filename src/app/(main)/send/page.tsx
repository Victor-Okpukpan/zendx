"use client";
import { useRouter } from "next/navigation";

export default function SendPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen md:min-h-[90vh] w-full flex items-center justify-center  px-4 md:px-0">
      <div className="">
        <h1 className="text-[#0C0D0E] font-semibold text-2xl md:text-5xl text-center">
          Send <span className="text-[#080065] font-extrabold">Base USDC</span>{" "}
          Instantly via
          <br />
          Email or Phone Number.
        </h1>

        <p className="text-[#667085] text-xs md:text-lg text-center mt-5 mb-8">
          Would you like to send Base USDC to an email
          <br />
          address or phone number?
        </p>

        <div className="flex items-center justify-center gap-4 w-full">
          <button
            onClick={() => router.push("/send/email")}
            className="bg-[#080065] text-xs py-4 px-6 md:py-5 md:px-14 font-bold md:text-base rounded-[20px] text-white"
          >
            Email Address
          </button>

          <button
            onClick={() => router.push("/send/phone")}
            className="bg-white py-4 text-xs px-6 md:py-5 md:px-14 font-medium md:text-base rounded-[20px] text-[#4D4B4B]"
          >
            Phone Number
          </button>
        </div>
      </div>
    </main>
  );
}
