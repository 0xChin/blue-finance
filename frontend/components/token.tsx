import Image from "next/image";
import { erc20Abi } from "viem";
import { useReadContracts } from "wagmi";

export default function Token({ address }: { address: `0x${string}` }) {
  const data = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: address,
        abi: erc20Abi,
        functionName: "symbol",
      },
    ],
  });

  const symbol = data.data ? data.data[0] : "";

  const getIcon = (symbol: string) => {
    return `https://app.aave.com/icons/tokens/${symbol.toLowerCase()}.svg`;
  };
  return (
    <div className="flex gap-2 items-center justify-center">
      <Image
        src={getIcon(symbol)}
        alt={symbol}
        width={20}
        height={20}
      />
      {symbol}
    </div>
  );
}