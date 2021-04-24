import * as PIXI from 'pixi.js';
import {EventEmitter} from '../utils';

export const buttons = new Set<Button>();
export type ButtonEvent = 'down' | 'up' | 'dblclick';

export enum Buttons {
	LeftButton = 0,
	WheelButton = 1,
	MiddleButton = 1,
	RightButton = 2,
	BackButton = 3,
	ForwardButton = 4,
}

export class Button extends EventEmitter<Record<ButtonEvent, [event?: MouseEvent, duration?: number]>> {
	private _pressedAt: number = 0;

	constructor(public readonly id: Buttons | MouseEvent['button']) {
		super();
		buttons.add(this);
	}

	private _isPressed: boolean = false;

	get isPressed(): boolean {
		return this._isPressed;
	}

	get duration(): number {
		if (!this._isPressed) return 0;
		return Date.now() - this._pressedAt;
	}

	handle(event: MouseEvent, action: ButtonEvent) {
		this.emit(action, event, this.duration);
		if (action === 'down') {
			this._isPressed = true;
			this._pressedAt = Date.now();
		} else {
			this._isPressed = false;
		}
	}

	isMineEvent(event: MouseEvent): boolean {
		return event.button === this.id;
	}
}

export const LeftClick = new Button(Buttons.LeftButton);
export const RightClick = new Button(Buttons.RightButton);
export const mousePosition: PIXI.Point = new PIXI.Point();

document.addEventListener('mousemove', (event: MouseEvent) => {
	mousePosition.set(event.x, event.y);
});

document.addEventListener('mouseup', (event: MouseEvent) => {
	buttons.forEach(button => {
		if (button.isMineEvent(event)) button.handle(event, 'up');
	});
});

document.addEventListener('mousedown', (event: MouseEvent) => {
	buttons.forEach(button => {
		if (button.isMineEvent(event)) button.handle(event, 'down');
	});
});

document.addEventListener('dblclick', (event: MouseEvent) => {
	buttons.forEach(button => {
		if (button.isMineEvent(event)) button.handle(event, 'dblclick');
	});
});
