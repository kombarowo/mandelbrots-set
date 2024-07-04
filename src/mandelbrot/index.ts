import { CanvasBase } from '../canvas-base/index.js';
import { ComplexNumber } from '../complex-number/index.js';

export class MandelbrotSet extends CanvasBase {
    onClick = (e: MouseEvent) => {
        const x = Math.floor(e.clientX - (window.innerWidth - this.canvas.clientWidth) / 2);
        const y = Math.floor(e.clientY - (window.innerHeight - this.canvas.clientHeight) / 2);

        let x1 = x * this.axis.xRatio + this.axis.xMin;
        let y1 = y * this.axis.yRatio + this.axis.yMin;

        this.axis.axlen *= 0.2;
        this.axis.xc = x1;
        this.axis.yc = y1;

        this.axis.update();
        this.draw();
    };
    getPixelColor(x: number, y: number): string | null {
        let z = new ComplexNumber(0, 0);
        let c = new ComplexNumber(x, y);

        for (var i = 0; i < 1000; i++) {
            z.sqr().add(c);

            if (z.mod() > 4) {
                break;
            }
        }

        if (i === 1000) {
            return '#00ff00';
        } else {
            return null;
        }
    }
    draw() {
        this.loopEachPixel(this.getPixelColor);
    }

    constructor(canvas: HTMLCanvasElement | null) {
        super(canvas);

        this.canvas.addEventListener('click', this.onClick);
    }
}
