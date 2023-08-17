import { NextResponse } from "next/server";

import getCars from "@/lib/getCars";

export async function GET() {
  const data = await getCars(
    "price.USD.lte=5000&year[0].gte=2005&region.id[0]=7"
  );

  const carData = [];
  let maxPrice = 0;
  let carsCount = 0;

  for (let i = 0; i < data.length; i++) {
    if (maxPrice < data[i].price) maxPrice = data[i].price;

    const firstCar = {
      id: data[i].id,
      name: data[i].name,
      year: data[i].year,
      price: [data[i].price, data[i].price],
      race: [data[i].race, data[i].race],
      count: 1,
    };

    const yearIndex = carData.findIndex((year) => year.year === data[i].year);

    if (yearIndex === -1) {
      carData.push({
        year: data[i].year,
        cars: [firstCar],
      });
      carsCount++;
    } else {
      const carIndex = carData[yearIndex].cars.findIndex(
        (car) => car.name === data[i].name
      );

      if (carIndex === -1) {
        carData[yearIndex].cars.push(firstCar);
        carsCount++;
      } else {
        const priceArr = carData[yearIndex].cars[carIndex].price;
        const raceArr = carData[yearIndex].cars[carIndex].race;

        if (data[i].price > priceArr[1]) {
          priceArr[1] = data[i].price;
          raceArr[1] = data[i].race;
        }
        if (data[i].price < priceArr[0]) {
          priceArr[0] = data[i].price;
          raceArr[0] = data[i].race;
        }

        carData[yearIndex].cars[carIndex].count++;
      }
    }
  }

  carData.sort((a, b) => (a.year > b.year ? 1 : -1));

  for (let i = 0; i < carData.length; i++) {
    carData[i].cars.sort((a, b) => (a.price[1] > b.price[1] ? 1 : -1));
  }

  return NextResponse.json({ carData, maxPrice, carsCount });
}
