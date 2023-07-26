"use client";

import { useEffect, useRef } from "react";

import { useCarsContext } from "./CarsProvider";

const carSectionHeight = 20;
const sectionGap = 5;
const graphOffsetLeft = 40;
const graphOffsetTop = 30;
const primaryFontSize = carSectionHeight * 0.75;

export default function Canvas() {
  const canvasRef = useRef(null);
  const highlightRef = useRef(null);

  const { chartData } = useCarsContext();

  const graphWidth = window.innerWidth * 0.7 + graphOffsetLeft;
  const graphHeight =
    chartData.carsCount * carSectionHeight +
    chartData.carData.length * sectionGap;

  const graphArea = useRef([]);
  const tooltipStart = useRef(null);

  const drawLine = (
    context,
    color,
    thickness,
    startX,
    startY,
    finishX,
    finishY,
    dotted = false
  ) => {
    context.beginPath();
    context.setLineDash(dotted ? [5, 10] : []);
    context.moveTo(startX, startY);
    context.lineTo(finishX, finishY);
    context.strokeStyle = color;
    context.lineWidth = thickness;
    context.stroke();
  };

  const drawText = (context, x, y, text, color = "white") => {
    context.beginPath();
    context.fillStyle = color;
    context.font = `${primaryFontSize}px sans-serif`;
    context.fillText(text, x, y);
  };

  const drawRect = (context, x, y, width, height, color = "blue") => {
    context.beginPath();
    context.fillStyle = color;
    context.rect(x, y, width, height);
    context.fill();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const hCanvas = highlightRef.current;

    console.log("window", window.innerWidth);

    canvas.width = graphWidth + graphOffsetLeft * 2;
    canvas.height = graphHeight + graphOffsetTop * 2;

    hCanvas.width = graphWidth;
    // console.log("graphWidth", graphWidth);
    hCanvas.height = graphHeight;
    hCanvas.style.top = `${graphOffsetTop}px`;

    const { width } = canvas;
    const { height } = canvas;

    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    const xKoeff = (graphWidth - graphOffsetLeft) / chartData.maxPrice;

    const startCoords = { x: graphOffsetLeft, y: graphOffsetTop + graphHeight };
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

    const xDimensionPart = chartData.maxPrice / 10;

    for (let i = 1; i < 11; i++) {
      const currentDimension = xDimensionPart * i;
      const priceDimension = context.measureText(currentDimension);
      drawText(
        context,
        currentDimension * xKoeff - priceDimension.width / 2 + graphOffsetLeft,
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

    graphArea.current = [];
    let yCoordOfYear = graphOffsetTop;
    for (let i = 0; i < chartData.carData.length; i++) {
      let carsOffset = yCoordOfYear;
      for (let j = 0; j < chartData.carData[i].cars.length; j++) {
        const currentCar = chartData.carData[i].cars[j];
        const barWidth = currentCar.price[1] - currentCar.price[0];
        const barOffsetLeft = currentCar.price[0] * xKoeff + graphOffsetLeft;
        const barOffsetRight = graphWidth - currentCar.price[1] * xKoeff;
        // console.log(barOffsetRight);
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
          barWidth === 0 ? -carSectionHeight / 4 : barWidth * xKoeff,
          carSectionHeight - 2
        );

        graphArea.current.push({
          start: carsOffset,
          end: carsOffset + carSectionHeight,
          offsetLeft: barOffsetLeft - graphOffsetLeft,
          offsetRight: barOffsetRight,
          width: barWidth * xKoeff,
          data: currentCar,
        });

        carsOffset = carsOffset + carSectionHeight;
      }

      let dY = chartData.carData[i].cars.length * carSectionHeight + sectionGap;
      yCoordOfYear = yCoordOfYear + dY;
      const yearDimension = context.measureText(chartData.carData[i].year);
      drawText(
        context,
        graphOffsetLeft - yearDimension.width - 5,
        yCoordOfYear - dY / 2 + sectionGap / 2,
        chartData.carData[i].year
      );

      if (i !== chartData.carData.length - 1) {
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const highlightLine = (e) => {
    const hCanvas = highlightRef.current;
    const hContext = hCanvas.getContext("2d");

    const currentLine = graphArea.current.find(
      (area) => e.pageY > area.start && e.pageY < area.end
    );

    console.log("currentLine", currentLine);

    if (currentLine && tooltipStart.current !== currentLine.start) {
      tooltipStart.current = currentLine.start;
      hContext.clearRect(0, 0, hCanvas.width, hCanvas.height);
      console.log("inside");
      const tooltipWidth = 100;
      const tooltipHeight =
        currentLine.width > 0 ? carSectionHeight * 2 : carSectionHeight;

      const tooltipXPosition =
        currentLine.offsetRight > tooltipWidth
          ? currentLine.offsetLeft + currentLine.width
          : currentLine.offsetLeft - tooltipWidth;
      const tooltipYPosition =
        currentLine.start - graphOffsetTop > tooltipHeight
          ? currentLine.start - graphOffsetTop - tooltipHeight
          : currentLine.end - graphOffsetTop;

      const isOnePrice =
        currentLine.data.price[0] === currentLine.data.price[1];

      const maxPrice = `${isOnePrice ? "Price:" : "Price max:"} ${
        currentLine.data.price[1]
      }$`;
      const minPrice = `${isOnePrice ? "Price:" : "Price min:"} ${
        currentLine.data.price[0]
      }$`;
      const maxPriceWidth = hContext.measureText(maxPrice).width;
      const minPriceWidth = hContext.measureText(minPrice).width;

      drawRect(
        hContext,
        0,
        currentLine.start - graphOffsetTop,
        hCanvas.width,
        carSectionHeight,
        "rgba(255,255,255,0.5)"
      );

      drawRect(
        hContext,
        tooltipXPosition,
        tooltipYPosition,
        Math.max(maxPriceWidth, minPriceWidth) + 10,
        isOnePrice ? carSectionHeight : carSectionHeight * 2,
        "rgba(100,100,100,0.8)"
      );
      drawText(
        hContext,
        tooltipXPosition + 5,
        tooltipYPosition + primaryFontSize,
        maxPrice
      );
      if (!isOnePrice) {
        drawText(
          hContext,
          tooltipXPosition + 5,
          tooltipYPosition + primaryFontSize + tooltipHeight / 2,
          minPrice
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
    <>
      <canvas ref={canvasRef}></canvas>
      <canvas
        onMouseMove={highlightLine}
        onMouseLeave={clearHighlightLine}
        ref={highlightRef}
        className="absolute"
      ></canvas>
      {/* {modal && (
        <div className={`absolute w-full h-full left-0 top-0`}>
          <div
            className={`border border-red-500 text-white relative top-[${coords.y}px]`}
          >
            Hello
          </div>
        </div>
      )} */}
      {/* {chartData &&
        chartData.carData.map((year) => {
          return (
            <div key={year.year} className="mb-3">
              {year.year}
              {year.cars.map((car) => {
                return (
                  <div key={car.id}>
                    {car.name} {car.year} {car.price[0]}-{car.price[1]} (
                    {car.count} units)
                  </div>
                );
              })}
            </div>
          );
        })} */}
    </>
  );
  // return <canvas ref={canvasRef} className="w-[500px] h-[200px]"></canvas>;
}
