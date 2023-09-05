import { useState, useEffect } from "react";

export default function XAxisMeasureRow({
  maxValue,
  koef,
  yPosition,
  height,
  graphOffsetTop,
  graphOffsetLeft,
}) {
  const [xAxisValue, setXAxisValue] = useState([]);

  useEffect(() => {
    const xAxisValues = [];
    for (let i = 1; i < 6; i++) {
      xAxisValues.push({
        key: i,
        value: i === 1 ? maxValue / 5 : xAxisValues[0].value * i,
      });
    }

    setXAxisValue(xAxisValues);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <g className="fill-white">
      {xAxisValue &&
        xAxisValue.map((measure) => {
          return (
            <g key={measure.key}>
              <line
                x1={measure.value * koef + graphOffsetLeft}
                y1={graphOffsetTop}
                x2={measure.value * koef + graphOffsetLeft}
                y2={height + graphOffsetTop}
                stroke="white"
                strokeWidth="1"
                strokeDasharray="4"
              ></line>

              <text
                x={measure.value * koef + (graphOffsetLeft - 15)}
                y={yPosition}
                className="text-sm"
              >
                {measure.value}
              </text>
            </g>
          );
        })}
    </g>
  );
}
