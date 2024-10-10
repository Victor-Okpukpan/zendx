"use client";
import Wrapper from "../Wrapper";
import Image from "next/image";
import logo from "../../assets/logo.svg";
import logoDark from "../../assets/logo-dark.svg";
import LoginButton from "../wallet/LoginButton";
import Connect from "../buttons/Connect";
import { useWallet } from "@/context";
import ThemeSwitch from "../buttons/ThemeSwitch";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { address } = useWallet();
  const { resolvedTheme } = useTheme();

  return (
    <nav className="py-3 bg-transparent z-50">
      <Wrapper>
        <div className="flex items-center justify-between w-full">
          <div className="w-max z-50">
            <Image
              src={resolvedTheme === "light" ? logo : logoDark}
              alt="logo"
              width={116}
              height={36}
              className="hidden md:block"
            />
            <Image
              src={resolvedTheme === "light" ? logo : logoDark}
              alt="logo"
              width={69}
              height={22}
              className="md:hidden"
            />
          </div>

          <div className="flex items-center z-50 gap-2">
            {!address ? (
              <Connect customStyle="rounded-[56px] py-[10px] min-w-[150px]" />
            ) : (
              <LoginButton />
            )}
            <ThemeSwitch />
          </div>
        </div>
      </Wrapper>
    </nav>
  );
}
