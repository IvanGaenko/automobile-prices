"use client";

import { useEffect, useRef } from "react";

import { canvasParams } from "@/lib/params";
import { drawLine, drawRect, drawText, getRandomColor } from "@/lib/functions";

export default function WarcraftCanvas({ data }) {
  const { lineHeight, graphOffsetLeft, graphOffsetTop, primaryFontSize } =
    canvasParams;
  const canvasRef = useRef(null);
  const highlightRef = useRef(null);

  const graphHeight = data.totalCount * lineHeight;

  const graphWidthRef = useRef(window.innerWidth * 0.7 + graphOffsetLeft);

  const xKoeffRef = useRef(
    (graphWidthRef.current - graphOffsetLeft) / data.maxXValue
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

      const xDimensionPart = data.maxXValue / 5;

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

    function renderTierData() {
      graphArea.current = [];
      let tiersOffset = graphOffsetTop;
      const colors = [];
      for (let i = 0; i < data.tierData.length; i++) {
        const currentTier = data.tierData[i];
        const { dungeonsStats } = currentTier;

        // draw rect
        let checkpoint = graphOffsetLeft + 2;
        for (let j = 0; j < dungeonsStats.length; j++) {
          const barWidth = dungeonsStats[j].count * xKoeff - 1;
          const barOffsetLeft = checkpoint - graphOffsetLeft;
          const barOffsetRight = graphWidth - barWidth - barOffsetLeft;

          const currentColor = getRandomColor();
          if (colors.length <= dungeonsStats.length) colors.push(currentColor);

          drawRect(
            context,
            checkpoint,
            tiersOffset,
            barWidth,
            lineHeight - 2,
            colors[j]
          );

          graphArea.current.push({
            start: tiersOffset,
            end: tiersOffset + lineHeight,
            offsetLeft: barOffsetLeft,
            offsetRight: barOffsetRight,
            width: barWidth,
            color: colors[j],
            data: {
              name: dungeonsStats[j].name,
              count: dungeonsStats[j].count,
              total: currentTier.totalCount,
              totalWidth: currentTier.totalCount * xKoeff,
            },
          });

          checkpoint += dungeonsStats[j].count * xKoeff;
        }

        // draw name
        drawText(
          context,
          graphOffsetLeft + 5,
          tiersOffset + primaryFontSize,
          currentTier.name
        );

        tiersOffset = tiersOffset + lineHeight;
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
    renderTierData();
  }

  function onResizeCanvas() {
    graphWidthRef.current = window.innerWidth * 0.7 + graphOffsetLeft;
    xKoeffRef.current =
      (graphWidthRef.current - graphOffsetLeft) / data.maxXValue;
    canvasInit();
  }

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

    const canvasDimensions = hCanvas.getBoundingClientRect();

    const currentLine = graphArea.current.find(
      (area) => e.pageY > area.start && e.pageY < area.end
    );

    if (currentLine) {
      hContext.clearRect(0, 0, hCanvas.width, hCanvas.height);

      drawRect(
        hContext,
        0,
        currentLine.start - graphOffsetTop,
        hCanvas.width,
        lineHeight,
        "rgba(255,255,255,0.5)"
      );

      drawText(
        hContext,
        currentLine.data.totalWidth + 5,
        currentLine.start - primaryFontSize,
        currentLine.data.total
      );
    }

    const currentBar = graphArea.current.find(
      (area) =>
        e.pageX > area.offsetLeft + canvasDimensions.left &&
        e.pageX < area.offsetLeft + area.width + canvasDimensions.left &&
        e.pageY > area.start &&
        e.pageY < area.end
    );

    if (currentBar) {
      hContext.clearRect(0, 0, hCanvas.width, hCanvas.height);

      const dungeonData = `${currentBar.data.name} - ${currentBar.data.count} ${
        currentBar.data.count > 1 ? "players" : "player"
      }`;
      const totalData = `Total: ${currentBar.data.total} ${
        currentBar.data.total > 1 ? "players" : "player"
      }`;

      const dungeonDataWidth = hContext.measureText(dungeonData).width;
      const totalDataWidth = hContext.measureText(totalData).width;

      const tooltipWidth = Math.max(dungeonDataWidth, totalDataWidth) + 10;
      const tooltipHeight = lineHeight * 2;

      const tooltipXPosition =
        currentBar.offsetRight > tooltipWidth
          ? currentBar.offsetLeft + currentBar.width
          : currentBar.offsetLeft - tooltipWidth;
      const tooltipYPosition =
        currentBar.start - graphOffsetTop > tooltipHeight
          ? currentBar.start - graphOffsetTop - tooltipHeight
          : currentBar.end - graphOffsetTop;

      // draw Highlight line
      drawRect(
        hContext,
        0,
        currentBar.start - graphOffsetTop,
        hCanvas.width,
        lineHeight,
        "rgba(255,255,255,0.5)"
      );

      // draw Highlight bar
      drawRect(
        hContext,
        currentBar.offsetLeft,
        currentBar.start - graphOffsetTop,
        currentBar.width,
        lineHeight - 2,
        currentBar.color
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

      // draw dungeon data
      drawText(
        hContext,
        tooltipXPosition + 5,
        tooltipYPosition + primaryFontSize,
        dungeonData
      );

      // draw total value
      drawText(
        hContext,
        tooltipXPosition + 5,
        tooltipYPosition + primaryFontSize + tooltipHeight / 2,
        totalData
      );
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
