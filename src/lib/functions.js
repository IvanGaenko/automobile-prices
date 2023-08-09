import { canvasParams } from "./params";

export const drawLine = (
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

export const drawText = (context, x, y, text, color = "white") => {
  context.beginPath();
  context.fillStyle = color;
  context.font = `${canvasParams.primaryFontSize}px sans-serif`;
  context.fillText(text, x, y);
};

export const drawRect = (context, x, y, width, height, color = "blue") => {
  context.beginPath();
  context.fillStyle = color;
  context.rect(x, y, width, height);
  context.fill();
};

export function getRandomColor() {
  const randomNumber = () => (Math.random() * 205 + 50).toFixed();
  return `rgba(${randomNumber()},${randomNumber()},${randomNumber()},0.7)`;
}
