export function getRandomColor() {
  const randomNumber = () => (Math.random() * 205 + 50).toFixed();
  return `rgba(${randomNumber()},${randomNumber()},${randomNumber()},0.7)`;
}

export default function getColors(count) {
  const colorsList = [];
  for (let i = 0; i < count; i++) {
    colorsList.push(getRandomColor());
  }
  return colorsList;
}
