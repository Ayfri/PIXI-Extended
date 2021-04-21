import * as PIXI from 'pixi.js';
import {Text} from '../sprites';

interface FPSCounterOptions {
	autoStart?: boolean;
	presentation?: string;
	priority?: PIXI.UPDATE_PRIORITY;
}

export class FPSCounter extends Text implements FPSCounterOptions {
	public autoStart: boolean;
	public presentation: string = 'FPS: ${count}';
	public priority: PIXI.UPDATE_PRIORITY;
	public ticker: PIXI.Ticker;
	private lastTime: number = Date.now();
	private timeValues: number[] = [];

	public constructor(options: FPSCounterOptions) {
		super({
			text: 'FPS: 60',
		});
		this.ticker = new PIXI.Ticker();
		this.autoStart = options.autoStart ?? true;
		this.priority = options.priority ?? PIXI.UPDATE_PRIORITY.LOW;
		this.ticker.autoStart = this.autoStart;
		this.ticker.add(this.update, undefined, this.priority);
	}

	public get approximate(): number {
		return this.ticker.FPS;
	}

	public get started(): boolean {
		return this.ticker.started;
	}

	public get value(): Promise<number> {
		return new Promise<number>(resolve => {
			const currentTime = Date.now();
			this.timeValues.push(1000 / (currentTime - this.lastTime));
			while (this.timeValues.length === 30) {
				const total = this.timeValues.reduce((p: number, a: number) => p + a);
				this.timeValues = [];
				resolve(total / 30);
			}
			this.lastTime = currentTime;
		});
	}

	public start() {
		this.ticker.start();
	}

	public update() {
		this.setFPS();
	}

	private setFPS(): void {
		const currentTime = Date.now();
		this.timeValues.push(1000 / (currentTime - this.lastTime));
		if (this.timeValues.length === 30) {
			const total = this.timeValues.reduce((p: number, a: number) => p + a);
			this.text = this.presentation.replace('${count}', (total / 30).toFixed(2));
			this.timeValues = [];
		}
		this.lastTime = currentTime;
	}
}
