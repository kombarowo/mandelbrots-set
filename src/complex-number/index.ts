/**
 * Every complex number can be expressed in the form (a+b*i),
 * where a and b are real numbers.
 */
export class ComplexNumber {
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
     * Just hypotenuse, but without sqrt for optimize calculations
     */
    mod(): number {
        return this.a * this.a + this.b * this.b;
    }
}
