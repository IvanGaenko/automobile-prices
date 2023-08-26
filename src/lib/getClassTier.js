import puppeteer from "puppeteer";

export default async function getClassTier() {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    headless: true,
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });

  const page = await browser.newPage();

  await page.goto("https://firestorm-servers.com/ru/challenge/index", {
    waitUntil: "domcontentloaded",
  });

  async function waitForTransitionEnd(element) {
    await page.evaluate((element) => {
      return new Promise((resolve) => {
        const transition = document.querySelector(element);
        const onEnd = function () {
          transition.removeEventListener("transitionend", onEnd);
          resolve();
        };
        transition.addEventListener("transitionend", onEnd);
      });
    }, element);
  }

  const carouselSelector = "div.carousel-inner";
  const dungeonSelector = "div.item.active >:first-child";
  const tableSelector = "tbody";
  const rightArrowSelector = "#pve_carousel > a.right.carousel-control > i";

  const dungeonsDivs = await page.waitForSelector(carouselSelector);
  const dungeons = await dungeonsDivs.evaluate((element) => {
    return Array.from(element.querySelectorAll("div.item")).map((dungeon) => {
      const name = dungeon
        .querySelector("label")
        .innerHTML.trim()
        .replace("<br>", "");
      const ajax = dungeon.querySelector("div").getAttribute("ajax");
      return { name, ajax };
    });
  });

  const teamRating = {};
  const tankRating = {};
  const healerRating = {};
  const dpsRating = {};

  for (let i = 0; i < dungeons.length; i++) {
    const currentDungeon = dungeons[i];

    if (i !== 0) {
      await page.click(dungeonSelector);

      // https://felsong.gg/en/challenge/challenge/1456/197
      await page.waitForResponse(
        (res) => {
          const neededUrl = `https://firestorm-servers.com/ru/challenge/${currentDungeon.ajax}`;
          return res.url() === neededUrl;
        },
        { timeout: 90_000 }
      );
    }

    const table = await page.waitForSelector(tableSelector);

    // get content
    const [tanks, healers, dps, teams] = await table.evaluate((element) => {
      const teams = [];
      const tanks = {};
      const healers = {};
      const dps = {};

      function convertToNameCountArray(players) {
        return Object.entries(players)
          .map((player) => {
            return {
              name: player[0],
              count: player[1],
            };
          })
          .sort((a, b) => (a.count < b.count ? 1 : -1));
      }

      Array.from(element.querySelectorAll("tr > td:nth-child(4)")).forEach(
        (group) => {
          const team = {
            tank: "",
            healer: "",
            dps: [],
          };
          Array.from(group.querySelectorAll("span")).forEach((line) => {
            const isTank = line.querySelector("span.fa.fa-shield") !== null;
            const isHealer = line.querySelector("span.fa.fa-plus") !== null;
            const name = line.className.split("_")[1];

            if (name) {
              if (isTank) {
                team.tank = name;

                if (tanks[name]) {
                  tanks[name] = tanks[name] + 1;
                } else {
                  tanks[name] = 1;
                }
              }
              if (isHealer) {
                team.healer = name;

                if (healers[name]) {
                  healers[name] = healers[name] + 1;
                } else {
                  healers[name] = 1;
                }
              }
              if (!isTank && !isHealer) {
                team.dps.push(name);

                if (dps[name]) {
                  dps[name] = dps[name] + 1;
                } else {
                  dps[name] = 1;
                }
              }
            }
          });

          team.dps.sort((a, b) => (a > b ? 1 : -1));
          teams.push(team);
        }
      );

      return [
        convertToNameCountArray(tanks),
        convertToNameCountArray(healers),
        convertToNameCountArray(dps),
        teams,
      ];
    });

    function parseTierData(rankingList, players, dungeon) {
      for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const playerName = player.name;
        const playerCount = player.count;
        const dungeonName = dungeon.name;

        if (rankingList[playerName]) {
          if (rankingList[playerName][0][dungeonName]) {
            rankingList[playerName][0][dungeonName] =
              rankingList[playerName][0][dungeonName] + playerCount;
            rankingList[playerName][1] =
              rankingList[playerName][1] + playerCount;
          } else {
            rankingList[playerName][0][dungeonName] = playerCount;
            rankingList[playerName][1] =
              rankingList[playerName][1] + playerCount;
          }
        } else {
          const newDungeonTier = {};
          newDungeonTier[dungeonName] = playerCount;
          rankingList[playerName] = [newDungeonTier, playerCount];
        }
      }
    }

    parseTierData(tankRating, tanks, currentDungeon);
    parseTierData(healerRating, healers, currentDungeon);
    parseTierData(dpsRating, dps, currentDungeon);

    for (let k = 0; k < teams.length; k++) {
      const curentTeam = teams[k];

      const teamIndex = `${curentTeam.tank ? curentTeam.tank : ""}_${
        curentTeam.healer ? curentTeam.healer : ""
      }_${curentTeam.dps[0] ? curentTeam.dps[0] : ""}_${
        curentTeam.dps[0] ? curentTeam.dps[1] : ""
      }_${curentTeam.dps[0] ? curentTeam.dps[2] : ""}`;

      if (teamRating[teamIndex]) {
        teamRating[teamIndex][1] = teamRating[teamIndex][1] + 1;
      } else {
        const newTeam = [curentTeam, 1];
        teamRating[teamIndex] = newTeam;
      }
    }

    await page.waitForSelector(rightArrowSelector);
    await page.click(rightArrowSelector);

    await waitForTransitionEnd(carouselSelector);
  }

  await browser.close();

  return { teamRating, tankRating, healerRating, dpsRating };
}

async function getWeaponName(browser) {
  const felsong = await browser.newPage();
  await felsong.goto(`https://felsong.gg/en/community/armory/6/11/139331`, {
    waitUntil: "domcontentloaded",
  });

  const weaponIdSelector = "div.frame.tooltip-item.tooltipstered";
  const playerWeapon = await felsong.waitForSelector(weaponIdSelector);

  const weaponId = await playerWeapon.evaluate((element) => {
    return element.querySelector("div").getAttribute("item");
  });

  await felsong.close();

  const wowhead = await browser.newPage();
  await wowhead.goto(
    `https://www.wowhead.com/ru/item=${weaponId ?? "128832"}`,
    {
      waitUntil: "domcontentloaded",
    }
  );

  const weaponNameSelector = "h1.heading-size-1";
  const weaponHeader = await wowhead.waitForSelector(weaponNameSelector);

  const weaponName = await weaponHeader.evaluate(
    (element) => element.textContent
  );

  await wowhead.close();

  return weaponName;
}
