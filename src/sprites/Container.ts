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

		(this.transform.position as PIXI.ObservablePoint<PIXI.Transform>).cb = ((a: any) => {
			if (this.background?.transform) {
				this.background.transform.position.copyFrom(this.transform.position);
				this.background.transform.scale.copyFrom(this.transform.scale);
				this.background.transform.pivot.copyFrom(this.pivot);
				this.background.transform.skew.copyFrom(this.skew);
				this.background.transform.rotation = this.rotation;
				this.background.width = this.width;
				this.background.height = this.height;
			}
			this.transform['_localID']++;
		}) as (this: any) => any;
	}

	public override get position() {
		return ObservableVector2.fromPoint<PIXI.Transform>(this.transform.position);
	}

	public override set position(value: ObservableVector2<PIXI.Transform>) {
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
