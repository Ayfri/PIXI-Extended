import * as PIXI from 'pixi.js';
import {ObservableVector2} from '../maths';
import {TextureOrName} from '../textures';
import {EventEmitter} from '../utils';
import {Sprite, SpriteEvents} from './Sprite';

export type ContainerEvents = SpriteEvents & {
	childAdded: [child: PIXI.DisplayObject, container: PIXI.Container, index: number];
};

export interface Container {
	emit: EventEmitter.Emit<ContainerEvents>;
	on: EventEmitter.On<ContainerEvents, this>;
	once: EventEmitter.Once<ContainerEvents, this>;
}

export class Container extends PIXI.Container {
	public background?: Sprite;

	public constructor(background?: TextureOrName) {
		super();
		if (background) {
			this.background = new Sprite(background);
			this.addChild(this.background);
		}
	}

	public override get position(): ObservableVector2 {
		return ObservableVector2.fromPoint(this.transform.position);
	}

	public override set position(value: ObservableVector2) {
		this.transform.position.copyFrom(value);
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
