import getCars from "@/lib/getCars";

export async function GET(request) {
  const { search } = new URL(request.url);
  console.log("request.url", search);

  const data = await getCars(search);

  const carData = [];
  let maxPrice = 0;
  let carsCount = 0;

  for (let i = 0; i < data.length; i++) {
    if (maxPrice < data[i].price) maxPrice = data[i].price;

    const yearIndex = carData.findIndex((year) => year.year === data[i].year);

    if (yearIndex === -1) {
      carData.push({
        year: data[i].year,
        cars: [
          {
            id: data[i].id,
            name: data[i].name,
            year: data[i].year,
            price: [data[i].price, data[i].price],
            count: 1,
          },
        ],
      });
      carsCount++;
    } else {
      const carIndex = carData[yearIndex].cars.findIndex(
        (car) => car.name === data[i].name
      );

      if (carIndex === -1) {
        carData[yearIndex].cars.push({
          id: data[i].id,
          name: data[i].name,
          year: data[i].year,
          price: [data[i].price, data[i].price],
          count: 1,
        });
        carsCount++;
      } else {
        const priceArr = carData[yearIndex].cars[carIndex].price;
        priceArr.push(data[i].price);
        priceArr.sort((a, b) => (a > b ? 1 : -1));
        carData[yearIndex].cars[carIndex].price = [
          priceArr[0],
          priceArr[priceArr.length - 1],
        ];
        carData[yearIndex].cars[carIndex].count++;
      }
    }
  }

  carData.sort((a, b) => (a.year > b.year ? 1 : -1));

  for (let i = 0; i < carData.length; i++) {
    carData[i].cars.sort((a, b) => (a.price[1] > b.price[1] ? 1 : -1));
  }

  return new Response(JSON.stringify({ carData, maxPrice, carsCount }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "s-maxage=300, stale-while-revalidate",
    },
    status: 200,
    statusText: "OK",
  });
}

// if (!Object.keys(carData).includes(data[i].name)) {
//   carData[data[i].name] = {};
//   carData[data[i].name][data[i].year] = [data[i].price, data[i].price];
// } else {
//   if (!Object.keys(carData[data[i].name]).includes(data[i].year)) {
//     carData[data[i].name][data[i].year] = [data[i].price, data[i].price];
//   } else {
//     const priceArr = carData[data[i].name][data[i].year];
//     priceArr.push(data[i].price);
//     priceArr.sort((a, b) => (a > b ? 1 : -1));
//     carData[data[i].name][data[i].year] = [
//       priceArr[0],
//       priceArr[priceArr.length - 1],
//     ];
//   }
// }

/**
const data = {
  2005: [
    {
      name: "Ford",
      price: [2000,2500]
    },
    {
      name: "BMW",
      price: [2700,2800]
    }
  ],
  2006: [
    {
      name: "Ford",
      price: [2500,2500]
    },
    {
      name: "BMW",
      price: [2800,3300]
    }
  ]
} 

**/
