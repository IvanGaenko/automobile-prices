"use client";

import { useEffect, useRef } from "react";
import { useCarsContext } from "./CarsProvider";
import { params, regions } from "@/lib/params";

export default function Search() {
  const {
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
  } = useCarsContext();
  const dropDownRef = useRef();

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
    setCars([]);

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
      console.log("data", data);
      setCars(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section className="w-full flex justify-center">
      <form
        onSubmit={searchCars}
        className="flex flex-col text-black max-w-[50%] flex-1"
      >
        <input
          onChange={(event) => setMinPrice(event.target.value)}
          placeholder="Min price"
          type="text"
          value={minPrice}
        />

        <input
          onChange={(event) => setMaxPrice(event.target.value)}
          placeholder="Max price"
          type="text"
          value={maxPrice}
        />

        <input
          onChange={(event) => setMinYear(event.target.value)}
          placeholder="Min year"
          type="text"
          value={minYear}
        />

        <input
          onChange={(event) => setMaxYear(event.target.value)}
          placeholder="Max year"
          type="text"
          value={maxYear}
        />
        <div
          ref={dropDownRef}
          className="w-full h-[30px] bg-slate-300 flex items-center relative"
          id="1"
          onClick={() => setDropDownOpen((prev) => !prev)}
        >
          <span>{regions[region]}</span>

          <ul className="absolute top-[30px] left-0 bg-slate-500 w-full max-h-[190px] overflow-x-hidden overflow-y-scroll">
            {dropDownOpen &&
              Object.entries(regions)
                .sort((a, b) => (a[1] > b[1] ? 1 : -1))
                .map(([key, value]) => (
                  <li
                    key={key}
                    className="text-white hover:bg-slate-400 cursor-pointer"
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

        <button type="submit" className="text-white">
          Search
        </button>
      </form>
    </section>
  );
}
