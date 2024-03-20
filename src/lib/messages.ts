import { Frame } from "@/types";
import { CHAIN_ID, LOCK_NFT_ADDR } from "@/config";

export const getMessage = async (
  id: string,
): Promise<Frame | null | undefined> => {
  console.log("getMessage", { id });
  try {
    const messageUrl = `https://gateway.irys.xyz/${id}`;
    const response = await fetch(messageUrl);
    const frame = await response.json();
    return {
      id,
      ...frame,
    };
  } catch (e) {
    console.error(e);
  }

  const paywallConfig = {
    pessimistic: true,
    persistentCheckout: true,
    title: "Unlock Community Membership",
    skipRecipient: true,
    locks: {
      [LOCK_NFT_ADDR]: {
        name: "Unlock Community",
        network: CHAIN_ID,
      },
    },
    metadataInputs: [{ name: "email", type: "email", required: true }],
  };

  return {
    // @ts-expect-error
    id: "1",
    frame: {
      title: "Some title",
      body: `👏 You're in the secret! 🤫. 

      You can only view this if you own a valid membership NFT from the Unlock community!
  
      This is a token gated frame!
      `,
      description: "Are you a member of the Unlock Community? Click Reveal 🔓!",
      denied:
        "You are not a member of the Unlock Community. Click below to get the free token!",
      gate: {
        contract: LOCK_NFT_ADDR,
        network: CHAIN_ID,
      },
      checkoutUrl: `https://app.unlock-protocol.com/checkout?paywallConfig=${encodeURIComponent(
        JSON.stringify(paywallConfig),
      )}`,
    },
  };
};
