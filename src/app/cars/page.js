"use client";

import { usePathname } from "next/navigation";
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

  const pathname = usePathname();
  const { cars, warcraft } = footerParams;

  const options = `?${minPrice ? params.price.min + minPrice : ""}${
    maxPrice ? params.price.max + maxPrice : ""
  }${minYear ? params.year.min + minYear : ""}${
    maxYear ? params.year.max + maxYear : ""
  }${region ? params.region.str + region : ""}`;

  useEffect(() => {
    async function searchData() {
      setIsLoading(true);

      const response = await fetch(`/api${pathname}${options}`);
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
