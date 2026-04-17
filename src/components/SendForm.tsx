"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useWallet } from "@/context/WalletContext";
import { validateAddress, buildTransaction, getNetworkPassphrase, getStellarServer } from "@/lib/stellar";
import { signTxWithFreighter } from "@/lib/freighter";
import { Send, AlertCircle, CheckCircle2 } from "lucide-react";
import { TransactionResult } from "./TransactionResult";
import { toast } from "sonner";

export const SendForm: React.FC = () => {
  const { publicKey, balance, refreshBalance } = useWallet();
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [isValidAddress, setIsValidAddress] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; data?: string; error?: string } | null>(null);

  useEffect(() => {
    if (destination) {
      setIsValidAddress(validateAddress(destination));
    } else {
      setIsValidAddress(true);
    }
  }, [destination]);

  const handleMax = () => {
    const balNum = parseFloat(balance);
    const max = Math.max(0, balNum - 1).toString();
    setAmount(max);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) return;

    if (!isValidAddress || !destination) {
      toast.error("Invalid destination address");
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    const balNum = parseFloat(balance);
    const amountNum = parseFloat(amount);
    if (amountNum > balNum - 0.5) {
      toast.error("Low balance. Remember to leave XLM for base reserves.");
      return;
    }

    if (destination === publicKey) {
      toast.error("Cannot send to yourself");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const tx = await buildTransaction(publicKey, destination, amount, memo);
      const xdr = tx.toXDR();
      const signedXdr = await signTxWithFreighter(xdr, getNetworkPassphrase());
      
      const server = getStellarServer();
      const submission = await server.submitTransaction(signedXdr as any);
      
      setResult({ success: true, data: submission.hash });
      await refreshBalance();
      setDestination("");
      setAmount("");
      setMemo("");
    } catch (error: any) {
      console.error("Transaction failed", error);
      let errorMsg = "Transaction failed";
      
      if (error.message?.includes("User declined")) {
        errorMsg = "Transaction rejected by user";
      } else if (error.response?.data?.extras?.result_codes?.operations?.includes("op_low_reserve")) {
        errorMsg = "Insufficient balance for reserves";
      } else if (error.response?.data?.extras?.result_codes?.transaction === "tx_bad_auth") {
        errorMsg = "Authentication failed";
      }

      setResult({ success: false, error: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const dismissResult = () => setResult(null);

  if (!publicKey) return null;

  if (result) {
    return <TransactionResult result={result} onDismiss={dismissResult} />;
  }

  return (
    <Card className="border-white/10 bg-[#0d0d16]/80 backdrop-blur-xl shadow-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <Send className="h-5 w-5 text-indigo-500" />
          Send Payment
        </CardTitle>
        <CardDescription className="text-white/40">
          Send XLM to any Stellar address on Testnet.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="destination" className="text-white/70">Destination Address</Label>
            <Input
              id="destination"
              placeholder="G..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className={`bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:ring-indigo-500 transition-all ${
                !isValidAddress ? "border-red-500 focus:border-red-500 ring-red-500/20" : "focus:border-indigo-500"
              }`}
            />
            {!isValidAddress && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Invalid Stellar public key
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="amount" className="text-white/70">Amount (XLM)</Label>
              <button
                type="button"
                onClick={handleMax}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Max (Balance - 1 XLM)
              </button>
            </div>
            <Input
              id="amount"
              type="number"
              step="0.0000001"
              min="0.0000001"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-indigo-500 transition-all font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="memo" className="text-white/70">Memo (Optional)</Label>
            <Input
              id="memo"
              placeholder="Enter message"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || !destination || !amount || !isValidAddress}
            className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-lg font-bold shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all active:scale-[0.98]"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Confirming...
              </span>
            ) : (
              "Send XLM"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
