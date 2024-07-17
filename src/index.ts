(() => {
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

        worker: Worker;

        queue: Array<number>;

        draw() {
            this.worker.postMessage({
                cwidth: this.canvas.width,
                xRatio: this.axis.xRatio,
                xMin: this.axis.xMin,
                aspectRatio: this.axis.aspectRatio,
                yRatio: this.axis.yRatio,
                yMin: this.axis.yMin,
                setup: true
            });

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (let y = 0; y < this.canvas.height; y += 200) {
                this.queue.push(y);
            }
            this.worker.postMessage({
                y: this.queue.shift()
            });
            this.worker.onmessage = (e) => {
                const { yArray, delta } = e.data;

                if (this.queue.length > 0) {
                    this.worker.postMessage({
                        y: this.queue.shift()
                    });
                } else {
                    this.canvas.style.opacity = '1';
                    this.canvas.style.pointerEvents = 'unset';
                    document.body.style.cursor = 'unset';
                }

                for (let i = 0; i < yArray.length; i++) {
                    for (let x = 0; x < this.canvas.width; x++) {
                        const color = yArray[i][x];

                        if (color !== null) {
                            this.ctx.fillStyle = color;
                            this.ctx.fillRect(x, i + delta, 1, 1);
                        }
                    }
                }
            };
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

            this.worker = new Worker('build/worker.js');

            this.queue = [];
        }
    }

    class MandelbrotSet extends CanvasBase {
        /* Make arrow function to save `this` */
        onClick = (e: MouseEvent): void => {
            this.canvas.style.opacity = '0.5';
            this.canvas.style.pointerEvents = 'none';
            document.body.style.cursor = 'progress';
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

        constructor(canvas: HTMLCanvasElement | null) {
            super(canvas);

            this.canvas.addEventListener('click', this.onClick);
        }
    }

    const $c = document.getElementById('app') as HTMLCanvasElement | null;

    const ms = new MandelbrotSet($c);

    ms.draw();
})();
