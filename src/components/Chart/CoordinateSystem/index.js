import { canvasParams } from "@/lib/params";

import XAxisMeasureRow from "./XAxisMeasureRow";
import GapLines from "./GapLines";

export default function CoordinateSystem({
  data,
  graphHeight,
  graphInnerWidth,
  graphInnerHeight,
  maxValue,
  koef,
}) {
  const { graphOffsetLeft, graphOffsetTop, lineHeight } = canvasParams;

  return (
    <>
      <rect
        rx="0"
        ry="0"
        fill="#141414"
        x="0"
        y="0"
        width="100%"
        height={graphHeight}
      ></rect>
      <polyline
        points={`${graphOffsetLeft},${graphOffsetTop} ${
          graphInnerWidth + graphOffsetLeft
        },${graphOffsetTop} ${graphInnerWidth + graphOffsetLeft},${
          graphInnerHeight + graphOffsetTop
        } ${graphOffsetLeft},${
          graphInnerHeight + graphOffsetTop
        } ${graphOffsetLeft},${graphOffsetTop}
      `}
        fill="none"
        stroke="white"
        strokeWidth="3"
      />

      {data && (
        <GapLines data={data} width={graphInnerWidth + graphOffsetLeft} />
      )}
      <XAxisMeasureRow
        maxValue={maxValue}
        koef={koef}
        yPosition={graphInnerHeight + graphOffsetTop + lineHeight}
        height={graphInnerHeight}
        graphOffsetTop={graphOffsetTop}
        graphOffsetLeft={graphOffsetLeft}
      />
    </>
  );
}
