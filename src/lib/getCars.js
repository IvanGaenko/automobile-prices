import axios from "axios";
import { JSDOM } from "jsdom";

export default async function getCars(search) {
  console.log("start");

  let carsData = [];
  let id = 0;
  let page = 0;

  function parsingNumber(str) {
    return parseInt(str.split(" ").join(""), 10);
  }

  async function fetchCars() {
    // const { data } = await axios.get(`https://auto.ria.com/uk/search/
    //   ?indexName=auto,order_auto,newauto_search&year[0].gte=2002
    //   &categories.main.id=1&price.USD.lte=5000&price.currency=1
    //   &abroad.not=0&custom.not=1&size=20&page=${page}&region.id[0]=7
    //   &damage.not=1`);
    const { data } = await axios.get(`https://auto.ria.com/uk/search/
      ?indexName=auto,order_auto,newauto_search
      &categories.main.id=1
      &price.currency=1
      &abroad.not=0
      &custom.not=1
      &size=100
      &damage.not=1
      &page=${page}
      ${search}
      `);

    const dom = new JSDOM(data);

    const carList = dom.window.document.querySelectorAll("section.ticket-item");

    if (carList.length > 0) {
      const newCars = Array.from(carList).map((car) => {
        id++;
        const name = car.querySelector("span.blue.bold").innerHTML.trim();
        const year = parsingNumber(
          car.querySelector("a.address").innerHTML.trim().slice(-4)
        );
        const price = parsingNumber(
          car
            .querySelector("span.size15 > span.bold.size22.green:first-child")
            .innerHTML.trim()
        );
        return { id, name, year, price };
      });

      carsData = [...carsData, ...newCars];

      page++;

      if (page < 5) {
        await fetchCars();
      }
    }
  }
  await fetchCars();

  return carsData;
}
