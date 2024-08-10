export const CONTRACT_ADDRESS = "0x2D48adbf60cb643333fa7e58c20b8908Ee451e3a";

export const ABI = [
    {
        "inputs": [
            { "internalType": "contract IPool", "name": "lendingPool_", "type": "address" },
            { "internalType": "contract IRewardsController", "name": "rewardsController_", "type": "address" }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "AaveV3ERC4626Factory__ATokenNonexistent",
        "type": "error"
    },
    {
        "inputs": [
            { "internalType": "contract ERC20", "name": "asset", "type": "address" },
            { "internalType": "uint256", "name": "minHealthFactor_", "type": "uint256" },
            { "internalType": "uint256", "name": "maxHealthFactor_", "type": "uint256" }
        ],
        "name": "createERC4626",
        "outputs": [
            { "internalType": "contract ERC4626", "name": "vault", "type": "address" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "lendingPool",
        "outputs": [
            { "internalType": "contract IPool", "name": "", "type": "address" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "rewardRecipient",
        "outputs": [
            { "internalType": "address", "name": "", "type": "address" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "rewardsController",
        "outputs": [
            { "internalType": "contract IRewardsController", "name": "", "type": "address" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];