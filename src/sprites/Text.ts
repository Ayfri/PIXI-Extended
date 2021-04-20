import * as PIXI from 'pixi.js';
import {TextureOrName} from '../textures';
import {Color} from '../utils';
import {Container} from './Container';
import {Sprite} from './Sprite';

export interface TextOptions {
	text?: string;
	background?: TextureOrName;
	whiteBackground?: boolean;
	style?: PIXI.TextStyle;
}

export class Text extends Container {
	public textObject: PIXI.Text;
	public background!: Sprite;

	public constructor(options: TextOptions) {
		super();
		this.background = new Sprite(options.background ?? options.whiteBackground ? PIXI.Texture.WHITE : PIXI.Texture.EMPTY);
		this.textObject = new PIXI.Text(options.text ?? '', options.style);
	}

	public get color(): Color {
		return Color.fromHex(this.textObject.tint);
	}

	public set color(value: Color) {
		this.textObject.tint = value.toHex();
	}

	public get backgroundColor(): Color {
		return this.background.color;
	}

	public set backgroundColor(color: Color) {
		this.background.color = color;
	}

	public get text(): string {
		return this.textObject.text;
	}

	public set text(text: string) {
		this.textObject.text = text;
	}
}
