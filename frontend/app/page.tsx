"use client";

import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useWriteContract } from "wagmi";
import { FACTORY_ABI, FACTORY_CONTRACT_ADDRESS } from "@/utils/vaultConfig";
import { parseUnits, stringToBytes, toBytes } from "viem";
import { simulateContract } from "wagmi/actions";
import { config } from "@/utils/wagmi";

export default function Home() {
  const { writeContractAsync } = useWriteContract();

  const createVault = async () => {
    const result = await simulateContract(config, {
      address: FACTORY_CONTRACT_ADDRESS,
      abi: FACTORY_ABI,
      functionName: "createERC4626",
      args: [
        "0x4200000000000000000000000000000000000006",
        "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
        parseUnits("125", 16),
        parseUnits("130", 16),
        "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace" as `0x${string}`,
      ],
    });

    console.log(result);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/logo.png"
          alt="Next.js Logo"
          width={90}
          height={37}
          priority
        />
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <ConnectButton />
        </div>
      </div>
      <button onClick={createVault}>Transfer</button>
    </main>
  );
}
