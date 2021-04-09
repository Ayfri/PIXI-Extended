export function uuidV4(): string {
	const randomBytes = crypto.getRandomValues(new Uint8Array(16));

	randomBytes[6] = (randomBytes[6] & 0x0f) | 0x40; // Version 4
	randomBytes[8] = (randomBytes[8] & 0x3f) | 0x80; // Variant 10

	return bytesToUuid(randomBytes);
}

export function bytesToUuid(bytes: number[] | Uint8Array): string {
	const bits = [...bytes].map(bit => {
		const s = bit.toString(16);
		return bit < 0x10 ? '0' + s : s;
	});
	return [...bits.slice(0, 4), '-', ...bits.slice(4, 6), '-', ...bits.slice(6, 8), '-', ...bits.slice(8, 10), '-', ...bits.slice(10, 16)].join('');
}
