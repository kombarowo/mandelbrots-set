interface Axis {
    /* Distance from x(y)min to x(y)max */
    axlen: number;
    /* x0 */
    xc: number;
    /* y0 */
    yc: number;

    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
}

class CanvasAxis implements Axis {
    axlen: number;
    xc: number;
    yc: number;
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;

    canvas: HTMLCanvasElement;

    /* Ratios for converting from canvas coordinates to real */
    xRatio: number;
    yRatio: number;
    aspectRatio: number;

    update() {
        this.xMin = this.xc - this.axlen / 2;
        this.xMax = this.xc + this.axlen / 2;
        this.yMin = this.yc - this.axlen / 2;
        this.yMax = this.yc + this.axlen / 2;
        this.xRatio = (this.xMax - this.xMin) / this.canvas.width;
        this.yRatio = (this.yMax - this.yMin) / this.canvas.height;
    }

    constructor(canvas, axlen, xc, yc) {
        this.canvas = canvas;
        this.axlen = axlen;
        this.xc = xc;
        this.yc = yc;
        this.aspectRatio = canvas.width / canvas.height;

        this.update();
    }
}

export class CanvasBase {
    axis: CanvasAxis;

    canvas: HTMLCanvasElement | null;

    ctx: CanvasRenderingContext2D;

    loopEachPixel(onPixel: (x: number, y: number) => string | null) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let y = 0; y < this.canvas.height; y++) {
            for (let x = 0; x < this.canvas.width; x++) {
                let newX = x * this.axis.xRatio + this.axis.xMin;
                newX *= this.axis.aspectRatio;

                let newY = y * this.axis.yRatio + this.axis.yMin;
                newY *= -1;

                const color = onPixel(newX, newY);

                if (color !== null) {
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(x, y, 1, 1);
                }
            }
        }
    }

    constructor(canvas: HTMLCanvasElement | null) {
        if (canvas === null) {
            throw new Error('Canvas is null');
        }
        this.canvas = canvas;

        this.ctx = canvas.getContext('2d', { alpha: false });
        if (this.ctx === null) {
            throw new Error('Canvas context is null');
        }

        this.axis = new CanvasAxis(canvas, 4, 0, 0);
    }
}
