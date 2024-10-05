"use client"
import Wrapper from "../Wrapper";
import Image from "next/image";
import logo from "../../assets/logo.svg";
import { BsArrowBarLeft, BsArrowBarRight } from "react-icons/bs";
import { CgMenuRight } from "react-icons/cg";
import LoginButton from "../wallet/LoginButton";
import { useAccount } from "wagmi";
import SignupButton from "../wallet/SignupButton";

export default function Navbar() {
  const { address } = useAccount();
  return (
    <nav className="py-3 bg-white">
      <Wrapper>
        <div className="flex items-center justify-between">
          <div className="">
            <Image src={logo} alt="logo" width={116} height={36} />
          </div>
          <div className="hidden md:flex items-center bg-[#F1F3F4] border border-[#F8F8FA] rounded-[60px] py-[6px] px-[10px]">
            <button className="bg-[#080065] flex items-center gap-1 rounded-[56px] text-white font-medium text-sm py-[10px] px-6">
              <BsArrowBarLeft className="h-4 w-4" />
              <span>Send Crypto</span>
            </button>

            <button className="flex items-center gap-1 rounded-[56px] text-[#0C0D0E] font-medium text-sm py-[10px] px-6">
              <BsArrowBarRight className="h-4 w-4" />
              <span>Receive Crypto</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            {/* <SignupButton /> */}
            <LoginButton />
          </div>
        </div>
      </Wrapper>
    </nav>
  );
}
