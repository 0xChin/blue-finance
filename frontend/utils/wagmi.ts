import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrum, optimism } from "wagmi/chains";

import { defineChain } from "viem";

export const virtualOptimism = defineChain({
  id: 64122,
  name: "Virtual Optimism",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        "https://virtual.optimism.rpc.tenderly.co/ed80e84e-185f-427f-b82f-666deb042d82",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Etherscan",
      url: "https://dashboard.tenderly.co/0xchin/project/testnet/0010d143-1530-4dcb-b00d-1f300fefc9b1",
    },
  },
});

export const config = getDefaultConfig({
  appName: "RainbowKit demo",
  projectId: "1175b1e6b9cdc2ace126da3276d6788c",
  chains: [optimism, arbitrum, virtualOptimism],
  ssr: true,
});
