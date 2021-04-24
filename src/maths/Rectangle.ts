import * as PIXI from 'pixi.js';
import {Sprite} from '../sprites';
import {Hit, intersectBoxes} from './CollisionsUtils';
import {clamp} from './utils';
import {Vector2} from './Vector2';

interface RectangleOptions {
	x?: number;
	y?: number;
	width?: number;
	height?: number;
}

export class Rectangle extends PIXI.Rectangle {
	constructor(options?: RectangleOptions);
	constructor(x?: number, y?: number, width?: number, height?: number);
	constructor(x?: number | RectangleOptions, y?: number, width?: number, height?: number) {
		if (x && typeof x !== 'number') {
			height = x.height;
			width = x.width;
			y = x.y;
			x = x.x;
		}

		super(x as number | undefined, y, width, height);
	}

	/**
	 * Returns the center of this Rectangle on the X axis.
	 * @returns - Half of the width.
	 */
	public get halfX(): number {
		return this.width / 2;
	}

	/**
	 * Returns the center of this Rectangle on the Y axis.
	 * @returns - Half of the height.
	 */
	public get halfY(): number {
		return this.height / 2;
	}

	public static fromSprite(sprite: PIXI.Sprite): Rectangle;
	public static fromSprite(container: PIXI.Container): Rectangle;
	/**
	 * Create a rectangle from a Sprite or a Container.
	 * @param object - The object to create a Rectangle from.
	 * @returns - The resulting Rectangle.
	 */
	public static fromSprite(object: PIXI.Container | PIXI.Sprite): Rectangle {
		return new Rectangle(object.x, object.y, object.width, object.height);
	}

	/**
	 * Create a rectangle from a set of 4 points.
	 * @param x1
	 * @param y1
	 * @param x2
	 * @param y2
	 * @returns - The resulting rectangle.
	 */
	public static fromCoords(x1: number, y1: number, x2: number, y2: number): Rectangle {
		return new Rectangle(x1, y1, x2 - x1, y2 - y1);
	}

	/**
	 * Create a rectangle from two sets of points.
	 * @param point1 - First set of points, x1 & y1.
	 * @param point2 - Second set of points, x2 & y2.
	 * @returns - The resulting Rectangle.
	 */
	public static fromPoints(point1: PIXI.IPointData, point2: PIXI.IPointData): Rectangle {
		return Rectangle.fromCoords(point1.x, point1.y, point2.x, point2.y);
	}

	/**
	 * Test if this Rectangle intersect with another Rectangle.
	 * @param other - The other rectangle.
	 * @returns The Hit result or null if not intersecting.
	 */
	public intersect(other: Rectangle): Hit | null {
		return intersectBoxes(this, other);
	}

	/**
	 * Test if this Rectangle collides with another Rectangle.
	 * @param other - The other rectangle.
	 * @returns - If the rectangles collides.
	 */
	public collidesWith(other: Rectangle): boolean {
		const dx = other.x - this.x;
		const px = other.halfX + this.halfX - Math.abs(dx);
		if (px <= 0) return false;

		const dy = other.y - this.y;
		const py = other.halfY + this.halfY - Math.abs(dy);
		return py > 0;
	}

	/**
	 * Test if a segment intersect with this Rectangle.
	 * @param position - Start of the segment.
	 * @param delta - End of the segment.
	 * @param paddingX - Padding X to add to this Rectangle.
	 * @param paddingY - Padding Y to add to this Rectangle.
	 * @returns - The Hit result or null if not intersecting.
	 */
	public intersectSegment(position: Vector2, delta: Vector2, paddingX: number = 0, paddingY: number = 0): Hit | null {
		const scaleX = 1.0 / delta.x;
		const scaleY = 1.0 / delta.y;
		const signX = Math.sign(scaleX);
		const signY = Math.sign(scaleY);
		const nearTimeX = (this.x - signX * (this.halfX + paddingX) - position.x) * scaleX;
		const nearTimeY = (this.y - signY * (this.halfY + paddingY) - position.y) * scaleY;
		const farTimeX = (this.x + signX * (this.halfX + paddingX) - position.x) * scaleX;
		const farTimeY = (this.y + signY * (this.halfY + paddingY) - position.y) * scaleY;

		if (nearTimeX > farTimeY || nearTimeY > farTimeX) return null;

		const nearTime = nearTimeX > nearTimeY ? nearTimeX : nearTimeY;
		const farTime = farTimeX < farTimeY ? farTimeX : farTimeY;

		if (nearTime >= 1 || farTime <= 0) return null;
		const hit = new Hit(this);
		hit.time = clamp(nearTime, 0, 1);
		if (nearTimeX > nearTimeY) {
			hit.normal.x = -signX;
			hit.normal.y = 0;
		} else {
			hit.normal.x = 0;
			hit.normal.y = -signY;
		}
		hit.delta.x = (1.0 - hit.time) * -delta.x;
		hit.delta.y = (1.0 - hit.time) * -delta.y;
		hit.position.x = position.x + delta.x * hit.time;
		hit.position.y = position.y + delta.y * hit.time;
		return hit;
	}
}
