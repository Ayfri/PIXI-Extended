import * as PIXI from 'pixi.js';
import {InteractionManager} from 'pixi.js';
import {Vector2} from '../maths';
import {EventEmitter} from '../utils';

/**
 * The set of buttons created.
 */
export const buttons = new Set<Button>();
/**
 * The events that can occurs on any Button.
 */
export type ButtonEvent = 'down' | 'up' | 'dblclick';

/**
 * The list of buttons that can exist.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button#return_value}.
 */
export enum Buttons {
	/**
	 * Main button pressed, usually the left button or the un-initialized state.
	 */
	LeftButton = 0,
	/**
	 * Auxiliary button pressed, usually the wheel button or the middle button (if present).
	 */
	WheelButton = 1,
	/**
	 * Auxiliary button pressed, usually the wheel button or the middle button (if present).
	 */
	MiddleButton = 1,
	/**
	 * Secondary button pressed, usually the right button.
	 */
	RightButton = 2,
	/**
	 * Fourth button, typically the Browser Back button.
	 */
	BackButton = 3,
	/**
	 * Fifth button, typically the Browser Forward button.
	 */
	ForwardButton = 4,
}

export class Button extends EventEmitter<Record<ButtonEvent, [event?: MouseEvent, duration?: number]>> {
	private _pressedAt: number = 0;
	private _isPressed: boolean = false;

	public constructor(public readonly id: Buttons | MouseEvent['button']) {
		super();
		buttons.add(this);
	}

	public get isPressed(): boolean {
		return this._isPressed;
	}

	public get duration(): number {
		if (!this._isPressed) return 0;
		return Date.now() - this._pressedAt;
	}

	/**
	 * @internal
	 */
	public handle(event: MouseEvent, action: ButtonEvent) {
		this.emit(action, event, this.duration);
		if (action === 'down') {
			this._isPressed = true;
			this._pressedAt = Date.now();
		} else {
			this._isPressed = false;
		}
	}

	/**
	 * @internal
	 */
	public isMineEvent(event: MouseEvent): boolean {
		return event.button === this.id;
	}
}

/**
 * The LeftClick button handler, usually used.
 */
export const LeftClick = new Button(Buttons.LeftButton);
/**
 * The RightClick button handler, usually used.
 */
export const RightClick = new Button(Buttons.RightButton);
/**
 * The actual position of the mouse.
 * @remarks You have to use {@link updateMousePosition} every time you want to update this value.
 */
export const mousePosition = new Vector2();

/**
 * Update the {@link mousePosition} values. Returns the mouse position itself.
 *
 * @param app - The PIXI Application to get the mouse from.
 * @returns - The mouse position itself.
 */
export function updateMousePosition(app: PIXI.Application) {
	return mousePosition.copyFrom((app.renderer.plugins.interaction as InteractionManager).mouse.global);
}

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
