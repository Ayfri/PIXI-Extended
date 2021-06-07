import * as PIXI from 'pixi.js';
import {ObservableVector2} from './ObservableVector2';

export type XY = [x: number, y: number];

export class Vector2 implements PIXI.IPoint {
	protected _values = new Float32Array(2);

	public constructor();

	public constructor(points: PIXI.IPointData);

	public constructor(x: number, y: number);

	public constructor(x?: number | PIXI.IPointData, y?: number) {
		let xValue: number = 0;
		let yValue: number = 0;

		if (x) {
			if (typeof x === 'number') {
				xValue = x;
				yValue = y ?? 0;
			} else {
				xValue = x.x;
				yValue = x.y;
			}
		}

		this.xy = [xValue, yValue];
	}

	/**
	 * Retrieves a new instance of the vector (0, 0)
	 * @returns {Vector2} The zero vector
	 */
	public static get zero(): Vector2 {
		return new Vector2(0, 0);
	}

	/**
	 * @returns {number} The x-component of the vector
	 */
	public get x(): number {
		return this._values[0];
	}

	/**
	 * @param {number} value The new x-component of the vector
	 */
	public set x(value: number) {
		this._values[0] = value;
	}

	/**
	 * @returns {number} The y-component of the vector
	 */
	public get y(): number {
		return this._values[1];
	}

	/**
	 * @param {number} value The new y-component of the vector
	 */
	public set y(value: number) {
		this._values[1] = value;
	}

	/**
	 * @returns {number[]} An array containing the x-component and y-component of the vector
	 */
	public get xy(): XY {
		return [this._values[0], this._values[1]];
	}

	/**
	 * @param {number[]} values An array containing the new x-component and y-component of the vector
	 */
	public set xy(values: XY) {
		this._values[0] = values[0];
		this._values[1] = values[1];
	}

	/**
	 * Retrieves the maximum vector values between two or more vectors.
	 * @param {Vector2} vector
	 * @param {Vector2[]} vectors
	 * @returns {Vector2} The result of the maximum vector values.
	 */
	public static max(vector: Vector2, ...vectors: Vector2[]): Vector2 {
		return new Vector2(Math.max(vector.x, ...vectors.map(v => v.x)), Math.max(vector.y, ...vectors.map(v => v.y)));
	}

	/**
	 * Retrieves the minimum vector values between two or more vectors.
	 * @param {Vector2} vector
	 * @param {Vector2[]} vectors
	 * @returns {Vector2} The result of the minimum vector values.
	 */
	public static min(vector: Vector2, ...vectors: Vector2[]): Vector2 {
		return new Vector2(Math.min(vector.x, ...vectors.map(v => v.x)), Math.min(vector.y, ...vectors.map(v => v.y)));
	}

	/**
	 * Calculates the dot product of two vectors.
	 * @param {Vector2} vector
	 * @param {Vector2} vector2
	 * @returns {number} The dot product of the two vectors.
	 */
	public static dot(vector: Vector2, vector2: Vector2): number {
		return vector.x * vector2.x + vector.y * vector2.y;
	}

	/**
	 * Calculates the distance between two vectors.
	 * @param {Vector2} vector
	 * @param {Vector2} vector2
	 * @returns {number} The distance between the two vectors.
	 */
	public static distance(vector: Vector2, vector2: PIXI.IPointData): number {
		return Math.sqrt(Vector2.squaredDistance(vector, vector2));
	}

	/**
	 * Calculates the distance between two vectors squared.
	 * @param {Vector2} vector
	 * @param {Vector2} vector2
	 * @returns {number} The distance between the two vectors.
	 */
	public static squaredDistance(vector: Vector2, vector2: PIXI.IPointData) {
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
	public static direction(vector: Vector2, vector2: Vector2, dest?: Vector2): Vector2 {
		if (!dest) dest = new Vector2();
		const x = vector.x - vector2.x;
		const y = vector.y - vector2.y;
		let length = Math.sqrt(x * x + y * y);
		if (length === 0) {
			dest.reset();
			return dest;
		}
		length = 1.0 / length;
		dest.set(x * length, y * length);
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
	public static lerp(a: Vector2, b: Vector2, t: number, dest?: Vector2): Vector2 {
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
	public static sum(vector: Vector2, vector2: Vector2, dest?: Vector2): Vector2 {
		if (!dest) dest = new Vector2();
		dest.set(vector.x + vector2.x, vector.y + vector2.y);
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
	public static difference(vector: Vector2, vector2: Vector2, dest?: Vector2): Vector2 {
		if (!dest) dest = new Vector2();
		dest.set(vector.x - vector2.x, vector.y - vector2.y);

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
	public static product(vector: Vector2, vector2: Vector2, dest?: Vector2): Vector2 {
		if (!dest) dest = new Vector2();
		dest.set(vector.x * vector2.x, vector.y * vector2.y);

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
	public static quotient(vector: Vector2, vector2: Vector2, dest?: Vector2): Vector2 {
		if (!dest) dest = new Vector2();
		dest.set(vector.x / vector2.x, vector.y / vector2.y);

		return dest;
	}

	/**
	 * Copies the x and y components from the source to the destination. The source and destination must be of the same type.
	 * @param {Vector2} src The source point.
	 */
	public copyFrom(src: PIXI.IPointData): this {
		this.set(src.x, src.y);
		return this;
	}

	/**
	 * Copies the x and y components from the source to the destination. The source and destination must be of the same type.
	 * @typeParam T The type of your source, can also be a Vector2.
	 * @param {T} p The source point.
	 * @returns {T}
	 */
	public copyTo<T extends PIXI.IPointData>(p: T): T {
		p.x = this.x;
		p.y = this.y;
		return p;
	}

	/**
	 * Set the x and y values.
	 * @param {number} x
	 * @param {number} y
	 * @returns {this}
	 */
	public set(x: number, y: number): this;
	public set(value?: number): this;
	public set(x: number = 0, y?: number): this {
		this.xy = [x, y ?? x];
		return this;
	}

	/**
	 * Return the absolute values of X and Y.
	 * @param {Vector2} dest
	 * @returns {Vector2}
	 */
	public abs(dest?: Vector2): Vector2 {
		if (!dest) dest = this;
		dest.set(Math.abs(this.x), Math.abs(this.y));
		return dest;
	}

	/**
	 * Retrieves the x-component or y-component of the vector.
	 * @param {number} index
	 * @returns {number}
	 */
	public at(index: number): number {
		return this._values[index];
	}

	/**
	 * Sets both the x- and y-components of the vector to 0.
	 */
	public reset(): void {
		this.set();
	}

	/**
	 * Multiplies both the x- and y-components of a vector by -1.
	 * If no dest vector is specified, the operation is performed in-place.
	 * @param {Vector2} dest
	 * @returns {Vector2}
	 */
	public negate(dest?: Vector2): Vector2 {
		if (!dest) dest = this;
		dest.set(-this.x, -this.y);
		return dest;
	}

	/**
	 * Checks if two vectors are equal, using a threshold to avoid floating-point precision errors.
	 * @param {Vector2} other
	 * @param {number} threshold
	 * @returns {boolean}
	 */
	public equals(other: Vector2, threshold = 0.00001): boolean {
		return Math.abs(this.x - other.x) > threshold ? false : Math.abs(this.y - other.y) <= threshold;
	}

	/**
	 * Returns true if both X & Y are greater than the other Vector2.
	 * @param {Vector2} other
	 * @returns {boolean}
	 */
	public greaterThan(other: Vector2): boolean {
		return this.x > other.x && this.y > other.y;
	}

	/**
	 * Returns the distance from the vector to the origin.
	 * @returns {number}
	 */
	public length(): number {
		return Math.sqrt(this.squaredLength());
	}

	/**
	 * Returns the distance from the vector to the origin, squared.
	 * @returns {number}
	 */
	public squaredLength(): number {
		return this.x ** 2 + this.y ** 2;
	}

	/**
	 * Adds two vectors together.
	 * If no dest vector is specified, the operation is performed in-place.
	 * @param {Vector2} vector
	 * @param {Vector2} dest
	 * @returns {Vector2}
	 */
	public add(vector: Vector2, dest?: Vector2): Vector2 {
		if (!dest) dest = this;
		dest.set(this.x + vector.x, this.y + vector.y);
		return dest;
	}

	/**
	 * Subtracts one vector from another.
	 * If no dest vector is specified, the operation is performed in-place.
	 * @param {Vector2} vector
	 * @param {Vector2} dest
	 * @returns {Vector2}
	 */
	public subtract(vector: Vector2, dest?: Vector2): Vector2 {
		if (!dest) dest = this;
		dest.set(this.x - vector.x, this.y - vector.y);
		return dest;
	}

	/**
	 * Multiplies two vectors together piecewise.
	 * If no dest vector is specified, the operation is performed in-place.
	 * @param {Vector2} vector
	 * @param {Vector2} dest
	 * @returns {Vector2}
	 */
	public multiply(vector: Vector2, dest?: Vector2): Vector2 {
		if (!dest) dest = this;
		dest.set(this.x * vector.x, this.y * vector.y);
		return dest;
	}

	/**
	 * Divides two vectors piecewise.
	 * @param {Vector2} vector
	 * @param {Vector2} dest
	 * @returns {Vector2}
	 */
	public divide(vector: Vector2, dest?: Vector2): Vector2 {
		if (!dest) dest = this;
		dest.set(this.x / vector.x, this.y / vector.y);
		return dest;
	}

	/**
	 * Scales a vector by a scalar parameter.
	 * If no dest vector is specified, the operation is performed in-place.
	 * @param {number} value
	 * @param {Vector2} dest
	 * @returns {Vector2}
	 */
	public scale(value: number, dest?: Vector2): Vector2 {
		if (!dest) dest = this;
		dest.set(this.x * value, this.y * value);
		return dest;
	}

	/**
	 * Normalizes a vector.
	 * If no dest vector is specified, the operation is performed in-place.
	 * @param {Vector2} dest
	 * @returns {Vector2}
	 */
	public normalize(dest?: Vector2): Vector2 {
		if (!dest) dest = this;
		dest.xy = this.xy;
		let length = dest.length();
		if (length === 1) return dest;
		if (length === 0) {
			dest.reset();
			return dest;
		}
		length = 1.0 / length;
		dest.x *= length;
		dest.y *= length;
		return dest;
	}

	public deepClone(dest?: Vector2): Vector2 {
		if (!dest) dest = this;
		dest.xy = this.xy.slice() as XY;
		return dest;
	}

	public toString(): string {
		return `(${this.x}, ${this.y})`;
	}

	/**
	 * Convert this Vector to an ObservableVector2.
	 * @param callback - Callback of the observableVector2.
	 * @param scope - Scope of the ObservableVector2.
	 * @returns - An ObservableVector2.
	 */
	public toObservable<T = any>(callback: (this: T) => any, scope: T): ObservableVector2<T> {
		return new ObservableVector2<T>(callback, scope, this.x, this.y);
	}
}
