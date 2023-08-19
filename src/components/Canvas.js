"use client";

import { useEffect, useRef } from "react";

import { canvasParams } from "@/lib/params";
import { drawLine, drawRect, drawText } from "@/lib/functions";
import getColors from "@/lib/getColors";

export default function Canvas({ data, container }) {
  const {
    lineHeight,
    sectionGap,
    graphOffsetLeft,
    graphOffsetTop,
    primaryFontSize,
  } = canvasParams;
  const canvasRef = useRef(null);
  const highlightRef = useRef(null);
  const colorsRef = useRef(null);

  const graphHeight =
    data.carsCount * lineHeight + data.carData.length * sectionGap;

  const graphWidthRef = useRef(window.innerWidth * 0.7 + graphOffsetLeft);

  const xKoeffRef = useRef(
    (graphWidthRef.current - graphOffsetLeft) / data.maxPrice
  );
  const graphArea = useRef([]);

  function canvasInit() {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const hCanvas = highlightRef.current;

    function drawCoordinateSystem() {
      const xKoeff = xKoeffRef.current;

      const startCoords = {
        x: graphOffsetLeft,
        y: graphOffsetTop + graphHeight,
      };
      const graph = [
        {
          startX: startCoords.x,
          startY: graphOffsetTop,
          finishX: startCoords.x,
          finishY: startCoords.y,
        },
        {
          startX: startCoords.x,
          startY: startCoords.y,
          finishX: graphOffsetLeft + graphWidth,
          finishY: startCoords.y,
        },
        {
          startX: startCoords.x,
          startY: graphOffsetTop,
          finishX: graphOffsetLeft + graphWidth,
          finishY: graphOffsetTop,
        },
        {
          startX: graphOffsetLeft + graphWidth,
          startY: graphOffsetTop,
          finishX: graphOffsetLeft + graphWidth,
          finishY: startCoords.y,
        },
      ];

      for (let i = 0; i < graph.length; i++) {
        const { startX, startY, finishX, finishY } = graph[i];
        drawLine(context, "white", 3, startX, startY, finishX, finishY);
      }

      const xDimensionPart = data.maxPrice / 5;

      for (let i = 1; i < 6; i++) {
        const currentDimension = (xDimensionPart * i).toFixed();
        const priceDimension = context.measureText(currentDimension);
        drawText(
          context,
          currentDimension * xKoeff -
            priceDimension.width / 2 +
            graphOffsetLeft,
          graphOffsetTop + graphHeight + primaryFontSize + 5,
          currentDimension
        );

        drawLine(
          context,
          "white",
          1,
          currentDimension * xKoeff + graphOffsetLeft,
          graphOffsetTop + graphHeight,
          currentDimension * xKoeff + graphOffsetLeft,
          graphOffsetTop,
          true
        );
      }
    }

    function renderCarData() {
      graphArea.current = [];
      let yCoordOfYear = graphOffsetTop;
      for (let i = 0; i < data.carData.length; i++) {
        let carsOffset = yCoordOfYear;
        for (let j = 0; j < data.carData[i].cars.length; j++) {
          const currentCar = data.carData[i].cars[j];
          const barWidth = currentCar.price[1] - currentCar.price[0];
          const barOffsetLeft = currentCar.price[0] * xKoeff + graphOffsetLeft;
          const barOffsetRight = graphWidth - currentCar.price[1] * xKoeff;
          const currentColor = colorsRef.current[j];

          drawText(
            context,
            graphOffsetLeft + 5,
            carsOffset + primaryFontSize,
            currentCar.name
          );

          drawRect(
            context,
            barOffsetLeft,
            carsOffset,
            barWidth === 0 ? -lineHeight / 4 : barWidth * xKoeff,
            lineHeight - 2,
            currentColor
          );

          graphArea.current.push({
            start: carsOffset,
            end: carsOffset + lineHeight,
            offsetLeft: barOffsetLeft - graphOffsetLeft,
            offsetRight: barOffsetRight,
            width: barWidth * xKoeff,
            data: currentCar,
          });

          carsOffset = carsOffset + lineHeight;
        }

        let dY = data.carData[i].cars.length * lineHeight + sectionGap;
        yCoordOfYear = yCoordOfYear + dY;
        const yearDimension = context.measureText(data.carData[i].year);
        drawText(
          context,
          graphOffsetLeft - yearDimension.width - 5,
          yCoordOfYear - dY / 2 + sectionGap / 2,
          data.carData[i].year
        );

        if (i !== data.carData.length - 1) {
          drawLine(
            context,
            "white",
            1,
            graphOffsetLeft,
            yCoordOfYear - sectionGap / 2,
            graphOffsetLeft + graphWidth,
            yCoordOfYear - sectionGap / 2,
            true
          );
        }
      }
    }

    const graphWidth = graphWidthRef.current;
    const xKoeff = xKoeffRef.current;

    canvas.width = graphWidth + graphOffsetLeft * 2;
    canvas.height = graphHeight + graphOffsetTop * 2;

    hCanvas.width = graphWidth;
    hCanvas.height = graphHeight;

    const { width } = canvas;
    const { height } = canvas;

    context.fillStyle = "rgba(0,0,0,0.7)";
    context.fillRect(0, 0, width, height);

    drawCoordinateSystem();
    renderCarData();
  }

  function onResizeCanvas() {
    graphWidthRef.current = window.innerWidth * 0.7 + graphOffsetLeft;
    xKoeffRef.current =
      (graphWidthRef.current - graphOffsetLeft) / data.maxPrice;
    canvasInit();
  }

  useEffect(() => {
    colorsRef.current = getColors(data.carsCount);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    canvasInit();

    window.addEventListener("resize", onResizeCanvas);

    return () => {
      window.removeEventListener("resize", onResizeCanvas);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const highlightLine = (e) => {
    const hCanvas = highlightRef.current;
    const hContext = hCanvas.getContext("2d");

    const currentLine = graphArea.current.find(
      (area) =>
        e.pageY - container.height - container.y * 2 > area.start &&
        e.pageY - container.height - container.y * 2 < area.end
    );

    if (currentLine) {
      hContext.clearRect(0, 0, hCanvas.width, hCanvas.height);

      const isOnePrice =
        currentLine.data.price[0] === currentLine.data.price[1];

      const isOneRace = currentLine.data.race[0] === currentLine.data.race[1];

      const maxPrice = `${isOnePrice ? "Price:" : "Max price:"} ${
        currentLine.data.price[1]
      }$`;
      const minPrice = `${isOnePrice ? "Price:" : "Min price:"} ${
        currentLine.data.price[0]
      }$`;

      const maxRace = `${isOneRace ? "Race:" : "Max race:"} ${
        currentLine.data.race[1]
      }k.km`;
      const minRace = `${isOneRace ? "Race:" : "Min race:"} ${
        currentLine.data.race[0]
      }k.km`;

      const maxPriceWidth = hContext.measureText(maxPrice).width;
      const minPriceWidth = hContext.measureText(minPrice).width;

      const maxRaceWidth = hContext.measureText(maxRace).width;
      const minRaceWidth = hContext.measureText(minRace).width;

      const tooltipWidth =
        Math.max(maxPriceWidth, minPriceWidth, maxRaceWidth, minRaceWidth) + 10;

      const priceHeight = isOnePrice ? lineHeight : lineHeight * 2;
      const raceHeight = isOneRace ? lineHeight : lineHeight * 2;
      const tooltipHeight = priceHeight + raceHeight;

      const tooltipXPosition =
        currentLine.offsetRight > tooltipWidth
          ? currentLine.offsetLeft + currentLine.width
          : currentLine.offsetLeft - tooltipWidth;

      const tooltipYPosition =
        data.carData.length > 1
          ? currentLine.start - graphOffsetTop > tooltipHeight
            ? currentLine.start - graphOffsetTop - tooltipHeight
            : currentLine.end - graphOffsetTop
          : currentLine.start - graphOffsetTop;

      // draw Highlight line
      drawRect(
        hContext,
        0,
        currentLine.start - graphOffsetTop,
        hCanvas.width,
        lineHeight,
        "rgba(255,255,255,0.5)"
      );

      // draw tootlip background
      drawRect(
        hContext,
        tooltipXPosition,
        tooltipYPosition,
        tooltipWidth,
        tooltipHeight,
        "rgba(100,100,100,0.8)"
      );

      // draw max price
      drawText(
        hContext,
        tooltipXPosition + 5,
        tooltipYPosition + primaryFontSize,
        maxPrice
      );

      // draw max race
      drawText(
        hContext,
        tooltipXPosition + 5,
        isOneRace
          ? tooltipYPosition + primaryFontSize + tooltipHeight / 2
          : tooltipYPosition + primaryFontSize * 2 + 3,
        maxRace
      );

      // draw min price
      if (!isOnePrice) {
        drawText(
          hContext,
          tooltipXPosition + 5,
          tooltipYPosition + primaryFontSize + tooltipHeight / 2 - 3,
          minPrice
        );
      }

      // // draw min race
      if (!isOneRace) {
        drawText(
          hContext,
          tooltipXPosition + 5,
          tooltipYPosition + primaryFontSize * 2 + tooltipHeight / 2,
          minRace
        );
      }
    }
  };

  const clearHighlightLine = () => {
    const hCanvas = highlightRef.current;
    const hContext = hCanvas.getContext("2d");
    hContext.clearRect(0, 0, hCanvas.width, hCanvas.height);
  };

  return (
    <div className="relative flex justify-center items-center">
      <canvas ref={canvasRef}></canvas>
      <canvas
        onMouseMove={highlightLine}
        onMouseLeave={clearHighlightLine}
        ref={highlightRef}
        className="absolute"
      ></canvas>
    </div>
  );
}
