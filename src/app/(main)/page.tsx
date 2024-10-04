"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-[90vh] w-full flex items-center justify-center">
      <div className="">
        <h1 className="text-[#0C0D0E] font-semibold text-5xl text-center">
          Send and Receive Base USDC
          <br />
          Effortlessly with{" "}
          <span className="text-[#080065] font-extrabold">Zend.</span>
        </h1>

        <p className="text-[#667085] text-lg text-center mt-5 mb-8">
          Instantly transfer USDC using just an email or phone
          <br />
          number—fast, secure, and simple with Zend.
        </p>

        <div className="flex items-center justify-center w-full">
          <button
            onClick={() => router.push("/send")}
            className="bg-[#080065] py-5 px-14 font-bold text-base rounded-[20px] text-white"
          >
            Send Crypto
          </button>
        </div>
      </div>
    </main>
  );
}
