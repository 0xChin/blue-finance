export const FACTORY_CONTRACT_ADDRESS =
  "0x895619E5d2f811B08F1Ce7169a8552b37712a818";

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
    inputs: [
      { internalType: "contract ERC20", name: "asset", type: "address" },
      {
        internalType: "contract ERC20",
        name: "borrowedAsset",
        type: "address",
      },
      { internalType: "uint256", name: "minHealthFactor_", type: "uint256" },
      { internalType: "uint256", name: "maxHealthFactor_", type: "uint256" },
      { internalType: "bytes32", name: "pythPriceFeed_", type: "bytes32" },
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
