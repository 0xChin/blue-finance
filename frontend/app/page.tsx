"use client";

import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useChainId,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";
import {
  BORROW_ASSETS,
  FACTORY_ABI,
  FACTORY_CONTRACT_ADDRESS,
} from "@/utils/vaultConfig";
import { parseUnits } from "viem";
import { pythPriceFeedIds } from "@/utils/vaultConfig";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Vault from "@/components/vault";
import {
  LENDING_PROTOCOLS,
  ASSETS,
  ADDRESS_TO_ORACLE_ID,
} from "@/utils/vaultConfig";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Token from "@/components/token";
import { parse } from "path";

export default function Home() {
  const { writeContractAsync } = useWriteContract();
  const chainId = useChainId();
  const [isCreatingVault, setIsCreatingVault] = useState(false);
  const [vaults, setVaults] = useState<{ [key: number]: `0x${string}`[] }>({});
  const [parsedVaults, setParsedVaults] = useState<`0x${string}`[]>([]);
  const [asset, setAsset] = useState<`0x${string}`>("0x");
  const [borrowToken, setBorrowToken] = useState<`0x${string}`>("0x");
  const [minHealthFactor, setMinHealthFactor] = useState(125);
  const [maxHealthFactor, setMaxHealthFactor] = useState(130);
  const [eventsEmitted, setEventsEmitted] = useState(0);
  useWatchContractEvent({
    address: FACTORY_CONTRACT_ADDRESS[chainId],
    abi: FACTORY_ABI,
    batch: false,
    eventName: "VaultCreated",
    onLogs(logs) {
      const currentVaults = JSON.parse(localStorage.getItem("vaults") || "{}");
      currentVaults[chainId] = currentVaults[chainId] || [];
      currentVaults[chainId].push(logs[0].args.vault);
      localStorage.setItem("vaults", JSON.stringify(currentVaults));
      setEventsEmitted(eventsEmitted + 1);
      alert("Vault created!");
    },
  });

  const createVault = async () => {
    try {
      const result = await writeContractAsync({
        address: FACTORY_CONTRACT_ADDRESS[chainId],
        abi: FACTORY_ABI,
        functionName: "createERC4626",
        args: [
          asset!,
          borrowToken!,
          parseUnits(minHealthFactor.toString(), 16),
          parseUnits(maxHealthFactor.toString(), 16),
          BigInt(0),
        ],
      });
    } catch (error) {
      console.error("Error creating vault:", error);
    }
  };

  useEffect(() => {
    fetch(`/api/getVaults?chainId=${chainId}`)
      .then((res) => res.json())
      .then((data) => {
        setVaults(data.vaults);
      });
  }, []);

  useEffect(() => {
    const lsVaults = JSON.parse(localStorage.getItem("vaults") || "{}");
    const apiVaults = vaults[chainId] || [];
    let parsedVaults = [];
    
    if (lsVaults && lsVaults[chainId]) {
      parsedVaults = [...lsVaults[chainId], ...apiVaults];
    } else {
      parsedVaults = apiVaults;
    }

    setParsedVaults(parsedVaults);
  }, [chainId, eventsEmitted])
  

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/logo.png"
          alt="Next.js Logo"
          width={90}
          height={37}
          priority
        />
        <div className="fixed flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <ConnectButton />
        </div>
      </div>
      <div className="mt-20">
        <ToggleGroup
          type="single"
          className="flex"
          value={isCreatingVault ? "createVault" : "deployedVaults"}
          onValueChange={(value) => setIsCreatingVault(value === "createVault")}
        >
          <ToggleGroupItem
            className="px-40"
            value="deployedVaults"
            aria-label="Deployed Vaults"
          >
            <p>Deployed Vaults</p>
          </ToggleGroupItem>
          <ToggleGroupItem
            className="px-40"
            value="createVault"
            aria-label="Create Vault"
          >
            <p>Create Vault</p>
          </ToggleGroupItem>
        </ToggleGroup>
        {!isCreatingVault &&
          (parsedVaults && parsedVaults.length > 0 ? (
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Token</TableHead>
                  <TableHead className="text-center">Debt token</TableHead>
                  <TableHead className="text-center">TVL</TableHead>
                  <TableHead className="text-center">
                    Target Health Factor
                  </TableHead>
                  <TableHead className="text-center">Health Factor</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parsedVaults.map((vault, index) => (
                  <Vault address={vault} key={index} />
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="mt-10 text-center">
              No deployed vaults found. Create one to get started.
            </p>
          ))}
        {isCreatingVault && (
          <form className="mt-4 p-4 bg-gray-100 rounded">
            <label className="block mb-2">
              Protocol:
              <Select>
                <SelectTrigger className="w-full mt-1 p-2 border rounded">
                  <SelectValue placeholder="Select Protocol" />
                </SelectTrigger>
                <SelectContent>
                  {LENDING_PROTOCOLS.map((protocol, index) => (
                    <SelectItem value={protocol.name} key={index}>
                      <div className="flex items-center">
                        <Image
                          src={protocol.image}
                          alt={protocol.name}
                          width={24}
                          height={24}
                          className="mr-2"
                        />
                        {protocol.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="block mb-2">
              Asset:
              <Select
                onValueChange={(value) => setAsset(value as `0x${string}`)}
              >
                <SelectTrigger className="w-full mt-1 p-2 border rounded">
                  <SelectValue placeholder="Select Asset" />
                </SelectTrigger>
                <SelectContent>
                  {ASSETS[chainId].map((token: `0x${string}`, index) => (
                    <SelectItem value={token} key={index}>
                      <Token address={token} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="block mb-2">
              Borrow Token:
              <Select
                onValueChange={(value) =>
                  setBorrowToken(value as `0x${string}`)
                }
              >
                <SelectTrigger className="w-full mt-1 p-2 border rounded">
                  <SelectValue placeholder="Select Borrow Token" />
                </SelectTrigger>
                <SelectContent>
                  {BORROW_ASSETS[chainId].map((token: `0x${string}`, index) => (
                    <SelectItem value={token} key={index}>
                      <Token address={token} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="block mb-2">
              Min Health Factor:
              <input
                type="range"
                className="block w-full mt-1"
                min="100"
                max="200"
                value={minHealthFactor}
                onChange={(e) => setMinHealthFactor(Number(e.target.value))}
              />
              <span className="block mt-1 text-sm text-gray-600">
                {minHealthFactor / 100}
              </span>
            </label>
            <label className="block mb-2">
              Max Health Factor:
              <input
                type="range"
                className="block w-full mt-1"
                min="100"
                max="200"
                value={maxHealthFactor}
                onChange={(e) => setMaxHealthFactor(Number(e.target.value))}
              />
              <span className="block mt-1 text-sm text-gray-600">
                {maxHealthFactor / 100}
              </span>
            </label>
            <button
              type="button"
              onClick={createVault}
              className="mt-4 p-2 bg-blue-500 text-white rounded"
            >
              Create Vault
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
