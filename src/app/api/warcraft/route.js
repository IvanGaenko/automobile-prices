import getClassTier from "@/lib/getClassTier";

export async function GET() {
  const dataTier = await getClassTier();
  console.log("dataTier", dataTier);
  const data = {
    monk: [
      {
        "Iron Docks": 5,
        "Grimrail Depot": 4,
        "Каражан (lower)": 8,
        "Каражан (upper)": 5,
        "Operation: Mechagon (Свалка)": 4,
        "Operation: Mechagon (Мастерская)": 7,
        "Tazavesh<br> (Улицы чудес)": 6,
        "Tazavesh<br> (Гамбит Со'леи)": 4,
      },
      43,
    ],
    demonhunter: [
      {
        "Iron Docks": 2,
        "Grimrail Depot": 7,
        "Каражан (lower)": 6,
        "Каражан (upper)": 9,
        "Operation: Mechagon (Свалка)": 1,
        "Operation: Mechagon (Мастерская)": 5,
        "Tazavesh<br> (Улицы чудес)": 8,
        "Tazavesh<br> (Гамбит Со'леи)": 6,
      },
      44,
    ],
  };

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
