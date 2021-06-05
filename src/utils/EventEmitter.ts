import * as PIXI from 'pixi.js';

export type EventList = Record<string, any[]>;

export class EventEmitter<Events extends EventList> extends PIXI.utils.EventEmitter {
	public override emit<K extends keyof Events & string>(event: K, ...args: Events[K]): boolean {
		return super.emit(event, ...args);
	}

	public override on<K extends keyof Events & string>(event: K, fn: (...params: Events[K]) => void, context?: any): this {
		return super.on(event, fn as (...args: any[]) => void, context);
	}

	public override once<K extends keyof Events & string>(event: K, fn: (...params: Events[K]) => void, context?: any): this {
		return super.once(event, fn as (...args: any[]) => void, context);
	}
}

export namespace EventEmitter {
	export type Emit<EventTypes extends EventList> = <K extends keyof EventTypes & string>(event: K, ...args: EventTypes[K]) => boolean;
	export type On<EventTypes extends EventList, This> = <K extends keyof EventTypes & string>(event: K, fn: (...params: EventTypes[K]) => void, context?: any) => This;
	export type Once<EventTypes extends EventList, This> = <K extends keyof EventTypes & string>(event: K, fn: (...params: EventTypes[K]) => void, context?: any) => This;
}
