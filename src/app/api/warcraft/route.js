// import getClassTier from "@/lib/getClassTier";

export async function GET() {
  // const data = await getClassTier();
  const data = [];

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

  return new Response(JSON.stringify({ tierData, maxXValue, totalCount }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "s-maxage=300, stale-while-revalidate",
    },
    status: 200,
    statusText: "OK",
  });
}
