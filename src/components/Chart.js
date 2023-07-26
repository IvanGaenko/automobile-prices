"use client";

import { useEffect } from "react";
import Canvas from "./Canvas";

import { useCarsContext } from "./CarsProvider";

export default function Chart() {
  const { chartData } = useCarsContext();
  console.log("chartData", chartData);

  // useEffect(() => {
  //   async function fontInit() {
  //     const fontFile = new FontFace(
  //       "FontFamily Style Bitter",
  //       "url(https://fonts.gstatic.com/s/bitter/v7/HEpP8tJXlWaYHimsnXgfCOvvDin1pK8aKteLpeZ5c0A.woff2)"
  //     );
  //     document.fonts.add(fontFile);
  //     console.log("fontFile", fontFile);
  //     await fontFile.load();
  //   }
  //   fontInit();
  // }, []);

  return (
    <div className={`bg-green-700 w-full flex justify-center relative`}>
      {chartData && <Canvas />}
    </div>
  );
}
