import * as PIXI from 'pixi.js';
import {Vector2, XY} from './Vector2';

export class ObservableVector2<T = any> implements PIXI.IPoint {
	public _x: number;
	public _y: number;

	/**
	 * Creates a new ObservableVector2.
	 * @param cb - The callback to call whenever a value change.
	 * @param scope - Owner of callback
	 * @param x - Position of the vector on the X axis.
	 * @param y - Position of the vector on the Y axis.
	 * @param fromObject
	 */
	public constructor(public cb: (this: T) => any, public scope: T, x = 0, y = 0, private fromObject?: PIXI.ObservablePoint) {
		this._x = x;
		this._y = y;
	}

	/**
	 * XY values.
	 * @returns - An array containing the x-component and y-component of the vector.
	 */
	public get xy(): XY {
		return [this._x, this._y];
	}

	/**
	 * Sets the XY values.
	 * @param values - An array containing the new x-component and y-component of the vector
	 */
	public set xy(values: XY) {
		this.x = values[0];
		this.y = values[1];
		this.fromObject?.set(...values);
	}

	/**
	 * The X value.
	 * @returns - The x-component of the vector
	 */
	public get x(): number {
		return this._x;
	}

	/**
	 * Set the x-component.
	 * @param value - The new x-component of the vector
	 */
	public set x(value: number) {
		if (this.x !== value) {
			this._x = value;
			this.cb.call(this.scope);
			if (this.fromObject) this.fromObject.x = value;
		}
	}

	/**
	 * The Y value.
	 * @returns - The y-component of the vector
	 */
	public get y(): number {
		return this._y;
	}

	/**
	 * Set the y-component.
	 * @param value - The new y-component of the vector
	 */
	public set y(value: number) {
		if (this.y !== value) {
			this._y = value;
			this.cb.call(this.scope);
			if (this.fromObject) this.fromObject.y = value;
		}
	}

	/**
	 * Create an ObservableVector2 from a PIXI.ObservablePoint.
	 * @param point - The point.
	 * @returns - The ObservableVector2.
	 */
	public static fromPoint<T = any>(point: PIXI.ObservablePoint): ObservableVector2<T> {
		return new ObservableVector2<T>(point.cb, point.scope, point.x, point.y, point);
	}

	/**
	 * Checks if two vectors are equal, using a threshold to avoid floating-point precision errors.
	 * @param other - The other vector to compare with.
	 * @param threshold - The minimal difference required to say that the vectors are different, to avoid floating-point precision errors.
	 * @returns - If vectors are equals.
	 */
	public equals(other: PIXI.IPointData, threshold = 0.00001): boolean {
		return Math.abs(this.x - other.x) > threshold ? false : Math.abs(this.y - other.y) <= threshold;
	}

	/**
	 * Copies the x and y components from the source to the destination. The source and destination must be of the same type.
	 * @param src The source point.
	 * @returns - Returns itself.
	 */
	public copyFrom(src: PIXI.IPointData): this {
		this.set(src.x, src.y);
		this.fromObject?.copyFrom(src);
		return this;
	}

	/**
	 * Copies the x- and y-components from the source to the destination. The source and destination must be of the same type.
	 * @typeParam T The type of your source, can also be a ObservableVector2.
	 * @param p The source point.
	 * @returns - The resulting object.
	 */
	public copyTo<T extends PIXI.IPointData>(p: T): T {
		p.x = this.x;
		p.y = this.y;
		return p;
	}

	/**
	 * Return the absolute values of X and Y.
	 * @param dest - An optional destination.
	 * @returns - The absolute values of X and Y.
	 */
	public abs(dest?: ObservableVector2<T>): ObservableVector2<T> {
		if (!dest) dest = this;
		dest.set(Math.abs(this.x), Math.abs(this.y));
		return dest;
	}

	/**
	 * Sets both the x- and y-components of the vector to 0.
	 */
	public reset(): void {
		this.set();
	}

	/**
	 * Sets the point to a new x and y position.
	 * If y is omitted, both x and y will be set to x.
	 */
	public set(x: number, y: number): this;
	public set(value?: number): this;
	public set(x: number = 0, y?: number): this {
		this.xy = [x, y ?? x];
		this.fromObject?.set(x, y);
		return this;
	}

	/**
	 * Returns true if both X & Y are greater than the other vector.
	 * @param other - The vector to compare with.
	 * @returns - Are both X & Y greater than the other vector.
	 */
	public greaterThan(other: PIXI.IPointData): boolean {
		return this.x > other.x && this.y > other.y;
	}

	/**
	 * Returns the distance from the vector to the origin.
	 */
	public length(): number {
		return Math.sqrt(this.squaredLength());
	}

	/**
	 * Returns the distance from the vector to the origin, squared.
	 */
	public squaredLength(): number {
		return this.x ** 2 + this.y ** 2;
	}

	/**
	 * Adds two vectors together.
	 * If no dest vector is specified, the operation is performed in-place.
	 * @param vector - The vector to add.
	 * @param dest - An optional destination.
	 * @returns - The vector added.
	 */
	public add(vector: PIXI.IPointData, dest?: ObservableVector2): ObservableVector2 {
		if (!dest) dest = this;
		dest.set(this.x + vector.x, this.y + vector.y);
		return dest;
	}

	/**
	 * Subtracts one vector from another.
	 * If no dest vector is specified, the operation is performed in-place.
	 * @param vector - The vector to subtract with.
	 * @param dest - An optional destination.
	 * @returns - The vector subtracted.
	 */
	public subtract(vector: PIXI.IPointData, dest?: ObservableVector2): ObservableVector2 {
		if (!dest) dest = this;
		dest.set(this.x - vector.x, this.y - vector.y);
		return dest;
	}

	/**
	 * Multiplies two vectors together piecewise.
	 * If no dest vector is specified, the operation is performed in-place.
	 * @param vector - The vector to multiply with.
	 * @param dest - An optional destination.
	 * @returns - The vector multiplied.
	 */
	public multiply(vector: PIXI.IPointData, dest?: ObservableVector2): ObservableVector2 {
		if (!dest) dest = this;
		dest.set(this.x * vector.x, this.y * vector.y);
		return dest;
	}

	/**
	 * Divides two vectors piecewise.
	 * @param vector - The vector to divide with.
	 * @param dest - An optional destination.
	 * @returns - The vector divided.
	 */
	public divide(vector: PIXI.IPointData, dest?: ObservableVector2): ObservableVector2 {
		if (!dest) dest = this;
		dest.set(this.x / vector.x, this.y / vector.y);
		return dest;
	}

	/**
	 * Scales a vector by a scalar parameter.
	 * If no dest vector is specified, the operation is performed in-place.
	 * @param value - The value to multiply the values to.
	 * @param dest - An optional destination.
	 * @returns - The vector scaled.
	 */
	public scale(value: number, dest?: ObservableVector2): ObservableVector2 {
		if (!dest) dest = this;
		dest.set(this.x * value, this.y * value);
		return dest;
	}

	/**
	 * Normalizes a vector.
	 * If no dest vector is specified, the operation is performed in-place.
	 *
	 * @param dest - An optional destination.
	 * @returns - The vector normalized.
	 */
	public normalize(dest?: ObservableVector2): ObservableVector2 {
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

	public toString(): string {
		return `(${this.x}, ${this.y})`;
	}

	/**
	 * Multiplies both the x- and y-components of a vector by -1.
	 * If no dest vector is specified, the operation is performed in-place.
	 * @param dest - An optional destination.
	 * @returns - The vector negated.
	 */
	public negate(dest?: ObservableVector2): ObservableVector2 {
		if (!dest) dest = this;
		dest.set(-this.x, -this.y);
		this.fromObject?.copyFrom(dest);
		return dest;
	}

	public clone(cb = this.cb, scope = this.scope) {
		return new ObservableVector2<T>(cb, scope, this._x, this._y, this.fromObject);
	}

	public deepClone() {
		const xy = this.xy.slice();
		return new ObservableVector2<T>(this.cb, this.scope, ...xy);
	}

	public toJSON() {
		return this.toVector().toJSON();
	}

	/**
	 * Convert this to a ObservableVector2.
	 * @returns - The ObservableVector2.
	 */
	public toVector(): Vector2 {
		return new Vector2(this._x, this._y);
	}
}
