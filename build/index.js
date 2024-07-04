(() => {
    /**
     * Every complex number can be expressed in the form `a+b*i`
     * where a and b are real numbers.
     */
    class ComplexNumber {
        constructor(a, b) {
            this.a = a;
            this.b = b;
        }
        add(n) {
            this.a = this.a + n.a;
            this.b = this.b + n.b;
            return this;
        }
        mul(cnum) {
            const a = this.a;
            const b = this.b;
            this.a = a * cnum.a - b * cnum.b;
            this.b = a * cnum.b + b * cnum.a;
            return this;
        }
        sqr() {
            const a = this.a;
            const b = this.b;
            this.a = a * a - b * b;
            this.b = a * b + b * a;
            return this;
        }
        /**
         * Just hypotenuse, but without `sqrt` for optimize calculations
         */
        mod() {
            return this.a * this.a + this.b * this.b;
        }
    }
    class CanvasAxis {
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
        loopEachPixel(onPixel) {
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
        constructor(canvas) {
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
        getPixelColor(x, y) {
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
            }
            else {
                return null;
            }
        }
        draw() {
            this.loopEachPixel(this.getPixelColor);
        }
        constructor(canvas) {
            super(canvas);
            /* Make arrow function to save `this` */
            this.onClick = (e) => {
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
            this.canvas.addEventListener('click', this.onClick);
        }
    }
    const $c = document.getElementById('app');
    const ms = new MandelbrotSet($c);
    ms.draw();
})();
