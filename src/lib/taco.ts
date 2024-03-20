import {
  conditions,
  decrypt,
  encrypt,
  getPorterUri,
  initialize,
  ThresholdMessageKit,
  toBytes,
} from "@nucypher/taco";
import * as dotenv from "dotenv";
import { ethers } from "ethers";
import { CHAIN_ID, TACO_DOMAIN, TACO_RITUAL_ID } from "@/config";

dotenv.config();

const initTaco = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  window.ethereum.enable().catch(alert);

  const network = await provider.getNetwork();
  if (network.chainId !== CHAIN_ID) {
    console.error("Please connect to Mumbai testnet");
  }

  await initialize();

  return provider;
};

export type DecryptionCondition = {
  contractType: string;
  contractAddress: string;
  tokenBalance: string;
};

const conditionForContractType = ({
  contractType,
  contractAddress,
  tokenBalance,
}: DecryptionCondition) => {
  switch (contractType) {
    // TODO: Fix after releasing: https://github.com/nucypher/taco-web/pull/498
    //   case "ERC20":
    //     return new conditions.predefined.erc20.ERC20Balance({
    //       chain: CHAIN_ID,
    //       contractAddress,
    //       returnValueTest: {
    //         comparator: ">",
    //         value: parseInt(tokenBalance),
    //       },
    //     });
    case "ERC721":
      return new conditions.predefined.erc721.ERC721Balance({
        chain: CHAIN_ID,
        contractAddress,
        returnValueTest: {
          comparator: ">",
          value: parseInt(tokenBalance),
        },
      });
    default:
      throw new Error(`Unsupported contract type: ${contractType}`);
  }
};

export const encryptToBytes = async (
  messageString: string,
  decryptionCondition: DecryptionCondition,
) => {
  const provider = await initTaco();

  const message = toBytes(messageString);
  const condition = conditionForContractType(decryptionCondition);
  const messageKit = await encrypt(
    provider,
    TACO_DOMAIN,
    message,
    condition,
    TACO_RITUAL_ID,
    provider.getSigner(),
  );
  return messageKit.toBytes();
};

export const decryptFromBytes = async (encryptedBytes: Uint8Array) => {
  const provider = await initTaco();

  const messageKit = ThresholdMessageKit.fromBytes(encryptedBytes);
  return decrypt(
    provider,
    TACO_DOMAIN,
    messageKit,
    getPorterUri(TACO_DOMAIN),
    provider.getSigner(),
  );
};
