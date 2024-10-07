"use client";
import Wrapper from "../Wrapper";
import Image from "next/image";
import logo from "../../assets/logo.svg";
import { BsArrowBarLeft, BsArrowBarRight } from "react-icons/bs";
// import { CgMenuRight } from "react-icons/cg";
import LoginButton from "../wallet/LoginButton";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  function isMatch(path: string) {
    return pathname.includes(path);
  }

  return (
    <nav className="py-3 bg-white">
      <Wrapper>
        <div className="flex items-center justify-between w-full">
          <div className="w-max">
            <Image
              src={logo}
              alt="logo"
              width={116}
              height={36}
              className="hidden md:block"
            />
            <Image
              src={logo}
              alt="logo"
              width={69}
              height={22}
              className="md:hidden"
            />
          </div>

          <div className="hidden ml-10 md:flex items-center w-max bg-[#F1F3F4] border border-[#F8F8FA] rounded-[60px] py-[6px] px-[10px]">
            <button
              onClick={() => router.push("/send")}
              className={`${isMatch("/send") ? "bg-[#080065] text-white" : "text-[#0C0D0E]"} flex items-center gap-1 rounded-[56px] font-medium text-sm py-[10px] px-6`}
            >
              <BsArrowBarLeft className="h-4 w-4" />
              <span>Send Crypto</span>
            </button>

            <button
              disabled
              className={`${isMatch("/claim") ? "bg-[#080065] text-white" : "text-[#0C0D0E]"} flex items-center gap-1 rounded-[56px] font-medium text-sm py-[10px] px-6`}
            >
              <BsArrowBarRight className="h-4 w-4" />
              <span>Receive Crypto</span>
            </button>
          </div>
          <div className="flex items-center w-[166.44px]">
            <LoginButton />
          </div>
        </div>
      </Wrapper>
    </nav>
  );
}
