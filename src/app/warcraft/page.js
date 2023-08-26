"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import Loading from "@/components/Loading";
import WarcraftCanvas from "@/components/WarcraftCanvas";
import EmptyContent from "@/components/EmptyContent";
import Footer from "@/components/Footer";

import { useCarsContext } from "@/components/CarsProvider";
import { footerParams } from "@/lib/params";

export default function Warcraft() {
  const {
    rankingData,
    setRankingData,
    errorMessage,
    setErrorMessage,
    isLoading,
    setIsLoading,
  } = useCarsContext();

  const pathname = usePathname();
  const { cars, warcraft } = footerParams;

  useEffect(() => {
    async function searchData() {
      setIsLoading(true);

      try {
        const response = await fetch(`/api${pathname}`);

        const data = await response.json();

        if (data.error) {
          setErrorMessage(data.error);
        } else {
          setRankingData(data);
        }
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    searchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="w-full h-full flex flex-col items-center">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col justify-center items-start flex-1">
          {rankingData ? (
            <>
              <WarcraftCanvas data={rankingData.tankData} />
              <WarcraftCanvas data={rankingData.healerData} />
              <WarcraftCanvas data={rankingData.dpsData} />
            </>
          ) : (
            <EmptyContent errorMessage={errorMessage} />
          )}
        </div>
      )}
      <Footer data={warcraft} altData={cars} />
    </section>
  );
}
