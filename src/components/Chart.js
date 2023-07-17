"use client";

import { useCarsContext } from "./CarsProvider";

export default function Chart() {
  const { cars } = useCarsContext();
  return (
    <div>
      {cars.map((car) => {
        return (
          <div key={car.id}>
            <span>{car.name}</span>-<span>{car.year}</span>-
            <span>{car.price}</span>
          </div>
        );
      })}
    </div>
  );
}
