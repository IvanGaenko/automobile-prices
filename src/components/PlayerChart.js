export default function PlayerChart({ data }) {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="50%"
      height="305"
    >
      <rect
        rx="0"
        ry="0"
        fill="#141414"
        x="0"
        y="0"
        width="840"
        height="305"
      ></rect>
      <path
        fill="none"
        d="M 227.5 25 L 227.5 255"
        strokeOpacity="0.1"
        stroke="rgb(255,255,255)"
        strokeWidth="1"
        opacity="1"
      ></path>
    </svg>
  );
}
