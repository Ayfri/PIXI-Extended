import * as PIXI from 'pixi.js';
import {TextureOrName} from '../textures';
import {Color} from '../utils';
import {Container} from './Container';
import {Sprite} from './Sprite';

export interface TextOptions {
	background?: TextureOrName;
	color?: Color;
	style?: Partial<PIXI.TextStyle>;
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
		let color: Color | undefined;
		if (typeof text !== 'string') {
			content = text?.text ?? '';
			background = text?.background ?? text?.whiteBackground ? PIXI.Texture.WHITE : PIXI.Texture.EMPTY;
			color = text?.color;
		} else {
			content = text ?? '';
			background = options?.background ?? options?.background ? PIXI.Texture.WHITE : PIXI.Texture.EMPTY;
			color = options?.color;
		}

		this.background = new Sprite(background);
		this.textObject = new PIXI.Text(content, options?.style);
		if (color) this.color = color;
		this.addChild(this.textObject);
	}

	/**
	 * Get the metrics of the text.
	 * @see http://pixijs.download/dev-fix-utils-docs/docs/PIXI.TextMetrics.html
	 *
	 * @returns {PIXI.TextMetrics}
	 */
	public get metrics(): PIXI.TextMetrics {
		return PIXI.TextMetrics.measureText(this.text, new PIXI.TextStyle(this.textObject.style));
	}

	/**
	 * Get the color of the text, as a Color, an array of Color, or a CanvasGradiant/CanvasPattern.
	 * @returns - The resulting color.
	 */
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

	/**
	 * Sets the color of the text, as a Color, an array of Color, or a CanvasGradiant/CanvasPattern.
	 * @param color - The new color to set.
	 */
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
