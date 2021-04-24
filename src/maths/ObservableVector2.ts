import * as PIXI from 'pixi.js';
import {Vector2} from './Vector2';

export class ObservableVector2<T = any> implements PIXI.IPoint {
	/**
	 * The callback to call whenever a value change.
	 */
	public cb: (this: T) => any;
	public scope: T;

	constructor(cb: (this: T) => any, scope: T, x = 0, y = 0, private fromObject?: PIXI.ObservablePoint) {
		this._x = x;
		this._y = y;
		this.cb = cb;
		this.scope = scope;
	}

	public get xy(): [x: number, y: number] {
		return [this._x, this._y];
	}

	public set xy(xy: [x: number, y: number]) {
		this.x = xy[0];
		this.y = xy[1];
		this.fromObject?.set(...xy);
	}

	public _x: number;

	public get x(): number {
		return this._x;
	}

	public set x(value: number) {
		if (this.x !== value) {
			this._x = value;
			this.cb.call(this.scope);
			if (this.fromObject) this.fromObject.x = value;
		}
	}

	public _y: number;

	public get y(): number {
		return this._y;
	}

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
	public static fromPoint(point: PIXI.ObservablePoint): ObservableVector2 {
		return new ObservableVector2(point.cb, point.scope, point.x, point.y, point);
	}

	equals(other: PIXI.IPointData, threshold = 0.00001): boolean {
		return Math.abs(this.x - other.x) > threshold ? false : Math.abs(this.y - other.y) <= threshold;
	}

	/**
	 * Copies the x and y components from the source to the destination. The source and destination must be of the same type.
	 * @param {ObservableVector2} src The source point.
	 */
	copyFrom(src: PIXI.IPointData): this {
		this.set(src.x, src.y);
		this.fromObject?.copyFrom(src);
		return this;
	}

	/**
	 * Copies the x and y components from the source to the destination. The source and destination must be of the same type.
	 * @typeParam T The type of your source, can also be a ObservableVector2.
	 * @param {T} p The source point.
	 * @returns {T}
	 */
	copyTo<T extends PIXI.IPointData>(p: T): T {
		p.x = this.x;
		p.y = this.y;
		return p;
	}

	abs(dest?: ObservableVector2): ObservableVector2 {
		if (!dest) dest = this;
		dest.set(Math.abs(this.x), Math.abs(this.y));
		return dest;
	}


	at(index: number): number {
		return this.xy[index];
	}


	reset(): void {
		this.set();
	}


	/**
	 * Set the x and y values.
	 * @param {number} x
	 * @param {number} y
	 * @returns {this}
	 */
	set(x: number, y: number): this;
	set(value?: number): this;
	set(x: number = 0, y?: number): this {
		this.xy = [x, y ?? x];
		this.fromObject?.set(x, y);
		return this;
	}

	greaterThan(other: ObservableVector2): boolean {
		return this.x > other.x && this.y > other.y;
	}

	length(): number {
		return Math.sqrt(this.squaredLength());
	}

	squaredLength(): number {
		return this.x ** 2 + this.y ** 2;
	}

	add(vector: ObservableVector2, dest?: ObservableVector2): ObservableVector2 {
		if (!dest) dest = this;
		dest.set(this.x + vector.x, this.y + vector.y);
		return dest;
	}

	subtract(vector: ObservableVector2, dest?: ObservableVector2): ObservableVector2 {
		if (!dest) dest = this;
		dest.set(this.x - vector.x, this.y - vector.y);
		return dest;
	}

	multiply(vector: ObservableVector2, dest?: ObservableVector2): ObservableVector2 {
		if (!dest) dest = this;
		dest.set(this.x * vector.x, this.y * vector.y);
		return dest;
	}

	divide(vector: ObservableVector2, dest?: ObservableVector2): ObservableVector2 {
		if (!dest) dest = this;
		dest.set(this.x / vector.x, this.y / vector.y);
		return dest;
	}

	scale(value: number, dest?: ObservableVector2): ObservableVector2 {
		if (!dest) dest = this;
		dest.set(this.x * value, this.y * value);
		return dest;
	}

	normalize(dest?: ObservableVector2): ObservableVector2 {
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

	toString(): string {
		return `(${this.x}, ${this.y})`;
	}


	public negate(dest?: ObservableVector2): ObservableVector2 {
		if (!dest) dest = this;
		dest.set(-this.x, -this.y);
		this.fromObject?.copyFrom(dest);
		return dest;
	}

	public clone(cb = this.cb, scope = this.scope) {
		return new ObservableVector2<T>(cb, scope, this._x, this._y, this.fromObject);
	}

	/**
	 * Convert this to a ObservableVector2.
	 * @returns - The ObservableVector2.
	 */
	toVector(): Vector2 {
		return new Vector2(this._x, this._y);
	}
}
