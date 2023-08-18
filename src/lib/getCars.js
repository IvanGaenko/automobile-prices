import axios from "axios";
import { JSDOM } from "jsdom";

export default async function getCars(search) {
  let carsData = [];
  let webPage = 0;
  let pageSize = 100;
  console.log("search in getCars", search);
  function parsingNumber(str) {
    return parseInt(str.split(" ").join(""), 10);
  }

  async function fetchCars() {
    console.log("start fetch cars");
    const { data } = await axios.get(
      `https://auto.ria.com/uk/search/?indexName=auto,order_auto,newauto_search&categories.main.id=1&price.currency=1&abroad.not=0&custom.not=1&size=${pageSize}&damage.not=1&sort[0].order=dates.created.desc&page=${webPage}&${search}`
    );
    // console.log("inside", data);
    const dom = new JSDOM(data);

    const carList = dom.window.document.querySelectorAll("section.ticket-item");
    console.log("carList.length", carList.length);
    if (carList.length > 0) {
      const newCars = Array.from(carList).map((car) => {
        const name = car.querySelector("span.blue.bold").innerHTML.trim();
        const year = parsingNumber(
          car.querySelector("a.address").innerHTML.trim().slice(-4)
        );
        const price = parsingNumber(
          car
            .querySelector("span.size15 > span.bold.size22.green:first-child")
            .innerHTML.trim()
        );
        const race = parsingNumber(
          car.querySelector("li.item-char.js-race").textContent.trim()
        );
        return { name, year, price, race };
      });

      carsData = [...carsData, ...newCars];

      webPage++;

      if (webPage < 5) {
        console.log("again");
        await fetchCars();
      }
    }
  }

  await fetchCars();
  console.log("carsData", carsData);
  return carsData;
}
