import * as PIXI from 'pixi.js';
import {getTextureOrThrow, TextureOrName} from '../textures';
import {Color} from '../utils';
import {Sprite} from './Sprite';

export class ColorableSprite extends Sprite {
	public color: Color = new Color(1, 1, 1);
	public constructor(texture: TextureOrName) {
		super(texture);

		this.color.on('change', (red, green, blue, alpha) => {
			this.tint = new Color(red, green, blue).toHex();
			this.alpha = alpha;
		});
	}
}
