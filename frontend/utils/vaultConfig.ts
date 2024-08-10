export const FACTORY_CONTRACT_ADDRESS: { [chainId: number]: `0x${string}` } = {
  10: "0x6032Aa03C26dc0eec909af1613D81e829aB2A36A",
  42161: "0x4d13b7cb87d44796aa409615706caf07b8c01aaa",
  64122: "0xe4d26ff09976d0a5bbb6143c1483c30b939fa09e",
};

export const LENDING_PROTOCOLS = [
  {
    name: "Aave V3",
    image: "https://icons.llamao.fi/icons/protocols/aave-v3?w=48&h=48",
  },
  {
    name: "Aave V2",
    image: "https://icons.llamao.fi/icons/protocols/aave-v2?w=48&h=48",
  },
  {
    name: "Compound",
    image: "https://icons.llamao.fi/icons/protocols/compound-finance?w=48&h=48",
  },
  {
    name: "Exactly",
    image: "https://icons.llamao.fi/icons/protocols/exactly?w=48&h=48",
  },
];

export const ASSETS: { [key: number]: `0x${string}`[] } = {
  10: [
    "0x4200000000000000000000000000000000000006",
    "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
    "0x4200000000000000000000000000000000000042",
    "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6",
  ],
  42161: [
    "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
    "0x912CE59144191C1204E64559FE8253a0e49E6548",
    "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
  ],
  64122: [
    "0x4200000000000000000000000000000000000006",
    "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
    "0x4200000000000000000000000000000000000042",
    "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6",
  ],
};

export const pythPriceFeedIds = {
  ethUsd: BigInt(0),
  btcUsd: BigInt(1),
  opUsd: BigInt(2),
  arbUsd: BigInt(3),
  linkUsd: BigInt(4),
};

export const ADDRESS_TO_ORACLE_ID: {
  [key: number]: { [key: `0x${string}`]: bigint };
} = {
  10: {
    "0x4200000000000000000000000000000000000006": pythPriceFeedIds["ethUsd"],
    "0x68f180fcCe6836688e9084f035309E29Bf0A2095": pythPriceFeedIds["btcUsd"],
    "0x4200000000000000000000000000000000000042": pythPriceFeedIds["opUsd"],
    "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6": pythPriceFeedIds["linkUsd"],
  },
  42161: {
    "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1": pythPriceFeedIds["ethUsd"],
    "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f": pythPriceFeedIds["btcUsd"],
    "0x912CE59144191C1204E64559FE8253a0e49E6548": pythPriceFeedIds["arbUsd"],
    "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4": pythPriceFeedIds["linkUsd"],
  },
  64122: {
    "0x4200000000000000000000000000000000000006": pythPriceFeedIds["ethUsd"],
    "0x68f180fcCe6836688e9084f035309E29Bf0A2095": pythPriceFeedIds["btcUsd"],
    "0x4200000000000000000000000000000000000042": pythPriceFeedIds["opUsd"],
    "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6": pythPriceFeedIds["linkUsd"],
  },
};

export const BORROW_ASSETS: { [key: number]: `0x${string}`[] } = {
  10: [
    "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
    "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
  ],
  42161: [
    "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    "0x93b346b6bc2548da6a1e7d98e9a421b42541425b",
  ],
  64122: [
    "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
    "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
  ],
};

export const FACTORY_ABI = [
  {
    inputs: [
      { internalType: "contract IPool", name: "lendingPool_", type: "address" },
      {
        internalType: "contract IRewardsController",
        name: "rewardsController_",
        type: "address",
      },
      {
        internalType: "contract ISwapRouter",
        name: "uniswapRouter_",
        type: "address",
      },
      { internalType: "contract IPyth", name: "pyth_", type: "address" },
      {
        internalType: "contract ISuperformFactory",
        name: "superformFactory_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AaveV3ERC4626Factory__ATokenNonexistent",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "vault",
        type: "address",
      },
    ],
    name: "VaultCreated",
    type: "event",
  },
  {
    inputs: [
      { internalType: "contract ERC20", name: "asset", type: "address" },
      {
        internalType: "contract ERC20",
        name: "borrowedAsset",
        type: "address",
      },
      { internalType: "uint256", name: "minHealthFactor_", type: "uint256" },
      { internalType: "uint256", name: "maxHealthFactor_", type: "uint256" },
      { internalType: "uint256", name: "pythPriceFeedId_", type: "uint256" },
    ],
    name: "createERC4626",
    outputs: [
      { internalType: "contract ERC4626", name: "vault", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "lendingPool",
    outputs: [{ internalType: "contract IPool", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pyth",
    outputs: [{ internalType: "contract IPyth", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "pythPriceFeedIds",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardRecipient",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardsController",
    outputs: [
      {
        internalType: "contract IRewardsController",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "superformFactory",
    outputs: [
      { internalType: "contract ISuperformFactory", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "uniswapRouter",
    outputs: [
      { internalType: "contract ISwapRouter", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const VAULT_ABI = [
  {
    inputs: [
      { internalType: "contract ERC20", name: "asset_", type: "address" },
      {
        internalType: "contract ERC20",
        name: "borrowedAsset_",
        type: "address",
      },
      { internalType: "contract ERC20", name: "aToken_", type: "address" },
      { internalType: "contract IPool", name: "lendingPool_", type: "address" },
      { internalType: "address", name: "rewardRecipient_", type: "address" },
      {
        internalType: "contract IRewardsController",
        name: "rewardsController_",
        type: "address",
      },
      { internalType: "uint256", name: "minHealthFactor_", type: "uint256" },
      { internalType: "uint256", name: "maxHealthFactor_", type: "uint256" },
      {
        internalType: "contract ISwapRouter",
        name: "uniswapRouter_",
        type: "address",
      },
      { internalType: "contract IPyth", name: "pyth_", type: "address" },
      { internalType: "bytes32", name: "pythPriceFeed_", type: "bytes32" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "AaveV3ERC4626_ZeroAssets", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "ClaimRewards",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    inputs: [],
    name: "ADDRESSES_PROVIDER",
    outputs: [
      {
        internalType: "contract IPoolAddressesProvider",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_HEALTH_FACTOR",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MIN_HEALTH_FACTOR",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "POOL",
    outputs: [{ internalType: "contract IPool", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "TARGET_HEALTH_FACTOR",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "aToken",
    outputs: [{ internalType: "contract ERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "asset",
    outputs: [{ internalType: "contract ERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bToken",
    outputs: [{ internalType: "contract ERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "borrowedAsset",
    outputs: [{ internalType: "contract ERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "claimRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "shares", type: "uint256" }],
    name: "convertToAssets",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "assets", type: "uint256" }],
    name: "convertToShares",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "assets", type: "uint256" },
      { internalType: "address", name: "receiver", type: "address" },
    ],
    name: "deposit",
    outputs: [{ internalType: "uint256", name: "shares", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "premium", type: "uint256" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "bytes", name: "params", type: "bytes" },
    ],
    name: "executeOperation",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getVaultAaveData",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lendingPool",
    outputs: [{ internalType: "contract IPool", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "maxDeposit",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "maxMint",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "maxRedeem",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "maxWithdraw",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "shares", type: "uint256" },
      { internalType: "address", name: "receiver", type: "address" },
    ],
    name: "mint",
    outputs: [{ internalType: "uint256", name: "assets", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "nonces",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
      { internalType: "uint8", name: "v", type: "uint8" },
      { internalType: "bytes32", name: "r", type: "bytes32" },
      { internalType: "bytes32", name: "s", type: "bytes32" },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "poolFee",
    outputs: [{ internalType: "uint24", name: "", type: "uint24" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "assets", type: "uint256" }],
    name: "previewDeposit",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "shares", type: "uint256" }],
    name: "previewMint",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "shares", type: "uint256" }],
    name: "previewRedeem",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "assets", type: "uint256" }],
    name: "previewWithdraw",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pyth",
    outputs: [{ internalType: "contract IPyth", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pythPriceFeed",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rebalance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "shares", type: "uint256" },
      { internalType: "address", name: "receiver", type: "address" },
      { internalType: "address", name: "owner_", type: "address" },
    ],
    name: "redeem",
    outputs: [{ internalType: "uint256", name: "assets", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardRecipient",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardsController",
    outputs: [
      {
        internalType: "contract IRewardsController",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalAssets",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "uniswapRouter",
    outputs: [
      { internalType: "contract ISwapRouter", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "minHealthFactor_", type: "uint256" },
      { internalType: "uint256", name: "maxHealthFactor_", type: "uint256" },
    ],
    name: "updateHealthFactors",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "assets", type: "uint256" },
      { internalType: "address", name: "receiver", type: "address" },
      { internalType: "address", name: "owner_", type: "address" },
    ],
    name: "withdraw",
    outputs: [{ internalType: "uint256", name: "shares", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
