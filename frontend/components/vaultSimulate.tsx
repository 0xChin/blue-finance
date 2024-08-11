import { TableCell, TableRow } from "./ui/table";
import { useVault } from "@/app/hooks/useVault";
import Image from "next/image";
import { erc20Abi, formatUnits, maxUint256, parseUnits } from "viem";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { VAULT_ABI } from "@/utils/vaultConfig";
import { format } from "path";

export default function VaultSimulate({ address }: { address: `0x${string}` }) {
  const vaultData = useVault(address);
  const [priceChange, setPriceChange] = useState(0);
  const [simulationInitialValue, setSimulationInitialValue] = useState(0);
  const [simulationHoldChange, setSimulationHoldChange] = useState(0);
  const [simulationVaultChange, setSimulationVaultChange] = useState(0);
  const [holdApy, setHoldApy] = useState(0);
  const [vaultApy, setVaultApy] = useState(0);

  const getIcon = (symbol: string) => {
    return `https://app.aave.com/icons/tokens/${symbol.toLowerCase()}.svg`;
  };

  const refreshSimulation = () => {
    const initialValue = Number(formatUnits(vaultData.tvl as bigint, 8));

    const holdChange = (initialValue * (100 + priceChange)) / 100;

    const vaultChange =
      (Number(formatUnits(vaultData.token.total as bigint, 8)) *
        (100 + priceChange)) /
        100 -
      Number(formatUnits(vaultData.debtToken.total as bigint, 8));

    const holdApy = priceChange;
    const vaultApy = ((vaultChange - initialValue) / initialValue) * 100;

    setHoldApy(holdApy);
    setVaultApy(vaultApy);

    setSimulationInitialValue(initialValue);
    setSimulationHoldChange(holdChange);
    setSimulationVaultChange(vaultChange);
  };

  return (
    vaultData.tvl > BigInt(0) && (
      <TableRow>
        <TableCell className="text-center">
          <div className="flex gap-2 items-center justify-center">
            <Image
              src={getIcon(vaultData.token.symbol)}
              alt="Logo"
              width={20}
              height={20}
            />
            {vaultData.token.symbol}
          </div>
        </TableCell>
        <TableCell className="text-center">
          <div className="flex gap-2 items-center justify-center">
            <Image
              src={getIcon(vaultData.debtToken.symbol)}
              alt={vaultData.debtToken.symbol}
              width={20}
              height={20}
            />
            {vaultData.debtToken.symbol}
          </div>
        </TableCell>
        <TableCell className="text-center">
          {vaultData.tvl > BigInt(0)
            ? `$${Number(formatUnits(vaultData.tvl as bigint, 8)).toFixed(2)}`
            : "-"}
        </TableCell>
        <TableCell className="text-center">
          {vaultData.token.total > BigInt(0)
            ? `$${Number(
                formatUnits(vaultData.token.total as bigint, 8)
              ).toFixed(2)}`
            : "-"}
        </TableCell>
        <TableCell className="text-center">
          {vaultData.debtToken.total > BigInt(0)
            ? `$${Number(
                formatUnits(vaultData.debtToken.total as bigint, 8)
              ).toFixed(2)}`
            : "-"}
        </TableCell>
        <TableCell className="text-center">
          <Dialog>
            <DialogTrigger>
              <button className="py-2 px-4 bg-blue-500 text-white rounded">
                Simulate
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Simulate</DialogTitle>
                <DialogDescription>
                  Compare your APY depositing into this vault versus the hold
                  APY
                </DialogDescription>
              </DialogHeader>
              <div>
                <label htmlFor="priceChange">
                  <p>Price change (in %)</p>
                </label>
                <input
                  className="mt-1 p-2 w-full border rounded"
                  onChange={(e) => setPriceChange(Number(e.target.value))}
                  // Add your onChange or value handling logic here
                />
                {simulationInitialValue > 0 && (
                  <div className="mt-4 p-4 bg-gray-100 rounded shadow">
                    <div className="mb-4">
                      <p className="text-lg font-semibold text-gray-700">
                        Simulation Results
                      </p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between">
                        <p className="text-gray-600 font-medium">
                          Initial Value:
                        </p>
                        <p className="text-gray-800 font-semibold">
                          {`$${simulationInitialValue.toFixed(0)}`}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-gray-600 font-medium">Hold Value:</p>
                        <p className="text-gray-800 font-semibold">
                          {`$${simulationHoldChange.toFixed(0)}`}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-gray-600 font-medium">Hold APY:</p>
                        <p className="text-green-600 font-semibold">
                          {`${holdApy.toFixed(2)}%`}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-gray-600 font-medium">
                          Vault Value:
                        </p>
                        <p className="text-gray-800 font-semibold">
                          {`$${simulationVaultChange.toFixed(0)}`}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-gray-600 font-medium">Vault APY:</p>
                        <p className="text-green-600 font-semibold">
                          {`${vaultApy.toFixed(2)}%`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  className="mt-4 p-2 bg-green-500 text-white rounded"
                  onClick={refreshSimulation}
                >
                  Simulate
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </TableCell>
      </TableRow>
    )
  );
}
