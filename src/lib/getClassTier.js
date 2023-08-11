import puppeteer from "puppeteer";

export default async function getClassTier() {
  const browser = await puppeteer.launch({
    // args: [
    //   "--disable-setuid-sandbox",
    //   "--no-sandbox",
    //   "--single-process",
    //   "--no-zygote",
    // ],
    headless: true,
    // executablePath:
    //   process.env.NODE_ENV === "production"
    //     ? "/usr/bin/google-chrome-stable"
    //     : puppeteer.executablePath(),
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
      const name = dungeon.querySelector("label").innerHTML.trim();
      const ajax = dungeon.querySelector("div").getAttribute("ajax");
      return { name, ajax };
    });
  });

  const tierList = {};

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
    const content = await table.evaluate((element) => {
      const players = {};

      Array.from(element.querySelectorAll("td > span")).map((line) => {
        const name = line.className.split("_")[1];

        if (players[name]) {
          players[name] = players[name] + 1;
        } else {
          players[name] = 1;
        }
      });

      return Object.entries(players).map((player) => {
        return {
          name: player[0],
          count: player[1],
        };
      });
    });

    for (let i = 0; i < content.length; i++) {
      const currentClass = content[i];
      const currentClassName = currentClass.name;
      const currentClassCount = currentClass.count;
      const currentDungeonName = currentDungeon.name;

      if (tierList[currentClassName]) {
        if (tierList[currentClassName][0][currentDungeonName]) {
          tierList[currentClassName][0][currentDungeonName] =
            tierList[currentClassName][0][currentDungeonName] +
            currentClassCount;
          tierList[currentClassName][1] =
            tierList[currentClassName][1] + currentClassCount;
        } else {
          tierList[currentClassName][0][currentDungeonName] = currentClassCount;
          tierList[currentClassName][1] =
            tierList[currentClassName][1] + currentClassCount;
        }
      } else {
        const newDungeonTier = {};
        newDungeonTier[currentDungeonName] = currentClassCount;
        tierList[currentClassName] = [newDungeonTier, currentClassCount];
      }
    }

    await page.waitForSelector(rightArrowSelector);
    await page.click(rightArrowSelector);

    await waitForTransitionEnd(carouselSelector);
  }

  await browser.close();

  return tierList;
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
