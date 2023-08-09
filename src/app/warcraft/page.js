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
  const { rankingData, setRankingData, isLoading, setIsLoading } =
    useCarsContext();

  const pathname = usePathname();
  const { cars, warcraft } = footerParams;

  useEffect(() => {
    async function searchData() {
      setIsLoading(true);

      const response = await fetch(`/api${pathname}`);
      const data = await response.json();

      setRankingData(data);
      setIsLoading(false);
    }

    searchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="w-full h-full flex flex-col items-center">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex justify-center items-start flex-1">
          {rankingData && rankingData.tierData.length > 0 ? (
            <WarcraftCanvas data={rankingData} />
          ) : (
            <EmptyContent />
          )}
        </div>
      )}
      <Footer data={warcraft} altData={cars} />
    </section>
  );
}
