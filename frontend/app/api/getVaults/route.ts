import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const chainId = request.nextUrl.searchParams.get("chainId") || "10";

  const vaults: { [key: number]: string[] } = {
    [10]: [
      "0xd582ac93a270b8B1c2761D0aFde400Cb334A55c5",
      "0x71836DE191ec5622e514A0B3a22D71abd5Bc5448",
    ],
    [42161]: ["0x4d13b7cb87d44796aa409615706caf07b8c01aaa"],
    [64122]: [],
  };

  return Response.json({ vaults: vaults[parseInt(chainId)] });
}
