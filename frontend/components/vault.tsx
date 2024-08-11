import { TableCell, TableRow } from "./ui/table";
import { useVault } from "@/app/hooks/useVault";
import Image from "next/image";
import { erc20Abi, formatUnits, maxUint256, parseUnits } from "viem";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { VAULT_ABI } from "@/utils/vaultConfig";

export default function Vault({ address }: { address: `0x${string}` }) {
  const vaultData = useVault(address);
  const [depositAmount, setDepositAmount] = useState(BigInt(0));
  const {address: user} = useAccount();

  const getIcon = (symbol: string) => {
    return `https://app.aave.com/icons/tokens/${symbol.toLowerCase()}.svg`;
  };

  const { writeContractAsync } = useWriteContract();

  const approve = async () => {
    try {
      await writeContractAsync({
        address: vaultData.token.address as `0x${string}`,
        abi: erc20Abi,
        functionName: "approve",
        args: [address, depositAmount],
      });
    } catch (error) {
      console.error("Error approving:", error);
    }
  };

  const deposit = async () => {
    try {
      await writeContractAsync({
      address: address,
        abi: VAULT_ABI,
        functionName: "deposit",
        args: [depositAmount, user!],
      });
    } catch (error) {
      console.error("Error approving:", error);
    }
  };

  return (
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
        {vaultData.tvl > BigInt(0) ? `$${Number(formatUnits(vaultData.tvl as bigint, 8)).toFixed(2)}` : "-"}
      </TableCell>
      <TableCell className="text-center">
        {vaultData.targetHealthFactor ? Number(formatUnits(vaultData.targetHealthFactor, 18)).toFixed(2) : "-"}
      </TableCell>
      <TableCell className="text-center">
        {vaultData.healthFactor && vaultData.healthFactor !== maxUint256 ? Number(formatUnits(vaultData.healthFactor, 18)).toFixed(2) : "-"}
      </TableCell>
      <TableCell className="text-center">
        <Dialog>
          <DialogTrigger>
            <button className="py-2 px-4 bg-blue-500 text-white rounded">
              Deposit
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Deposit into {vaultData.token.symbol} Vault</DialogTitle>
              <DialogDescription>
                Enter the amount you want to deposit into the vault at address {address}.
              </DialogDescription>
            </DialogHeader>
            <div>
              <input
                placeholder="Amount"
                className="mt-4 p-2 w-full border rounded"
                onChange={(e) => setDepositAmount(parseUnits(e.target.value, vaultData.token.decimals))}
                // Add your onChange or value handling logic here
              />
              <p>Your Balance: {formatUnits(vaultData.token.balance, vaultData.token.decimals)}</p>     
              <button
                className="mt-4 p-2 bg-green-500 text-white rounded"
                onClick={approve}
                // Add your deposit logic here in the onClick handler
              >
                Approve
              </button>
              <button
                className="mt-4 p-2 bg-green-500 text-white rounded"
                onClick={deposit}
                // Add your deposit logic here in the onClick handler
              >
                Deposit
              </button>
            </div>
          </DialogContent>
        </Dialog>
        <button className="py-2 px-4 bg-red-500 text-white rounded ml-2">
          Withdraw
        </button>
      </TableCell>
    </TableRow>
  );
}
