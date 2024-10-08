"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import axios from 'axios';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address, isConnected } = useAccount();
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      setConnectedAddress(address);
      sendAddressToApi(address);
    } else {
      setConnectedAddress(null);
    }
  }, [isConnected, address]);

  const sendAddressToApi = async (address: string) => {
    try {
      const response = await axios.post('https://zend.swap2naira.com/api/v1/auth', {
        address,
      });
      console.log('API response:', response.data);
    } catch (error) {
      console.error('Error sending address to API:', error);
    }
  };

  return (
    <WalletContext.Provider value={{ address: connectedAddress, isConnected }}>
      {children}
    </WalletContext.Provider>
  );
};
