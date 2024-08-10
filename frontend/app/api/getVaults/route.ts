import { NextRequest } from "next/server";

export async function GET() {
  const vaults: { [key: number]: string[] } = {
    [10]: [
      "0xd582ac93a270b8B1c2761D0aFde400Cb334A55c5",
      "0x71836DE191ec5622e514A0B3a22D71abd5Bc5448",
    ],
    [42161]: ["0x5f975746a539E2E9Fa3a0b4d4B85FE8E4220113E"],
    [64122]: [],
  };

  return Response.json({ vaults });
}
