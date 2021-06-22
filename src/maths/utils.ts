/**
 * Returns true if the number is odd.
 *
 * @remarks Use this function with negation to know if a number is even.
 *
 * @param value - The number to test.
 * @returns - Is the number odd.
 */
export function isOdd(value: number): boolean {
	return value % 2 === 0;
}

/**
 * Returns a number whose value is limited to the given range.
 * @param value - The value to clamp.
 * @param min - The lower boundary of the output range.
 * @param max - The upper boundary of the output range.
 * @returns - A number in the range [min, max].
 */
export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

/**
 * Map a number from one range to another.
 * @param value - The value to map.
 * @param min1 - First range minimum.
 * @param max1 - First range maximum.
 * @param min2 - Second range minimum.
 * @param max2 - Second range maximum.
 * @returns - The number mapped.
 */
export function map(value: number, min1: number, max1: number, min2: number, max2: number): number {
	const range1 = max1 - min1;
	const range2 = max2 - min2;
	return ((value - min1) * range2) / range1 + min2;
}
