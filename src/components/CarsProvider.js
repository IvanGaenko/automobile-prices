"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { params } from "@/lib/params";

const CarsContext = createContext({});

export function useCarsContext() {
  return useContext(CarsContext);
}

export default function CarsProvider({ children }) {
  const [cars, setCars] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("5000");
  const [minYear, setMinYear] = useState("2005");
  const [maxYear, setMaxYear] = useState("");
  const [region, setRegion] = useState("7");
  const [dropDownOpen, setDropDownOpen] = useState(false);

  useEffect(() => {
    async function searchCars() {
      try {
        const response = await fetch(
          `/api/cars?indexName=auto,order_auto,newauto_search${
            minPrice ? params.price.min + minPrice : ""
          }${maxPrice ? params.price.max + maxPrice : ""}${
            minYear ? params.year.min + minYear : ""
          }${maxYear ? params.year.max + maxYear : ""}${
            region ? params.region.str + region : ""
          }`
        );
        const data = await response.json();
        console.log("data", data);
        setCars(data);
      } catch (error) {
        console.error(error);
      }
    }

    searchCars();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <CarsContext.Provider
      value={{
        cars,
        setCars,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        minYear,
        setMinYear,
        maxYear,
        setMaxYear,
        region,
        setRegion,
        dropDownOpen,
        setDropDownOpen,
      }}
    >
      {children}
    </CarsContext.Provider>
  );
}
