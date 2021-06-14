import * as PIXI from 'pixi.js';
import {TextureOrName} from '../textures';
import {Color} from '../utils';
import {Container} from './Container';
import {Sprite} from './Sprite';

export interface TextOptions {
	background?: TextureOrName;
	style?: PIXI.TextStyle;
	text?: string;
	whiteBackground?: boolean;
}

export type TextColor = Color | Color[];

export class Text extends Container {
	public override background: Sprite;
	public textObject: PIXI.Text;

	public constructor();
	public constructor(options: TextOptions);
	public constructor(text?: string, options?: Omit<TextOptions, 'text'>);
	public constructor(text?: string | TextOptions, options?: Omit<TextOptions, 'text'>) {
		super();
		let content: string;
		let background: PIXI.Texture;
		if (typeof text !== 'string') {
			content = text?.text ?? '';
			background = text?.background ?? text?.whiteBackground ? PIXI.Texture.WHITE : PIXI.Texture.EMPTY;
		} else {
			content = text ?? '';
			background = options?.background ?? options?.background ? PIXI.Texture.WHITE : PIXI.Texture.EMPTY;
		}

		this.background = new Sprite(background);
		this.textObject = new PIXI.Text(content, options?.style);
		this.addChild(this.textObject);
	}

	public get metrics(): PIXI.TextMetrics {
		return PIXI.TextMetrics.measureText(this.text, new PIXI.TextStyle(this.textObject.style));
	}

	public get color(): TextColor | CanvasGradient | CanvasPattern {
		let result: TextColor | CanvasGradient | CanvasPattern;
		const color = this.textObject.style.fill!;

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
