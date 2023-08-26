import { NextResponse } from "next/server";

import getClassTier from "@/lib/getClassTier";

export async function GET() {
  try {
    // const data = await getClassTier();
    const { teamRating, tankRating, healerRating, dpsRating } =
      await getClassTier();
    // {priest: [
    //   {
    //     'Iron Docks': 22,
    //     'Grimrail Depot': 24,
    //     'Каражан (lower)': 17,
    //     'Каражан (upper)': 26,
    //     'Operation: Mechagon (Свалка)': 27,
    //     'Operation: Mechagon (Мастерская)': 20,
    //     'Tazavesh (Улицы чудес)': 16,
    //     "Tazavesh (Гамбит Со'леи)": 27
    //   },
    //   179
    // ],}

    // {
    //   deathknight_priest_hunter_mage_warlock: [ { tank: 'deathknight', healer: 'priest', dps: [Array] }, 7 ],
    //   deathknight_shaman_hunter_warlock_warlock: [ { tank: 'deathknight', healer: 'shaman', dps: [Array] }, 6 ],
    //   monk_druid_hunter_warlock_warlock: [ { tank: 'monk', healer: 'druid', dps: [Array] }, 1 ],
    //   demonhunter_priest_hunter_warlock_warrior: [ { tank: 'demonhunter', healer: 'priest', dps: [Array] }, 6 ],
    // }

    function convertTeamRating(data) {
      const teamData = Object.entries(data).map((team) => {
        return {
          team: [team[1][0].tank, team[1][0].healer, ...team[1][0].dps],
          count: team[1][1],
        };
      });
      teamData.sort((a, b) => (a.count < b.count ? 1 : -1));
      return teamData.slice(0, 30);
    }

    function convertPlayerRating(data) {
      const playerData = Object.entries(data).map((tier) => {
        const dungeonsStats = Object.entries(tier[1][0]).map((dungeon) => {
          return {
            name: dungeon[0],
            count: dungeon[1],
          };
        });

        return { name: tier[0], dungeonsStats, totalCount: tier[1][1] };
      });

      playerData.sort((a, b) => (a.totalCount < b.totalCount ? 1 : -1));

      return {
        tierData: playerData,
        maxXValue: playerData[0].totalCount,
        totalCount: playerData.length,
      };
    }

    const teamData = convertTeamRating(teamRating);

    const tankData = convertPlayerRating(tankRating);
    const healerData = convertPlayerRating(healerRating);
    const dpsData = convertPlayerRating(dpsRating);

    return new NextResponse(
      // JSON.stringify({ tierData, maxXValue, totalCount }),
      JSON.stringify({ teamData, tankData, healerData, dpsData }),
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
