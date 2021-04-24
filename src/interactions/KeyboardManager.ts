import {EventEmitter} from '../utils';

type Key = KeyboardEvent['key'];
type KeyboardEvents = {
	/**
	 * Emitted when a key is released.
	 */
	up: [Key];
	/**
	 * Emitted when a key is pressed.
	 */
	down: [Key];
};

/**
 * The Set of keys that are actually pressed.
 */
export const pressed: Set<string> = new Set();

/**
 * The EventEmitter to watch the KeyBoard.
 * @type {EventEmitter<KeyboardEvents>}
 */
export const events: EventEmitter<KeyboardEvents> = new EventEmitter();

/**
 * Test if a key is pressed.
 * @params key - The key to test.
 * @returns - Is pressed.
 */
export function isPressed(key: Key): boolean {
	return pressed.has(key);
}

function onKeyDown(e: KeyboardEvent) {
	if (!isPressed(e.key)) events.emit('down', e.key);
	pressed.add(e.key);
}

function onKeyUp(e: KeyboardEvent) {
	if (isPressed(e.key)) events.emit('up', e.key);
	pressed.delete(e.key);
}

window.onkeydown = onKeyDown;
window.onkeyup = onKeyUp;
