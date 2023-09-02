import { useRef } from "react";
import { canvasParams } from "@/lib/params";

export default function PlayerChart({ data }) {
  console.log("data", data);
  const {
    lineHeight,
    sectionGap,
    graphOffsetLeft,
    graphOffsetTop,
    primaryFontSize,
  } = canvasParams;

  const graphHeightRef = useRef(
    lineHeight * data.carsCount +
      graphOffsetTop * 2 +
      (data.carData.length - 1) * sectionGap
  );
  const grapshWidthRef = useRef(window.innerWidth * 0.9);
  const graphInnerWidthRef = useRef(
    grapshWidthRef.current - graphOffsetLeft * 2
  );
  const graphInnerHeightRef = useRef(
    graphHeightRef.current - graphOffsetTop * 2
  );

  const startPoint = useRef(graphOffsetTop);
  const carPoint = useRef(0);

  console.log("graphHeightRef", graphHeightRef);
  console.log("(data.carData.length - 1", sectionGap * data.carData.length);
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={grapshWidthRef.current}
      height={graphHeightRef.current}
    >
      <rect
        rx="0"
        ry="0"
        fill="#141414"
        x="0"
        y="0"
        width="100%"
        height={graphHeightRef.current}
      ></rect>
      <polyline
        points={`${graphOffsetLeft},${graphOffsetTop} 
        ${graphInnerWidthRef.current + graphOffsetLeft},${graphOffsetTop} 
        ${graphInnerWidthRef.current + graphOffsetLeft},${
          graphInnerHeightRef.current + graphOffsetTop
        }
        ${graphOffsetLeft},${graphInnerHeightRef.current + graphOffsetTop}
        ${graphOffsetLeft},${graphOffsetTop}
        `}
        fill="none"
        stroke="white"
        strokeWidth="3"
      />

      {data.carData.map((car, i) => {
        const yearSection = car.cars.length * lineHeight;
        startPoint.current = startPoint.current + yearSection;
        const xKoeff = graphInnerWidthRef.current / data.maxPrice;
        return (
          <g
            key={car.year}
            className="fill-white"
            // style={{ backgroundColor: "red" }}
            // x={graphOffsetLeft}
          >
            <line
              x1={graphOffsetLeft}
              y1={startPoint.current - yearSection - 3}
              x2={graphInnerWidthRef.current + graphOffsetLeft}
              y2={startPoint.current - yearSection - 3}
              stroke="white"
              strokeWidth="3"
            ></line>

            <text
              x="0"
              y={startPoint.current - yearSection / 2 + 14 / 2}
              className="text-sm"
            >
              {car.year}
            </text>
            {car.cars.map((line, i) => {
              carPoint.current =
                startPoint.current - yearSection + lineHeight * (i + 1);
              if (i === car.cars.length - 1) {
                startPoint.current = startPoint.current + sectionGap;
              }
              const isSamePrice = line.price[0] === line.price[1];
              const barWidth = isSamePrice
                ? lineHeight
                : (line.price[1] - line.price[0]) * xKoeff;
              return (
                <g key={line.name}>
                  <rect
                    x={graphOffsetLeft}
                    y={carPoint.current - lineHeight}
                    fill="red"
                    // fill="transparent"
                    width={graphInnerWidthRef.current}
                    height={lineHeight}
                    style={{ opacity: 0.5, zIndex: 1 }}
                  ></rect>
                  <text
                    x={graphOffsetLeft + 5}
                    y={carPoint.current - 14 / 2}
                    className="text-sm"
                  >
                    {line.name} {line.year}
                  </text>
                  <rect
                    rx="0"
                    ry="0"
                    fill="blue"
                    // x="300"
                    x={line.price[0] * xKoeff + graphOffsetLeft}
                    y={carPoint.current - lineHeight + 5}
                    width={barWidth}
                    height={lineHeight - 10}
                  ></rect>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}
