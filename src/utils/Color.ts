import {EventEmitter} from './EventEmitter';

export type ColorEvents = {
	change: [red: number, green: number, blue: number, alpha: number];
	redChange: [value: number];
	greenChange: [value: number];
	blueChange: [value: number];
	alphaChange: [value: number];
};

/**
 * A type containing RGB (red, green, blue) values as a Tuple.
 */
export type RGB = [red: number, green: number, blue: number];

/**
 * A type containing RGBA (red, green, blue, alpha) values as a Tuple.
 */
export type RGBA = [red: number, green: number, blue: number, alpha: number];

export class Color extends EventEmitter<ColorEvents> {
	public static readonly BLACK: Color = new Color();
	public static readonly RED: Color = new Color(1, 0, 0);
	public static readonly GREEN: Color = new Color(0, 1, 0);
	public static readonly BLUE: Color = new Color(0, 0, 1);
	public static readonly WHITE: Color = new Color(1, 1, 1);

	/**
	 * Creates a new color.
	 *
	 * @remarks Values can only go up to 1.
	 *
	 * @param red - The red value of the color, from 0 to 1.
	 * @param green - The green value of the color, from 0 to 1.
	 * @param blue - The blue value of the color, from 0 to 1.
	 * @param alpha - The alpha value of the color, from 0 to 1, default to 1.
	 */
	public constructor(red: number = 0, green: number = 0, blue: number = 0, alpha: number = 1) {
		super();
		this._alpha = alpha;
		this._blue = blue;
		this._green = green;
		this._red = red;
	}

	/**
	 * Returns an array containing the red, green, blue and alpha values.
	 *
	 * @returns - The array.
	 */
	public get rgba(): RGBA {
		return [...this.rgb, this.alpha];
	}

	/**
	 * Set the red, green, blue and alpha values from an array of these.
	 *
	 * @param value - The array.
	 */
	public set rgba(value: RGBA) {
		this.set(...value);
	}

	/**
	 * Returns an array containing the red, green and blue values.
	 *
	 * @returns - The array.
	 */
	public get rgb(): RGB {
		return [this._red, this._green, this._blue];
	}

	/**
	 * Set the red, green and blue values from an array of these.
	 *
	 * @param value - The array.
	 */
	public set rgb(value: RGB) {
		this.set(...value);
	}

	private _red: number = 0;

	/**
	 * Get the red value.
	 *
	 * @returns - The value, can only be from 0 up to 1.
	 */
	public get red(): number {
		return this._red;
	}

	/**
	 * Set the red value, emit the 'redChange' and 'change' events for the color.
	 *
	 * @param value - The value, can only be form 0 up to 1.
	 */
	public set red(value: number) {
		this._red = value;
		this.emit('redChange', value);
		this.emit('change', this._red, this._blue, this._green, this._alpha);
	}

	private _green: number = 0;

	/**
	 * Get the green value.
	 *
	 * @returns - The value, can only be from 0 up to 1.
	 */
	public get green(): number {
		return this._green;
	}

	/**
	 * Set the green value, emit the 'greenChange' and 'change' events for the color.
	 *
	 * @param value - The value, can only be form 0 up to 1.
	 */
	public set green(value: number) {
		this._green = value;
		this.emit('greenChange', value);
		this.emit('change', this._red, this._blue, this._green, this._alpha);
	}

	private _blue: number = 0;

	/**
	 * Get the blue value.
	 *
	 * @returns - The value, can only be from 0 up to 1.
	 */
	public get blue(): number {
		return this._blue;
	}

	/**
	 * Set the blue value, emit the 'blueChange' and 'change' events for the color.
	 *
	 * @param value - The value, can only be form 0 up to 1.
	 */
	public set blue(value: number) {
		this._blue = value;
		this.emit('blueChange', value);
		this.emit('change', this._red, this._blue, this._green, this._alpha);
	}

	private _alpha: number = 1;

	/**
	 * Get the alpha value.
	 *
	 * @remarks Alpha is the opacity, 1 means full visible, 0 means transparent.
	 *
	 * @returns - The value, can only be from 0 up to 1.
	 */
	public get alpha(): number {
		return this._alpha;
	}

	/**
	 * Set the alpha value, emit the 'alphaChange' and 'change' events for the color.
	 *
	 * @remarks Alpha is the transparency.
	 *
	 * @param value - The value, can only be form 0 up to 1.
	 */
	public set alpha(value: number) {
		this._alpha = value;
		this.emit('alphaChange', value);
		this.emit('change', this._red, this._blue, this._green, this._alpha);
	}

	public static random(): Color;
	public static random(alpha: boolean): Color;
	/**
	 * Generates a random color.
	 *
	 * @param alpha - Set this parameter to `true` to also have a random transparency.
	 * @returns - The resulting color.
	 */
	public static random(alpha: boolean = false): Color {
		return new Color(Math.random(), Math.random(), Math.random(), alpha ? Math.random() : 1);
	}

	/**
	 * Inverts a color returning its negative forme.
	 *
	 * @example
	 * Color.invert(Color.WHITE) === Color.BLACK;
	 *
	 * @param color - The color to invert.
	 * @returns - The resulting color.
	 */
	public static invert(color: Color): Color {
		return new Color(-color._red + 1, -color._green + 1, -color._blue + 1, color._alpha);
	}

	/**
	 * Transforms a color to its hexadecimal form.
	 *
	 * @example
	 * Color.toHex(Color.RED) === 0xff0000
	 *
	 * @param color - The color to get its hexadecimal form.
	 * @returns - The resulting hexadecimal number.
	 */
	public static toHex(color: Color): number {
		return ((color.red * 255) << 16) | ((color.green * 255) << 8) | (color.blue * 255);
	}

	/**
	 * Transforms a color to its stringed hexadecimal form.
	 *
	 * @example
	 * Color.toHex(Color.BLUE) === "#0000ff"
	 *
	 * @param color - The color to get its stringed hexadecimal form.
	 * @returns - The resulting stringed hexadecimal form.
	 */
	public static toHexString(color: Color): `#${string}` {
		return `#${color.toHex().toString(16)}`;
	}

	/**
	 * Creates a color from a stringed hexadecimal form.
	 *
	 * @example
	 * Color.fromHexString("#00ff00") === Color.GREEN
	 *
	 * @param hexString - The stringed hexadecimal form of your color.
	 * @param alpha - The alpha value of the color, defaults to 1.
	 * @returns - The resulting color.
	 */
	public static fromHexString(hexString: string | `#${string}`, alpha?: number): Color {
		const color = Number.parseInt(hexString.replace(/^#/, ''), 16);
		const r = ((color >> 16) & 0xff) / 255;
		const g = ((color >> 8) & 0xff) / 255;
		const b = (color & 0xff) / 255;

		return new Color(r, g, b, alpha);
	}

	/**
	 * Creates a color from a hexadecimal form.
	 *
	 * @example
	 * Color.fromHex(0x000000) === Color.BLACK
	 *
	 * @param hex - The hexadecimal form of your color.
	 * @param alpha - The alpha value of the color, defaults to 1.
	 * @returns - The resulting color.
	 */
	public static fromHex(hex: number, alpha?: number): Color {
		return Color.fromHexString(`#${hex.toString(16)}`, alpha);
	}

	/**
	 * Transforms the color to its stringed hexadecimal form.
	 *
	 * @example
	 * Color.BLUE.toHexString() === "#0000ff"
	 *
	 * @returns - The resulting stringed hexadecimal form.
	 */
	public toHexString(): string {
		return Color.toHexString(this);
	}

	/**
	 * Sets the values of the color.
	 *
	 * @param red - The red value.
	 * @param green - The green value.
	 * @param blue - The blue value.
	 * @param alpha - The alpha value.
	 */
	public set(red?: number, green?: number, blue?: number, alpha?: number) {
		if (red) this.red = red;
		if (green) this.green = green;
		if (blue) this.blue = blue;
		if (alpha) this.alpha = alpha;
	}

	/**
	 * Transforms the color to its hexadecimal form.
	 *
	 * @example
	 * Color.RED.toHex() === 0xff0000
	 *
	 * @returns - The resulting hexadecimal number.
	 */
	public toHex(): number {
		return Color.toHex(this);
	}

	/**
	 * Inverts the color returning its negative forme.
	 *
	 * @example
	 * Color.WHITE.invert() === Color.BLACK;
	 *
	 * @returns - The resulting color.
	 */
	public invert(): Color {
		return Color.invert(this);
	}
}
