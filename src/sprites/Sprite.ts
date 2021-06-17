import * as PIXI from 'pixi.js';
import {collisionBoxes, intersect, ObservableVector2, Rectangle, Vector2} from '../maths';
import {getColoredTexture, getTextureOrThrow, TextureOrName} from '../textures';
import {Color, EventEmitter} from '../utils';

export type SpriteEvents = {
	added: [container: PIXI.Container];
	click: [event: PIXI.InteractionEvent];
	mousedown: [event: PIXI.InteractionEvent];
	mousemove: [event: PIXI.InteractionEvent];
	mouseout: [event: PIXI.InteractionEvent];
	mouseover: [event: PIXI.InteractionEvent];
	mouseup: [event: PIXI.InteractionEvent];
	mouseupoutside: [event: PIXI.InteractionEvent];
	pointercancel: [event: PIXI.InteractionEvent];
	pointerdown: [event: PIXI.InteractionEvent];
	pointermove: [event: PIXI.InteractionEvent];
	pointerout: [event: PIXI.InteractionEvent];
	pointerover: [event: PIXI.InteractionEvent];
	pointertap: [event: PIXI.InteractionEvent];
	pointerup: [event: PIXI.InteractionEvent];
	pointerupoutside: [event: PIXI.InteractionEvent];
	removed: [container: PIXI.Container];
	removedFrom: [child: PIXI.DisplayObject, container: PIXI.Container, index: number];
	rightclick: [event: PIXI.InteractionEvent];
	rightdown: [event: PIXI.InteractionEvent];
	rightup: [event: PIXI.InteractionEvent];
	rightupoutside: [event: PIXI.InteractionEvent];
	tap: [event: PIXI.InteractionEvent];
	touchcancel: [event: PIXI.InteractionEvent];
	touchend: [event: PIXI.InteractionEvent];
	touchendoutside: [event: PIXI.InteractionEvent];
	touchmove: [event: PIXI.InteractionEvent];
	touchstart: [event: PIXI.InteractionEvent];
};

export interface Sprite {
	emit: EventEmitter.Emit<SpriteEvents>;
	on: EventEmitter.On<SpriteEvents, this>;
	once: EventEmitter.Once<SpriteEvents, this>;
}

export class Sprite extends PIXI.Sprite {
	/**
	 * Creates a new Sprite.
	 *
	 * @remarks If a string is passed for the texture argument, it will search in the {@link loadedTexturesNames} and throw an error if not found.
	 * @param texture - The texture of the sprite, can be its name or itself.
	 */
	public constructor(texture: TextureOrName) {
		if (typeof texture === 'string') texture = getTextureOrThrow(texture);
		if (!texture) throw new ReferenceError('texture not specified');
		super(texture);
	}

	public get destroyed(): boolean {
		return this._destroyed;
	}

	/**
	 * Returns a readonly Rectangle with the coordinates of the sprite and the width/height of the sprite.
	 *
	 * @remarks Expensive object, avoid using it in an update function, prefer using {@link Sprite#collidesWith} if you want to test collisions.
	 * @returns - The resulting rectangle.
	 */
	public get hitBox(): Readonly<Rectangle> {
		return Rectangle.fromSprite(this);
	}

	public get color(): Color {
		return Color.fromHex(this.tint, this.alpha);
	}

	public set color(value: Color) {
		this.tint = value.toHex();
		this.alpha = value.alpha;
	}

	public override get position(): ObservableVector2 {
		return ObservableVector2.fromPoint(this.transform.position);
	}

	public override set position(value: ObservableVector2) {
		this.transform.position.copyFrom(value);
	}

	public static fromColor(application: PIXI.Application, color: Color, size?: Vector2) {
		return new Sprite(
			getColoredTexture(application, {
				color,
				width: size?.x,
				height: size?.y,
			})
		);
	}

	public hide() {
		this.visible = false;
	}

	public show() {
		this.visible = true;
	}

	/**
	 * Test if this sprite collides with another sprite.
	 *
	 * @remarks To get more information on this collision, use {@link Sprite#collisionWith}.
	 * @param other - The other sprite.
	 * @returns - True if colliding, else false.
	 */
	public collidesWith(other: PIXI.Container) {
		return intersect(this, other);
	}

	/**
	 * Set the position of the sprite from quotients.
	 *
	 * @example
	 * mySprite.position.set(window.innerWidth / 2, window.innerHeight / 5)
	 * // equals to :
	 * mySprite.setPositionFromWindow(0.5, 0.2)
	 * // use 1 / 2 and 1 / 5 if you want to keep it more comprehensible.
	 *
	 * @param xQuotient - The quotient in the X axis, from 0 up to 1.
	 * @param yQuotient - The quotient in the Y axis, from 0 up to 1.
	 */
	public setPositionFromWindow(xQuotient: number, yQuotient: number) {
		this.position.set(window.innerWidth * xQuotient, window.innerHeight * yQuotient);
	}

	/**
	 * Test if this sprite collides with another sprite.
	 *
	 * @remarks Expensive operation, prefer using {@link Sprite#collidesWith} if you just want to test if the sprite collide.
	 * @param other - The other sprite.
	 * @returns - A hit collision with some information on collision if colliding, else null.
	 */
	public collisionWith(other: PIXI.Container) {
		return collisionBoxes(this, other);
	}

	public addToApplication(application: PIXI.Application) {
		application.stage.addChild(this);
	}

	public removeFromApplication(application: PIXI.Application) {
		application.stage.removeChild(this);
	}
}
