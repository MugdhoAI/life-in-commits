"use client";

const CELLS: { x: number; y: number; fill: string }[] = [
  { x: 9, y: 15, fill: "#0e4429" },
  { x: 22, y: 15, fill: "#26a641" },
  { x: 35, y: 15, fill: "#39d353" },
  { x: 46, y: 15, fill: "#0e4429" },
  { x: 9, y: 28, fill: "#26a641" },
  { x: 22, y: 28, fill: "#39d353" },
  { x: 35, y: 28, fill: "#006d32" },
  { x: 46, y: 28, fill: "#21262d" },
  { x: 9, y: 41, fill: "#006d32" },
  { x: 22, y: 41, fill: "#0e4429" },
  { x: 35, y: 41, fill: "#21262d" },
  { x: 46, y: 41, fill: "#21262d" },
];

export default function Logo() {
  return (
    <span className="brand-mark logo-mark" aria-hidden="true">
      <svg viewBox="0 0 64 64" width="38" height="38">
        <rect width="64" height="64" rx="14" fill="#0d1117" />
        {CELLS.map((cell, index) => (
          <rect key={index} x={cell.x} y={cell.y} width="9" height="9" rx="2.5" fill={cell.fill} />
        ))}
      </svg>
    </span>
  );
}
