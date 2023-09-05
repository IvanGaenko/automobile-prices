import { useState, useEffect } from "react";

import { canvasParams } from "@/lib/params";

export default function GapLines({ data, width }) {
  const { lineHeight, sectionGap, graphOffsetLeft, graphOffsetTop } =
    canvasParams;

  const [gaps, setGaps] = useState([]);

  useEffect(() => {
    const gapsArray = [];
    let startPoint = graphOffsetTop;
    for (let i = 0; i < data.length; i++) {
      if (i !== data.length - 1) {
        startPoint += data[i].cars.length * lineHeight + sectionGap;
        gapsArray.push({ key: i + 1, offset: startPoint - sectionGap / 2 });
      }
    }

    setGaps(gapsArray);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <g stroke="white" strokeWidth="1" strokeDasharray="4">
      {gaps &&
        gaps.map((gap) => {
          return (
            <line
              key={gap.key}
              x1={graphOffsetLeft}
              y1={gap.offset}
              x2={width}
              y2={gap.offset}
            ></line>
          );
        })}
    </g>
  );
}
