"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ExternalLink, ArrowLeft } from "lucide-react";

interface TransactionResultProps {
  result: {
    success: boolean;
    data?: string;
    error?: string;
  };
  onDismiss: () => void;
}

export const TransactionResult: React.FC<TransactionResultProps> = ({ result, onDismiss }) => {
  const explorerUrl = `https://stellar.expert/explorer/testnet/tx/${result.data}`;

  return (
    <Card className={`border-2 animate-in fade-in zoom-in duration-300 ${
      result.success ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5"
    }`}>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          {result.success ? (
            <div className="rounded-full bg-emerald-500/20 p-3">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            </div>
          ) : (
            <div className="rounded-full bg-red-500/20 p-3">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
          )}
        </div>
        <CardTitle className={`text-2xl font-bold ${result.success ? "text-emerald-400" : "text-red-400"}`}>
          {result.success ? "Payment Successful" : "Transaction Failed"}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 text-center">
        {result.success ? (
          <>
            <p className="text-white/60">
              Your payment has been successfully recorded on the Stellar Ledger.
            </p>
            <div className="bg-black/20 p-3 rounded border border-white/5 break-all font-mono text-xs text-indigo-300">
              {result.data}
            </div>
          </>
        ) : (
          <p className="text-red-300/80 bg-red-900/10 p-4 rounded border border-red-500/20">
            {result.error}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col gap-3">
        {result.success && (
          <Button
            variant="outline"
            className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
            onClick={() => window.open(explorerUrl, "_blank")}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View on Explorer
          </Button>
        )}
        <Button
          variant="ghost"
          className="w-full text-white/50 hover:text-white"
          onClick={onDismiss}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Form
        </Button>
      </CardFooter>
    </Card>
  );
};
