import {TextureOrName} from '../textures';
import {Color} from '../utils';
import {Sprite} from './Sprite';

export class ColorableSprite extends Sprite {
	public constructor(texture: TextureOrName) {
		super(texture);
		this.color = new Color(1, 1, 1);

		this.color.on('change', (red, green, blue, alpha) => {
			this.tint = new Color(red, green, blue).toHex();
			this.alpha = alpha;
		});
	}
}
