"use client";

import { useEffect } from "react";

import { useCarsContext } from "@/components/CarsProvider";
import { footerParams } from "@/lib/params";
import getOptionsString from "@/lib/getOptionsString";

import Search from "@/components/Search";
import Canvas from "@/components/Canvas";
import Loading from "@/components/Loading";
import EmptyContent from "@/components/EmptyContent";
import Footer from "@/components/Footer";
import Chart from "@/components/Chart";
import mockCarsData from "@/lib/mockCars";

export default function Cars() {
  const {
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    region,
    chartData,
    setChartData,
    errorMessage,
    setErrorMessage,
    isLoading,
    setIsLoading,
    searchContainer,
  } = useCarsContext();

  const { cars, warcraft } = footerParams;

  const options = getOptionsString({
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    region,
  });

  useEffect(() => {
    async function searchData() {
      setIsLoading(true);

      try {
        const response = await fetch(`/api/cars?${options}`);

        const data = await response.json();

        if (data.error) {
          setErrorMessage(data.error);
        } else {
          setChartData(data);
        }
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    // searchData();
    // setChartData(mockCarsData);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="w-full h-full flex flex-col items-center">
      {/* <Search />
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex justify-center items-start flex-1">
          {chartData && chartData.carData.length > 0 ? (
            <Canvas data={chartData} container={searchContainer} />
          ) : (
            <EmptyContent errorMessage={errorMessage} />
          )}
        </div>
      )}
      <Footer data={cars} altData={warcraft} /> */}
      <div className="w-full flex justify-center">
        <Chart data={mockCarsData} />
      </div>
    </section>
  );
}
