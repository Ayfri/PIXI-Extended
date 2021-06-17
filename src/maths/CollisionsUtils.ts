import {IRectangle, Rectangle} from './Rectangle';
import {Vector2} from './Vector2';

/**
 * Test if two boxes collides.
 *
 * @param first - First box.
 * @param second - Second box.
 * @returns - True if colliding, else false.
 */
export function intersect(first: Required<IRectangle>, second: Required<IRectangle>): boolean {
	return first.x <= second.x + second.width && first.x + first.width >= second.x && first.y <= second.y + second.height && first.y + first.height >= second.y;
}

export class Hit {
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
	 * The point of contact between the two objects (or an estimation of it, in some sweep tests).
	 * @type {Vector2}
	 */
	public position: Vector2;
	/**
	 * Only defined for segment and sweep intersections, and is a fraction from 0 to 1 indicating how far along the line the collision occurred.
	 *
	 * _(This is the **t** value for the line equation **L(t) = A + t(B - A)**)._
	 * @type {number}
	 */
	public time: number = 0;

	public constructor(public collider: Rectangle) {
		this.position = new Vector2();
		this.delta = new Vector2();
		this.normal = new Vector2();
	}
}

/**
 * A function to test a collision and get information if colliding.
 *
 * @remarks Expensive function, if you just want to test collision, prefer using {@link intersect} function.
 * @param box1 - First rectangle.
 * @param box2 - Second rectangle.
 * @returns - The Hit result or `null` it not intersecting.
 */
export function collisionBoxes(box1: Required<IRectangle>, box2: Required<IRectangle>): Hit | null {
	if (box1.x > box2.x + box2.width || box1.x + box1.width < box2.x) return null;
	if (box1.y > box2.y + box2.height || box1.y + box1.height < box2.y) return null;

	const rect1 = Rectangle.fromSprite(box1);
	const rect2 = Rectangle.fromSprite(box2);

	const dx = rect2.x - rect1.x;
	const px = rect2.halfX + rect1.halfX - Math.abs(dx);
	const dy = rect2.y - rect1.y;
	const py = rect2.halfY + rect1.halfY - Math.abs(dy);

	const hit = new Hit(rect1);
	if (px < py) {
		const sx = Math.sign(dx);
		hit.delta.x = px * sx;
		hit.normal.x = sx;
		hit.position.x = rect1.x + rect1.halfX * sx;
		hit.position.y = rect2.y;
	} else {
		const sy = Math.sign(dy);
		hit.delta.y = py * sy;
		hit.normal.y = sy;
		hit.position.x = rect2.x;
		hit.position.y = rect1.y + rect1.halfY * sy;
	}
	return hit;
}
