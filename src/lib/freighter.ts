import * as freighterModule from "@stellar/freighter-api";

// Turbopack/Next.js fix: freighter-api sometimes exports functions on a .default property
const freighter = (freighterModule as any).default || freighterModule;

export const checkFreighter = async () => {
  const result = await freighter.isConnected();
  return !!result?.isConnected;
};

export const connectWallet = async () => {
  const connected = await freighter.isConnected();
  if (!connected?.isConnected) {
    throw new Error("Freighter not installed");
  }

  const allowed = await freighter.isAllowed();
  if (!allowed?.isAllowed) {
    await freighter.setAllowed();
  }

  const result = await freighter.getAddress();
  if (result.error) {
    throw new Error(result.error);
  }
  return result.address;
};

export const signTxWithFreighter = async (xdr: string, network: string) => {
  const result = await freighter.signTransaction(xdr, {
    networkPassphrase: network,
  });
  
  if (result.error) {
    throw new Error(result.error);
  }
  
  return result.signedTxXdr;
};
