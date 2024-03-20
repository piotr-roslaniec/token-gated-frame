import { providers } from "ethers";
import { WebIrys } from "@irys/sdk";

export const getWebIrys = async () => {
  await window.ethereum.enable();
  const provider = new providers.Web3Provider(window.ethereum);

  // Node 2 is free
  const url = "https://node2.irys.xyz";
  const token = "matic";
  // Devnet RPC URLs change often, use a recent one from https://chainlist.org/chain/80001
  const rpcURL = "https://gateway.tenderly.co/public/polygon-mumbai";

  const wallet = { rpcUrl: rpcURL, name: "ethersv5", provider: provider };
  const webIrys = new WebIrys({ url, token, wallet });
  await webIrys.ready();

  return webIrys;
};
