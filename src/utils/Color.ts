import {EventEmitter} from './EventEmitter';

export type ColorEvents = {
	change: [red: number, green: number, blue: number, alpha: number];
	redChange: [value: number];
	greenChange: [value: number];
	blueChange: [value: number];
	alphaChange: [value: number];
};

export type RGB = [red: number, green: number, blue: number];
export type RGBA = [red: number, green: number, blue: number, alpha: number];

export class Color extends EventEmitter<ColorEvents> {
	public static readonly BLACK: Color = new Color();
	public static readonly RED: Color = new Color(1, 0, 0);
	public static readonly GREEN: Color = new Color(0, 1, 0);
	public static readonly BLUE: Color = new Color(0, 0, 1);
	public static readonly WHITE: Color = new Color(1, 1, 1);

	public constructor(red: number = 0, green: number = 0, blue: number = 0, alpha: number = 1) {
		super();
		this._alpha = alpha;
		this._blue = blue;
		this._green = green;
		this._red = red;
	}

	public get rgba(): RGBA {
		return [...this.rgb, this.alpha];
	}

	public set rgba(value: RGBA) {
		this.set(...value);
	}

	public get rgb(): RGB {
		return [this._red, this._green, this._blue];
	}

	public set rgb(value: RGB) {
		this.set(...value);
	}

	private _red: number = 0;

	public get red(): number {
		return this._red;
	}

	public set red(value: number) {
		this._red = value;
		this.emit('redChange', value);
		this.emit('change', this._red, this._blue, this._green, this._alpha);
	}

	private _green: number = 0;

	public get green(): number {
		return this._green;
	}

	public set green(value: number) {
		this._green = value;
		this.emit('greenChange', value);
		this.emit('change', this._red, this._blue, this._green, this._alpha);
	}

	private _blue: number = 0;

	public get blue(): number {
		return this._blue;
	}

	public set blue(value: number) {
		this._blue = value;
		this.emit('blueChange', value);
		this.emit('change', this._red, this._blue, this._green, this._alpha);
	}

	private _alpha: number = 1;

	public get alpha(): number {
		return this._alpha;
	}

	public set alpha(value: number) {
		this._alpha = value;
		this.emit('alphaChange', value);
		this.emit('change', this._red, this._blue, this._green, this._alpha);
	}

	public static random(): Color;
	public static random(alpha: boolean): Color;
	public static random(alpha: boolean = false): Color {
		return new Color(Math.random(), Math.random(), Math.random(), alpha ? Math.random() : 1);
	}

	public static invert(color: Color): Color {
		return new Color(-color._red + 1, -color._green + 1, -color._blue + 1, color._alpha);
	}

	public static toHex(color: Color): number {
		return ((color.red * 255) << 16) | ((color.green * 255) << 8) | (color.blue * 255);
	}

	public static toHexString(color: Color): `#${string}` {
		return `#${color.toHex().toString(16)}`;
	}

	public static fromHexString(hexString: `#${string}`, alpha?: number): Color {
		const color = Number.parseInt(hexString.replace(/^#/, ''), 16);
		const r = ((color >> 16) & 0xff) / 255;
		const g = ((color >> 8) & 0xff) / 255;
		const b = (color & 0xff) / 255;

		return new Color(r, g, b, alpha);
	}

	public static fromHex(hex: number, alpha?: number): Color {
		return Color.fromHexString(`#${hex.toString(16)}`, alpha);
	}

	public toHexString(): string {
		return Color.toHexString(this);
	}

	public set(red?: number, green?: number, blue?: number, alpha?: number) {
		if (red) this.red = red;
		if (green) this.green = green;
		if (blue) this.blue = blue;
		if (alpha) this.alpha = alpha;
	}

	public toHex(): number {
		return Color.toHex(this);
	}

	public invert(): Color {
		return Color.invert(this);
	}
}
