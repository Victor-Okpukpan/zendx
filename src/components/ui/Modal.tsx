"use client";
import Image from "next/image";
import success from "../../assets/success.svg";

const Modal = ({ isOpen, onClose, children }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative text-center">
        <Image
          src={success}
          alt="Success!"
          width={154}
          height={154}
          className="mx-auto"
        />
        <p className="text-[#0C0D0E] text-sm font-semibold mt-6 mb-2">
          Transaction Successful
        </p>
        {children}
      </div>
    </div>
  );
};

export default Modal;
