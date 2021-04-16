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

		super(x, y, width, height);
	}

	public get halfX(): number {
		return this.width / 2;
	}

	public get halfY(): number {
		return this.height / 2;
	}

	public static fromSprite(sprite: Sprite): Rectangle;
	public static fromSprite(sprite: PIXI.Sprite): Rectangle;
	public static fromSprite(sprite: PIXI.Container): Rectangle;
	public static fromSprite(sprite: PIXI.Container | PIXI.Sprite | Sprite): Rectangle {
		return new Rectangle(sprite.x, sprite.y, sprite.width, sprite.height);
	}

	public static fromCoords(x1: number, y1: number, x2: number, y2: number): Rectangle {
		return new Rectangle(x1, y1, x2 - x1, y2 - y1);
	}

	public static fromPoints(point1: PIXI.IPointData, point2: PIXI.IPointData): Rectangle {
		return Rectangle.fromCoords(point1.x, point1.y, point2.x, point2.y);
	}

	public intersect(other: Rectangle): Hit | null {
		return intersectBoxes(this, other);
	}

	public collidesWith(other: Rectangle): boolean {
		const dx = other.x - this.x;
		const px = (other.halfX + this.halfX) - Math.abs(dx);
		if (px <= 0) return false;

		const dy = other.y - this.y;
		const py = (other.halfY + this.halfY) - Math.abs(dy);
		return py > 0;
	}

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
