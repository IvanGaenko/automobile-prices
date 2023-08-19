import { NextResponse } from "next/server";

import getClassTier from "@/lib/getClassTier";

export async function GET() {
  try {
    const data = await getClassTier();

    const tierData = Object.entries(data).map((tier) => {
      const name = tier[0];
      const dungeonsStats = Object.entries(tier[1][0]).map((dungeon) => {
        return {
          name: dungeon[0],
          count: dungeon[1],
        };
      });
      const totalCount = tier[1][1];

      return { name, dungeonsStats, totalCount };
    });

    const totalCount = tierData.length;

    tierData.sort((a, b) => (a.totalCount < b.totalCount ? 1 : -1));
    const maxXValue = tierData[0].totalCount;

    return new NextResponse(
      JSON.stringify({ tierData, maxXValue, totalCount }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
