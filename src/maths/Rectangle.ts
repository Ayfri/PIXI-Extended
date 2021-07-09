import * as PIXI from 'pixi.js';
import {collisionBoxes, Hit, intersect} from './CollisionsUtils';
import {clamp} from './utils';
import {Vector2} from './Vector2';

export interface IRectangle {
	height?: number;
	width?: number;
	x?: number;
	y?: number;
}

export class Rectangle extends PIXI.Rectangle {
	public constructor(options?: IRectangle);
	public constructor(x?: number, y?: number, width?: number, height?: number);
	public constructor(x?: number | IRectangle, y?: number, width?: number, height?: number) {
		if (x && typeof x !== 'number') {
			height = x.height;
			width = x.width;
			y = x.y;
			x = x.x;
		}

		super(x as number | undefined, y, width, height);
	}

	public static get WINDOW() {
		return new Rectangle(0, 0, window.innerWidth, window.innerHeight);
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

	public static appRectangle(app: PIXI.Application) {
		return new Rectangle(app.screen);
	}

	/**
	 * Create a rectangle from a Sprite or a Container.
	 * @param object - The object to create a Rectangle from.
	 * @returns - The resulting Rectangle.
	 */
	public static fromSprite(object: PIXI.Container | PIXI.Sprite | Required<IRectangle>): Rectangle {
		let x = object.x;
		let y = object.y;

		if (object instanceof PIXI.Sprite) {
			x += object.width * -object.anchor.x;
			y += object.height * -object.anchor.y;
		}

		return new Rectangle(x, y, object.width, object.height);
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
	 * Test if this Rectangle has a collision with another Rectangle.
	 *
	 * @remarks Expensive function, use {@link Rectangle#collidesWith} to just see if they collide or not.
	 * @param other - The other rectangle.
	 * @returns The Hit result or null if not intersecting.
	 */
	public collisionWith(other: Rectangle): Hit | null {
		return collisionBoxes(this, other);
	}

	/**
	 * Test if this Rectangle collides with another Rectangle.
	 * @param other - The other rectangle.
	 * @returns - If the rectangles collides.
	 */
	public collidesWith(other: Required<IRectangle>): boolean {
		return intersect(this, other);
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
