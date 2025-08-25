type Color = "red" | "blue" | "green" | "black" | "white"

interface ShapeParams {
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor?: Color;
  strokeColor?: Color;
  strokeWidth?: number;
}

interface ImageParams {
  src: string;
}

export type { ShapeParams, ImageParams, LineParams, Color }