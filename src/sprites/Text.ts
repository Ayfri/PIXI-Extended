import * as PIXI from 'pixi.js';
import {TextureOrName} from '../textures';
import {Color} from '../utils';
import {Container} from './Container';
import {Sprite} from './Sprite';

export interface TextOptions {
	text?: string;
	background?: TextureOrName;
	style?: PIXI.TextStyle;
	whiteBackground?: boolean;
}

export type TextColor = Color | Color[];

export class Text extends Container {
	public textObject: PIXI.Text;
	public background!: Sprite;

	public constructor(options: TextOptions) {
		super();
		this.background = new Sprite(options.background ?? options.whiteBackground ? PIXI.Texture.WHITE : PIXI.Texture.EMPTY);
		this.textObject = new PIXI.Text(options.text ?? '', options.style);
	}

	public get color(): TextColor | CanvasGradient | CanvasPattern {
		let result: TextColor | CanvasGradient | CanvasPattern;
		const color: PIXI.TextStyleFill = this.textObject.style.fill!;
		if (color instanceof Array) {
			result = color.map((c: string | number) => (typeof c === 'string' ? Color.fromHexString(c) : Color.fromHex(c)));
		} else if (color instanceof CanvasGradient || color instanceof CanvasPattern) {
			result = color;
		} else {
			result = typeof color === 'string' ? Color.fromHexString(color) : Color.fromHex(color);
		}

		return result;
	}

	public set color(color: TextColor | CanvasGradient | CanvasPattern) {
		this.textObject.style.fill = color instanceof Array ? color.map(c => c.toHex()) : color instanceof Color ? color.toHex() : color;
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
