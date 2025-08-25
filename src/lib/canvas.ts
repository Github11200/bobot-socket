import type { Color, ImageParams, LineParams, ShapeParams } from "./types/canvasTypes";

class Canvas {
  private context;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context
  }

  private initShape(params: ShapeParams) {
    this.context.beginPath();
    this.context.fillStyle = params.fillColor ? params.fillColor : "black";
    this.context.strokeStyle = params.strokeColor ? params.strokeColor : "black"
    this.context.lineWidth = params.strokeWidth ? params.strokeWidth : 1;
  }

  private displayShape(strokeColor: Color | undefined) {
    if (strokeColor)
      this.context.stroke()
    this.context.fill()
  }

  drawImage(params: ImageParams) {
    const image = new Image();
    image.src = params.src;

    this.context.drawImage(image, 0, 0);
  }

  drawRect(params: ShapeParams) {
    this.initShape(params)
    this.context.rect(params.x, params.y, params.width, params.height);
    this.displayShape(params.strokeColor)
  }

  drawCircle(params: ShapeParams) {
    this.initShape(params)
    this.context.arc(params.x, params.y, params.width, 0, 360)
    this.displayShape(params.strokeColor)
  }

  drawLine(params: ShapeParams) {
    this.initShape(params)
    this.context.moveTo(params.x, params.y)
    this.context.lineTo(params.x + params.width, params.y + params.height)
    this.displayShape(params.strokeColor)
  }
}

export default Canvas