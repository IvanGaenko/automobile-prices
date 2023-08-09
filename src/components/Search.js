"use client";

import { useEffect, useRef } from "react";
import { useCarsContext } from "./CarsProvider";
import { params, regions } from "@/lib/params";

export default function Search() {
  const {
    setCars,
    setChartData,
    setIsLoading,
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
    setSearchContainer,
  } = useCarsContext();
  const searchRef = useRef();
  const dropDownRef = useRef();

  useEffect(() => {
    if (searchRef && searchRef.current) {
      const searchDimensions = searchRef.current.getBoundingClientRect();
      setSearchContainer(searchDimensions);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onEscapeHandler = (e) => {
      if (e.key === "Escape") {
        setDropDownOpen(false);
      }
    };

    const onOutsideHandler = (e) => {
      if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
        setDropDownOpen(false);
      }
    };

    document.addEventListener("keydown", onEscapeHandler);
    document.addEventListener("mousedown", onOutsideHandler);

    return () => {
      document.removeEventListener("keydown", onEscapeHandler);
      document.removeEventListener("mousedown", onOutsideHandler);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function searchCars(e) {
    e.preventDefault();
    setIsLoading(true);
    setChartData(null);

    const parsedMinPrice = parseInt(minPrice, 10);
    const parsedMaxPrice = parseInt(maxPrice, 10);
    const parsedMinYear = parseInt(minYear, 10);
    const parsedMaxYear = parseInt(maxYear, 10);

    if (!parsedMinPrice || parsedMinPrice < 0) {
      setMinPrice("");
    } else {
      setMinPrice(parsedMinPrice);
    }

    if (!parsedMaxPrice) {
      setMaxPrice("");
    } else {
      setMaxPrice(parsedMaxPrice);
    }

    if (!parsedMinYear || parsedMinYear < 1900) {
      setMinYear("");
    } else {
      setMinYear(parsedMinYear);
    }

    if (!parsedMaxYear || parsedMaxYear > new Date().getFullYear()) {
      setMaxYear("");
    } else {
      setMaxYear(parsedMaxYear);
    }

    try {
      const response = await fetch(
        `/api/cars?indexName=auto,order_auto,newauto_search${
          parsedMinPrice ? params.price.min + parsedMinPrice : ""
        }${parsedMaxPrice ? params.price.max + parsedMaxPrice : ""}${
          parsedMinYear ? params.year.min + parsedMinYear : ""
        }${parsedMaxYear ? params.year.max + parsedMaxYear : ""}${
          region ? params.region.str + region : ""
        }`
      );

      const data = await response.json();

      setChartData(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div ref={searchRef} className="w-full my-3 max-w-[50%]">
      <form
        onSubmit={searchCars}
        className="flex flex-col w-full text-slate-400 bg-gray-500 px-1 sm:px-0 shadow"
      >
        <div className="flex w-full mb-1 flex-col sm:flex-row">
          <div className="flex flex-col w-full sm:max-w-[50%] sm:px-1">
            {/* <div className="flex flex-col w-full sm:px-1"> */}
            <label className="mx-1 text-black">Min price</label>
            <input
              onChange={(event) => setMinPrice(event.target.value)}
              placeholder="Min price"
              type="text"
              value={minPrice}
              className="bg-transparent text-black border border-black h-[30px] px-1 shadow"
            />
          </div>

          <div className="flex flex-col w-full sm:max-w-[50%] sm:px-1">
            <label className="mx-1 text-black">Max price</label>
            <input
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="Max price"
              type="text"
              value={maxPrice}
              className="bg-transparent border text-black border-black h-[30px] px-1 shadow"
            />
          </div>
        </div>

        <div className="flex w-full mb-1 flex-col sm:flex-row">
          <div className="flex flex-col w-full sm:max-w-[50%] sm:px-1">
            <label className="mx-1 text-black">Min year</label>
            <input
              onChange={(event) => setMinYear(event.target.value)}
              placeholder="Min year"
              type="text"
              value={minYear}
              className="bg-transparent text-black border border-black h-[30px] px-1 shadow"
            />
          </div>
          <div className="flex flex-col w-full sm:max-w-[50%] sm:px-1">
            <label className="mx-1 text-black">Max year</label>
            <input
              onChange={(event) => setMaxYear(event.target.value)}
              placeholder="Max year"
              type="text"
              value={maxYear}
              className="bg-transparent text-black border border-black h-[30px] px-1 shadow"
            />
          </div>
        </div>

        <div className="flex w-full mb-1 flex-col sm:flex-row justify-center">
          <div className="flex flex-col w-full sm:max-w-[50%] sm:px-1 mb-1 sm:mb-0">
            <label className="mx-1 text-black">Region</label>
            <div
              ref={dropDownRef}
              className="w-full h-[30px] bg-transparent flex items-center relative border border-black px-1 cursor-pointer shadow text-black"
              id="1"
              onClick={() => setDropDownOpen((prev) => !prev)}
            >
              <span className="pointer-events-none">{regions[region]}</span>

              <ul className="absolute top-[30px] left-0 bg-slate-500 w-full max-h-[190px] overflow-x-hidden overflow-y-scroll z-10">
                {dropDownOpen &&
                  Object.entries(regions)
                    .sort((a, b) => (a[1] > b[1] ? 1 : -1))
                    .map(([key, value]) => (
                      <li
                        key={key}
                        className="text-white hover:bg-slate-400 cursor-pointer px-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRegion(key);
                          setDropDownOpen((prev) => !prev);
                        }}
                      >
                        {value}
                      </li>
                    ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col justify-end w-full sm:max-w-[50%] sm:px-1">
            <button
              type="submit"
              className="text-white bg-green-700 w-full h-[30px] drop-shadow hover:bg-green-600"
            >
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
