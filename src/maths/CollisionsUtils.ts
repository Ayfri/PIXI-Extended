import * as PIXI from 'pixi.js';
import {Rectangle} from './Rectangle';
import {Vector2} from './Vector2';

export function collides(a: PIXI.Container, b: PIXI.Container): Hit | null {
	return intersectBoxes(Rectangle.fromSprite(a), Rectangle.fromSprite(b));
}

export class Hit {
	/**
	 * The point of contact between the two objects (or an estimation of it, in some sweep tests).
	 * @type {Vector2}
	 */
	public position: Vector2;
	/**
	 * The overlap between the two objects, and is a vector that can be added to the colliding object’s position to move it back to a non-colliding state.
	 * @type {Vector2}
	 */
	public delta: Vector2;
	/**
	 * The surface normal at the point of contact.
	 * @type {Vector2}
	 */
	public normal: Vector2;
	/**
	 * Only defined for segment and sweep intersections, and is a fraction from 0 to 1 indicating how far along the line the collision occurred.
	 *
	 * _(This is the **t** value for the line equation **L(t) = A + t(B - A)**)._
	 * @type {number}
	 */
	public time: number;

	constructor(public collider: Rectangle) {
		this.position = new Vector2();
		this.delta = new Vector2();
		this.normal = new Vector2();
		this.time = 0;
	}
}

export function intersectBoxes(box1: Rectangle, box2: Rectangle): Hit | null {
	const dx = box2.x - box1.x;
	const px = (box2.halfX + box1.halfX) - Math.abs(dx);
	if (px <= 0) return null;

	const dy = box2.y - box1.y;
	const py = (box2.halfY + box1.halfY) - Math.abs(dy);
	if (py <= 0) return null;

	const hit = new Hit(box1);
	if (px < py) {
		const sx = Math.sign(dx);
		hit.delta.x = px * sx;
		hit.normal.x = sx;
		hit.position.x = box1.x + (box1.halfX * sx);
		hit.position.y = box2.y;
	} else {
		const sy = Math.sign(dy);
		hit.delta.y = py * sy;
		hit.normal.y = sy;
		hit.position.x = box2.x;
		hit.position.y = box1.y + (box1.halfY * sy);
	}
	return hit;
}
