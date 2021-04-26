import * as PIXI from 'pixi.js';
import {ObservableVector2, Rectangle} from '../maths';
import {getTextureOrThrow, TextureOrName} from '../textures';
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

	public get position(): ObservableVector2 {
		return ObservableVector2.fromPoint(this.transform.position);
	}

	public set position(value: ObservableVector2) {
		this.transform.position.copyFrom(value);
	}

	public constructor(texture: TextureOrName) {
		if (typeof texture === 'string') texture = getTextureOrThrow(texture);
		super(texture);
	}

	public hide() {
		this.visible = false;
	}

	public show() {
		this.visible = true;
	}

	public addToApplication(application: PIXI.Application) {
		application.stage.addChild(this);
	}

	public removeFromApplication(application: PIXI.Application) {
		application.stage.removeChild(this);
	}
}
