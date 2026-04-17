# StellarSend

StellarSend is a premium, high-speed dApp for sending XLM on the Stellar Testnet. Built with Next.js 14, TypeScript, and shadcn/ui, it offers a futuristic interface for global payments.

## Features

- **Wallet Connectivity**: Seamlessly connect with the Freighter browser extension.
- **Real-time Balance**: Instantly fetch and update your XLM balance.
- **Smart Payment Form**: Real-time address validation and automatic transaction type selection (Payment vs Create Account).
- **Testnet Funding**: Quick-fund your account using Friendbot integration.
- **Transaction Feedback**: Detailed success and error panels with direct links to StellarExpert.

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **Stellar SDK**: `@stellar/stellar-sdk`
- **Wallet API**: `@stellar/freighter-api`
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- [Freighter Wallet](https://www.freighter.app/) extension installed in your browser.

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd simplepaymentdapp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Screenshots

*(Screenshots section placeholders)*
- **Landing Page**: Futuristic dark-themed hero section.
- **Active Dashboard**: Wallet balance and payment form.
- **Transaction Success**: Green confirmation panel with tx hash.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
