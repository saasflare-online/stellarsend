"use client";

import React from "react";
import { WalletButton } from "@/components/WalletButton";
import { BalanceCard } from "@/components/BalanceCard";
import { SendForm } from "@/components/SendForm";
import { useWallet } from "@/context/WalletContext";
import { Rocket, Github, ExternalLink, ShieldCheck } from "lucide-react";

export default function Home() {
  const { publicKey } = useWallet();

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#0a0a0f] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none animate-pulse"></div>

      {/* Header */}
      <header className="w-full max-w-7xl px-6 py-8 flex justify-between items-center z-10 border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-2 group">
          <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            <Rocket className="text-white h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent italic">
            STELLARSEND
          </h1>
        </div>
        <WalletButton />
      </header>

      {/* Hero Section / Content */}
      <div className="w-full max-w-4xl px-6 py-12 flex flex-col gap-10 z-10">
        {!publicKey ? (
          <div className="flex flex-col items-center text-center py-20 gap-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
                The Future of <span className="text-indigo-500">Payments</span>
              </h2>
              <p className="text-white/40 text-lg max-w-xl mx-auto">
                Send XLM globally and instantly on the Stellar network with our premium, high-speed dApp.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mt-12">
              <FeatureCard 
                icon={<ShieldCheck className="h-6 w-6 text-emerald-400" />}
                title="Secure"
                description="Sign transactions locally with Freighter wallet."
              />
              <FeatureCard 
                icon={<Rocket className="h-6 w-6 text-indigo-400" />}
                title="Fast"
                description="Finality in 3-5 seconds on the Stellar network."
              />
              <FeatureCard 
                icon={<ExternalLink className="h-6 w-6 text-amber-400" />}
                title="Open"
                description="Built on the Stellar Testnet for developers."
              />
            </div>
            
            <div className="mt-8">
              <p className="text-white/20 text-sm">Requires the Freighter Extension to begin.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
            {/* Left Column: Stats */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <BalanceCard />
              
              <div className="p-6 rounded-2xl border border-white/5 bg-white/2 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/30">Network Stats</h3>
                <div className="space-y-3">
                  <StatRow label="Network" value="Stellar Testnet" color="text-amber-400" />
                  <StatRow label="Base Fee" value="0.0001 XLM" />
                  <StatRow label="Block Time" value="~5 Seconds" />
                </div>
              </div>
            </div>

            {/* Right Column: Interaction */}
            <div className="lg:col-span-7">
              <SendForm />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-auto w-full max-w-7xl px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5">
        <p className="text-white/20 text-sm">
          &copy; 2024 StellarSend. Experimental dApp.
        </p>
        <div className="flex items-center gap-6 text-white/40">
          <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
            <Github size={16} /> GitHub
          </a>
          <a href="https://stellar.org" target="_blank" className="hover:text-white transition-colors flex items-center gap-2">
            Stellar.org <ExternalLink size={14} />
          </a>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/5 transition-all group">
      <div className="mb-4 bg-white/5 w-fit p-3 rounded-xl group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>
      <p className="text-sm text-white/30 leading-relaxed">{description}</p>
    </div>
  );
}

function StatRow({ label, value, color = "text-white/70" }: { label: string, value: string, color?: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-white/30">{label}</span>
      <span className={color}>{value}</span>
    </div>
  );
}
