import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { VAULT_ABI } from "@/utils/vaultConfig";
import { erc20Abi, maxUint256 } from "viem";

export const useVault = (address: `0x${string}`) => {
  const { address: user } = useAccount();

  const assetAddress = useReadContract({
    abi: VAULT_ABI,
    address,
    functionName: "asset",
  });

  const { data: assetData } = useReadContracts({
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
      {
        address: assetAddress.data,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [user!],
      },
      {
        address: assetAddress.data,
        abi: erc20Abi,
        functionName: "allowance",
        args: [user!, address],
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

  return {
    token: {
      ...{ address: assetAddress.data },
      decimals: assetData ? assetData[0] : 0,
      symbol: assetData ? assetData[1] : "",
      balance: assetData ? assetData[2] : BigInt(0),
      allowance: assetData ? assetData[3] : BigInt(0),
      total: aaveData.data ? aaveData.data[0][0] : BigInt(0),
    },
    debtToken: {
      ...{ address: borrowedAssetAddress.data },
      decimals: borrowedAssetData.data ? borrowedAssetData.data[0] : 0,
      symbol: borrowedAssetData.data ? borrowedAssetData.data[1] : "",
      total: aaveData.data ? aaveData.data[0][1] : BigInt(0),
    },
    tvl: aaveData.data ? aaveData.data[0][0] - aaveData.data[0][1] : BigInt(0),
    targetHealthFactor: targetHealthFactor.data,
    healthFactor: aaveData.data ? aaveData.data[0][5] : maxUint256,
  };
};
