import * as PIXI from "pixi.js";
import {ObservableVector2} from '../maths/Vector2.js';
import {getTextureOrThrow, TextureOrName} from '../textures/TextureManager.js';

export default class Sprite extends PIXI.Sprite {
	get position(): ObservableVector2 {
		return new ObservableVector2(this.transform.position.cb, this.transform.position.scope, this.transform.position.x, this.transform.position.y);
	}

	set position(value: ObservableVector2) {
		this.transform.position = value;
	}

	public constructor(texture: string);
	public constructor(texture: PIXI.Texture);
	public constructor(sprite: TextureOrName) {
		super(typeof sprite === 'string' ? getTextureOrThrow(sprite) : sprite);
	}

	public hide() {
		this.visible = false;
	}

	public show() {
		this.visible = true;
	}
}
