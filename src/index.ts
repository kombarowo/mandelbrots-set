import { MandelbrotSet } from './mandelbrot/index.js';

(() => {
    const $c = document.getElementById('app') as HTMLCanvasElement | null;

    const ms = new MandelbrotSet($c);

    ms.draw();
})();
