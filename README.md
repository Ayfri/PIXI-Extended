[![npm](https://img.shields.io/npm/dt/pixi-extended?style=flat-square)](https://www.npmjs.com/package/pixi-extended)
![npm bundle size](https://img.shields.io/bundlephobia/min/pixi-extended?style=flat-square)

# PIXI-Extended

A framework as a npm library to help you develop with PIXI 2d games.<br>

> **Note:<br>This package is bundled with PIXI `v6.0.4`, you don't have to install it.**

## Installation

[`npm i -s pixi-extended`](https://www.npmjs.com/package/pixi-extended) <br>
You can use this package with TypeScript.

## Features

- Enhanced classes that extends default PIXI ones to better use them.
- Enhanced event handling strictly typed.
- Fully typed in TypeScript, with strict events using custom EventEmitter class.
- Some utility collisions/maths classes and functions.
- Mouse/Keyboard support with a class & functions.
- Other utility classes/objects for PIXI.

## Examples

```javascript
import {Color, FPSCounter, loadTexture, PIXI, Sprite} from 'pixi-extended';

const app = new PIXI.Application({
	backgroundColor: Color.BLACK.toHex(),
});

document.body.appendChild(app.view);

async function start() {
	await loadTexture('myTexture', 'textures/myTexture.png');

	const red = new Color(1, 0, 0);
	const sprite = new Sprite('myTexture');
	sprite.color = red;
	
	const fpsCounter = new FPSCounter();
	fpsCounter.addToApplication(app);
	
	sprite.addToApplication(app);
}

start();
```

## Documentation

The documentation is automatically generated and updated from the code using GitHub workflows.<br>
[You can find it here.](https://ayfri.github.io/PIXI-Extended/index.html) <br>
The code is on the [`docs` branch](https://github.com/Ayfri/PIXI-Extended/tree/docs).
