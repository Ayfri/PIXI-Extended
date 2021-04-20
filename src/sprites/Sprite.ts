import * as PIXI from 'pixi.js';
import {ObservableVector2} from '../maths';
import {getTextureOrThrow, TextureOrName} from '../textures';
import {EventEmitter} from '../utils';

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
	public constructor(texture: string);
	public constructor(texture: PIXI.Texture);
	public constructor(texture: TextureOrName) {
		super(typeof texture === 'string' ? getTextureOrThrow(texture) : texture);
	}

	get position(): ObservableVector2 {
		return new ObservableVector2(this.transform.position.cb, this.transform.position.scope, this.transform.position.x, this.transform.position.y);
	}

	set position(value: ObservableVector2) {
		this.transform.position = value;
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
