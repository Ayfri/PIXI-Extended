import * as PIXI from 'pixi.js';
import {ContainerEvents, Text} from '../sprites';
import {EventEmitter} from './EventEmitter';
import On = EventEmitter.On;

interface FPSCounterOptions {
	/**
	 * @default true
	 */
	autoStart?: boolean;
	/**
	 * What the counter will show.
	 *
	 * @default 'FPS: ${count}'
	 */
	presentation?: string;
	/**
	 * @default PIXI.UPDATE_PRIORITY.LOW
	 */
	priority?: PIXI.UPDATE_PRIORITY;
	/**
	 * @default 2
	 */
	updatesBySeconds?: number;
}

export type FPSCounterEvents = ContainerEvents & {
	ready: [];
};

export interface FPSCounter {
	emit: EventEmitter.Emit<FPSCounterEvents>;
	on: EventEmitter.On<FPSCounterEvents, this>;
	once: EventEmitter.Once<FPSCounterEvents, this>;
}

export class FPSCounter extends Text implements FPSCounterOptions {
	public autoStart: boolean;
	/**
	 * What the counter will show.
	 *
	 * @remarks use `${count}` to represent the value.
	 * @default 'FPS: ${count}'
	 */
	public presentation: string = 'FPS: ${count}';
	/**
	 * The priority of the FPSCounter.
	 *
	 * @default PIXI.UPDATE_PRIORITY.LOW
	 */
	public priority: PIXI.UPDATE_PRIORITY;
	/**
	 * The number of time to update the FPSCounter per second.
	 *
	 * @remarks Upper values means less precise values.
	 * @default 2
	 */
	public updatesBySeconds: number;
	public ticker: PIXI.Ticker;
	private lastTime: number = Date.now();
	private timeValues: number[] = [];
	private _ready: boolean = false;

	public constructor(options?: FPSCounterOptions) {
		super();
		this.ticker = new PIXI.Ticker();
		this.autoStart = options?.autoStart ?? true;
		this.priority = options?.priority ?? PIXI.UPDATE_PRIORITY.LOW;
		this.updatesBySeconds = options?.updatesBySeconds ?? 2;
		this.ticker.autoStart = this.autoStart;
		this.ticker.add(this.update, this, this.priority);
	}

	public get ready(): boolean {
		return this._ready;
	}

	/**
	 * Returns the approximate value of the FPS.
	 *
	 * @see http://pixijs.download/dev-fix-utils-docs/docs/PIXI.Ticker_.html#FPS
	 *
	 * @returns - The approximate number.
	 */
	public get approximate(): number {
		return this.ticker.FPS;
	}

	/**
	 * Returns true if the FPSCounter is started.
	 *
	 * @returns - The value.
	 */
	public get started(): boolean {
		return this.ticker.started;
	}

	/**
	 * Returns the mean value from the last 30 frames.
	 *
	 * @remarks Only update 2 times per second.
	 *
	 * @returns - The number in a Promise because it is only available 2 times per second.
	 */
	public get value(): Promise<number> {
		return new Promise<number>(resolve => {
			const quotient = 60 / this.updatesBySeconds;
			const currentTime = Date.now();

			this.timeValues.push(1000 / (quotient * 2) / 60 / (currentTime - this.lastTime));
			while (this.timeValues.length === quotient) {
				const total = this.timeValues.reduce((p, a) => p + a);
				this.timeValues = [];
				resolve(total / quotient);
			}
			this.lastTime = currentTime;
		});
	}

	/**
	 * Start the ticker.
	 * @remarks If {@link FPSCounter#autoStart} hasn't been set to `false`, you shouldn't have to use this method.
	 */
	public start() {
		this.ticker.start();
	}

	/**
	 * Update the text.
	 * @remarks If {@link FPSCounter#autoStart} hasn't been set to `false` and/or you have used the {@link FPSCounter#start} method, you shouldn't have to use this method.
	 */
	public update() {
		this.setFPS();
	}

	private setFPS(): void {
		const quotient = 60 / this.updatesBySeconds;
		const currentTime = Date.now();

		this.timeValues.push(1000 / (currentTime - this.lastTime));
		if (this.timeValues.length >= quotient) {
			const total = this.timeValues.reduce((p, a) => p + a);
			this.text = this.presentation.replace(/\${count}/g, (total / quotient).toFixed(2));
			this.timeValues = [];
		}
		this.lastTime = currentTime;
		if (this._ready === false) {
			this.emit('ready');
			this._ready = true;
		}
	}
}
