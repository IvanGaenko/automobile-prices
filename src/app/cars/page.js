"use client";

// import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useCarsContext } from "@/components/CarsProvider";
import { params, footerParams } from "@/lib/params";

import Search from "@/components/Search";
import Canvas from "@/components/Canvas";
import Loading from "@/components/Loading";
import EmptyContent from "@/components/EmptyContent";
import Footer from "@/components/Footer";

export default function Cars() {
  const {
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    region,
    chartData,
    setChartData,
    isLoading,
    setIsLoading,
    searchContainer,
  } = useCarsContext();

  const { cars, warcraft } = footerParams;

  const optionsList = [];

  if (minPrice)
    optionsList.push(
      `${optionsList.length === 0 ? "" : "&"}${params.price.min + minPrice}`
    );
  if (maxPrice)
    optionsList.push(
      `${optionsList.length === 0 ? "" : "&"}${params.price.max + maxPrice}`
    );

  if (minYear)
    optionsList.push(
      `${optionsList.length === 0 ? "" : "&"}${params.year.min + minYear}`
    );
  if (maxYear)
    optionsList.push(
      `${optionsList.length === 0 ? "" : "&"}${params.year.max + maxYear}`
    );

  if (region)
    optionsList.push(
      `${optionsList.length === 0 ? "" : "&"}${params.region.str + region}`
    );

  useEffect(() => {
    async function searchData() {
      setIsLoading(true);

      const requestParams = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search: optionsList.join("") }),
      };

      // const response = await fetch(`/api${pathname}${optionsList.join("")}`);
      const response = await fetch(`/api/cars`, requestParams);

      const data = await response.json();

      setChartData(data);
      setIsLoading(false);
    }

    searchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="w-full h-full flex flex-col items-center">
      <Search />
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex justify-center items-start flex-1">
          {chartData && chartData.carData.length > 0 ? (
            <Canvas data={chartData} container={searchContainer} />
          ) : (
            <EmptyContent />
          )}
        </div>
      )}
      <Footer data={cars} altData={warcraft} />
    </section>
  );
}
