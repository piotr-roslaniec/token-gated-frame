"use client";

import { FrameFields } from "@/types";
import { encryptToBytes } from "@/lib/taco";
import { toHexString } from "@nucypher/taco";
import { getWebIrys } from "@/lib/irys";

export async function createFrame(_prev: any, form: FormData) {
  // TODO: perform validation!

  // TODO: Handle type casting to string
  const formBody = form.get("frame.body") as string;
  const contractType = form.get("frame.gate.type") as string;
  // My event NFT: 0xa2C09412396f5fa6C49FAc71E62D1c620Ba9e490
  const contractAddress = form.get("frame.gate.contract") as string;
  const tokenBalance = form.get("frame.gate.balance") as string;

  const encryptedBody = await encryptToBytes(formBody, {
    contractType,
    contractAddress,
    tokenBalance,
  });
  const encryptedBodyHex = toHexString(encryptedBody);

  const toSave = {
    author: form.get("author"),
    frame: {
      title: form.get("frame.title"),
      description: form.get("frame.description"),
      body: encryptedBodyHex,
      denied: form.get("frame.denied"),
      gate: {
        network: Number(form.get("frame.gate.network")),
        type: contractType,
        token: form.get("frame.gate.token"), // ERC1155 token id
        balance: tokenBalance,
        contract: contractAddress,
      },
      checkoutUrl: form.get("frame.checkoutUrl"),
    } as FrameFields,
  };

  const webIrys = await getWebIrys();
  const dataToUpload = JSON.stringify(toSave);
  const receipt = await webIrys.upload(dataToUpload);
  console.log(`Data uploaded ==> https://gateway.irys.xyz/${receipt.id}`);
  return { ...toSave, id: receipt.id };
}
