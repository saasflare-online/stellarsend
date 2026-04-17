import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/context/WalletContext";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StellarSend | Futuristic Stellar dApp",
  description: "Send XLM on the Stellar Testnet with a premium dApp interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0a0a0f] text-white antialiased min-h-screen`}>
        <WalletProvider>
          {children}
          <Toaster position="bottom-right" richColors theme="dark" />
        </WalletProvider>
      </body>
    </html>
  );
}
