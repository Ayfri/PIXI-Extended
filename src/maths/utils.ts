export function isOdd(value: number): boolean {
	return value % 2 === 0;
}

export function clamp(value: number, min: number, max: number): number {
	return value < min ? min : value > max ? max : value;
}
