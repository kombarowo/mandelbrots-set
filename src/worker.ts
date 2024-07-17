let cw;
let xr;
let xm;
let ar;
let yr;
let ym;

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

function getPixelColor(x: number, y: number): string | null {
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

onmessage = (e) => {
    const yArray = [];
    let xArray = [];

    const { y, cwidth, xRatio, xMin, aspectRatio, yRatio, yMin, setup } = e.data;

    if (setup) {
        cw = cwidth;
        xr = xRatio;
        xm = xMin;
        ar = aspectRatio;
        yr = yRatio;
        ym = yMin;
    } else {
        for (let i = y; i < y + 200; i++) {
            for (let x = 0; x < cw; x++) {
                const newX = (x * xr + xm) * ar;
                const newY = (i * yr + ym) * -1;

                const color = getPixelColor(newX, newY);

                xArray.push(color);
            }

            yArray.push([...xArray]);
            xArray = [];
        }

        postMessage({ yArray, delta: y });
    }
};
