import { useReadContract, useReadContracts } from "wagmi";
import { VAULT_ABI } from "@/utils/vaultConfig";
import { erc20Abi } from "viem";

export const useVault = (address: `0x${string}`) => {
  const assetAddress = useReadContract({
    abi: VAULT_ABI,
    address,
    functionName: "asset",
  });

  const assetData = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: assetAddress.data,
        abi: erc20Abi,
        functionName: "decimals",
      },
      {
        address: assetAddress.data,
        abi: erc20Abi,
        functionName: "symbol",
      },
    ],
  });

  const borrowedAssetAddress = useReadContract({
    abi: VAULT_ABI,
    address,
    functionName: "borrowedAsset",
  });

  const borrowedAssetData = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: borrowedAssetAddress.data,
        abi: erc20Abi,
        functionName: "decimals",
      },
      {
        address: borrowedAssetAddress.data,
        abi: erc20Abi,
        functionName: "symbol",
      },
    ],
  });

  const aaveData = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: address,
        abi: VAULT_ABI,
        functionName: "getVaultAaveData",
      },
    ],
  });

  if (aaveData.data) {
    console.log(aaveData.data[0][0] - aaveData.data[0][1]);
  }

  return {
    token: {
      ...{ address: assetAddress.data },
      decimals: assetData.data ? assetData.data[0] : 0,
      symbol: assetData.data ? assetData.data[1] : "",
    },
    debtToken: {
      ...{ address: borrowedAssetAddress.data },
      decimals: borrowedAssetData.data ? borrowedAssetData.data[0] : 0,
      symbol: borrowedAssetData.data ? borrowedAssetData.data[1] : "",
    },
    tvl: aaveData.data
      ? aaveData.data[0][0] - aaveData.data[0][1]
      : parseInt("0").toFixed(2),
    healthFactor: 0,
  };
};
