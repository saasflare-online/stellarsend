"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { connectWallet, checkFreighter } from "@/lib/freighter";
import { getBalance } from "@/lib/stellar";
import { toast } from "sonner";

interface WalletContextType {
  publicKey: string | null;
  balance: string;
  isConnecting: boolean;
  hasFreighter: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasFreighter, setHasFreighter] = useState(false);

  useEffect(() => {
    const check = async () => {
      const installed = await checkFreighter();
      setHasFreighter(installed);
    };
    check();

    const savedKey = localStorage.getItem("stellar_pubkey");
    if (savedKey) {
      setPublicKey(savedKey);
    }
  }, []);

  const refreshBalance = useCallback(async () => {
    if (publicKey) {
      try {
        const bal = await getBalance(publicKey);
        setBalance(bal);
      } catch (error) {
        console.error("Failed to fetch balance", error);
      }
    }
  }, [publicKey]);

  useEffect(() => {
    if (publicKey) {
      refreshBalance();
    }
  }, [publicKey, refreshBalance]);

  const connect = async () => {
    setIsConnecting(true);
    try {
      const key = await connectWallet();
      setPublicKey(key);
      localStorage.setItem("stellar_pubkey", key);
      toast.success("Wallet connected!");
    } catch (error: any) {
      toast.error(error.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setPublicKey(null);
    setBalance("0");
    localStorage.removeItem("stellar_pubkey");
    toast.info("Wallet disconnected");
  };

  return (
    <WalletContext.Provider
      value={{
        publicKey,
        balance,
        isConnecting,
        hasFreighter,
        connect,
        disconnect,
        refreshBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
