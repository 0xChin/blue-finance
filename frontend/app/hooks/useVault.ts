import { useReadContract, useReadContracts } from "wagmi";
import { VAULT_ABI } from "@/utils/vaultConfig";
import { erc20Abi, maxUint256 } from "viem";

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

  const targetHealthFactor = useReadContract({
    abi: VAULT_ABI,
    address,
    functionName: "TARGET_HEALTH_FACTOR",
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

  console.log(aaveData.data);

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
    tvl: aaveData.data ? aaveData.data[0][0] - aaveData.data[0][1] : BigInt(0),
    targetHealthFactor: targetHealthFactor.data,
    healthFactor: aaveData.data ? aaveData.data[0][5] : maxUint256,
  };
};
