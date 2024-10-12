"use client";
import SendToBaseName from "@/components/forms/SendToBaseName";
import SendToEmail from "@/components/forms/SendToEmail";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SendPage() {
  const router = useRouter();
  const [view, setView] = useState("default");

  return (
    <>
      <main
        className={`min-h-screen relative w-full flex flex-col items-start md:items-center justify-center px-4 md:px-0`}
      >
        <div
          className={`mt-36 md:mt-0 transition-transform duration-700 ease-in-out ${view === "default" ? "translate-y-0" : "-translate-y-full hidden"}`}
        >
          <h1 className="text-[#0C0D0E] dark:text-[#DEDEDE] font-semibold text-2xl md:text-7xl text-center">
            Send{" "}
            <span className="text-[#080065] dark:text-[#014EF2] font-extrabold">
              Base USDC
            </span>{" "}
            Instantly via
            <br />
            Email or Base Name.
          </h1>

          <p className="text-[#667085] dark:text-[#DEDEDE] text-xs md:text-lg text-center mt-5 mb-8">
            Would you like to send Base USDC to an email
            <br />
            address or base name?
          </p>

          <div className="flex items-center justify-center gap-4 w-full">
            <button
              onClick={() => setView("email")}
              className="bg-[#080065] dark:bg-[#014EF2] text-xs py-4 px-6 md:py-5 md:px-14 font-semibold md:text-base rounded-[20px] text-white"
            >
              Email Address
            </button>

            <button
              onClick={() => setView("basename")}
              className="bg-white dark:bg-[#DEDEDE] py-4 text-xs px-6 md:py-5 md:px-14 font-semibold md:text-base rounded-[20px] text-[#4D4B4B] dark:text-[#000617]"
            >
              Base Name
            </button>
          </div>
        </div>

        <div
          className={`transition-transform z-40 duration-700 ease-in-out ${view === "email" ? "translate-y-0" : "translate-y-full"}`}
        >
          {view === "email" && <SendToEmail />}
        </div>

        <div
          className={`transition-transform z-50 duration-700 ease-in-out ${view === "basename" ? "translate-y-0" : "translate-y-full"}`}
        >
          {view === "basename" && <SendToBaseName />}
        </div>
      </main>
    </>
  );
}
