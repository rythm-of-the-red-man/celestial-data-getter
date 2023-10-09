const sweph = require("sweph");
const datetime = require("luxon");
const fs = require("fs");
sweph.set_ephe_path("./");

console.log(process.argv);
const year = process.argv[2];
const plantesNames = [
  "mercury",
  "venus",
  "moon",
  "mars",
  "jupiter",
  "saturn",
  "urnaus",
  "neptune",
  "pluto",
];
const planets = {
  mercury: sweph.constants.SE_MERCURY,
  venus: sweph.constants.SE_VENUS,
  moon: sweph.constants.SE_MOON,
  mars: sweph.constants.SE_MARS,
  jupiter: sweph.constants.SE_JUPITER,
  saturn: sweph.constants.SE_SATURN,
  urnaus: sweph.constants.SE_URANUS,
  neptune: sweph.constants.SE_NEPTUNE,
  pluto: sweph.constants.SE_PLUTO,
};
for (let planet of plantesNames) {
    console.log(`starting planet ${planet}`)
  const planetToCalculate = planets[planet];
  let i = 0;
  let initialDateTime = datetime.DateTime.fromObject({
    year,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
  });
  let foo = "";
  let calculated;
  while (initialDateTime.year != parseInt(year) + 1) {
    calculated = sweph.calc(
      sweph.julday(
        parseInt(year),
        initialDateTime.month,
        initialDateTime.day,
        initialDateTime.hour + initialDateTime.minute / 60,
        sweph.constants.SE_GREG_CAL
      ),
      planetToCalculate,
      sweph.constants.SEFLG_SWIEPH
    );
    if (i > 44000 && i % 44000 === 0) {
      console.log(`current date ${initialDateTime.month}/${initialDateTime.year} for planet ${planet}`);
    }
    foo += `${initialDateTime.toISO()},${calculated.data[0]};\n`;
    initialDateTime = initialDateTime.plus({ minute: 1 });
    i++;
  }

  fs.writeFileSync(`./${planet}_${year}.csv`, foo);
}
