export function uuidV4(): string {
	const randomBytes = crypto.getRandomValues(new Uint8Array(16));

	randomBytes[6] = (randomBytes[6] & 0x0f) | 0x40; // Version 4
	randomBytes[8] = (randomBytes[8] & 0x3f) | 0x80; // Variant 10

	return bytesToUuid(randomBytes);
}

export function bytesToUuid(bytes: number[] | Uint8Array): string {
	const bits = [...bytes].map((bit: number) => {
		const s = bit.toString(16);
		return bit < 0x10 ? `0${s}` : s;
	});
	return [...bits.slice(0, 4), '-', ...bits.slice(4, 6), '-', ...bits.slice(6, 8), '-', ...bits.slice(8, 10), '-', ...bits.slice(10, 16)].join('');
}

export function random(max: number, toInt?: boolean): number;
export function random(min: number, max: number, toInt?: boolean): number;
export function random<T>(array: T[]): T;
export function random<T>(arg: T[] | number, arg2?: number | boolean, toInt?: boolean): T | number {
	if (arg instanceof Array) return randomArray(arg);
	if (typeof arg2 === 'number') return toInt ? (arg2 ? randomInt(arg, arg2) : randomInt(arg)) : arg2 ? randomFloat(arg, arg2) : randomFloat(arg);
	return arg2 ? randomInt(arg) : randomFloat(arg);
}

export function randomArray<T>(array: T[]): T {
	return array[randomInt(array.length - 1)];
}

export function randomFloat(max: number): number;
export function randomFloat(min: number, max: number): number;
export function randomFloat(min: number = 0, max?: number): number {
	return !max ? Math.random() * min : Math.random() * (max - min) + min;
}

export function randomInt(max: number): number;
export function randomInt(min: number, max: number): number;
export function randomInt(min: number = 0, max?: number): number {
	return Math.floor(max ? randomFloat(min, max + 1) : randomFloat(min + 1));
}
