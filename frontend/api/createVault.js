import { createPublicClient, createWalletClient, http } from 'viem';
import { getContract } from 'viem';
import { ABI, CONTRACT_ADDRESS } from '../../vaultConfig';


const publicClient = createPublicClient({
  transport: http(),
  chain: {
    id: 1, 
    name: 'Ethereum',
  },
});

const walletClient = createWalletClient({
  transport: http(),
  chain: {
    id: 1,
    name: 'Ethereum',
  },
  privateKey: process.env.PRIVATE_KEY,
});


const factoryContract = getContract({
  address: CONTRACT_ADDRESS,
  abi: ABI,
  client: walletClient,
})

export default async function handler(req, res) {
  const { method, params } = req.body;
  
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
  
  try {
    let result;

    switch (method) {
      case 'createERC4626':
        const { asset, minHealthFactor, maxHealthFactor } = params;
         result = await factoryContract.createERC4626(asset, minHealthFactor, maxHealthFactor);
        break;
    }

    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
