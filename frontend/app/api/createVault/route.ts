import {
  createPublicClient,
  createWalletClient,
  http,
  parseUnits,
  toBytes,
} from "viem";
import { getContract } from "viem";
import {
  FACTORY_ABI,
  FACTORY_CONTRACT_ADDRESS,
} from "../../../utils/vaultConfig";
import { NextRequest } from "next/server";
import { privateKeyToAccount } from "viem/accounts";
import { optimism } from "viem/chains";

export async function GET(request: NextRequest) {
  const publicClient = createPublicClient({
    chain: optimism,
    transport: http(
      "https://opt-mainnet.g.alchemy.com/v2/YNob1yS6fZux6Fs44VAybG3JXP4k8QgN"
    ),
  });

  const walletClient = createWalletClient({
    chain: optimism,
    transport: http(
      "https://opt-mainnet.g.alchemy.com/v2/YNob1yS6fZux6Fs44VAybG3JXP4k8QgN"
    ),
  });
  /* 
  const contract = getContract({
    address: FACTORY_CONTRACT_ADDRESS,
    abi: FACTORY_ABI,
    // 1a. Insert a single client
    client: { wallet: walletClient },
    // 1b. Or public and/or wallet clients
  }); */

  const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

  /*  const { result, request: contractRequest } =
    await publicClient.simulateContract({
      account,
      address: FACTORY_CONTRACT_ADDRESS,
      abi: FACTORY_ABI,
      functionName: "createERC4626",
      args: [
        "0x4200000000000000000000000000000000000006",
        "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
        parseUnits("125", 16),
        parseUnits("130", 16),
        toBytes(
          "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace"
        ),
      ],
    });
 */
  /* const tx = await walletClient.writeContract(contractRequest); */

  return Response.json({ contractAddress: FACTORY_CONTRACT_ADDRESS });
}
