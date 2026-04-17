import {
  Horizon,
  Networks,
  TransactionBuilder,
  Operation,
  Asset,
  StrKey,
  Memo,
} from "@stellar/stellar-sdk";

const HORIZON_URL = "https://horizon-testnet.stellar.org";
const server = new Horizon.Server(HORIZON_URL);

export const getBalance = async (publicKey: string): Promise<string> => {
  try {
    const account = await server.loadAccount(publicKey);
    const nativeBalance = account.balances.find((b) => b.asset_type === "native");
    return nativeBalance ? nativeBalance.balance : "0";
  } catch (error: any) {
    if (error.response?.status === 404) {
      return "0";
    }
    throw error;
  }
};

export const checkAccountExists = async (publicKey: string): Promise<boolean> => {
  try {
    await server.loadAccount(publicKey);
    return true;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return false;
    }
    throw error;
  }
};

export const validateAddress = (address: string): boolean => {
  return StrKey.isValidEd25519PublicKey(address);
};

export const fundWithFriendbot = async (address: string): Promise<void> => {
  const response = await fetch(`https://friendbot.stellar.org?addr=${address}`);
  if (!response.ok) {
    throw new Error("Friendbot funding failed");
  }
};

export const buildTransaction = async (
  sourceKey: string,
  destination: string,
  amount: string,
  memo?: string
) => {
  const account = await server.loadAccount(sourceKey);
  const destinationExists = await checkAccountExists(destination);

  let txBuilder = new TransactionBuilder(account, {
    fee: "10000",
    networkPassphrase: Networks.TESTNET,
  });

  if (destinationExists) {
    txBuilder = txBuilder.addOperation(
      Operation.payment({
        destination,
        asset: Asset.native(),
        amount,
      })
    );
  } else {
    txBuilder = txBuilder.addOperation(
      Operation.createAccount({
        destination,
        startingBalance: amount,
      })
    );
  }

  if (memo) {
    txBuilder = txBuilder.addMemo(Memo.text(memo));
  }

  return txBuilder.setTimeout(30).build();
};

export const getStellarServer = () => server;
export const getNetworkPassphrase = () => Networks.TESTNET;
