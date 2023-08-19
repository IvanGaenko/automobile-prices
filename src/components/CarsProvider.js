"use client";

import { createContext, useContext, useState } from "react";

const CarsContext = createContext({});

export function useCarsContext() {
  return useContext(CarsContext);
}

export default function CarsProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  const [chartData, setChartData] = useState(null);
  const [rankingData, setRankingData] = useState(null);

  const [searchContainer, setSearchContainer] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("5000");
  const [minYear, setMinYear] = useState("2005");
  const [maxYear, setMaxYear] = useState("");
  const [region, setRegion] = useState("7");

  const [dropDownOpen, setDropDownOpen] = useState(false);

  return (
    <CarsContext.Provider
      value={{
        isLoading,
        setIsLoading,
        chartData,
        setChartData,
        rankingData,
        setRankingData,
        errorMessage,
        setErrorMessage,
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
        searchContainer,
        setSearchContainer,
      }}
    >
      {children}
    </CarsContext.Provider>
  );
}
