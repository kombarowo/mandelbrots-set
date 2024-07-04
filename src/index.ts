(() => {
    /**
     * Every complex number can be expressed in the form `a+b*i`
     * where a and b are real numbers.
     */
    class ComplexNumber {
        a: number;
        b: number;

        constructor(a: number, b: number) {
            this.a = a;
            this.b = b;
        }

        add(n: ComplexNumber): ComplexNumber {
            this.a = this.a + n.a;
            this.b = this.b + n.b;

            return this;
        }

        mul(cnum: ComplexNumber): ComplexNumber {
            const a = this.a;
            const b = this.b;

            this.a = a * cnum.a - b * cnum.b;
            this.b = a * cnum.b + b * cnum.a;

            return this;
        }

        sqr(): ComplexNumber {
            const a = this.a;
            const b = this.b;

            this.a = a * a - b * b;
            this.b = a * b + b * a;

            return this;
        }

        /**
         * Just hypotenuse, but without `sqrt` for optimize calculations
         */
        mod(): number {
            return this.a * this.a + this.b * this.b;
        }
    }

    interface Axis {
        /* Distance from `min` to `max` */
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

        constructor(canvas) {
            this.canvas = canvas;
            this.axlen = 4;
            this.xc = 0;
            this.yc = 0;
            this.aspectRatio = canvas.width / canvas.height;

            this.update();
        }
    }

    class CanvasBase {
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

            this.axis = new CanvasAxis(canvas);
        }
    }

    class MandelbrotSet extends CanvasBase {
        /* Make arrow function to save `this` */
        onClick = (e: MouseEvent): void => {
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
            let i = 0;

            do {
                z.sqr().add(c);

                if (z.mod() > 4) {
                    break;
                }

                i++;
            } while (i < 1000);

            if (i === 1000) {
                return '#00ff00';
            } else {
                return null;
            }
        }
        draw(): void {
            this.loopEachPixel(this.getPixelColor);
        }

        constructor(canvas: HTMLCanvasElement | null) {
            super(canvas);

            this.canvas.addEventListener('click', this.onClick);
        }
    }

    const $c = document.getElementById('app') as HTMLCanvasElement | null;

    const ms = new MandelbrotSet($c);

    ms.draw();
})();
