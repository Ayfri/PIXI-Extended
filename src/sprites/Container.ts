import * as PIXI from 'pixi.js';
import {ObservableVector2} from '../maths';
import {EventEmitter} from '../utils';
import {SpriteEvents} from './Sprite';

export type ContainerEvents = SpriteEvents & {
	childAdded: [child: PIXI.DisplayObject, container: PIXI.Container, index: number]
};

export interface Container {
	emit: EventEmitter.Emit<ContainerEvents>;
	on: EventEmitter.On<ContainerEvents, this>;
	once: EventEmitter.Once<ContainerEvents, this>;
}

export class Container extends PIXI.Container {
	public constructor() {
		super();
	}

	get position(): ObservableVector2 {
		return new ObservableVector2(this.transform.position.cb, this.transform.position.scope, this.transform.position.x, this.transform.position.y);
	}

	set position(value: ObservableVector2) {
		this.transform.position = value;
	}

	public addToApplication(application: PIXI.Application) {
		application.stage.addChild(this);
	}

	public removeFromApplication(application: PIXI.Application) {
		application.stage.removeChild(this);
	}

	public hide() {
		this.visible = false;
	}

	public show() {
		this.visible = true;
	}
}
