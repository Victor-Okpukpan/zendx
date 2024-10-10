"use client";
import Image from "next/image";
import success from "../../assets/success.svg";
import successDark from "../../assets/success-dark.svg";
import { useTheme } from "next-themes";

const Modal = ({ isOpen, onClose, children }: any) => {
  const { resolvedTheme } = useTheme();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-[#0B0B2F] rounded-lg shadow-lg w-full max-w-md p-6 relative text-center">
        <Image
          src={resolvedTheme === "light" ? success : successDark}
          alt="Success!"
          width={154}
          height={154}
          className="mx-auto"
        />
        <p className="text-[#0C0D0E] dark:text-white text-sm font-semibold mt-6 mb-2">
          Transaction Successful
        </p>
        {children}
      </div>
    </div>
  );
};

export default Modal;
