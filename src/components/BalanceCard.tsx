"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/WalletContext";
import { RefreshCcw, Wallet, PlusCircle } from "lucide-react";
import { fundWithFriendbot } from "@/lib/stellar";
import { toast } from "sonner";

export const BalanceCard: React.FC = () => {
  const { publicKey, balance, refreshBalance } = useWallet();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFunding, setIsFunding] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshBalance();
    setIsRefreshing(false);
    toast.success("Balance updated");
  };

  const handleFund = async () => {
    if (!publicKey) return;
    setIsFunding(true);
    try {
      await fundWithFriendbot(publicKey);
      await refreshBalance();
      toast.success("Account funded with 10,000 XLM!");
    } catch (error: any) {
      toast.error("Funding failed. Try again later.");
    } finally {
      setIsFunding(false);
    }
  };

  if (!publicKey) return null;

  return (
    <Card className="relative overflow-hidden border-indigo-500/20 bg-[#0d0d16]/80 backdrop-blur-xl transition-all hover:border-indigo-500/40 group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Wallet size={80} className="text-indigo-500" />
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium text-white/50 uppercase tracking-widest">
            Available Balance
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-white/30 hover:text-white"
          >
            <RefreshCcw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white tracking-tight">
              {parseFloat(balance).toLocaleString()}
            </span>
            <span className="text-indigo-400 font-semibold">XLM</span>
          </div>
          
          <div className="flex gap-2 mt-2">
            <Button
              onClick={handleFund}
              disabled={isFunding}
              size="sm"
              className="w-full bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              {isFunding ? "Funding..." : "Fund Wallet"}
            </Button>
          </div>
        </div>
      </CardContent>
      
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
    </Card>
  );
};
