export const params = {
  price: {
    min: "&price.USD.gte=",
    max: "&price.USD.lte=",
  },
  year: {
    min: "&year[0].gte=",
    max: "&year[0].lte=",
  },
  region: {
    str: "&region.id[0]=",
  },
};

export const regions = {
  1: "Винница",
  2: "Житомир",
  3: "Тернополь",
  4: "Хмельницк",
  5: "Львов",
  6: "Чернигов",
  7: "Харьков",
  8: "Сумы",
  9: "Ровно",
  10: "Киев",
  11: "Днепр",
  12: "Одесса",
  13: "Донецк",
  14: "Запорожье",
  15: "Ивано-Франковск",
  16: "Кировоград",
  17: "Луганск",
  18: "Волынь",
  19: "Николаев",
  20: "Полтава",
  22: "Закарпатье",
  23: "Херсон",
  24: "Черкассы",
  25: "Черновцы",
};

export const canvasParams = {
  lineHeight: 20,
  sectionGap: 5,
  graphOffsetLeft: 40,
  graphOffsetTop: 30,
  primaryFontSize: 20 * 0.75,
};

export const footerParams = {
  cars: {
    name: "auto.ria.com",
    src: "https://auto.ria.com/uk/",
    profile: "Cars Purchase",
    path: "/cars",
  },
  warcraft: {
    name: "felsong.gg",
    src: "https://felsong.gg/en/challenge/index",
    profile: "Warcraft Legion",
    path: "/warcraft",
  },
};
