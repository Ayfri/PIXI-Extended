import * as PIXI from 'pixi.js';

export class Vector2 extends PIXI.Point {
	private _values = new Float32Array(2);

	constructor(public x: number = 0, public y: number = 0) {
		super(x, y);
		this.xy = [x, y];
		this._values[0] = x;
		this._values[1] = y;
	}

	/**
	 * Retrieves a new instance of the vector (0, 0)
	 * @returns {Vector2} The zero vector
	 */
	static get zero(): Vector2 {
		return new Vector2(0, 0);
	}

	/**
	 * @returns {number[]} An array containing the x-component and y-component of the vector
	 */
	get xy(): number[] {
		return [this._values[0], this._values[1]];
	}

	/**
	 * @param {number[]} values An array containing the new x-component and y-component of the vector
	 */
	set xy(values: number[]) {
		this._values[0] = values[0];
		this._values[1] = values[1];
	}

	/**
	 * Retrieves the maximum vector values between two or more vectors.
	 * @param {Vector2} vector
	 * @param {Vector2[]} vectors
	 * @returns {Vector2} The result of the maximum vector values.
	 */
	static max(vector: Vector2, ...vectors: Vector2[]): Vector2 {
		return new Vector2(Math.max(vector.x, ...vectors.map(v => v.x)), Math.max(vector.y, ...vectors.map(v => v.y)));
	}

	/**
	 * Retrieves the minimum vector values between two or more vectors.
	 * @param {Vector2} vector
	 * @param {Vector2[]} vectors
	 * @returns {Vector2} The result of the minimum vector values.
	 */
	static min(vector: Vector2, ...vectors: Vector2[]): Vector2 {
		return new Vector2(Math.min(vector.x, ...vectors.map(v => v.x)), Math.min(vector.y, ...vectors.map(v => v.y)));
	}

	/**
	 * Calculates the dot product of two vectors.
	 * @param {Vector2} vector
	 * @param {Vector2} vector2
	 * @returns {number} The dot product of the two vectors.
	 */
	static dot(vector: Vector2, vector2: Vector2): number {
		return vector.x * vector2.x + vector.y * vector2.y;
	}

	/**
	 * Calculates the distance between two vectors.
	 * @param {Vector2} vector
	 * @param {Vector2} vector2
	 * @returns {number} The distance between the two vectors.
	 */
	static distance(vector: Vector2, vector2: PIXI.IPointData): number {
		return Math.sqrt(Vector2.squaredDistance(vector, vector2));
	}

	/**
	 * Calculates the distance between two vectors squared.
	 * @param {Vector2} vector
	 * @param {Vector2} vector2
	 * @returns {number} The distance between the two vectors.
	 */
	static squaredDistance(vector: Vector2, vector2: PIXI.IPointData) {
		const x = vector2.x - vector.x;
		const y = vector2.y - vector.y;
		return x * x + y * y;
	}

	/**
	 * Calculates a normalized vector representing the direction from one vector to another.
	 * If no dest vector is specified, a new vector is instantiated.
	 * @param {Vector2} vector
	 * @param {Vector2} vector2
	 * @param {Vector2} dest
	 * @returns {Vector2}
	 */
	static direction(vector: Vector2, vector2: Vector2, dest?: Vector2): Vector2 {
		if (!dest) dest = new Vector2();
		let x = vector.x - vector2.x;
		let y = vector.y - vector2.y;
		let length = Math.sqrt(x * x + y * y);
		if (length === 0) {
			dest.reset();
			return dest;
		}
		length = 1.0 / length;
		dest.x = x * length;
		dest.y = y * length;
		return dest;
	}

	/**
	 * Performs a linear interpolation over two vectors.
	 * If no dest vector is specified, a new vector is instantiated.
	 * @param {Vector2} a
	 * @param {Vector2} b
	 * @param {number} t
	 * @param {Vector2} dest
	 * @returns {Vector2}
	 */
	static lerp(a: Vector2, b: Vector2, t: number, dest?: Vector2): Vector2 {
		if (!dest) dest = new Vector2();
		dest.x = a.x + t * (b.x - a.x);
		dest.y = a.y + t * (b.y - a.y);
		return dest;
	}

	/**
	 * Adds two vectors.
	 * If no dest vector is specified, a new vector is instantiated.
	 * @param {Vector2} vector
	 * @param {Vector2} vector2
	 * @param {Vector2} dest
	 * @returns {Vector2}
	 */
	static sum(vector: Vector2, vector2: Vector2, dest?: Vector2): Vector2 {
		if (!dest) dest = new Vector2();
		dest.x = vector.x + vector2.x;
		dest.y = vector.y + vector2.y;
		return dest;
	}

	/**
	 * Subtracts two vectors.
	 * If no dest vector is specified, a new vector is instantiated.
	 * @param {Vector2} vector
	 * @param {Vector2} vector2
	 * @param {Vector2} dest
	 * @returns {Vector2}
	 */
	static difference(vector: Vector2, vector2: Vector2, dest?: Vector2): Vector2 {
		if (!dest) dest = new Vector2();

		dest.x = vector.x - vector2.x;
		dest.y = vector.y - vector2.y;

		return dest;
	}

	/**
	 * Multiplies two vectors piecewise.
	 * If no dest vector is specified, a new vector is instantiated.
	 * @param {Vector2} vector
	 * @param {Vector2} vector2
	 * @param {Vector2} dest
	 * @returns {Vector2}
	 */
	static product(vector: Vector2, vector2: Vector2, dest?: Vector2): Vector2 {
		if (!dest) dest = new Vector2();

		dest.x = vector.x * vector2.x;
		dest.y = vector.y * vector2.y;

		return dest;
	}

	/**
	 * Divides two vectors piecewise.
	 * If no dest vector is specified, a new vector is instantiated.
	 * @param {Vector2} vector
	 * @param {Vector2} vector2
	 * @param {Vector2} dest
	 * @returns {Vector2}
	 */
	static quotient(vector: Vector2, vector2: Vector2, dest?: Vector2): Vector2 {
		if (!dest) dest = new Vector2();

		dest.x = vector.x / vector2.x;
		dest.y = vector.y / vector2.y;

		return dest;
	}

	static getIntersect(planePosition: Vector2, planeNormal: Vector2, rayOrigin: Vector2, rayDirection: Vector2) {
		const planeDistance = planeNormal.x > 0 || planeNormal.y > 0 ? planePosition.add(planeNormal, new Vector2()).subtract(rayOrigin) : planePosition.subtract(rayOrigin, new Vector2());
		const t = Vector2.dot(planeNormal, planeDistance) / Vector2.dot(planeNormal, rayDirection);
		const mul = rayDirection.multiply(new Vector2(t, t), planeDistance);
		return rayOrigin.add(mul, mul);
	}

	/**
	 * Return the absolute values of X and Y.
	 * @param {Vector2} dest
	 * @returns {Vector2}
	 */
	abs(dest?: Vector2): Vector2 {
		if (!dest) dest = this;
		dest.x = Math.abs(this.x);
		dest.y = Math.abs(this.y);
		return dest;
	}

	/**
	 * Retrieves the x-component or y-component of the vector.
	 * @param {number} index
	 * @returns {number}
	 */
	at(index: number): number {
		return this._values[index];
	}

	/**
	 * Sets both the x- and y-components of the vector to 0.
	 */
	reset(): void {
		this.x = 0;
		this.y = 0;
	}

	/**
	 * Copies the x- and y-components from one vector to another.
	 * If no dest vector is specified, a new vector is instantiated.
	 * @param {Vector2} dest
	 * @returns {Vector2}
	 */
	copy(dest?: Vector2): Vector2 {
		if (!dest) dest = new Vector2();
		dest.xy = this.xy;
		return dest;
	}

	/**
	 * Multiplies both the x- and y-components of a vector by -1.
	 * If no dest vector is specified, the operation is performed in-place.
	 * @param {Vector2} dest
	 * @returns {Vector2}
	 */
	negate(dest?: Vector2): Vector2 {
		if (!dest) dest = this;
		dest.x = -this.x;
		dest.y = -this.y;
		return dest;
	}

	/**
	 * Checks if two vectors are equal, using a threshold to avoid floating-point precision errors.
	 * @param {Vector2} other
	 * @param {number} threshold
	 * @returns {boolean}
	 */
	equals(other: Vector2, threshold = 0.00001): boolean {
		return Math.abs(this.x - other.x) > threshold ? false : Math.abs(this.y - other.y) <= threshold;
	}

	/**
	 * Returns the distance from the vector to the origin.
	 * @returns {number}
	 */
	length(): number {
		return Math.sqrt(this.squaredLength());
	}

	/**
	 * Returns the distance from the vector to the origin, squared.
	 * @returns {number}
	 */
	squaredLength(): number {
		return this.x ** 2 + this.y ** 2;
	}

	/**
	 * Adds two vectors together.
	 * If no dest vector is specified, the operation is performed in-place.
	 * @param {Vector2} vector
	 * @param {Vector2} dest
	 * @returns {Vector2}
	 */
	add(vector: Vector2, dest?: Vector2): Vector2 {
		if (!dest) dest = this;
		dest.x = this.x + vector.x;
		dest.y = this.y + vector.y;
		return dest;
	}

	/**
	 * Subtracts one vector from another.
	 * If no dest vector is specified, the operation is performed in-place.
	 * @param {Vector2} vector
	 * @param {Vector2} dest
	 * @returns {Vector2}
	 */
	subtract(vector: Vector2, dest?: Vector2): Vector2 {
		if (!dest) dest = this;
		dest.x = this.x - vector.x;
		dest.y = this.y - vector.y;
		return dest;
	}

	/**
	 * Multiplies two vectors together piecewise.
	 * If no dest vector is specified, the operation is performed in-place.
	 * @param {Vector2} vector
	 * @param {Vector2} dest
	 * @returns {Vector2}
	 */
	multiply(vector: Vector2, dest?: Vector2): Vector2 {
		if (!dest) dest = this;
		dest.x = this.x * vector.x;
		dest.y = this.y * vector.y;
		return dest;
	}

	/**
	 * Divides two vectors piecewise.
	 * @param {Vector2} vector
	 * @param {Vector2} dest
	 * @returns {Vector2}
	 */
	divide(vector: Vector2, dest?: Vector2): Vector2 {
		if (!dest) dest = this;
		dest.x = this.x / vector.x;
		dest.y = this.y / vector.y;
		return dest;
	}

	/**
	 * Scales a vector by a scalar parameter.
	 * If no dest vector is specified, the operation is performed in-place.
	 * @param {number} value
	 * @param {Vector2} dest
	 * @returns {Vector2}
	 */
	scale(value: number, dest?: Vector2): Vector2 {
		if (!dest) dest = this;
		dest.x = this.x * value;
		dest.y = this.y * value;
		return dest;
	}

	/**
	 * Normalizes a vector.
	 * If no dest vector is specified, the operation is performed in-place.
	 * @param {Vector2} dest
	 * @returns {Vector2}
	 */
	normalize(dest?: Vector2): Vector2 {
		if (!dest) dest = this;
		dest.xy = this.xy;
		let length = dest.length();
		if (length === 1) {
			return dest;
		}
		if (length === 0) {
			dest.reset();
			return dest;
		}
		length = 1.0 / length;
		dest.x *= length;
		dest.y *= length;
		return dest;
	}

	toString(): string {
		return `(${this.x}, ${this.y})`;
	}
}
