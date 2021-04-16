import * as Maths from './maths';
import * as Sprites from './sprites';
import * as Textures from './textures';
import * as utils from './utils';
import * as PIXI from 'pixi.js';

export * from './maths';
export * from './sprites';
export * from './textures';
export * from './utils';
export {PIXI};


const exports = {
	...Maths,
	...Sprites,
	...Textures,
	...utils,
	PIXI,
};

Object.entries(exports).forEach((x) => (window as any)[x[0]] = x[1]);
