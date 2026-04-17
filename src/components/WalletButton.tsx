"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/WalletContext";
import { LogIn, LogOut, Wallet, Download } from "lucide-react";

export const WalletButton: React.FC = () => {
  const { publicKey, connect, disconnect, isConnecting, hasFreighter } = useWallet();

  const truncateKey = (key: string) => {
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  };

  if (!hasFreighter) {
    return (
      <Button
        variant="outline"
        className="border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
        onClick={() => window.open("https://www.freighter.app/", "_blank")}
      >
        <Download className="mr-2 h-4 w-4" />
        Install Freighter
      </Button>
    );
  }

  if (publicKey) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="border-white/10 bg-white/5 text-white/70 backdrop-blur-sm"
          disabled
        >
          <Wallet className="mr-2 h-4 w-4" />
          {truncateKey(publicKey)}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={disconnect}
          className="text-white/50 hover:text-red-400 hover:bg-red-400/10"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={connect}
      disabled={isConnecting}
      className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all"
    >
      {isConnecting ? (
        <span className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Connecting...
        </span>
      ) : (
        <>
          <LogIn className="mr-2 h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  );
};
