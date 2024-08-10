import { useEffect } from "react";
import { TableCell, TableRow } from "./ui/table";
import { useVault } from "@/app/hooks/useVault";
import Image from "next/image";

export default function Vault({ address }: { address: `0x${string}` }) {
  const vaultData = useVault(address);

  useEffect(() => {
    console.log(vaultData);
  }, [vaultData]);

  const getIcon = (symbol: string) => {
    return `https://app.aave.com/icons/tokens/${symbol.toLowerCase()}.svg`;
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
      <TableCell className="text-center">$10.000</TableCell>
      <TableCell className="text-center">1.25</TableCell>
      <TableCell className="text-center">1.25</TableCell>
      <TableCell className="text-center">
        <button className="py-2 px-4 bg-blue-500 text-white rounded">
          Deposit
        </button>
        <button className="py-2 px-4 bg-red-500 text-white rounded ml-2">
          Withdraw
        </button>
      </TableCell>
    </TableRow>
  );
}
