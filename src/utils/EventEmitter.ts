import * as PIXI from 'pixi.js';

type EventList = Record<string, any[]>;

export class EventEmitter<Events extends EventList> extends PIXI.utils.EventEmitter {
	public emit<K extends keyof Events & string>(event: K, ...args: Events[K]): boolean {
		return super.emit(event, ...args);
	}

	public on<K extends keyof Events & string>(event: K, fn: (...params: Events[K]) => void, context?: any): this {
		return super.on(event, fn as (...args: any[]) => void, context);
	}

	public once<K extends keyof Events & string>(event: K, fn: (...params: Events[K]) => void, context?: any): this {
		return super.once(event, fn as (...args: any[]) => void, context);
	}
}
